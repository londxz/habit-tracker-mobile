import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { appColors } from '../../shared/theme/colors';
import type { HabitFormDraft } from './HabitFormDraftProvider';
import { HABIT_NAME_MAX_LENGTH } from '../../entities/habit/model/habitValidation';
import {
  getHabitAccentColor,
  getHabitColorName,
} from '../../entities/habit/ui/habitColors';
import { habitFormStyles } from './habitFormStyles';
import { HabitIcon } from '../../entities/habit/ui/HabitIcon';

type HabitBasicsSectionProps = {
  draft: HabitFormDraft;
  errorMessage: string | null;
  onNameChange: (value: string) => void;
  onIconPress: () => void;
  onColorPress: () => void;
};

export function HabitBasicsSection({
  draft,
  errorMessage,
  onNameChange,
  onIconPress,
  onColorPress,
}: HabitBasicsSectionProps) {
  const accentColor = getHabitAccentColor(draft.color);

  return (
    <>
      <Text style={habitFormStyles.sectionTitle}>ОСНОВНОЕ</Text>

      <View style={habitFormStyles.group}>
        <View style={habitFormStyles.row}>
          <Text style={habitFormStyles.rowLabel}>Название</Text>
          <TextInput
            value={draft.name}
            accessibilityLabel="Название привычки"
            maxLength={HABIT_NAME_MAX_LENGTH}
            onChangeText={onNameChange}
            placeholder="Введите"
            placeholderTextColor={appColors.placeholder}
            returnKeyType="done"
            textAlign="right"
            style={styles.nameInput}
          />
        </View>

        <View style={habitFormStyles.separator} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Выбрать значок"
          onPress={onIconPress}
          style={({ pressed }) => [
            habitFormStyles.row,
            pressed && styles.rowPressed,
          ]}
        >
          <Text style={habitFormStyles.rowLabel}>Значок</Text>
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

        <View style={habitFormStyles.separator} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Выбрать цвет"
          onPress={onColorPress}
          style={({ pressed }) => [
            habitFormStyles.row,
            pressed && styles.rowPressed,
          ]}
        >
          <Text style={habitFormStyles.rowLabel}>Цвет</Text>
          <View style={styles.rowValue}>
            <View
              style={[
                styles.colorValue,
                { backgroundColor: accentColor },
                draft.color === null && styles.colorValueNeutral,
              ]}
            />
            <Text style={habitFormStyles.secondaryValue}>
              {getHabitColorName(draft.color)}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </Pressable>
      </View>

      {errorMessage === null ? null : (
        <Text accessibilityRole="alert" style={styles.error}>
          {errorMessage}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  rowPressed: {
    backgroundColor: appColors.controlBackground,
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
  chevron: {
    marginLeft: 10,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
    color: appColors.textTertiary,
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
});
