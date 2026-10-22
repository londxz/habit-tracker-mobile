import {
  useCallback,
  createContext,
  useContext,
  useReducer,
  useRef,
  useState,
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
  hasLoadError: boolean;
  retryLoad(): void;
};

type HabitsProviderProps = {
  children: ReactNode;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [initialLoad] = useState(loadInitialState);
  const [state, updateState] = useReducer(habitsReducer, initialLoad.state);
  const [hasLoadError, setHasLoadError] = useState(initialLoad.hasError);
  const stateRef = useRef(state);

  const dispatch = useCallback((action: HabitsAction): boolean => {
    const nextState = habitsReducer(stateRef.current, action);

    if (nextState === stateRef.current) {
      return false;
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

  const retryLoad = useCallback(() => {
    try {
      const loadedState = habitsStorage.load() ?? initialHabitsState;

      stateRef.current = loadedState;
      updateState({ type: 'stateLoaded', state: loadedState });
      setHasLoadError(false);
    } catch {
      setHasLoadError(true);
    }
  }, []);

  return (
    <HabitsContext.Provider
      value={{ state, dispatch, hasLoadError, retryLoad }}
    >
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

function loadInitialState(): { state: HabitsState; hasError: boolean } {
  try {
    return {
      state: habitsStorage.load() ?? initialHabitsState,
      hasError: false,
    };
  } catch {
    return { state: initialHabitsState, hasError: true };
  }
}
