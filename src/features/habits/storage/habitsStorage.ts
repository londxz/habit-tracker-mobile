import { createMMKV } from 'react-native-mmkv';

import type {
  Habit,
  HabitActivityPeriod,
  HabitColor,
  HabitCompletion,
  HabitReminder,
  HabitSchedule,
  HabitsState,
} from '../model/habitTypes';

export interface HabitsStorage {
  load(): HabitsState | null;
  save(state: HabitsState): void;
}

type StoredHabitsStateV2 = {
  version: 2;
  state: HabitsState;
};

const HABITS_STATE_KEY = 'habitsState';
const HABITS_STORAGE_VERSION = 2;

const storage = createMMKV({
  id: 'habits',
});

export const habitsStorage: HabitsStorage = {
  load() {
    try {
      const serializedState = storage.getString(HABITS_STATE_KEY);

      if (serializedState === undefined) {
        return null;
      }

      const storedState: unknown = JSON.parse(serializedState);

      if (
        isRecord(storedState) &&
        storedState.version !== HABITS_STORAGE_VERSION
      ) {
        storage.remove(HABITS_STATE_KEY);
        return null;
      }

      return restoreHabitsState(storedState);
    } catch {
      return null;
    }
  },

  save(state) {
    const storedState: StoredHabitsStateV2 = {
      version: HABITS_STORAGE_VERSION,
      state,
    };

    storage.set(HABITS_STATE_KEY, JSON.stringify(storedState));
  },
};

function restoreHabitsState(value: unknown): HabitsState | null {
  if (!isRecord(value)) {
    return null;
  }

  switch (value.version) {
    case 2:
      if (!isHabitsState(value.state)) {
        return null;
      }

      return value.state;

    default:
      return null;
  }
}

function isHabitsState(value: unknown): value is HabitsState {
  if (!isRecord(value)) {
    return false;
  }

  if (!Array.isArray(value.habits) || !Array.isArray(value.completions)) {
    return false;
  }

  if (!value.habits.every(isHabit) || !value.completions.every(isCompletion)) {
    return false;
  }

  return (
    new Set(value.habits.map(habit => habit.id)).size === value.habits.length
  );
}

function isHabit(value: unknown): value is Habit {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (typeof value.emoji === 'string' || value.emoji === null) &&
    isHabitColor(value.color) &&
    typeof value.createdAt === 'string' &&
    isHabitSchedule(value.schedule) &&
    isHabitReminder(value.reminder) &&
    Array.isArray(value.activityPeriods) &&
    value.activityPeriods.length > 0 &&
    value.activityPeriods.every(isActivityPeriod)
  );
}

function isHabitSchedule(value: unknown): value is HabitSchedule {
  return isRecord(value) && isWeekdayList(value.weekdays);
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
  return (
    isRecord(value) &&
    typeof value.isEnabled === 'boolean' &&
    typeof value.time === 'string' &&
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.time)
  );
}

function isActivityPeriod(value: unknown): value is HabitActivityPeriod {
  if (
    !isRecord(value) ||
    typeof value.startedOn !== 'string' ||
    !isDateKey(value.startedOn) ||
    !isWeekdayList(value.weekdays)
  ) {
    return false;
  }

  return (
    (value.endedBefore === null && value.archivedAt === null) ||
    (typeof value.endedBefore === 'string' &&
      isDateKey(value.endedBefore) &&
      (typeof value.archivedAt === 'string' || value.archivedAt === null))
  );
}

function isWeekdayList(value: unknown): value is HabitSchedule['weekdays'] {
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
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
