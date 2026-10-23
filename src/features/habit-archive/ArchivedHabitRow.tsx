import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCompletionCount } from '../../shared/localization/formatCompletionCount';
import { appColors } from '../../shared/theme/colors';
import type { ArchivedHabit } from './getArchivedHabits';
import { HabitIcon } from '../../entities/habit/ui/HabitIcon';

type ArchivedHabitRowProps = {
  item: ArchivedHabit;
  onPress: () => void;
};

const archiveDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});

export function ArchivedHabitRow({ item, onPress }: ArchivedHabitRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Открыть завершённую привычку ${item.habit.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <HabitIcon
        name={item.habit.name}
        emoji={item.habit.emoji}
        color={item.habit.color}
        size={50}
      />

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {item.habit.name}
        </Text>
        <Text numberOfLines={1} style={styles.description}>
          Завершена {archiveDateFormatter.format(new Date(item.archivedAt))} ·{' '}
          {formatCompletionCount(item.completionCount)}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={24}
        color={appColors.textTertiary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: appColors.separator,
    backgroundColor: appColors.surface,
  },
  pressed: {
    backgroundColor: appColors.controlBackground,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  description: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    color: appColors.textSecondary,
  },
});
