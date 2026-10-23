import type { Habit } from './habitTypes';

export function isHabitActive(habit: Habit): boolean {
  return habit.activityPeriods.some(period => period.endedBefore === null);
}
