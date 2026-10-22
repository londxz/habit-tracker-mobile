import { getAdjacentDateKey } from '../../../shared/date/getAdjacentDateKey';
import type { Habit, HabitsState } from './habitTypes';
import { normalizeHabitName } from './habitValidation';
import { isHabitCompletedOn } from './isHabitCompletedOn';
import { isHabitPlannedOn } from './isHabitPlannedOn';

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
      changes: Pick<
        Habit,
        'name' | 'emoji' | 'color' | 'schedule' | 'reminder'
      >;
      updatedOn: string;
    }
  | {
      type: 'habitArchived';
      habitId: string;
      archivedOn: string;
      archivedAt: string;
    }
  | {
      type: 'habitRestored';
      habitId: string;
      startedOn: string;
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
      if (
        state.habits.some(
          habit =>
            habit.id === action.habit.id ||
            areHabitNamesEqual(habit.name, action.habit.name),
        )
      ) {
        return state;
      }

      return {
        ...state,
        habits: [...state.habits, action.habit],
      };

    case 'habitUpdated':
      if (
        state.habits.some(
          habit =>
            habit.id !== action.habitId &&
            areHabitNamesEqual(habit.name, action.changes.name),
        )
      ) {
        return state;
      }

      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id !== action.habitId) {
            return habit;
          }

          const activityPeriods = areWeekdaysEqual(
            habit.schedule.weekdays,
            action.changes.schedule.weekdays,
          )
            ? habit.activityPeriods
            : updateSchedulePeriods(
                habit.activityPeriods,
                action.changes.schedule.weekdays,
                action.updatedOn,
              );

          return { ...habit, ...action.changes, activityPeriods };
        }),
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

    case 'habitRestored':
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (
            habit.id !== action.habitId ||
            habit.activityPeriods.some(period => period.endedBefore === null)
          ) {
            return habit;
          }

          return {
            ...habit,
            reminder: {
              ...habit.reminder,
              isEnabled: false,
            },
            activityPeriods: [
              ...habit.activityPeriods,
              {
                startedOn: action.startedOn,
                endedBefore: null,
                archivedAt: null,
                weekdays: habit.schedule.weekdays,
              },
            ],
          };
        }),
      };

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

      const habit = state.habits.find(item => item.id === action.habitId);

      if (habit === undefined || !isHabitPlannedOn(habit, action.completedOn)) {
        return state;
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

function areHabitNamesEqual(firstName: string, secondName: string): boolean {
  return (
    normalizeHabitName(firstName).toLocaleLowerCase() ===
    normalizeHabitName(secondName).toLocaleLowerCase()
  );
}

function areWeekdaysEqual(
  first: Habit['schedule']['weekdays'],
  second: Habit['schedule']['weekdays'],
): boolean {
  return (
    first.length === second.length &&
    first.every(weekday => second.includes(weekday))
  );
}

function updateSchedulePeriods(
  periods: Habit['activityPeriods'],
  weekdays: Habit['schedule']['weekdays'],
  updatedOn: string,
): Habit['activityPeriods'] {
  return periods.reduce<Habit['activityPeriods']>((updatedPeriods, period) => {
    if (period.endedBefore !== null) {
      updatedPeriods.push(period);
      return updatedPeriods;
    }

    if (period.startedOn === updatedOn) {
      updatedPeriods.push({ ...period, weekdays });
      return updatedPeriods;
    }

    updatedPeriods.push(
      {
        ...period,
        endedBefore: updatedOn,
        archivedAt: null,
      },
      {
        startedOn: updatedOn,
        endedBefore: null,
        archivedAt: null,
        weekdays,
      },
    );

    return updatedPeriods;
  }, []);
}
