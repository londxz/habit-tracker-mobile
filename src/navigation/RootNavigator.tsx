import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArchivedHabitsScreen } from '../screens/ArchivedHabitsScreen';
import { EditHabitScreen } from '../screens/EditHabitScreen';
import { HabitDetailsScreen } from '../screens/HabitDetailsScreen';
import { CreateHabitNavigator } from './CreateHabitNavigator';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HabitDetails"
        component={HabitDetailsScreen}
        options={{ title: 'Привычка' }}
      />

      <Stack.Screen
        name="CreateHabit"
        component={CreateHabitNavigator}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="EditHabit"
        component={EditHabitScreen}
        options={{ title: 'Изменить привычку' }}
      />

      <Stack.Screen
        name="ArchivedHabits"
        component={ArchivedHabitsScreen}
        options={{ title: 'Архив' }}
      />
    </Stack.Navigator>
  );
}
