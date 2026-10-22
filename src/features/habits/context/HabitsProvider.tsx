import {
  useCallback,
  createContext,
  useContext,
  useReducer,
  useRef,
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
  dispatch: (action: HabitsAction) => boolean;
};

type HabitsProviderProps = {
  children: ReactNode;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [state, updateState] = useReducer(
    habitsReducer,
    initialHabitsState,
    loadInitialState,
  );
  const stateRef = useRef(state);

  const dispatch = useCallback((action: HabitsAction): boolean => {
    const nextState = habitsReducer(stateRef.current, action);

    if (nextState === stateRef.current) {
      return true;
    }

    try {
      habitsStorage.save(nextState);
    } catch {
      return false;
    }

    stateRef.current = nextState;
    updateState({ type: 'stateLoaded', state: nextState });

    return true;
  }, []);

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
