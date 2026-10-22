import type { Habit } from './habitTypes';

export function getHabitArchivedAt(habit: Habit): string | null {
  return habit.activityPeriods.reduce<string | null>((latest, period) => {
    if (period.archivedAt === null) {
      return latest;
    }

    return latest === null || period.archivedAt > latest
      ? period.archivedAt
      : latest;
  }, null);
}
