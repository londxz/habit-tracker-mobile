import { useRef, useState } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useHabitFormDraft } from '../features/habits/context/HabitFormDraftProvider';
import { useHabits } from '../features/habits/context/HabitsProvider';
import {
  validateHabitName,
  type HabitNameValidationError,
} from '../features/habits/model/habitValidation';
import { HabitForm } from '../features/habits/ui/HabitForm';
import { showHabitSaveError } from '../features/habits/ui/showHabitSaveError';
import type {
  EditHabitStackParamList,
  RootStackParamList,
} from '../navigation/navigationTypes';
import { getDateKey } from '../shared/date/getDateKey';
import { useCurrentDate } from '../shared/date/useCurrentDate';
import { appColors } from '../shared/theme/colors';

type EditHabitScreenProps = NativeStackScreenProps<
  EditHabitStackParamList,
  'EditHabitForm'
>;

export function EditHabitScreen({ navigation, route }: EditHabitScreenProps) {
  const { state, dispatch } = useHabits();
  const { draft, updateDraft } = useHabitFormDraft();
  const isSubmitting = useRef(false);
  const currentDate = useCurrentDate();
  const [nameError, setNameError] = useState<HabitNameValidationError | null>(
    null,
  );
  const habit = state.habits.find(item => item.id === route.params.habitId);
  const rootNavigation =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  function handleNameChange(value: string) {
    updateDraft({ name: value });
    setNameError(null);
  }

  function handleSave() {
    if (habit === undefined || isSubmitting.current) {
      return;
    }

    const validationResult = validateHabitName(
      draft.name,
      state.habits,
      habit.id,
    );

    if (!validationResult.isValid) {
      setNameError(validationResult.error);
      return;
    }

    isSubmitting.current = true;

    const didSave = dispatch({
      type: 'habitUpdated',
      habitId: habit.id,
      changes: {
        name: validationResult.name,
        emoji: draft.emoji.trim() || null,
        color: draft.color,
        reminder: {
          isEnabled: draft.isReminderEnabled,
          time: draft.reminderTime,
          weekdays: draft.weekdays,
        },
      },
    });

    if (!didSave) {
      isSubmitting.current = false;
      showHabitSaveError();
      return;
    }

    rootNavigation?.goBack();
  }

  function handleArchivePress() {
    if (habit === undefined) {
      return;
    }

    Alert.alert(
      'Завершить привычку?',
      'Она исчезнет из «Сегодня», напоминание отключится, а история сохранится.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Завершить',
          style: 'destructive',
          onPress: () => {
            const didSave = dispatch({
              type: 'habitArchived',
              habitId: habit.id,
              archivedOn: getDateKey(currentDate),
              archivedAt: new Date().toISOString(),
            });

            if (!didSave) {
              showHabitSaveError();
              return;
            }

            rootNavigation?.goBack();
          },
        },
      ],
    );
  }

  function handleDeletePress() {
    if (habit === undefined) {
      return;
    }

    Alert.alert(
      'Удалить привычку?',
      'Привычка и вся история выполнения будут удалены безвозвратно.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            const didSave = dispatch({
              type: 'habitDeleted',
              habitId: habit.id,
            });

            if (!didSave) {
              showHabitSaveError();
              return;
            }

            rootNavigation?.popTo('MainTabs');
          },
        },
      ],
    );
  }

  if (habit === undefined) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Привычка не найдена</Text>
      </View>
    );
  }

  return (
    <HabitForm
      nameError={nameError}
      submitTitle="Сохранить изменения"
      secondaryAction={{
        title: 'Удалить привычку',
        onPress: handleDeletePress,
      }}
      onNameChange={handleNameChange}
      onIconPress={() => navigation.navigate('HabitIconPicker')}
      onColorPress={() => navigation.navigate('HabitColorPicker')}
      onSubmit={handleSave}
    >
      <Text style={styles.sectionTitle}>УПРАВЛЕНИЕ</Text>

      <Pressable
        accessibilityRole="button"
        onPress={handleArchivePress}
        style={({ pressed }) => [
          styles.archiveAction,
          pressed && styles.archiveActionPressed,
        ]}
      >
        <Ionicons
          name="archive-outline"
          size={27}
          color={appColors.textSecondary}
        />
        <Text style={styles.archiveActionTitle}>Завершить привычку</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <Text style={styles.helperText}>
        Она исчезнет из «Сегодня», напоминание отключится, история сохранится.
      </Text>
    </HabitForm>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 28,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: appColors.textSecondary,
  },
  archiveAction: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  archiveActionPressed: {
    backgroundColor: appColors.controlBackground,
  },
  archiveActionTitle: {
    flex: 1,
    marginLeft: 14,
    fontSize: 17,
    color: appColors.textPrimary,
  },
  chevron: {
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
    color: appColors.textTertiary,
  },
  helperText: {
    marginTop: 8,
    marginHorizontal: 12,
    fontSize: 13,
    lineHeight: 18,
    color: appColors.textSecondary,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.background,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
});
