import { createMMKV } from 'react-native-mmkv';

import type {
  Habit,
  HabitActivityPeriod,
  HabitColor,
  HabitCompletion,
  HabitReminder,
  HabitWeekday,
  HabitsState,
} from '../model/habitTypes';

export interface HabitsStorage {
  load(): HabitsState | null;
  save(state: HabitsState): void;
}

type StoredHabitsStateV3 = {
  version: 3;
  state: HabitsState;
};

type LegacyHabitReminderV2 = Omit<HabitReminder, 'weekdays'>;

type LegacyHabitActivityPeriodV2 = HabitActivityPeriod & {
  weekdays: HabitWeekday[];
};

type LegacyHabitV2 = Omit<Habit, 'reminder' | 'activityPeriods'> & {
  schedule: { weekdays: HabitWeekday[] };
  reminder: LegacyHabitReminderV2;
  activityPeriods: LegacyHabitActivityPeriodV2[];
};

type LegacyHabitsStateV2 = {
  habits: LegacyHabitV2[];
  completions: HabitCompletion[];
};

const HABITS_STATE_KEY = 'habitsState';
const HABITS_STORAGE_VERSION = 3;

const storage = createMMKV({
  id: 'habits',
});

export const habitsStorage: HabitsStorage = {
  load() {
    const serializedState = storage.getString(HABITS_STATE_KEY);

    if (serializedState === undefined) {
      return null;
    }

    const storedState: unknown = JSON.parse(serializedState);

    const state = restoreHabitsState(storedState);

    if (isRecord(storedState) && storedState.version === 2) {
      saveState(state);
    }

    return state;
  },

  save(state) {
    saveState(state);
  },
};

function saveState(state: HabitsState): void {
  const storedState: StoredHabitsStateV3 = {
    version: HABITS_STORAGE_VERSION,
    state,
  };

  storage.set(HABITS_STATE_KEY, JSON.stringify(storedState));
}

function restoreHabitsState(value: unknown): HabitsState {
  if (!isRecord(value)) {
    throw new Error('Invalid habits storage payload');
  }

  switch (value.version) {
    case 3:
      if (!isHabitsState(value.state)) {
        throw new Error('Invalid habits storage schema');
      }

      return value.state;

    case 2:
      if (!isLegacyHabitsStateV2(value.state)) {
        throw new Error('Invalid legacy habits storage schema');
      }

      return migrateFromV2(value.state);

    default:
      throw new Error('Unsupported habits storage version');
  }
}

function migrateFromV2(state: LegacyHabitsStateV2): HabitsState {
  return {
    habits: state.habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      emoji: habit.emoji,
      color: habit.color,
      createdAt: habit.createdAt,
      reminder: {
        ...habit.reminder,
        weekdays: [...habit.schedule.weekdays],
      },
      activityPeriods: habit.activityPeriods.map(period =>
        period.endedBefore === null
          ? {
              startedOn: period.startedOn,
              endedBefore: null,
              archivedAt: null,
            }
          : {
              startedOn: period.startedOn,
              endedBefore: period.endedBefore,
              archivedAt: period.archivedAt,
            },
      ),
    })),
    completions: state.completions,
  };
}

function isHabitsState(value: unknown): value is HabitsState {
  if (!hasValidStateCollections(value, isHabit)) {
    return false;
  }

  const habitIds = new Set(value.habits.map(habit => habit.id));
  const completionKeys = value.completions.map(
    completion => `${completion.habitId}:${completion.completedOn}`,
  );

  return (
    value.completions.every(completion => habitIds.has(completion.habitId)) &&
    new Set(completionKeys).size === completionKeys.length
  );
}

function isLegacyHabitsStateV2(value: unknown): value is LegacyHabitsStateV2 {
  if (!hasValidStateCollections(value, isLegacyHabitV2)) {
    return false;
  }

  const habitIds = new Set(value.habits.map(habit => habit.id));
  const completionKeys = value.completions.map(
    completion => `${completion.habitId}:${completion.completedOn}`,
  );

  return (
    value.completions.every(completion => habitIds.has(completion.habitId)) &&
    new Set(completionKeys).size === completionKeys.length
  );
}

