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
