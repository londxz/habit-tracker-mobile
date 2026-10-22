import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../shared/theme/colors';

import type { HabitColor } from '../model/habitTypes';
import { getHabitDisplayName } from './getHabitDisplayName';
import { HabitIcon } from './HabitIcon';

type HabitPreviewCardProps = {
  name: string;
  emoji: string | null;
  color: HabitColor | null;
  isReminderEnabled: boolean;
  reminderTime: string;
};

export function HabitPreviewCard({
  name,
  emoji,
  color,
  isReminderEnabled,
  reminderTime,
}: HabitPreviewCardProps) {
  const displayName = getHabitDisplayName(name);

  return (
    <View style={styles.card}>
      <HabitIcon name={displayName} emoji={emoji} color={color} />

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {displayName}
        </Text>

        <Text style={styles.schedule}>
          Каждый день{isReminderEnabled ? ` · ${reminderTime}` : ''}
        </Text>
      </View>

      <View style={styles.completionCircle} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  schedule: {
    marginTop: 3,
    fontSize: 15,
    color: appColors.textSecondary,
  },
  completionCircle: {
    width: 28,
    height: 28,
    marginLeft: 12,
    borderWidth: 2,
    borderColor: appColors.border,
    borderRadius: 14,
  },
});
