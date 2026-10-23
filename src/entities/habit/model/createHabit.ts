import { v4 as uuidv4 } from 'uuid';

import { getDateKey } from '../../../shared/date/getDateKey';
import type { Habit, HabitColor, HabitReminder } from './habitTypes';

export type CreateHabitInput = {
  name: string;
  emoji: string | null;
  color: HabitColor | null;
  reminder: HabitReminder;
};

export function createHabit(input: CreateHabitInput): Habit {
  const now = new Date();

  return {
    id: uuidv4(),
    name: input.name.trim(),
    emoji: input.emoji,
    color: input.color,
    createdAt: now.toISOString(),
    reminder: input.reminder,
    activityPeriods: [
      {
        startedOn: getDateKey(now),
        endedBefore: null,
        archivedAt: null,
      },
    ],
  };
}