function hasValidStateCollections<T extends { id: string }>(
  value: unknown,
  isValidHabit: (habit: unknown) => habit is T,
): value is { habits: T[]; completions: HabitCompletion[] } {
  if (!isRecord(value)) {
    return false;
  }

  if (!Array.isArray(value.habits) || !Array.isArray(value.completions)) {
    return false;
  }

  if (
    !value.habits.every(isValidHabit) ||
    !value.completions.every(isCompletion)
  ) {
    return false;
  }

  return (
    new Set(value.habits.map(habit => habit.id)).size === value.habits.length
  );
}

function isHabit(value: unknown): value is Habit {
  return (
    hasValidHabitBase(value) &&
    isHabitReminder(value.reminder) &&
    Array.isArray(value.activityPeriods) &&
    value.activityPeriods.length > 0 &&
    value.activityPeriods.every(isActivityPeriod)
  );
}

function isLegacyHabitV2(value: unknown): value is LegacyHabitV2 {
  return (
    hasValidHabitBase(value) &&
    isRecord(value.schedule) &&
    isWeekdayList(value.schedule.weekdays) &&
    isLegacyHabitReminderV2(value.reminder) &&
    Array.isArray(value.activityPeriods) &&
    value.activityPeriods.length > 0 &&
    value.activityPeriods.every(isLegacyActivityPeriodV2)
  );
}

function hasValidHabitBase(value: unknown): value is {
  id: string;
  name: string;
  emoji: string | null;
  color: HabitColor | null;
  createdAt: string;
} & Record<string, unknown> {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (typeof value.emoji === 'string' || value.emoji === null) &&
    isHabitColor(value.color) &&
    typeof value.createdAt === 'string' &&
    isIsoDate(value.createdAt)
  );
}

function isHabitColor(value: unknown): value is HabitColor | null {
  return (
    value === null ||
    value === 'blue' ||
    value === 'teal' ||
    value === 'purple' ||
    value === 'coral' ||
    value === 'amber' ||
    value === 'pink'
  );
}

function isHabitReminder(value: unknown): value is HabitReminder {
  if (!isRecord(value)) {
    return false;
  }

  const weekdays = value.weekdays;

  return isLegacyHabitReminderV2(value) && isWeekdayList(weekdays);
}

function isLegacyHabitReminderV2(
  value: unknown,
): value is LegacyHabitReminderV2 {
  return (
    isRecord(value) &&
    typeof value.isEnabled === 'boolean' &&
    typeof value.time === 'string' &&
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.time)
  );
}

function isActivityPeriod(value: unknown): value is HabitActivityPeriod {
  return hasValidActivityPeriod(value);
}

function isLegacyActivityPeriodV2(
  value: unknown,
): value is LegacyHabitActivityPeriodV2 {
  if (!isRecord(value)) {
    return false;
  }

  const weekdays = value.weekdays;

  return hasValidActivityPeriod(value) && isWeekdayList(weekdays);
}

function hasValidActivityPeriod(value: unknown): value is {
  startedOn: string;
  endedBefore: string | null;
  archivedAt: string | null;
} {
  if (
    !isRecord(value) ||
    typeof value.startedOn !== 'string' ||
    !isDateKey(value.startedOn)
  ) {
    return false;
  }

  return (
    (value.endedBefore === null && value.archivedAt === null) ||
    (typeof value.endedBefore === 'string' &&
      isDateKey(value.endedBefore) &&
      (value.archivedAt === null ||
        (typeof value.archivedAt === 'string' && isIsoDate(value.archivedAt))))
  );
}

function isWeekdayList(value: unknown): value is HabitWeekday[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 7 &&
    value.every(
      weekday => Number.isInteger(weekday) && weekday >= 1 && weekday <= 7,
    ) &&
    new Set(value).size === value.length
  );
}

function isCompletion(value: unknown): value is HabitCompletion {
  return (
    isRecord(value) &&
    typeof value.habitId === 'string' &&
    typeof value.completedOn === 'string' &&
    isDateKey(value.completedOn)
  );
}

function isDateKey(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (match === null) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
