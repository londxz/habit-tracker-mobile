export type Habit = {
  id: string;
  name: string;
  emoji: string | null;
  color: HabitColor | null;
  createdAt: string;
  reminder: HabitReminder;
  activityPeriods: HabitActivityPeriod[];
};

export type HabitsState = {
  habits: Habit[];
  completions: HabitCompletion[];
};

export type HabitCompletion = {
  habitId: string;
  completedOn: string;
};

export type HabitColor =
  | 'blue'
  | 'teal'
  | 'purple'
  | 'coral'
  | 'amber'
  | 'pink';

export type HabitReminder = {
  isEnabled: boolean;
  time: string;
  weekdays: HabitWeekday[];
};

export type HabitWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type HabitActivityPeriod =
  | OpenHabitActivityPeriod
  | ClosedHabitActivityPeriod;

type OpenHabitActivityPeriod = {
  startedOn: string;
  endedBefore: null;
  archivedAt: null;
};

type ClosedHabitActivityPeriod = {
  startedOn: string;
  endedBefore: string;
  archivedAt: string | null;
};
