import { StyleSheet, Text, View } from 'react-native';

import type { DayHabitStatus } from './getDayHabitStatuses';
import { HabitIcon } from '../../entities/habit/ui/HabitIcon';
import { appColors } from '../../shared/theme/colors';

type ProgressDayHabitRowProps = {
  item: DayHabitStatus;
};

export function ProgressDayHabitRow({ item }: ProgressDayHabitRowProps) {
  return (
    <View style={[styles.container, item.isCompleted && styles.completed]}>
      <HabitIcon
        name={item.habit.name}
        emoji={item.habit.emoji}
        color={item.habit.color}
        size={44}
      />

      <View style={styles.text}>
        <Text style={styles.name}>{item.habit.name}</Text>
        <Text style={styles.status}>
          {item.isCompleted ? 'Выполнено' : 'Не выполнено'}
        </Text>
      </View>

      <View
        style={[
          styles.statusCircle,
          item.isCompleted && styles.statusCircleCompleted,
        ]}
      >
        {item.isCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: appColors.separator,
    backgroundColor: appColors.surface,
  },
  completed: {
    backgroundColor: appColors.selectedSurface,
  },
  text: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  status: {
    marginTop: 2,
    fontSize: 14,
    color: appColors.textSecondary,
  },
  statusCircle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appColors.textTertiary,
    borderRadius: 17,
  },
  statusCircleCompleted: {
    borderColor: appColors.accent,
    backgroundColor: appColors.accent,
  },
  checkmark: {
    fontSize: 19,
    lineHeight: 22,
    fontWeight: '700',
    color: appColors.onAccent,
  },
});
