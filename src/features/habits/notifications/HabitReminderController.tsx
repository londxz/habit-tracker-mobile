import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { Alert, AppState } from 'react-native';

import type { RootStackParamList } from '../../../navigation/navigationTypes';
import { useHabits } from '../context/HabitsProvider';
import { isHabitActive } from '../model/isHabitActive';
import {
  habitReminderNotifications,
  type HabitReminderSchedule,
} from './habitReminderNotifications';

type HabitReminderControllerProps = {
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
  isNavigationReady: boolean;
};

export function HabitReminderController({
  navigationRef,
  isNavigationReady,
}: HabitReminderControllerProps) {
  const { state } = useHabits();
  const pendingHabitId = useRef<string | null>(null);
  const [syncAttempt, setSyncAttempt] = useState(0);
  const activeHabitIds = useMemo(
    () => new Set(state.habits.filter(isHabitActive).map(habit => habit.id)),
    [state.habits],
  );
  const schedules = useMemo<HabitReminderSchedule[]>(
    () =>
      state.habits
        .filter(habit => isHabitActive(habit) && habit.reminder.isEnabled)
        .map(habit => ({
          habitId: habit.id,
          name: habit.name,
          emoji: habit.emoji,
          time: habit.reminder.time,
          weekdays: habit.reminder.weekdays,
        })),
    [state.habits],
  );

  const openHabit = useCallback(
    (habitId: string) => {
      if (!activeHabitIds.has(habitId)) {
        pendingHabitId.current = null;
        return;
      }

      if (!isNavigationReady || !navigationRef.isReady()) {
        pendingHabitId.current = habitId;
        return;
      }

      pendingHabitId.current = null;
      navigationRef.navigate('HabitDetails', { habitId });
    },
    [activeHabitIds, isNavigationReady, navigationRef],
  );

  const openHabitFromNotification = useCallback(() => {
    habitReminderNotifications
      .getOpeningHabitId()
      .then(habitId => {
        if (habitId !== null) {
          openHabit(habitId);
        }
      })
      .catch(() => undefined);
  }, [openHabit]);

  useEffect(() => {
    let isMounted = true;

    habitReminderNotifications.sync(schedules).catch(() => {
      if (!isMounted) {
        return;
      }

      Alert.alert(
        'Не удалось настроить напоминания',
        'Проверь настройки уведомлений и попробуй ещё раз.',
        [
          { text: 'Позже', style: 'cancel' },
          {
            text: 'Повторить',
            onPress: () => setSyncAttempt(value => value + 1),
          },
        ],
      );
    });

    return () => {
      isMounted = false;
    };
  }, [schedules, syncAttempt]);

  useEffect(
    () => habitReminderNotifications.subscribeToPress(openHabit),
    [openHabit],
  );

  useEffect(() => {
    openHabitFromNotification();

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        openHabitFromNotification();
      }
    });

    return () => subscription.remove();
  }, [openHabitFromNotification]);

  useEffect(() => {
    if (isNavigationReady && pendingHabitId.current !== null) {
      openHabit(pendingHabitId.current);
    }
  }, [isNavigationReady, openHabit]);

  return null;
}
