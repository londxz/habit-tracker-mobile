import { getAdjacentDateKey } from '../../../shared/date/getAdjacentDateKey';
import type { Habit, HabitCompletion, HabitActivityPeriod } from './habitTypes';
import { isHabitPlannedOn } from './isHabitPlannedOn';

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

  let dateKey =
    isHabitPlannedOn(habit, todayKey) && !completionDates.has(todayKey)
      ? getAdjacentDateKey(todayKey, -1)
      : todayKey;
  let streak = 0;

  while (dateKey >= activePeriod.startedOn) {
    if (!isHabitPlannedOn(habit, dateKey)) {
      dateKey = getAdjacentDateKey(dateKey, -1);
      continue;
    }

    if (!completionDates.has(dateKey)) {
      break;
    }

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
        getBestStreakForPeriod(habit, period, completionDates, todayKey),
      ),
    0,
  );
}

function getBestStreakForPeriod(
  habit: Habit,
  period: HabitActivityPeriod,
  completionDates: Set<string>,
  todayKey: string,
): number {
  let bestStreak = 0;
  let currentStreak = 0;
  const lastDateKey =
    period.endedBefore === null || period.endedBefore > todayKey
      ? todayKey
      : getAdjacentDateKey(period.endedBefore, -1);

  for (
    let dateKey = period.startedOn;
    dateKey <= lastDateKey;
    dateKey = getAdjacentDateKey(dateKey, 1)
  ) {
    if (!isHabitPlannedOn(habit, dateKey)) {
      continue;
    }

    currentStreak = completionDates.has(dateKey) ? currentStreak + 1 : 0;

    bestStreak = Math.max(bestStreak, currentStreak);
  }

  return bestStreak;
}
