import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDayCount } from '../../../shared/localization/formatDayCount';
import { appColors } from '../../../shared/theme/colors';
import type { Habit } from '../model/habitTypes';
import { HabitIcon } from './HabitIcon';

type HabitDetailsSummaryProps = {
  habit: Habit;
  isActive: boolean;
  isCompletedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  percentage: number;
  completedCount: number;
  plannedCount: number;
  onCompletionPress: () => void;
};

export function HabitDetailsSummary({
  habit,
  isActive,
  isCompletedToday,
  currentStreak,
  bestStreak,
  percentage,
  completedCount,
  plannedCount,
  onCompletionPress,
}: HabitDetailsSummaryProps) {
  return (
    <View>
      <View style={styles.identity}>
        <HabitIcon
          name={habit.name}
          emoji={habit.emoji}
          color={habit.color}
          size={54}
        />

        <View style={styles.identityText}>
          <Text numberOfLines={2} style={styles.name}>
            {habit.name}
          </Text>
          <Text style={styles.schedule}>{getScheduleTitle(habit)}</Text>
        </View>
      </View>

      {isActive ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompletedToday }}
          onPress={onCompletionPress}
          style={({ pressed }) => [
            styles.todayCard,
            isCompletedToday && styles.todayCardCompleted,
            pressed && styles.pressed,
          ]}
        >
          <View>
            <Text style={styles.todayLabel}>СЕГОДНЯ</Text>
            <Text style={styles.todayStatus}>
              {isCompletedToday ? 'Выполнено' : 'Не выполнено'}
            </Text>
          </View>

          <View
            style={[
              styles.completionCircle,
              isCompletedToday && styles.completionCircleCompleted,
            ]}
          >
            {isCompletedToday ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
        </Pressable>
      ) : null}

      <View style={styles.streaks}>
        <View style={styles.streakColumn}>
          <Text style={styles.streakLabel}>🔥 ТЕКУЩАЯ СЕРИЯ</Text>
          <Text style={styles.streakValue}>
            {formatDayCount(currentStreak)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.streakColumn}>
          <Text style={styles.streakLabel}>ЛИЧНЫЙ РЕКОРД</Text>
          <Text style={styles.streakValue}>{formatDayCount(bestStreak)}</Text>
        </View>
      </View>

      <View style={styles.completionStats}>
        <Text style={styles.percentage}>{percentage}% выполнения</Text>
        <Text style={styles.percentageDescription}>
          {completedCount} из {plannedCount} запланированных дней
        </Text>
      </View>
    </View>
  );
}

function getScheduleTitle(habit: Habit): string {
  if (habit.reminder.isEnabled) {
    return `Каждый день · ${habit.reminder.time}`;
  }

  return 'Каждый день';
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityText: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '700',
    color: '#000000',
  },
  schedule: {
    fontSize: 16,
    lineHeight: 21,
    color: '#747480',
  },
  todayCard: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  todayCardCompleted: {
    backgroundColor: '#EDF4FF',
  },
  todayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#747480',
  },
  todayStatus: {
    marginTop: 3,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    color: '#111111',
  },
  completionCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8E94A5',
    borderRadius: 18,
  },
  completionCircleCompleted: {
    borderColor: appColors.accent,
    backgroundColor: appColors.accent,
  },
  checkmark: {
    fontSize: 21,
    lineHeight: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
  streaks: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#D1D1D6',
  },
  streakColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D1D6',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#747480',
  },
  streakValue: {
    marginTop: 4,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000000',
  },
  completionStats: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  percentage: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
  },
  percentageDescription: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: '#747480',
  },
});
