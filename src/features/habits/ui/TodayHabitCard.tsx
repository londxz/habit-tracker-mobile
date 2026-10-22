import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDayCount } from '../../../shared/localization/formatDayCount';
import { appColors } from '../../../shared/theme/colors';
import type { Habit } from '../model/habitTypes';
import { HabitIcon } from './HabitIcon';

type TodayHabitCardProps = {
  habit: Habit;
  isCompleted: boolean;
  currentStreak: number;
  bestStreak: number;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onCompletionPress: () => void;
};

export function TodayHabitCard({
  habit,
  isCompleted,
  currentStreak,
  bestStreak,
  isFirst,
  isLast,
  onPress,
  onCompletionPress,
}: TodayHabitCardProps) {
  return (
    <View
      style={[
        styles.card,
        isFirst && styles.firstCard,
        isLast && styles.lastCard,
        isCompleted && styles.cardCompleted,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Открыть привычку ${habit.name}`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.detailsButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <HabitIcon
          name={habit.name}
          emoji={habit.emoji}
          color={habit.color}
          size={48}
        />

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.name}>
            {habit.name}
          </Text>

          <Text numberOfLines={1} style={styles.subtitle}>
            {getHabitSubtitle(habit, isCompleted, currentStreak, bestStreak)}
          </Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={
          isCompleted
            ? `${habit.name}: отменить выполнение сегодня`
            : `${habit.name}: выполнить сегодня`
        }
        accessibilityState={{ checked: isCompleted }}
        hitSlop={6}
        onPress={onCompletionPress}
        style={({ pressed }) => [
          styles.completionButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <View
          style={[
            styles.completionCircle,
            isCompleted && styles.completionCircleCompleted,
          ]}
        >
          {isCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
      </Pressable>

      {!isLast ? <View style={styles.separator} /> : null}
    </View>
  );
}

function getHabitSubtitle(
  habit: Habit,
  isCompleted: boolean,
  currentStreak: number,
  bestStreak: number,
): string {
  if (isCompleted) {
    return `Выполнено сегодня · серия ${formatDayCount(currentStreak)}`;
  }

  if (bestStreak > 0) {
    return `Лучший результат: ${formatDayCount(bestStreak)}`;
  }

  if (habit.reminder.isEnabled) {
    return `Напоминание в ${habit.reminder.time}`;
  }

  return 'Каждый день';
}

const styles = StyleSheet.create({
  card: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardCompleted: {
    backgroundColor: '#EDF4FF',
  },
  firstCard: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  lastCard: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  detailsButton: {
    minHeight: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 14,
  },
  buttonPressed: {
    opacity: 0.65,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: '#111111',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#747480',
  },
  completionButton: {
    width: 58,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionCircle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A8AEC0',
    borderRadius: 15,
  },
  completionCircleCompleted: {
    borderColor: appColors.accent,
    backgroundColor: appColors.accent,
  },
  checkmark: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  separator: {
    position: 'absolute',
    right: 14,
    bottom: 0,
    left: 74,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D8D8DE',
  },
});
