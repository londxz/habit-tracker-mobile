import type { ReactNode } from 'react';
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

import { useHabitFormDraft } from '../context/HabitFormDraftProvider';
import {
  HABIT_NAME_MAX_LENGTH,
  type HabitNameValidationError,
} from '../model/habitValidation';
import { getHabitAccentColor, getHabitColorName } from './habitColors';
import { HabitIcon } from './HabitIcon';
import { ReminderTimePicker } from './ReminderTimePicker';
import { appColors } from '../../../shared/theme/colors';
import { useHabitReminderPermission } from '../notifications/useHabitReminderPermission';

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

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

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
  const canSubmit = draft.name.trim().length > 0;
  const accentColor = getHabitAccentColor(draft.color);
  const { isRequestingPermission, setReminderEnabled } =
    useHabitReminderPermission();

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
              onChangeText={onNameChange}
              placeholder="Введите"
              placeholderTextColor={appColors.placeholder}
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
            onPress={onIconPress}
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
            onPress={onColorPress}
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
            <Text style={styles.secondaryValue}>Каждый день</Text>
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
                disabled={isRequestingPermission}
                value={draft.isReminderEnabled}
                onValueChange={setReminderEnabled}
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
            <ReminderTimePicker
              value={draft.reminderTime}
              disabled={!draft.isReminderEnabled}
              onChange={reminderTime => updateDraft({ reminderTime })}
            />
          </View>
        </View>

        <Text style={styles.helperText}>
          Уведомление придёт локально на этом устройстве.
        </Text>

        {children}
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <Pressable
          accessibilityRole="button"
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

        {secondaryAction !== undefined ? (
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
        ) : null}
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
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: appColors.textSecondary,
  },
  group: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  row: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  rowPressed: {
    backgroundColor: appColors.controlBackground,
  },
  rowDisabled: {
    opacity: 0.4,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: appColors.textPrimary,
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
    color: appColors.textPrimary,
  },
  secondaryValue: {
    fontSize: 17,
    color: appColors.textSecondary,
  },
  chevron: {
    marginLeft: 10,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
    color: appColors.textTertiary,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    backgroundColor: appColors.separator,
  },
  colorValue: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
  },
  colorValueNeutral: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: appColors.placeholder,
    backgroundColor: appColors.controlBackground,
  },
  error: {
    marginTop: 8,
    marginLeft: 12,
    fontSize: 13,
    color: appColors.danger,
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
    color: appColors.textSecondary,
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
    color: appColors.onAccent,
  },
  helperText: {
    marginTop: 8,
    marginHorizontal: 12,
    fontSize: 13,
    lineHeight: 18,
    color: appColors.textSecondary,
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
