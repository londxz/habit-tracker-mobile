import { getAdjacentDateKey } from '../../../shared/date/getAdjacentDateKey';
import type { Habit, HabitCompletion } from './habitTypes';
import { isHabitPlannedOn } from './isHabitPlannedOn';

export type HabitHistoryEntry = {
  dateKey: string;
  isCompleted: boolean;
};

export function getHabitHistory(
  habit: Habit,
  completions: HabitCompletion[],
  throughDateKey: string,
): HabitHistoryEntry[] {
  const plannedDates = new Set<string>();

  habit.activityPeriods.forEach(period => {
    const lastDateKey =
      period.endedBefore === null || period.endedBefore > throughDateKey
        ? throughDateKey
        : getAdjacentDateKey(period.endedBefore, -1);

    for (
      let dateKey = period.startedOn;
      dateKey <= lastDateKey;
      dateKey = getAdjacentDateKey(dateKey, 1)
    ) {
      if (isHabitPlannedOn(habit, dateKey)) {
        plannedDates.add(dateKey);
      }
    }
  });

  const completionDates = new Set(
    completions
      .filter(completion => completion.habitId === habit.id)
      .map(completion => completion.completedOn),
  );

  return [...plannedDates]
    .sort((firstDate, secondDate) => secondDate.localeCompare(firstDate))
    .map(dateKey => ({
      dateKey,
      isCompleted: completionDates.has(dateKey),
    }));
}
