import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ProgressDay } from '../model/getProgressHistory';
import { ProgressDayIndicator } from './ProgressDayIndicator';

type ProgressHistoryRowProps = {
  entry: ProgressDay;
  todayKey: string;
  sectionTitle: string | null;
  onPress: () => void;
};

const dayMonthFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});
const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export function ProgressHistoryRow({
  entry,
  todayKey,
  sectionTitle,
  onPress,
}: ProgressHistoryRowProps) {
  return (
    <View>
      {sectionTitle === null ? null : (
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <ProgressDayIndicator status={entry.status} size={30} />

        <View style={styles.text}>
          <Text style={styles.date}>
            {getDateTitle(entry.dateKey, todayKey)}
          </Text>
          <Text style={styles.status}>
            {entry.completedCount} из {entry.totalCount} ·{' '}
            {getStatusTitle(entry.status)}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#8E94A5" />
      </Pressable>
    </View>
  );
}

function getDateTitle(dateKey: string, todayKey: string): string {
  const date = getDateFromKey(dateKey);

  if (dateKey === todayKey) {
    return `Сегодня, ${dayMonthFormatter.format(date)}`;
  }

  const dateTitle = fullDateFormatter.format(date);

  return dateTitle.charAt(0).toLocaleUpperCase('ru-RU') + dateTitle.slice(1);
}

function getDateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function getStatusTitle(status: ProgressDay['status']): string {
  switch (status) {
    case 'complete':
      return 'Выполнено';
    case 'partial':
      return 'Частично';
    case 'none':
      return 'Пропущено';
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 18,
    marginBottom: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#747480',
  },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  rowPressed: {
    opacity: 0.62,
  },
  text: {
    flex: 1,
    marginLeft: 14,
  },
  date: {
    fontSize: 17,
    lineHeight: 22,
    color: '#111111',
  },
  status: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 19,
    color: '#747480',
  },
});
