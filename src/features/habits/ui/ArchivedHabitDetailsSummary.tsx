import { StyleSheet, Text, View } from 'react-native';

import { formatCompletionCount } from '../../../shared/localization/formatCompletionCount';
import { formatDayCount } from '../../../shared/localization/formatDayCount';
import { appColors } from '../../../shared/theme/colors';
import type { Habit } from '../model/habitTypes';
import { HabitIdentity } from './HabitIdentity';

type ArchivedHabitDetailsSummaryProps = {
  habit: Habit;
  archivedAt: string;
  bestStreak: number;
  percentage: number;
  completedCount: number;
  plannedCount: number;
};

const archiveDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function ArchivedHabitDetailsSummary({
  habit,
  archivedAt,
  bestStreak,
  percentage,
  completedCount,
  plannedCount,
}: ArchivedHabitDetailsSummaryProps) {
  return (
    <View>
      <HabitIdentity habit={habit} showsReminderTimeWhenDisabled />

      <View style={styles.archiveCard}>
        <Text style={styles.archiveLabel}>ЗАВЕРШЕНА</Text>
        <Text style={styles.archiveDate}>{formatArchiveDate(archivedAt)}</Text>
        <Text style={styles.archiveDescription}>История сохранена</Text>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>🔥 ВСЕГО ВЫПОЛНЕНИЙ</Text>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.metricValue}
          >
            {formatCompletionCount(completedCount)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricColumn}>
          <Text style={styles.metricLabel}>ЛИЧНЫЙ РЕКОРД</Text>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.metricValue}
          >
            {formatDayCount(bestStreak)}
          </Text>
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

function formatArchiveDate(archivedAt: string): string {
  return archiveDateFormatter
    .format(new Date(archivedAt))
    .replace(/\s*г\.$/i, '');
}

const styles = StyleSheet.create({
  archiveCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  archiveLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  archiveDate: {
    marginTop: 4,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  archiveDescription: {
    marginTop: 3,
    fontSize: 16,
    color: appColors.textSecondary,
  },
  metrics: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: appColors.separator,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: appColors.separator,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: appColors.textSecondary,
  },
  metricValue: {
    marginTop: 4,
    fontSize: 25,
    lineHeight: 30,
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
