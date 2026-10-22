import type { Habit, HabitCompletion } from './habitTypes';
import { isHabitCompletedOn } from './isHabitCompletedOn';
import { isHabitPlannedOn } from './isHabitPlannedOn';

export type DayHabitStatus = {
  habit: Habit;
  isCompleted: boolean;
};

export function getDayHabitStatuses(
  habits: Habit[],
  completions: HabitCompletion[],
  dateKey: string,
): DayHabitStatus[] {
  return habits
    .filter(habit => isHabitPlannedOn(habit, dateKey))
    .map(habit => ({
      habit,
      isCompleted: isHabitCompletedOn(completions, habit.id, dateKey),
    }));
}
