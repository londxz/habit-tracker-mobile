import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../shared/theme/colors';

import type { Habit } from '../model/habitTypes';
import { HabitIcon } from './HabitIcon';

type HabitIdentityProps = {
  habit: Habit;
  showsReminderTimeWhenDisabled?: boolean;
};

export function HabitIdentity({
  habit,
  showsReminderTimeWhenDisabled = false,
}: HabitIdentityProps) {
  return (
    <View style={styles.container}>
      <HabitIcon
        name={habit.name}
        emoji={habit.emoji}
        color={habit.color}
        size={54}
      />

      <View style={styles.text}>
        <Text numberOfLines={2} style={styles.name}>
          {habit.name}
        </Text>
        <Text style={styles.schedule}>
          {getScheduleTitle(habit, showsReminderTimeWhenDisabled)}
        </Text>
      </View>
    </View>
  );
}

function getScheduleTitle(
  habit: Habit,
  showsReminderTimeWhenDisabled: boolean,
): string {
  if (habit.reminder.isEnabled || showsReminderTimeWhenDisabled) {
    return `Каждый день · ${habit.reminder.time}`;
  }

  return 'Каждый день';
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  schedule: {
    fontSize: 16,
    lineHeight: 21,
    color: appColors.textSecondary,
  },
});
