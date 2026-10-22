import { useMemo } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getDateKey } from '../../../shared/date/getDateKey';
import { appColors } from '../../../shared/theme/colors';
import type { HabitHistoryEntry } from '../model/getHabitHistory';

type HabitHistoryCalendarProps = {
  month: Date;
  entries: HabitHistoryEntry[];
  highlightedDateKey: string;
  canOpenPreviousMonth: boolean;
  canOpenNextMonth: boolean;
  onPreviousMonthPress: () => void;
  onNextMonthPress: () => void;
};

const weekdayTitles = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function HabitHistoryCalendar({
  month,
  entries,
  highlightedDateKey,
  canOpenPreviousMonth,
  canOpenNextMonth,
  onPreviousMonthPress,
  onNextMonthPress,
}: HabitHistoryCalendarProps) {
  const entriesByDate = useMemo(
    () => new Map(entries.map(entry => [entry.dateKey, entry])),
    [entries],
  );
  const calendarCells = useMemo(() => getCalendarCells(month), [month]);

  return (
    <View style={styles.container}>
      <View style={styles.monthHeader}>
        <Pressable
          accessibilityLabel="Предыдущий месяц"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canOpenPreviousMonth }}
          disabled={!canOpenPreviousMonth}
          hitSlop={10}
          onPress={onPreviousMonthPress}
          style={({ pressed }) => [
            !canOpenPreviousMonth && styles.navigationButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={appColors.textPrimary}
          />
        </Pressable>

        <Text style={styles.monthTitle}>{getMonthTitle(month)}</Text>

        <Pressable
          accessibilityLabel="Следующий месяц"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canOpenNextMonth }}
          disabled={!canOpenNextMonth}
          hitSlop={10}
          onPress={onNextMonthPress}
          style={({ pressed }) => [
            !canOpenNextMonth && styles.navigationButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={28}
            color={appColors.textPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.weekdays}>
        {weekdayTitles.map(title => (
          <Text key={title} style={styles.weekday}>
            {title}
          </Text>
        ))}
      </View>

      <View style={styles.days}>
        {calendarCells.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.day} />;
          }

          const dateKey = getDateKey(
            new Date(month.getFullYear(), month.getMonth(), day),
          );
          const entry = entriesByDate.get(dateKey);
          const isUnavailable = dateKey > highlightedDateKey;

          return (
            <View key={dateKey} style={styles.day}>
              <View
                style={[
                  styles.dayNumberContainer,
                  dateKey === highlightedDateKey && styles.highlightedDay,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isUnavailable && styles.unavailableDayNumber,
                    dateKey === highlightedDateKey &&
                      styles.highlightedDayNumber,
                  ]}
                >
                  {day}
                </Text>
              </View>

              {entry?.isCompleted ? (
                <View style={styles.completedMarker}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              ) : entry ? (
                <Text style={styles.missedMarker}>—</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function getCalendarCells(month: Date): Array<number | null> {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<number | null> = Array.from(
    { length: firstWeekday },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function getMonthTitle(month: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  })
    .format(month)
    .replace(/\s*г\.$/i, '')
    .toLocaleUpperCase('ru-RU');
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  monthHeader: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  navigationButtonDisabled: {
    opacity: 0.25,
  },
  pressed: {
    opacity: 0.55,
  },
  weekdays: {
    flexDirection: 'row',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 14,
    color: appColors.textSecondary,
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  day: {
    width: `${100 / 7}%`,
    height: 52,
    alignItems: 'center',
  },
  dayNumberContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  highlightedDay: {
    borderWidth: 2,
    borderColor: appColors.accent,
  },
  dayNumber: {
    fontSize: 16,
    color: appColors.textPrimary,
  },
  unavailableDayNumber: {
    color: appColors.placeholder,
  },
  highlightedDayNumber: {
    color: appColors.textPrimary,
  },
  completedMarker: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderRadius: 9,
    backgroundColor: appColors.accent,
  },
  checkmark: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
    color: appColors.onAccent,
  },
  missedMarker: {
    marginTop: 1,
    fontSize: 16,
    color: appColors.border,
  },
});
