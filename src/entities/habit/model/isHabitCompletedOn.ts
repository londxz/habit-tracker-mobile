import type { HabitCompletion } from './habitTypes';

export function isHabitCompletedOn(
  completions: HabitCompletion[],
  habitId: string,
  dateKey: string,
): boolean {
  return completions.some(
    completion =>
      completion.habitId === habitId && completion.completedOn === dateKey,
  );
}
