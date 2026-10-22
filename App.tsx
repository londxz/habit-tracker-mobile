import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HabitsProvider } from './src/features/habits/context/HabitsProvider';
import { HabitReminderController } from './src/features/habits/notifications/HabitReminderController';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from './src/navigation/navigationTypes';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <HabitsProvider>
        <AppContent />
      </HabitsProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  return (
    <>
      <HabitReminderController
        navigationRef={navigationRef}
        isNavigationReady={isNavigationReady}
      />

      <NavigationContainer
        ref={navigationRef}
        onReady={() => setIsNavigationReady(true)}
      >
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default App;
