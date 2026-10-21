import { createMMKV } from 'react-native-mmkv';

import type { HabitsState } from '../model/habitTypes';

export interface HabitsStorage {
  load(): HabitsState | null;
  save(state: HabitsState): void;
}

type StoredHabitsStateV1 = {
  version: 1;
  state: HabitsState;
};

const HABITS_STATE_KEY = 'habitsState';
const HABITS_STORAGE_VERSION = 1;

const storage = createMMKV({
  id: 'habits',
});

export const habitsStorage: HabitsStorage = {
  load() {
    const serializedState = storage.getString(HABITS_STATE_KEY);

    if (serializedState === undefined) {
      return null;
    }

    try {
      const storedState: unknown = JSON.parse(serializedState);

      return restoreHabitsState(storedState);
    } catch {
      return null;
    }
  },

  save(state) {
    const storedState: StoredHabitsStateV1 = {
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
    case 1:
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

  return Array.isArray(value.habits) && Array.isArray(value.completions);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
