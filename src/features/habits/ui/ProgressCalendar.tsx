import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getDateKey } from '../../../shared/date/getDateKey';
import { appColors } from '../../../shared/theme/colors';
import type { ProgressDay } from '../model/getProgressHistory';
import { ProgressDayIndicator } from './ProgressDayIndicator';
import { ProgressMonthHeader } from './ProgressMonthHeader';

type ProgressCalendarProps = {
  month: Date;
  entries: ProgressDay[];
  todayKey: string;
  canOpenPreviousMonth: boolean;
  canOpenNextMonth: boolean;
  onPreviousMonthPress: () => void;
  onNextMonthPress: () => void;
  onDayPress: (dateKey: string) => void;
};

const weekdayTitles = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function ProgressCalendar({
  month,
  entries,
  todayKey,
  canOpenPreviousMonth,
  canOpenNextMonth,
  onPreviousMonthPress,
  onNextMonthPress,
  onDayPress,
}: ProgressCalendarProps) {
  const entriesByDate = useMemo(
    () => new Map(entries.map(entry => [entry.dateKey, entry])),
    [entries],
  );
  const calendarCells = useMemo(() => getCalendarCells(month), [month]);

  return (
    <View style={styles.container}>
      <ProgressMonthHeader
        month={month}
        canOpenPreviousMonth={canOpenPreviousMonth}
        canOpenNextMonth={canOpenNextMonth}
        onPreviousMonthPress={onPreviousMonthPress}
        onNextMonthPress={onNextMonthPress}
      />

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

          return (
            <Pressable
              key={dateKey}
              accessibilityLabel={getDayAccessibilityLabel(day, entry)}
              accessibilityRole={entry === undefined ? undefined : 'button'}
              disabled={entry === undefined}
              onPress={() => onDayPress(dateKey)}
              style={({ pressed }) => [
                styles.day,
                pressed && styles.dayPressed,
              ]}
            >
              <View
                style={[
                  styles.dayNumberContainer,
                  dateKey === todayKey && styles.today,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    dateKey > todayKey && styles.futureDayNumber,
                  ]}
                >
                  {day}
                </Text>
              </View>

              {entry === undefined ? null : (
                <View style={styles.dayIndicator}>
                  <ProgressDayIndicator status={entry.status} size={18} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <LegendItem status="complete" title="Все" />
        <LegendItem status="partial" title="Часть" />
        <LegendItem status="none" title="Нет" />
      </View>
    </View>
  );
}

type LegendItemProps = {
  status: ProgressDay['status'];
  title: string;
};

function LegendItem({ status, title }: LegendItemProps) {
  return (
    <View style={styles.legendItem}>
      <ProgressDayIndicator status={status} size={18} />
      <Text style={styles.legendTitle}>{title}</Text>
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

function getDayAccessibilityLabel(
  day: number,
  entry: ProgressDay | undefined,
): string {
  if (entry === undefined) {
    return `${day}, нет запланированных привычек`;
  }

  return `${day}, ${entry.completedCount} из ${entry.totalCount} выполнено`;
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
  },
  weekdays: {
    flexDirection: 'row',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 14,
    color: '#747480',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  day: {
    width: `${100 / 7}%`,
    height: 43,
    alignItems: 'center',
  },
  dayPressed: {
    opacity: 0.55,
  },
  dayNumberContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  today: {
    borderWidth: 2,
    borderColor: appColors.accent,
  },
  dayNumber: {
    fontSize: 15,
    color: '#111111',
  },
  futureDayNumber: {
    color: '#C7C7CC',
  },
  dayIndicator: {
    marginTop: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 6,
    paddingHorizontal: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendTitle: {
    marginLeft: 6,
    fontSize: 14,
    color: '#747480',
  },
});
