import { getAdjacentDateKey } from '../../../shared/date/getAdjacentDateKey';
import type { Habit, HabitsState } from './habitTypes';
import { isHabitCompletedOn } from './isHabitCompletedOn';

export const initialHabitsState: HabitsState = {
  habits: [],
  completions: [],
};

export type HabitsAction =
  | {
      type: 'stateLoaded';
      state: HabitsState;
    }
  | {
      type: 'habitAdded';
      habit: Habit;
    }
  | {
      type: 'habitUpdated';
      habitId: string;
      changes: Pick<Habit, 'name' | 'emoji' | 'color' | 'reminder'>;
    }
  | {
      type: 'habitArchived';
      habitId: string;
      archivedOn: string;
      archivedAt: string;
    }
  | {
      type: 'habitDeleted';
      habitId: string;
    }
  | {
      type: 'habitCompletionToggled';
      habitId: string;
      completedOn: string;
    };

export function habitsReducer(
  state: HabitsState,
  action: HabitsAction,
): HabitsState {
  switch (action.type) {
    case 'stateLoaded':
      return action.state;

    case 'habitAdded':
      return {
        ...state,
        habits: [...state.habits, action.habit],
      };

    case 'habitUpdated':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.habitId ? { ...habit, ...action.changes } : habit,
        ),
      };

    case 'habitArchived': {
      const completedOnArchiveDay = isHabitCompletedOn(
        state.completions,
        action.habitId,
        action.archivedOn,
      );
      const endedBefore = completedOnArchiveDay
        ? getAdjacentDateKey(action.archivedOn, 1)
        : action.archivedOn;

      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.habitId
            ? {
                ...habit,
                reminder: {
                  ...habit.reminder,
                  isEnabled: false,
                },
                activityPeriods: habit.activityPeriods.map(period =>
                  period.endedBefore === null
                    ? {
                        ...period,
                        endedBefore,
                        archivedAt: action.archivedAt,
                      }
                    : period,
                ),
              }
            : habit,
        ),
      };
    }

    case 'habitDeleted':
      return {
        habits: state.habits.filter(habit => habit.id !== action.habitId),
        completions: state.completions.filter(
          completion => completion.habitId !== action.habitId,
        ),
      };

    case 'habitCompletionToggled': {
      const isCompleted = isHabitCompletedOn(
        state.completions,
        action.habitId,
        action.completedOn,
      );

      if (isCompleted) {
        return {
          ...state,
          completions: state.completions.filter(
            completion =>
              completion.habitId !== action.habitId ||
              completion.completedOn !== action.completedOn,
          ),
        };
      }

      return {
        ...state,
        completions: [
          ...state.completions,
          {
            habitId: action.habitId,
            completedOn: action.completedOn,
          },
        ],
      };
    }

    default:
      return state;
  }
}
