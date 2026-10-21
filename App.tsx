import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HabitsProvider } from './src/features/habits/context/HabitsProvider';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <HabitsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </HabitsProvider>
    </SafeAreaProvider>
  );
}

export default App;
