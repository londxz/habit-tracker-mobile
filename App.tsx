import {
  createNavigationContainerRef,
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  HabitsProvider,
  useHabits,
} from './src/entities/habit/context/HabitsProvider';
import { HabitsLoadError } from './src/entities/habit/ui/HabitsLoadError';
import { HabitReminderController } from './src/features/habit-reminders/HabitReminderController';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from './src/navigation/navigationTypes';

const navigationRef = createNavigationContainerRef<RootStackParamList>();
const lightNavigationTheme = createNavigationTheme(DefaultTheme, {
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#111111',
  border: '#D1D1D6',
  notification: '#FF3B30',
});
const darkNavigationTheme = createNavigationTheme(DarkTheme, {
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  border: '#38383A',
  notification: '#FF453A',
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <HabitsProvider>
        <AppContent isDarkMode={isDarkMode} />
      </HabitsProvider>
    </SafeAreaProvider>
  );
}

type AppContentProps = {
  isDarkMode: boolean;
};

function AppContent({ isDarkMode }: AppContentProps) {
  const { hasLoadError, retryLoad } = useHabits();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const openHabit = useCallback((habitId: string) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('HabitDetails', { habitId });
    }
  }, []);

  if (hasLoadError) {
    return <HabitsLoadError onRetry={retryLoad} />;
  }

  return (
    <>
      <HabitReminderController
        isNavigationReady={isNavigationReady}
        onOpenHabit={openHabit}
      />

      <NavigationContainer
        ref={navigationRef}
        theme={isDarkMode ? darkNavigationTheme : lightNavigationTheme}
        onReady={() => setIsNavigationReady(true)}
      >
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

function createNavigationTheme(
  baseTheme: Theme,
  colors: Omit<Theme['colors'], 'primary'>,
): Theme {
  return {
    ...baseTheme,
    colors: {
      ...colors,
      primary: '#0A84FF',
    },
  };
}

export default App;
