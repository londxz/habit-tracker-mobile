import type { Habit } from './habitTypes';
import { getHabitWeekday } from './habitSchedule';

export function isHabitPlannedOn(habit: Habit, dateKey: string): boolean {
  const weekday = getHabitWeekday(dateKey);

  return habit.activityPeriods.some(
    period =>
      dateKey >= period.startedOn &&
      (period.endedBefore === null || dateKey < period.endedBefore) &&
      period.weekdays.includes(weekday),
  );
}
