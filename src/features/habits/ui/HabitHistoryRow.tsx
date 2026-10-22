import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../shared/theme/colors';
import type { HabitHistoryEntry } from '../model/getHabitHistory';

type HabitHistoryRowProps = {
  entry: HabitHistoryEntry;
  todayKey: string;
  showsYear?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});
const dateWithYearFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
});

export function HabitHistoryRow({
  entry,
  todayKey,
  showsYear = false,
}: HabitHistoryRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text style={styles.date}>
          {getHistoryDateTitle(entry.dateKey, todayKey, showsYear)}
        </Text>
        <Text style={styles.status}>
          {entry.isCompleted ? 'Выполнено' : 'Не выполнено'}
        </Text>
      </View>

      <View
        style={[
          styles.statusCircle,
          entry.isCompleted && styles.statusCircleCompleted,
        ]}
      >
        {entry.isCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
    </View>
  );
}

function getHistoryDateTitle(
  dateKey: string,
  todayKey: string,
  showsYear: boolean,
): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dateTitle = (showsYear ? dateWithYearFormatter : dateFormatter)
    .format(date)
    .replace(/\s*г\.$/i, '');

  if (!showsYear && dateKey === todayKey) {
    return `Сегодня, ${dateTitle}`;
  }

  const weekday = weekdayFormatter.format(date);

  return `${
    weekday.charAt(0).toLocaleUpperCase('ru-RU') + weekday.slice(1)
  }, ${dateTitle}`;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  text: {
    flex: 1,
    paddingRight: 12,
  },
  date: {
    fontSize: 17,
    lineHeight: 22,
    color: '#111111',
  },
  status: {
    marginTop: 3,
    fontSize: 14,
    color: '#747480',
  },
  statusCircle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8E94A5',
    borderRadius: 17,
  },
  statusCircleCompleted: {
    borderColor: appColors.accent,
    backgroundColor: appColors.accent,
  },
  checkmark: {
    fontSize: 19,
    lineHeight: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
