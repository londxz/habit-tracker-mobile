import type { Habit, HabitCompletion } from './habitTypes';
import { isHabitActive } from './isHabitActive';
import { isHabitCompletedOn } from './isHabitCompletedOn';
import { isHabitPlannedOn } from './isHabitPlannedOn';

export function doesCompletionFinishDay(
  habits: Habit[],
  completions: HabitCompletion[],
  habitId: string,
  dateKey: string,
): boolean {
  const activeHabits = habits.filter(
    habit => isHabitActive(habit) && isHabitPlannedOn(habit, dateKey),
  );
  const selectedHabit = activeHabits.find(habit => habit.id === habitId);

  if (
    selectedHabit === undefined ||
    isHabitCompletedOn(completions, habitId, dateKey)
  ) {
    return false;
  }

  return activeHabits.every(
    habit =>
      habit.id === habitId ||
      isHabitCompletedOn(completions, habit.id, dateKey),
  );
}
