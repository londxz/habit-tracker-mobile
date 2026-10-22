import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../shared/theme/colors';

type TodayProgressSummaryProps = {
  completedCount: number;
  totalCount: number;
};

export function TodayProgressSummary({
  completedCount,
  totalCount,
}: TodayProgressSummaryProps) {
  const remainingCount = totalCount - completedCount;

  return (
    <View
      accessibilityLabel={`${completedCount} из ${totalCount}, ${getCompletedLabel(
        completedCount,
      )}`}
      style={styles.container}
    >
      <View style={styles.valueRow}>
        <Text style={styles.completedValue}>{completedCount}</Text>
        <Text style={styles.totalValue}> из {totalCount}</Text>
      </View>

      <Text style={styles.subtitle}>{getCompletedLabel(completedCount)}</Text>

      <View style={styles.segments}>
        {Array.from({ length: totalCount }, (_, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              index < completedCount && styles.segmentCompleted,
            ]}
          />
        ))}
      </View>

      <Text style={styles.caption}>{getProgressCaption(remainingCount)}</Text>
    </View>
  );
}

function getCompletedLabel(completedCount: number): string {
  const lastTwoDigits = completedCount % 100;
  const lastDigit = completedCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'привычек выполнено';
  }

  if (lastDigit === 1) {
    return 'привычка выполнена';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'привычки выполнены';
  }

  return 'привычек выполнено';
}

function getProgressCaption(remainingCount: number): string {
  if (remainingCount === 0) {
    return 'На сегодня всё';
  }

  if (remainingCount === 1) {
    return 'Осталась одна — и день закрыт';
  }

  if (remainingCount === 2) {
    return 'Ещё две — и день закрыт';
  }

  return `Осталось ${remainingCount} — и день закрыт`;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  completedValue: {
    fontSize: 64,
    lineHeight: 68,
    fontWeight: '700',
    color: appColors.accent,
  },
  totalValue: {
    fontSize: 64,
    lineHeight: 68,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  segments: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  segment: {
    height: 12,
    flex: 1,
    borderRadius: 6,
    backgroundColor: appColors.track,
  },
  segmentCompleted: {
    backgroundColor: appColors.accent,
  },
  caption: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 22,
    color: appColors.textSecondary,
  },
});
