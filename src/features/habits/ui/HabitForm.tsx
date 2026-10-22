import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '../../../shared/theme/colors';
import { useHabitFormDraft } from '../context/HabitFormDraftProvider';
import type { HabitWeekday } from '../model/habitTypes';
import {
  HABIT_NAME_MAX_LENGTH,
  type HabitNameValidationError,
} from '../model/habitValidation';
import { useHabitReminderPermission } from '../notifications/useHabitReminderPermission';
import { HabitBasicsSection } from './HabitBasicsSection';
import { HabitReminderSection } from './HabitReminderSection';
import { HabitScheduleSection } from './HabitScheduleSection';

type HabitFormProps = {
  children?: ReactNode;
  nameError: HabitNameValidationError | null;
  submitTitle: string;
  secondaryAction?: {
    title: string;
    onPress: () => void;
  };
  onNameChange: (value: string) => void;
  onIconPress: () => void;
  onColorPress: () => void;
  onSubmit: () => void;
};

export function HabitForm({
  children,
  nameError,
  submitTitle,
  secondaryAction,
  onNameChange,
  onIconPress,
  onColorPress,
  onSubmit,
}: HabitFormProps) {
  const { draft, updateDraft } = useHabitFormDraft();
  const insets = useSafeAreaInsets();
  const { isRequestingPermission, setReminderEnabled } =
    useHabitReminderPermission();
  const canSubmit = draft.name.trim().length > 0 && !isRequestingPermission;

  function toggleWeekday(weekday: HabitWeekday) {
    if (!draft.isReminderEnabled) {
      return;
    }

    const isSelected = draft.weekdays.includes(weekday);

    if (isSelected && draft.weekdays.length === 1) {
      return;
    }

    updateDraft({
      weekdays: isSelected
        ? draft.weekdays.filter(value => value !== weekday)
        : [...draft.weekdays, weekday].sort((first, second) => first - second),
    });
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
        <HabitBasicsSection
          draft={draft}
          errorMessage={getNameErrorMessage(nameError)}
          onNameChange={onNameChange}
          onIconPress={onIconPress}
          onColorPress={onColorPress}
        />

        <HabitScheduleSection />

        <HabitReminderSection
          isEnabled={draft.isReminderEnabled}
          isRequestingPermission={isRequestingPermission}
          time={draft.reminderTime}
          weekdays={draft.weekdays}
          onEnabledChange={setReminderEnabled}
          onTimeChange={reminderTime => updateDraft({ reminderTime })}
          onWeekdayToggle={toggleWeekday}
        />

        {children}
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit }}
          disabled={!canSubmit}
          onPress={onSubmit}
          style={({ pressed }) => [
            styles.saveButton,
            !canSubmit && styles.saveButtonDisabled,
            pressed && canSubmit && styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveButtonTitle}>{submitTitle}</Text>
        </Pressable>

        {secondaryAction === undefined ? null : (
          <Pressable
            accessibilityRole="button"
            onPress={secondaryAction.onPress}
            style={({ pressed }) => [
              styles.secondaryAction,
              pressed && styles.secondaryActionPressed,
            ]}
          >
            <Text style={styles.secondaryActionTitle}>
              {secondaryAction.title}
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function getNameErrorMessage(
  error: HabitNameValidationError | null,
): string | null {
  switch (error) {
    case 'required':
      return 'Введите название привычки';
    case 'tooLong':
      return `Название не должно быть длиннее ${HABIT_NAME_MAX_LENGTH} символов`;
    case 'duplicate':
      return 'Привычка с таким названием уже существует';
    case null:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: appColors.separator,
    backgroundColor: appColors.surface,
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
    color: appColors.onAccent,
  },
  secondaryAction: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionPressed: {
    opacity: 0.55,
  },
  secondaryActionTitle: {
    fontSize: 16,
    color: appColors.danger,
  },
});
