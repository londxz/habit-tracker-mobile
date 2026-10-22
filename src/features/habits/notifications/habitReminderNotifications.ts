import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
  RepeatFrequency,
  TriggerType,
  type TimestampTrigger,
} from '@notifee/react-native';
import { Linking, Platform } from 'react-native';

import type { HabitWeekday } from '../model/habitTypes';
import {
  savePendingHabitReminderPress,
  takePendingHabitReminderPress,
} from './habitReminderPressStorage';

export type HabitReminderSchedule = {
  habitId: string;
  name: string;
  emoji: string | null;
  time: string;
  weekdays: HabitWeekday[];
};

export interface HabitReminderNotifications {
  requestPermission(): Promise<boolean>;
  openSettings(): Promise<void>;
  sync(schedules: HabitReminderSchedule[]): Promise<void>;
  getOpeningHabitId(): Promise<string | null>;
  subscribeToPress(handler: (habitId: string) => void): () => void;
}

const CHANNEL_ID = 'habit-reminders';
const NOTIFICATION_ID_PREFIX = 'habit-reminder-';
let syncQueue: Promise<void> = Promise.resolve();

export const habitReminderNotifications: HabitReminderNotifications = {
  async requestPermission() {
    const channelId = await createHabitReminderChannel();
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      return false;
    }

    if (Platform.OS !== 'android') {
      return true;
    }

    const channel = await notifee.getChannel(channelId);

    return channel?.blocked !== true;
  },

  openSettings() {
    return Platform.OS === 'android'
      ? notifee.openNotificationSettings(CHANNEL_ID)
      : Linking.openSettings();
  },

  sync(schedules) {
    const syncResult = syncQueue
      .catch(() => undefined)
      .then(() => syncHabitReminderSchedules(schedules));

    syncQueue = syncResult;

    return syncResult;
  },

  async getOpeningHabitId() {
    if (Platform.OS !== 'android') {
      return null;
    }

    const pendingHabitId = takePendingHabitReminderPress();
    const initialNotification = await notifee.getInitialNotification();
    const initialHabitId = getHabitId(initialNotification?.notification.data);

    return pendingHabitId ?? initialHabitId;
  },

  subscribeToPress(handler) {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type !== EventType.PRESS) {
        return;
      }

      const habitId = getHabitId(detail.notification?.data);

      if (habitId !== null) {
        handler(habitId);
      }
    });
  },
};

export function registerHabitReminderBackgroundHandler(): void {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (Platform.OS !== 'android' || type !== EventType.PRESS) {
      return;
    }

    const habitId = getHabitId(detail.notification?.data);

    if (habitId !== null) {
      savePendingHabitReminderPress(habitId);
    }
  });
}

async function syncHabitReminderSchedules(
  schedules: HabitReminderSchedule[],
): Promise<void> {
  const desiredNotificationIds = new Set(
    schedules.flatMap(schedule =>
      schedule.weekdays.map(weekday =>
        getNotificationId(schedule.habitId, weekday),
      ),
    ),
  );
  const scheduledNotificationIds = await notifee.getTriggerNotificationIds();
  const obsoleteNotificationIds = scheduledNotificationIds.filter(
    notificationId =>
      notificationId.startsWith(NOTIFICATION_ID_PREFIX) &&
      !desiredNotificationIds.has(notificationId),
  );

  await Promise.all(
    obsoleteNotificationIds.map(notificationId =>
      notifee.cancelNotification(notificationId),
    ),
  );

  if (schedules.length === 0) {
    return;
  }

  const channelId = await createHabitReminderChannel();

  await Promise.all(
    schedules.map(schedule => scheduleHabitReminder(schedule, channelId)),
  );
}

function createHabitReminderChannel(): Promise<string> {
  return notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Напоминания о привычках',
    importance: AndroidImportance.DEFAULT,
  });
}

async function scheduleHabitReminder(
  schedule: HabitReminderSchedule,
  channelId: string,
): Promise<void> {
  await Promise.all(
    schedule.weekdays.map(weekday => {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: getNextReminderTimestamp(schedule.time, weekday),
        repeatFrequency: RepeatFrequency.WEEKLY,
      };

      return notifee.createTriggerNotification(
        {
          id: getNotificationId(schedule.habitId, weekday),
          title: getNotificationTitle(schedule),
          body: 'Пора выполнить привычку',
          data: { habitId: schedule.habitId },
          android: {
            channelId,
            pressAction: { id: 'default' },
          },
          ios: {
            sound: 'default',
            foregroundPresentationOptions: {
              banner: true,
              list: true,
              sound: true,
              badge: false,
            },
          },
        },
        trigger,
      );
    }),
  );
}

function getNotificationId(habitId: string, weekday: HabitWeekday): string {
  return `${NOTIFICATION_ID_PREFIX}${habitId}-${weekday}`;
}

function getNotificationTitle(schedule: HabitReminderSchedule): string {
  return schedule.emoji === null
    ? schedule.name
    : `${schedule.emoji} ${schedule.name}`;
}

function getNextReminderTimestamp(time: string, weekday: HabitWeekday): number {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const reminderDate = new Date(now);
  const targetDay = weekday === 7 ? 0 : weekday;
  const daysUntilTarget = (targetDay - now.getDay() + 7) % 7;

  reminderDate.setDate(reminderDate.getDate() + daysUntilTarget);
  reminderDate.setHours(hours, minutes, 0, 0);

  if (reminderDate.getTime() <= now.getTime()) {
    reminderDate.setDate(reminderDate.getDate() + 7);
  }

  return reminderDate.getTime();
}

function getHabitId(
  data: Record<string, string | number | object> | undefined,
): string | null {
  const habitId = data?.habitId;

  return typeof habitId === 'string' ? habitId : null;
}
