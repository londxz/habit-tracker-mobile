import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArchivedHabitsScreen } from '../screens/ArchivedHabitsScreen';
import { CreateHabitScreen } from '../screens/CreateHabitScreen';
import { EditHabitScreen } from '../screens/EditHabitScreen';
import { HabitDetailsScreen } from '../screens/HabitDetailsScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
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
        component={CreateHabitScreen}
        options={{ title: 'Новая привычка' }}
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
