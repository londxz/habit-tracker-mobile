import { getAdjacentDateKey } from '../../../shared/date/getAdjacentDateKey';
import type { Habit, HabitCompletion, HabitActivityPeriod } from './habitTypes';

export type HabitStreakStats = {
  current: number;
  best: number;
};

export function getHabitStreakStats(
  habit: Habit,
  completions: HabitCompletion[],
  todayKey: string,
): HabitStreakStats {
  const completionDates = new Set(
    completions
      .filter(completion => completion.habitId === habit.id)
      .map(completion => completion.completedOn),
  );

  return {
    current: getCurrentStreak(habit, completionDates, todayKey),
    best: getBestStreak(habit, completionDates, todayKey),
  };
}

function getCurrentStreak(
  habit: Habit,
  completionDates: Set<string>,
  todayKey: string,
): number {
  const activePeriod = habit.activityPeriods.find(
    period => period.endedBefore === null,
  );

  if (activePeriod === undefined) {
    return 0;
  }

  let dateKey = completionDates.has(todayKey)
    ? todayKey
    : getAdjacentDateKey(todayKey, -1);
  let streak = 0;

  while (dateKey >= activePeriod.startedOn && completionDates.has(dateKey)) {
    streak += 1;
    dateKey = getAdjacentDateKey(dateKey, -1);
  }

  return streak;
}

function getBestStreak(
  habit: Habit,
  completionDates: Set<string>,
  todayKey: string,
): number {
  return habit.activityPeriods.reduce(
    (bestStreak, period) =>
      Math.max(
        bestStreak,
        getBestStreakForPeriod(period, completionDates, todayKey),
      ),
    0,
  );
}

function getBestStreakForPeriod(
  period: HabitActivityPeriod,
  completionDates: Set<string>,
  todayKey: string,
): number {
  const dates = [...completionDates]
    .filter(
      dateKey =>
        dateKey >= period.startedOn &&
        dateKey <= todayKey &&
        (period.endedBefore === null || dateKey < period.endedBefore),
    )
    .sort();

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
