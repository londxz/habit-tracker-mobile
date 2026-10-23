import type { HabitHistoryEntry } from './getHabitHistory';

export type HabitCompletionStats = {
  completedCount: number;
  plannedCount: number;
  percentage: number;
};

export function getHabitCompletionStats(
  history: HabitHistoryEntry[],
): HabitCompletionStats {
  const completedCount = history.filter(entry => entry.isCompleted).length;
  const plannedCount = history.length;

  return {
    completedCount,
    plannedCount,
    percentage:
      plannedCount === 0
        ? 0
        : Math.round((completedCount / plannedCount) * 100),
  };
}
