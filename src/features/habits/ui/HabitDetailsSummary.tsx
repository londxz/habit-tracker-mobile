import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDayCount } from '../../../shared/localization/formatDayCount';
import { appColors } from '../../../shared/theme/colors';
import type { Habit } from '../model/habitTypes';
import { HabitIdentity } from './HabitIdentity';

type HabitDetailsSummaryProps = {
  habit: Habit;
  isActive: boolean;
  isPlannedToday: boolean;
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
  isPlannedToday,
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
      <HabitIdentity habit={habit} />

      {isActive ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{
            checked: isCompletedToday,
            disabled: !isPlannedToday,
          }}
          disabled={!isPlannedToday}
          onPress={onCompletionPress}
          style={({ pressed }) => [
            styles.todayCard,
            isCompletedToday && styles.todayCardCompleted,
            !isPlannedToday && styles.todayCardDisabled,
            pressed && styles.pressed,
          ]}
        >
          <View>
            <Text style={styles.todayLabel}>СЕГОДНЯ</Text>
            <Text style={styles.todayStatus}>
              {!isPlannedToday
                ? 'Не запланировано'
                : isCompletedToday
                ? 'Выполнено'
                : 'Не выполнено'}
            </Text>
          </View>

          {isPlannedToday ? (
            <View
              style={[
                styles.completionCircle,
                isCompletedToday && styles.completionCircleCompleted,
              ]}
            >
              {isCompletedToday ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : null}
            </View>
          ) : null}
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

const styles = StyleSheet.create({
  todayCard: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  todayCardCompleted: {
    backgroundColor: appColors.selectedSurface,
  },
  todayCardDisabled: {
    opacity: 0.65,
  },
  todayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  todayStatus: {
    marginTop: 3,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  completionCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appColors.textTertiary,
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
    color: appColors.onAccent,
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
    borderColor: appColors.separator,
  },
  streakColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: appColors.separator,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: appColors.textSecondary,
  },
  streakValue: {
    marginTop: 4,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '700',
    textAlign: 'center',
    color: appColors.textPrimary,
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
    color: appColors.textPrimary,
  },
  percentageDescription: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    color: appColors.textSecondary,
  },
});
