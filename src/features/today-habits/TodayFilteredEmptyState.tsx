import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../shared/theme/colors';
import type { TodayHabitFilter } from './todayHabitFilter';

type TodayFilteredEmptyStateProps = {
  filter: TodayHabitFilter;
  onShowAllPress: () => void;
};

export function TodayFilteredEmptyState({
  filter,
  onShowAllPress,
}: TodayFilteredEmptyStateProps) {
  const content = getEmptyStateContent(filter);

  return (
    <View style={styles.container}>
      <Ionicons name={content.icon} size={56} color={appColors.accent} />
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.description}>{content.description}</Text>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={onShowAllPress}
        style={({ pressed }) => pressed && styles.buttonPressed}
      >
        <Text style={styles.showAll}>Показать все</Text>
      </Pressable>
    </View>
  );
}

function getEmptyStateContent(filter: TodayHabitFilter) {
  switch (filter) {
    case 'remaining':
      return {
        icon: 'checkmark-circle-outline' as const,
        title: 'Всё выполнено',
        description: 'Невыполненных привычек на сегодня не осталось.',
      };
    case 'completed':
      return {
        icon: 'ellipse-outline' as const,
        title: 'Пока ничего не выполнено',
        description: 'Отметьте привычку, и она появится в этом списке.',
      };
    case 'all':
      return {
        icon: 'calendar-clear-outline' as const,
        title: 'Здесь пока пусто',
        description: 'В выбранном фильтре нет привычек на сегодня.',
      };
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  title: {
    width: '100%',
    maxWidth: 320,
    marginTop: 14,
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  description: {
    maxWidth: 300,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 23,
    color: appColors.textSecondary,
  },
  showAll: {
    marginTop: 20,
    fontSize: 17,
    color: appColors.accent,
  },
  buttonPressed: {
    opacity: 0.65,
  },
});
