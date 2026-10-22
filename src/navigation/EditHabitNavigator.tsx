import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  emptyHabitFormDraft,
  HabitFormDraftProvider,
  type HabitFormDraft,
} from '../features/habits/context/HabitFormDraftProvider';
import { useHabits } from '../features/habits/context/HabitsProvider';
import { EditHabitScreen } from '../screens/EditHabitScreen';
import { HabitColorPickerScreen } from '../screens/HabitColorPickerScreen';
import { HabitIconPickerScreen } from '../screens/HabitIconPickerScreen';
import { appColors } from '../shared/theme/colors';
import type {
  EditHabitStackParamList,
  RootStackParamList,
} from './navigationTypes';

const Stack = createNativeStackNavigator<EditHabitStackParamList>();

type EditHabitNavigatorProps = NativeStackScreenProps<
  RootStackParamList,
  'EditHabit'
>;

export function EditHabitNavigator({ route }: EditHabitNavigatorProps) {
  const { state } = useHabits();
  const habit = state.habits.find(item => item.id === route.params.habitId);
  const initialDraft: HabitFormDraft = habit
    ? {
        name: habit.name,
        emoji: habit.emoji ?? '',
        color: habit.color,
        weekdays: habit.reminder.weekdays,
        isReminderEnabled: habit.reminder.isEnabled,
        reminderTime: habit.reminder.time,
      }
    : emptyHabitFormDraft;

  return (
    <HabitFormDraftProvider initialDraft={initialDraft}>
      <Stack.Navigator
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: styles.content,
        }}
      >
        <Stack.Screen
          name="EditHabitForm"
          component={EditHabitScreen}
          initialParams={{ habitId: route.params.habitId }}
          options={{
            title: 'Редактировать',
            headerLeft: EditHabitCancelButton,
          }}
        />

        <Stack.Screen
          name="HabitIconPicker"
          component={HabitIconPickerScreen}
          options={{ title: 'Значок' }}
        />

        <Stack.Screen
          name="HabitColorPicker"
          component={HabitColorPickerScreen}
          options={{ title: 'Цвет' }}
        />
      </Stack.Navigator>
    </HabitFormDraftProvider>
  );
}

function EditHabitCancelButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.cancelButtonTitle}>Отмена</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: appColors.background,
  },
  cancelButtonTitle: {
    fontSize: 17,
    color: appColors.accent,
  },
});
