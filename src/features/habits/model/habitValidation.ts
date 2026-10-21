import type { Habit } from './habitTypes';

export const HABIT_NAME_MAX_LENGTH = 60;

export type HabitNameValidationError = 'required' | 'tooLong' | 'duplicate';

export type HabitNameValidationResult =
  | {
      isValid: true;
      name: string;
    }
  | {
      isValid: false;
      error: HabitNameValidationError;
    };

export function normalizeHabitName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateHabitName(
  value: string,
  habits: Habit[],
  excludedHabitId: string | null = null,
): HabitNameValidationResult {
  const name = normalizeHabitName(value);

  if (name.length === 0) {
    return {
      isValid: false,
      error: 'required',
    };
  }

  if (Array.from(name).length > HABIT_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: 'tooLong',
    };
  }

  const normalizedName = name.toLocaleLowerCase();

  const hasDuplicate = habits.some(
    habit =>
      habit.id !== excludedHabitId &&
      normalizeHabitName(habit.name).toLocaleLowerCase() === normalizedName,
  );

  if (hasDuplicate) {
    return {
      isValid: false,
      error: 'duplicate',
    };
  }

  return {
    isValid: true,
    name,
  };
}
