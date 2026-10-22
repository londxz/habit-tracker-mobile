import type { Habit } from './habitTypes';

export function isHabitPlannedOn(habit: Habit, dateKey: string): boolean {
  return habit.activityPeriods.some(
    period =>
      dateKey >= period.startedOn &&
      (period.endedBefore === null || dateKey < period.endedBefore),
  );
}
