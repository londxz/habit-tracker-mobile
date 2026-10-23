import { createMMKV } from 'react-native-mmkv';

const PENDING_HABIT_ID_KEY = 'pendingHabitId';

const storage = createMMKV({
  id: 'habit-reminder-press',
});

export function savePendingHabitReminderPress(habitId: string): void {
  storage.set(PENDING_HABIT_ID_KEY, habitId);
}

export function takePendingHabitReminderPress(): string | null {
  const habitId = storage.getString(PENDING_HABIT_ID_KEY);

  storage.remove(PENDING_HABIT_ID_KEY);

  return habitId ?? null;
}
