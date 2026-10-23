import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { appColors } from '../../shared/theme/colors';
import {
  getReminderDaysTitle,
  reminderWeekdayOptions,
} from '../../entities/habit/model/habitReminderDays';
import type { HabitWeekday } from '../../entities/habit/model/habitTypes';
import { habitFormStyles } from './habitFormStyles';
import { ReminderTimePicker } from './ReminderTimePicker';

type HabitReminderSectionProps = {
  isEnabled: boolean;
  isRequestingPermission: boolean;
  time: string;
  weekdays: HabitWeekday[];
  onEnabledChange: (isEnabled: boolean) => void;
  onTimeChange: (time: string) => void;
  onWeekdayToggle: (weekday: HabitWeekday) => void;
};

export function HabitReminderSection({
  isEnabled,
  isRequestingPermission,
  time,
  weekdays,
  onEnabledChange,
  onTimeChange,
  onWeekdayToggle,
}: HabitReminderSectionProps) {
  return (
    <>
      <Text style={habitFormStyles.sectionTitle}>НАПОМИНАНИЕ</Text>

      <View style={habitFormStyles.group}>
        <View style={habitFormStyles.row}>
          <Text style={habitFormStyles.rowLabel}>Напоминать</Text>
          <View
            style={[
              styles.switchContainer,
              Platform.OS === 'ios' && styles.switchContainerIos,
            ]}
          >
            <Switch
              accessibilityLabel="Напоминать"
              disabled={isRequestingPermission}
              value={isEnabled}
              onValueChange={onEnabledChange}
              style={
                Platform.OS === 'ios' ? styles.reminderSwitchIos : undefined
              }
            />
          </View>
        </View>

        <View style={habitFormStyles.separator} />

        <View style={[styles.daysHeader, !isEnabled && styles.disabled]}>
          <Text style={habitFormStyles.rowLabel}>Дни</Text>
          <Text style={habitFormStyles.secondaryValue}>
            {getReminderDaysTitle(weekdays)}
          </Text>
        </View>

        <View style={[styles.weekdays, !isEnabled && styles.disabled]}>
          {reminderWeekdayOptions.map(
            ({ label, accessibilityLabel, value }) => {
              const isSelected = weekdays.includes(value);
              const isOnlySelected = isSelected && weekdays.length === 1;
              const isDisabled = !isEnabled || isOnlySelected;

              return (
                <Pressable
                  key={value}
                  accessibilityLabel={accessibilityLabel}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: isSelected,
                    disabled: isDisabled,
                  }}
                  disabled={isDisabled}
                  hitSlop={5}
                  onPress={() => onWeekdayToggle(value)}
                  style={({ pressed }) => [
                    styles.weekday,
                    pressed && styles.weekdayPressed,
                  ]}
                >
                  <Text style={styles.weekdayName}>{label}</Text>
                  <View
                    style={[
                      styles.weekdayControl,
                      isSelected && styles.weekdayControlSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Text style={styles.weekdayCheckmark}>✓</Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            },
          )}
        </View>

        <View style={habitFormStyles.separator} />

        <View style={[habitFormStyles.row, !isEnabled && styles.disabled]}>
          <Text style={habitFormStyles.rowLabel}>Время</Text>
          <ReminderTimePicker
            value={time}
            disabled={!isEnabled}
            onChange={onTimeChange}
          />
        </View>
      </View>

      <Text style={styles.helperText}>
        Уведомление придёт локально на этом устройстве.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  daysHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  weekday: {
    minWidth: 38,
    alignItems: 'center',
    gap: 8,
  },
  weekdayPressed: {
    opacity: 0.6,
  },
  weekdayName: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  weekdayControl: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appColors.border,
    borderRadius: 17,
  },
  weekdayControlSelected: {
    borderColor: appColors.accent,
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
});
