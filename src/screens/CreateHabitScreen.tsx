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

import { useCreateHabitDraft } from '../features/habits/context/CreateHabitDraftProvider';
import { useHabits } from '../features/habits/context/HabitsProvider';
import { createHabit } from '../features/habits/model/createHabit';
import {
  HABIT_NAME_MAX_LENGTH,
  validateHabitName,
  type HabitNameValidationError,
} from '../features/habits/model/habitValidation';
import {
  getHabitAccentColor,
  getHabitColorName,
} from '../features/habits/ui/habitColors';
import { HabitIcon } from '../features/habits/ui/HabitIcon';
import { HabitPreviewCard } from '../features/habits/ui/HabitPreviewCard';
import type { CreateHabitStackParamList } from '../navigation/navigationTypes';
import { appColors } from '../shared/theme/colors';

type CreateHabitScreenProps = NativeStackScreenProps<
  CreateHabitStackParamList,
  'CreateHabitForm'
>;

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function CreateHabitScreen({ navigation }: CreateHabitScreenProps) {
  const { state, dispatch } = useHabits();
  const { draft, updateDraft } = useCreateHabitDraft();
  const insets = useSafeAreaInsets();
  const [nameError, setNameError] = useState<HabitNameValidationError | null>(
    null,
  );

  const canSave = draft.name.trim().length > 0;
  const accentColor = getHabitAccentColor(draft.color);

  function handleNameChange(value: string) {
    updateDraft({ name: value });
    setNameError(null);
  }

  function handleSave() {
    const validationResult = validateHabitName(draft.name, state.habits);

    if (!validationResult.isValid) {
      setNameError(validationResult.error);
      return;
    }

    const habit = createHabit({
      name: validationResult.name,
      emoji: draft.emoji.trim() || null,
      color: draft.color,
      reminder: {
        isEnabled: draft.isReminderEnabled,
        time: draft.reminderTime,
      },
    });

    dispatch({
      type: 'habitAdded',
      habit,
    });

    navigation.getParent()?.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>ОСНОВНОЕ</Text>

        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Название</Text>

            <TextInput
              value={draft.name}
              onChangeText={handleNameChange}
              placeholder="Введите"
              maxLength={HABIT_NAME_MAX_LENGTH}
              returnKeyType="done"
              textAlign="right"
              style={styles.nameInput}
            />
          </View>

          <View style={styles.separator} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Выбрать значок"
            onPress={() => navigation.navigate('HabitIconPicker')}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowLabel}>Значок</Text>

            <View style={styles.rowValue}>
              <HabitIcon
                name={draft.name}
                emoji={draft.emoji || null}
                color={draft.color}
                size={42}
              />
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>

          <View style={styles.separator} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Выбрать цвет"
            onPress={() => navigation.navigate('HabitColorPicker')}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.rowLabel}>Цвет</Text>

            <View style={styles.rowValue}>
              <View
                style={[
                  styles.colorValue,
                  { backgroundColor: accentColor },
                  draft.color === null && styles.colorValueNeutral,
                ]}
              />
              <Text style={styles.secondaryValue}>
                {getHabitColorName(draft.color)}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>
        </View>

        {nameError !== null ? (
          <Text style={styles.error}>{getNameErrorMessage(nameError)}</Text>
        ) : null}

        <Text style={styles.sectionTitle}>РАСПИСАНИЕ</Text>

        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Повторять</Text>

            <View style={styles.rowValue}>
              <Text style={styles.secondaryValue}>Каждый день</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.weekdays}>
            {weekdays.map(day => (
              <View key={day} style={styles.weekday}>
                <Text style={styles.weekdayName}>{day}</Text>
                <View style={styles.weekdaySelected}>
                  <Text style={styles.weekdayCheckmark}>✓</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>НАПОМИНАНИЕ</Text>

        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Напоминать</Text>
            <View
              style={[
                styles.switchContainer,
                Platform.OS === 'ios' && styles.switchContainerIos,
              ]}
            >
              <Switch
                accessibilityLabel="Напоминать"
                value={draft.isReminderEnabled}
                onValueChange={value =>
                  updateDraft({ isReminderEnabled: value })
                }
                style={
                  Platform.OS === 'ios' ? styles.reminderSwitchIos : undefined
                }
              />
            </View>
          </View>

          <View style={styles.separator} />

          <View
            style={[styles.row, !draft.isReminderEnabled && styles.rowDisabled]}
          >
            <Text style={styles.rowLabel}>Время</Text>
            <View style={styles.rowValue}>
              <Text style={styles.secondaryValue}>{draft.reminderTime}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.helperText}>
          Уведомление придёт локально на этом устройстве.
        </Text>

        <Text style={styles.sectionTitle}>ПРЕДПРОСМОТР</Text>

        <HabitPreviewCard
          name={draft.name}
          emoji={draft.emoji || null}
          color={draft.color}
          isReminderEnabled={draft.isReminderEnabled}
          reminderTime={draft.reminderTime}
        />

        <Text style={styles.helperText}>
          Все данные хранятся только на устройстве.
        </Text>
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
          <Text style={styles.saveButtonTitle}>Добавить привычку</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function getNameErrorMessage(error: HabitNameValidationError): string {
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#747B9A',
  },
  group: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  row: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  rowPressed: {
    backgroundColor: '#F2F2F7',
  },
  rowDisabled: {
    opacity: 0.4,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#111111',
  },
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  nameInput: {
    minWidth: 150,
    flex: 1,
    marginLeft: 16,
    paddingVertical: 8,
    fontSize: 17,
    color: '#111111',
  },
  secondaryValue: {
    fontSize: 17,
    color: '#747B9A',
  },
  chevron: {
    marginLeft: 10,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
    color: '#8E96B1',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    backgroundColor: '#D8D8DE',
  },
  colorValue: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
  },
  colorValueNeutral: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C7C7CC',
    backgroundColor: '#E5E5EA',
  },
  error: {
    marginTop: 8,
    marginLeft: 12,
    fontSize: 13,
    color: '#FF3B30',
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  weekday: {
    alignItems: 'center',
    gap: 8,
  },
  weekdayName: {
    fontSize: 14,
    color: '#747B9A',
  },
  weekdaySelected: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: appColors.accent,
  },
  weekdayCheckmark: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helperText: {
    marginTop: 8,
    marginHorizontal: 12,
    fontSize: 13,
    lineHeight: 18,
    color: '#747B9A',
  },
  switchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainerIos: {
    width: 51,
    height: 31,
  },
  reminderSwitchIos: {
    width: 51,
    height: 31,
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: appColors.accent,
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
