import { StyleSheet, Text, View } from 'react-native';

import { formatDayCount } from '../../../shared/localization/formatDayCount';
import { ProgressRing } from './ProgressRing';

type ProgressSummaryProps = {
  currentStreak: number;
  bestStreak: number;
  completedToday: number;
  totalToday: number;
};

export function ProgressSummary({
  currentStreak,
  bestStreak,
  completedToday,
  totalToday,
}: ProgressSummaryProps) {
  const percentage =
    totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  return (
    <View>
      <View style={styles.streakCard}>
        <Text style={styles.fire}>🔥</Text>
        <View style={styles.streakText}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.streakValue}
          >
            {formatDayCount(currentStreak)}
          </Text>
          <Text style={styles.streakLabel}>текущая серия</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <ProgressRing percentage={percentage} />
          <View style={styles.todayText}>
            <Text style={styles.metricLabel}>Сегодня</Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.todayValue}
            >
              {completedToday} из {totalToday}
            </Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.crown}>👑</Text>
          <View style={styles.recordText}>
            <Text style={styles.metricLabel}>Рекорд</Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.recordValue}
            >
              {formatDayCount(bestStreak)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8DD',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  fire: {
    position: 'absolute',
    left: 24,
    fontSize: 54,
    lineHeight: 62,
  },
  streakText: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '700',
    color: '#000000',
  },
  streakLabel: {
    fontSize: 17,
    lineHeight: 21,
    color: '#747480',
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  metricCard: {
    minHeight: 84,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8DD',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  todayText: {
    marginLeft: 7,
  },
  recordText: {
    marginLeft: 8,
  },
  metricLabel: {
    fontSize: 15,
    lineHeight: 19,
    color: '#747480',
  },
  todayValue: {
    marginTop: 1,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
    color: '#111111',
  },
  crown: {
    fontSize: 32,
    lineHeight: 38,
  },
  recordValue: {
    marginTop: 1,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '700',
    color: '#111111',
  },
});
