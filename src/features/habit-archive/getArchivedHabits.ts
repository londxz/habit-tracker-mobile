import { getHabitArchivedAt } from '../../entities/habit/model/getHabitArchivedAt';
import type {
  Habit,
  HabitCompletion,
} from '../../entities/habit/model/habitTypes';
import { isHabitActive } from '../../entities/habit/model/isHabitActive';

export type ArchivedHabit = {
  habit: Habit;
  archivedAt: string;
  completionCount: number;
};

export function getArchivedHabits(
  habits: Habit[],
  completions: HabitCompletion[],
): ArchivedHabit[] {
  const completionCounts = completions.reduce<Map<string, number>>(
    (counts, completion) => {
      counts.set(completion.habitId, (counts.get(completion.habitId) ?? 0) + 1);

      return counts;
    },
    new Map(),
  );

  return habits
    .filter(habit => !isHabitActive(habit))
    .flatMap(habit => {
      const archivedAt = getHabitArchivedAt(habit);

      return archivedAt === null
        ? []
        : [
            {
              habit,
              archivedAt,
              completionCount: completionCounts.get(habit.id) ?? 0,
            },
          ];
    })
    .sort((first, second) => second.archivedAt.localeCompare(first.archivedAt));
}
