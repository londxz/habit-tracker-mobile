import { getAdjacentDateKey } from '../../../shared/date/getAdjacentDateKey';
import type { Habit, HabitCompletion } from './habitTypes';
import { isHabitPlannedOn } from './isHabitPlannedOn';

export type ProgressDayStatus = 'none' | 'partial' | 'complete';

export type ProgressDay = {
  dateKey: string;
  completedCount: number;
  totalCount: number;
  status: ProgressDayStatus;
};

export function getProgressHistory(
  habits: Habit[],
  completions: HabitCompletion[],
  throughDateKey: string,
): ProgressDay[] {
  const firstDateKey = getFirstActivityDateKey(habits);

  if (firstDateKey === null || firstDateKey > throughDateKey) {
    return [];
  }

  const completionKeys = new Set(
    completions.map(
      completion => `${completion.habitId}:${completion.completedOn}`,
    ),
  );
  const history: ProgressDay[] = [];

  for (
    let dateKey = firstDateKey;
    dateKey <= throughDateKey;
    dateKey = getAdjacentDateKey(dateKey, 1)
  ) {
    const plannedHabits = habits.filter(habit =>
      isHabitPlannedOn(habit, dateKey),
    );

    if (plannedHabits.length === 0) {
      continue;
    }

    const completedCount = plannedHabits.filter(habit =>
      completionKeys.has(`${habit.id}:${dateKey}`),
    ).length;

    history.push({
      dateKey,
      completedCount,
      totalCount: plannedHabits.length,
      status: getProgressDayStatus(completedCount, plannedHabits.length),
    });
  }

  return history.reverse();
}

function getFirstActivityDateKey(habits: Habit[]): string | null {
  return habits.reduce<string | null>((firstDateKey, habit) => {
    return habit.activityPeriods.reduce<string | null>(
      (firstPeriodDateKey, period) =>
        firstPeriodDateKey === null || period.startedOn < firstPeriodDateKey
          ? period.startedOn
          : firstPeriodDateKey,
      firstDateKey,
    );
  }, null);
}

function getProgressDayStatus(
  completedCount: number,
  totalCount: number,
): ProgressDayStatus {
  if (completedCount === 0) {
    return 'none';
  }

  if (completedCount === totalCount) {
    return 'complete';
  }

  return 'partial';
}
