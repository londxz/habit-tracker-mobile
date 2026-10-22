import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import {
  getProgressHistory,
  type ProgressDay,
} from '../features/habits/model/getProgressHistory';
import { getProgressStreakStats } from '../features/habits/model/getProgressStreakStats';
import {
  HistoryViewSwitch,
  type HistoryView,
} from '../features/habits/ui/HistoryViewSwitch';
import { ProgressCalendar } from '../features/habits/ui/ProgressCalendar';
import { ProgressHistoryRow } from '../features/habits/ui/ProgressHistoryRow';
import { ProgressMonthHeader } from '../features/habits/ui/ProgressMonthHeader';
import { ProgressSummary } from '../features/habits/ui/ProgressSummary';
import type {
  MainTabsParamList,
  RootStackParamList,
} from '../navigation/navigationTypes';
import { getAdjacentDateKey } from '../shared/date/getAdjacentDateKey';
import { getDateKey } from '../shared/date/getDateKey';
import { useCurrentDate } from '../shared/date/useCurrentDate';
import { appColors } from '../shared/theme/colors';

const TAB_BAR_CONTENT_INSET = Platform.OS === 'ios' ? 72 : 64;
const TAB_BAR_INDICATOR_INSET = Platform.OS === 'ios' ? 56 : 48;
const shortDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});

type HistoryListItem = {
  entry: ProgressDay;
  sectionTitle: string | null;
};

export function ProgressScreen() {
  const navigation = useNavigation<NavigationProp<MainTabsParamList>>();
  const { state } = useHabits();
  const insets = useSafeAreaInsets();
  const currentDate = useCurrentDate();
  const todayKey = getDateKey(currentDate);
  const [selectedView, setSelectedView] = useState<HistoryView>('calendar');
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );
  const handleArchivePress = useCallback(() => {
    navigation
      .getParent<NavigationProp<RootStackParamList>>()
      ?.navigate('ArchivedHabits');
  }, [navigation]);
  const renderArchiveButton = useCallback(
    () => <ArchiveButton onPress={handleArchivePress} />,
    [handleArchivePress],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderArchiveButton,
    });
  }, [navigation, renderArchiveButton]);

  const history = useMemo(
    () => getProgressHistory(state.habits, state.completions, todayKey),
    [state.habits, state.completions, todayKey],
  );
  const streaks = useMemo(
    () => getProgressStreakStats(history, todayKey),
    [history, todayKey],
  );
  const today = history.find(day => day.dateKey === todayKey);
  const visibleMonthKey = getDateKey(visibleMonth).slice(0, 7);
  const currentMonthKey = todayKey.slice(0, 7);
  const canOpenPreviousMonth = true;
  const canOpenNextMonth = visibleMonthKey < currentMonthKey;
  const historyItems = useMemo(
    () => getHistoryListItems(history, visibleMonthKey, todayKey),
    [history, todayKey, visibleMonthKey],
  );
  const contentBottomStyle = useMemo(
    () => ({
      paddingBottom:
        selectedView === 'history' ? insets.bottom + TAB_BAR_CONTENT_INSET : 8,
    }),
    [insets.bottom, selectedView],
  );

  function changeMonth(monthOffset: number) {
    setVisibleMonth(
      month => new Date(month.getFullYear(), month.getMonth() + monthOffset, 1),
    );
  }

  function openDay(dateKey: string) {
    navigation
      .getParent<NavigationProp<RootStackParamList>>()
      ?.navigate('ProgressDayDetails', { dateKey });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedView === 'history' ? historyItems : []}
        keyExtractor={item => item.entry.dateKey}
        renderItem={({ item }) => (
          <ProgressHistoryRow
            entry={item.entry}
            todayKey={todayKey}
            sectionTitle={item.sectionTitle}
            onPress={() => openDay(item.entry.dateKey)}
          />
        )}
        ListHeaderComponent={
          <View>
            <ProgressSummary
              currentStreak={streaks.current}
              bestStreak={streaks.best}
              completedToday={today?.completedCount ?? 0}
              totalToday={today?.totalCount ?? 0}
            />

            <View style={styles.viewSwitch}>
              <HistoryViewSwitch
                selectedView={selectedView}
                onViewChange={setSelectedView}
              />
            </View>

            {selectedView === 'history' ? (
              <ProgressMonthHeader
                month={visibleMonth}
                canOpenPreviousMonth={canOpenPreviousMonth}
                canOpenNextMonth={canOpenNextMonth}
                onPreviousMonthPress={() => changeMonth(-1)}
                onNextMonthPress={() => changeMonth(1)}
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          selectedView === 'history' ? (
            <Text style={styles.emptyHistory}>За этот месяц данных нет</Text>
          ) : undefined
        }
        ListFooterComponent={
          selectedView === 'calendar' ? (
            <ProgressCalendar
              month={visibleMonth}
              entries={history}
              todayKey={todayKey}
              canOpenPreviousMonth={canOpenPreviousMonth}
              canOpenNextMonth={canOpenNextMonth}
              onPreviousMonthPress={() => changeMonth(-1)}
              onNextMonthPress={() => changeMonth(1)}
              onDayPress={openDay}
            />
          ) : undefined
        }
        contentContainerStyle={[styles.content, contentBottomStyle]}
        scrollIndicatorInsets={{
          bottom: insets.bottom + TAB_BAR_INDICATOR_INSET,
        }}
        scrollEnabled={selectedView === 'history'}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

type ArchiveButtonProps = {
  onPress: () => void;
};

function ArchiveButton({ onPress }: ArchiveButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Открыть архив"
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.archiveButton,
        pressed && styles.archiveButtonPressed,
      ]}
    >
      <Ionicons name="archive-outline" size={25} color={appColors.accent} />
    </Pressable>
  );
}

function getHistoryListItems(
  history: ProgressDay[],
  monthKey: string,
  todayKey: string,
): HistoryListItem[] {
  let previousWeekKey: string | null = null;

  return history
    .filter(day => day.dateKey.startsWith(monthKey))
    .map(entry => {
      const weekKey = getWeekStartKey(entry.dateKey);
      const sectionTitle =
        weekKey === previousWeekKey
          ? null
          : getWeekSectionTitle(weekKey, todayKey);

      previousWeekKey = weekKey;

      return { entry, sectionTitle };
    });
}

function getWeekSectionTitle(weekKey: string, todayKey: string): string {
  const currentWeekKey = getWeekStartKey(todayKey);

  if (weekKey === currentWeekKey) {
    return 'ЭТА НЕДЕЛЯ';
  }

  if (weekKey === getAdjacentDateKey(currentWeekKey, -7)) {
    return 'ПРОШЛАЯ НЕДЕЛЯ';
  }

  return `НЕДЕЛЯ С ${formatShortDate(weekKey)}`.toLocaleUpperCase('ru-RU');
}

function getWeekStartKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const daysAfterMonday = (date.getDay() + 6) % 7;

  return getDateKey(new Date(year, month - 1, day - daysAfterMonday));
}

function formatShortDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);

  return shortDateFormatter.format(new Date(year, month - 1, day));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  archiveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archiveButtonPressed: {
    opacity: 0.55,
  },
  viewSwitch: {
    marginTop: 10,
  },
  emptyHistory: {
    paddingVertical: 36,
    textAlign: 'center',
    fontSize: 16,
    color: appColors.textSecondary,
  },
});
