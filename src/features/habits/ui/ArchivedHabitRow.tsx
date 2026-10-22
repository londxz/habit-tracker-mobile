import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCompletionCount } from '../../../shared/localization/formatCompletionCount';
import type { ArchivedHabit } from '../model/getArchivedHabits';
import { HabitIcon } from './HabitIcon';

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

      <Ionicons name="chevron-forward" size={24} color="#8E96B1" />
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
    borderBottomColor: '#D8D8DE',
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    backgroundColor: '#F2F2F7',
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
    color: '#111111',
  },
  description: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    color: '#747B9A',
  },
});
