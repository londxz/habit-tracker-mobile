import type {
  Habit,
  HabitCompletion,
} from '../../entities/habit/model/habitTypes';
import { isHabitCompletedOn } from '../../entities/habit/model/isHabitCompletedOn';
import { isHabitPlannedOn } from '../../entities/habit/model/isHabitPlannedOn';

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
