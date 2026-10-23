import { createContext, useContext, useState, type ReactNode } from 'react';

import { allReminderWeekdays } from '../../entities/habit/model/habitReminderDays';
import type {
  HabitColor,
  HabitWeekday,
} from '../../entities/habit/model/habitTypes';

export type HabitFormDraft = {
  name: string;
  emoji: string;
  color: HabitColor | null;
  weekdays: HabitWeekday[];
  isReminderEnabled: boolean;
  reminderTime: string;
};

type HabitFormDraftContextValue = {
  draft: HabitFormDraft;
  updateDraft(values: Partial<HabitFormDraft>): void;
};

type HabitFormDraftProviderProps = {
  children: ReactNode;
  initialDraft?: HabitFormDraft;
};

export const emptyHabitFormDraft: HabitFormDraft = {
  name: '',
  emoji: '',
  color: null,
  weekdays: allReminderWeekdays,
  isReminderEnabled: false,
  reminderTime: '08:00',
};

const HabitFormDraftContext = createContext<HabitFormDraftContextValue | null>(
  null,
);

export function HabitFormDraftProvider({
  children,
  initialDraft = emptyHabitFormDraft,
}: HabitFormDraftProviderProps) {
  const [draft, setDraft] = useState(initialDraft);

  function updateDraft(values: Partial<HabitFormDraft>) {
    setDraft(currentDraft => ({
      ...currentDraft,
      ...values,
    }));
  }

  return (
    <HabitFormDraftContext.Provider value={{ draft, updateDraft }}>
      {children}
    </HabitFormDraftContext.Provider>
  );
}

export function useHabitFormDraft(): HabitFormDraftContextValue {
  const context = useContext(HabitFormDraftContext);

  if (context === null) {
    throw new Error(
      'useHabitFormDraft must be used inside HabitFormDraftProvider',
    );
  }

  return context;
}
