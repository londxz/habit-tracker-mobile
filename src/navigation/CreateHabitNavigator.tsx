import { useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';

import { CreateHabitDraftProvider } from '../features/habits/context/CreateHabitDraftProvider';
import { CreateHabitScreen } from '../screens/CreateHabitScreen';
import { HabitColorPickerScreen } from '../screens/HabitColorPickerScreen';
import { HabitIconPickerScreen } from '../screens/HabitIconPickerScreen';
import { appColors } from '../shared/theme/colors';
import type { CreateHabitStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<CreateHabitStackParamList>();

export function CreateHabitNavigator() {
  return (
    <CreateHabitDraftProvider>
      <Stack.Navigator
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: styles.content,
        }}
      >
        <Stack.Screen
          name="CreateHabitForm"
          component={CreateHabitScreen}
          options={{
            title: 'Новая привычка',
            headerLeft: CreateHabitCancelButton,
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
    </CreateHabitDraftProvider>
  );
}

function CreateHabitCancelButton() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CreateHabitStackParamList>>();

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
    backgroundColor: '#F2F2F7',
  },
  cancelButtonTitle: {
    fontSize: 17,
    color: appColors.accent,
  },
});
