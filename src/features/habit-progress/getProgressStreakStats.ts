import { getAdjacentDateKey } from '../../shared/date/getAdjacentDateKey';
import type { ProgressDay } from './getProgressHistory';

export type ProgressStreakStats = {
  current: number;
  best: number;
};

export function getProgressStreakStats(
  history: ProgressDay[],
  todayKey: string,
): ProgressStreakStats {
  const successfulDates = new Set(
    history.filter(day => day.completedCount > 0).map(day => day.dateKey),
  );

  return {
    current: getCurrentStreak(successfulDates, todayKey),
    best: getBestStreak(successfulDates),
  };
}

function getCurrentStreak(
  successfulDates: Set<string>,
  todayKey: string,
): number {
  let dateKey = successfulDates.has(todayKey)
    ? todayKey
    : getAdjacentDateKey(todayKey, -1);
  let streak = 0;

  while (successfulDates.has(dateKey)) {
    streak += 1;
    dateKey = getAdjacentDateKey(dateKey, -1);
  }

  return streak;
}

function getBestStreak(successfulDates: Set<string>): number {
  const dates = [...successfulDates].sort();
  let bestStreak = 0;
  let currentStreak = 0;
  let previousDateKey: string | null = null;

  dates.forEach(dateKey => {
    currentStreak =
      previousDateKey !== null &&
      getAdjacentDateKey(previousDateKey, 1) === dateKey
        ? currentStreak + 1
        : 1;

    bestStreak = Math.max(bestStreak, currentStreak);
    previousDateKey = dateKey;
  });

  return bestStreak;
}
