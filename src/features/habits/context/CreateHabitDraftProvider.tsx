import { createContext, useContext, useState, type ReactNode } from 'react';

import type { HabitColor } from '../model/habitTypes';

type CreateHabitDraft = {
  name: string;
  emoji: string;
  color: HabitColor | null;
  isReminderEnabled: boolean;
  reminderTime: string;
};

type CreateHabitDraftContextValue = {
  draft: CreateHabitDraft;
  updateDraft(values: Partial<CreateHabitDraft>): void;
};

type CreateHabitDraftProviderProps = {
  children: ReactNode;
};

const initialDraft: CreateHabitDraft = {
  name: '',
  emoji: '',
  color: null,
  isReminderEnabled: false,
  reminderTime: '08:00',
};

const CreateHabitDraftContext =
  createContext<CreateHabitDraftContextValue | null>(null);

export function CreateHabitDraftProvider({
  children,
}: CreateHabitDraftProviderProps) {
  const [draft, setDraft] = useState(initialDraft);

  function updateDraft(values: Partial<CreateHabitDraft>) {
    setDraft(currentDraft => ({
      ...currentDraft,
      ...values,
    }));
  }

  return (
    <CreateHabitDraftContext.Provider value={{ draft, updateDraft }}>
      {children}
    </CreateHabitDraftContext.Provider>
  );
}

export function useCreateHabitDraft(): CreateHabitDraftContextValue {
  const context = useContext(CreateHabitDraftContext);

  if (context === null) {
    throw new Error(
      'useCreateHabitDraft must be used inside CreateHabitDraftProvider',
    );
  }

  return context;
}
