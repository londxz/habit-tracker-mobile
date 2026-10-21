import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';

import {
  habitsReducer,
  initialHabitsState,
  type HabitsAction,
} from '../model/habitsReducer';
import type { HabitsState } from '../model/habitTypes';
import { habitsStorage } from '../storage/habitsStorage';

type HabitsContextValue = {
  state: HabitsState;
  dispatch: Dispatch<HabitsAction>;
};

type HabitsProviderProps = {
  children: ReactNode;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [state, dispatch] = useReducer(
    habitsReducer,
    initialHabitsState,
    loadInitialState,
  );

  useEffect(() => {
    habitsStorage.save(state);
  }, [state]);

  return (
    <HabitsContext.Provider value={{ state, dispatch }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits(): HabitsContextValue {
  const context = useContext(HabitsContext);

  if (context === null) {
    throw new Error('useHabits must be used inside HabitsProvider');
  }

  return context;
}

function loadInitialState(initialState: HabitsState): HabitsState {
  return habitsStorage.load() ?? initialState;
}
