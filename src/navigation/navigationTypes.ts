export type RootStackParamList = {
  MainTabs: undefined;
  HabitDetails: {
    habitId: string;
  };
  CreateHabit: undefined;
  EditHabit: {
    habitId: string;
  };
  ArchivedHabits: undefined;
  ProgressDayDetails: {
    dateKey: string;
  };
};

export type MainTabsParamList = {
  Today: undefined;
  Progress: undefined;
};

export type CreateHabitStackParamList = {
  CreateHabitForm: undefined;
  HabitIconPicker: undefined;
  HabitColorPicker: undefined;
};

export type EditHabitStackParamList = {
  EditHabitForm: {
    habitId: string;
  };
  HabitIconPicker: undefined;
  HabitColorPicker: undefined;
};
