import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { createHabit } from '../features/habits/model/createHabit';
import type { HabitColor } from '../features/habits/model/habitTypes';
import {
  HABIT_NAME_MAX_LENGTH,
  validateHabitName,
  type HabitNameValidationError,
} from '../features/habits/model/habitValidation';
import type { RootStackParamList } from '../navigation/navigationTypes';

type CreateHabitScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateHabit'
>;

const habitColors: Array<{
  value: HabitColor;
  hex: string;
}> = [
  { value: 'blue', hex: '#3478F6' },
  { value: 'teal', hex: '#30B0C7' },
  { value: 'purple', hex: '#AF52DE' },
  { value: 'coral', hex: '#FF6B5E' },
  { value: 'amber', hex: '#FFB340' },
  { value: 'pink', hex: '#FF375F' },
];

export function CreateHabitScreen({
  navigation,
}: CreateHabitScreenProps) {
  const { state, dispatch } = useHabits();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState<HabitColor | null>(null);
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [nameError, setNameError] =
    useState<HabitNameValidationError | null>(null);

  const canSave = name.trim().length > 0;

  function handleNameChange(value: string) {
    setName(value);
    setNameError(null);
  }

  function handleColorPress(value: HabitColor) {
    setColor(currentColor =>
      currentColor === value ? null : value,
    );
  }

  function handleSave() {
    const validationResult = validateHabitName(
      name,
      state.habits,
    );

    if (!validationResult.isValid) {
      setNameError(validationResult.error);
      return;
    }

    const habit = createHabit({
      name: validationResult.name,
      emoji: emoji.trim() || null,
      color,
      reminder: {
        isEnabled: isReminderEnabled,
        time: '08:00',
      },
    });

    dispatch({
      type: 'habitAdded',
      habit,
    });

    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>Название</Text>

          <TextInput
            value={name}
            onChangeText={handleNameChange}
            placeholder="Например, читать 20 минут"
            maxLength={HABIT_NAME_MAX_LENGTH}
            autoFocus
            returnKeyType="done"
            style={styles.input}
          />

          {nameError !== null ? (
            <Text style={styles.error}>
              {getNameErrorMessage(nameError)}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Иконка</Text>

          <TextInput
            value={emoji}
            onChangeText={setEmoji}
            placeholder="Например, 📚"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.hint}>Необязательно</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Цвет</Text>

          <View style={styles.colors}>
            {habitColors.map(option => (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{
                  selected: color === option.value,
                }}
                onPress={() => handleColorPress(option.value)}
                style={[
                  styles.color,
                  { backgroundColor: option.hex },
                  color === option.value && styles.selectedColor,
                ]}
              >
                {color === option.value ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null}
              </Pressable>
            ))}
          </View>

          <Text style={styles.hint}>Необязательно</Text>
        </View>

        <View style={[styles.section, styles.reminderSection]}>
          <View style={styles.reminderText}>
            <Text style={styles.label}>Напоминание</Text>
            <Text style={styles.reminderTime}>
              Каждый день · 08:00
            </Text>
          </View>

          <Switch
            value={isReminderEnabled}
            onValueChange={setIsReminderEnabled}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          disabled={!canSave}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
            pressed && canSave && styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveButtonTitle}>
            Добавить привычку
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function getNameErrorMessage(
  error: HabitNameValidationError,
): string {
  switch (error) {
    case 'required':
      return 'Введите название привычки';
    case 'tooLong':
      return `Название не должно быть длиннее ${HABIT_NAME_MAX_LENGTH} символов`;
    case 'duplicate':
      return 'Привычка с таким названием уже существует';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  label: {
    marginBottom: 8,
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    fontSize: 17,
    color: '#111111',
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: '#8E8E93',
  },
  error: {
    marginTop: 8,
    fontSize: 13,
    color: '#FF3B30',
  },
  colors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  color: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 21,
  },
  selectedColor: {
    borderColor: '#111111',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reminderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderText: {
    flex: 1,
  },
  reminderTime: {
    fontSize: 15,
    color: '#8E8E93',
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#0A84FF',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonPressed: {
    opacity: 0.75,
  },
  saveButtonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});