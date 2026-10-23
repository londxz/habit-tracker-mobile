import { useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';

import { useHabitFormDraft } from '../../features/habit-form/HabitFormDraftProvider';
import { useHabits } from '../../entities/habit/context/HabitsProvider';
import { createHabit } from '../../entities/habit/model/createHabit';
import {
  validateHabitName,
  type HabitNameValidationError,
} from '../../entities/habit/model/habitValidation';
import { HabitForm } from '../../features/habit-form/HabitForm';
import { HabitPreviewCard } from '../../features/habit-form/HabitPreviewCard';
import { showHabitSaveError } from '../../entities/habit/ui/showHabitSaveError';
import type { CreateHabitStackParamList } from '../../navigation/navigationTypes';
import { appColors } from '../../shared/theme/colors';

type CreateHabitScreenProps = NativeStackScreenProps<
  CreateHabitStackParamList,
  'CreateHabitForm'
>;

export function CreateHabitScreen({ navigation }: CreateHabitScreenProps) {
  const { state, dispatch } = useHabits();
  const { draft, updateDraft } = useHabitFormDraft();
  const isSubmitting = useRef(false);
  const [nameError, setNameError] = useState<HabitNameValidationError | null>(
    null,
  );

  function handleNameChange(value: string) {
    updateDraft({ name: value });
    setNameError(null);
  }

  function handleSave() {
    if (isSubmitting.current) {
      return;
    }

    const validationResult = validateHabitName(draft.name, state.habits);

    if (!validationResult.isValid) {
      setNameError(validationResult.error);
      return;
    }

    isSubmitting.current = true;

    const didSave = dispatch({
      type: 'habitAdded',
      habit: createHabit({
        name: validationResult.name,
        emoji: draft.emoji.trim() || null,
        color: draft.color,
        reminder: {
          isEnabled: draft.isReminderEnabled,
          time: draft.reminderTime,
          weekdays: draft.weekdays,
        },
      }),
    });

    if (!didSave) {
      isSubmitting.current = false;
      showHabitSaveError();
      return;
    }

    navigation.getParent()?.goBack();
  }

  return (
    <HabitForm
      nameError={nameError}
      submitTitle="Добавить привычку"
      onNameChange={handleNameChange}
      onIconPress={() => navigation.navigate('HabitIconPicker')}
      onColorPress={() => navigation.navigate('HabitColorPicker')}
      onSubmit={handleSave}
    >
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
    </HabitForm>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: appColors.textSecondary,
  },
  helperText: {
    marginTop: 8,
    marginHorizontal: 12,
    fontSize: 13,
    lineHeight: 18,
    color: appColors.textSecondary,
  },
});
