import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArchivedHabitsScreen } from '../screens/archive/ArchivedHabitsScreen';
import { HabitDetailsScreen } from '../screens/habit-details/HabitDetailsScreen';
import { ProgressDayDetailsScreen } from '../screens/progress/ProgressDayDetailsScreen';
import { appColors } from '../shared/theme/colors';
import { CreateHabitNavigator } from './CreateHabitNavigator';
import { EditHabitNavigator } from './EditHabitNavigator';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTitleAlign: 'center',
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
        options={{ title: 'Детали' }}
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
        component={EditHabitNavigator}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="ArchivedHabits"
        component={ArchivedHabitsScreen}
        options={{ title: 'Архив' }}
      />

      <Stack.Screen
        name="ProgressDayDetails"
        component={ProgressDayDetailsScreen}
        options={{
          headerShown: false,
          presentation: 'pageSheet',
          contentStyle: { backgroundColor: appColors.background },
        }}
      />
    </Stack.Navigator>
  );
}
