import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { doesCompletionFinishDay } from '../features/habits/model/doesCompletionFinishDay';
import { getHabitCompletionStats } from '../features/habits/model/getHabitCompletionStats';
import { getHabitHistory } from '../features/habits/model/getHabitHistory';
import { getHabitStreakStats } from '../features/habits/model/getHabitStreakStats';
import { isHabitActive } from '../features/habits/model/isHabitActive';
import { isHabitCompletedOn } from '../features/habits/model/isHabitCompletedOn';
import { HabitDetailsSummary } from '../features/habits/ui/HabitDetailsSummary';
import { TodayCompletionCelebration } from '../features/habits/ui/TodayCompletionCelebration';
import {
  HabitDetailsViewSwitch,
  type HabitDetailsView,
} from '../features/habits/ui/HabitDetailsViewSwitch';
import { HabitHistoryCalendar } from '../features/habits/ui/HabitHistoryCalendar';
import { HabitHistoryRow } from '../features/habits/ui/HabitHistoryRow';
import type { RootStackParamList } from '../navigation/navigationTypes';
import { getDateKey } from '../shared/date/getDateKey';
import { useCurrentDate } from '../shared/date/useCurrentDate';
import { appColors } from '../shared/theme/colors';

type HabitDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'HabitDetails'
>;

export function HabitDetailsScreen({
  navigation,
  route,
}: HabitDetailsScreenProps) {
  const { state, dispatch } = useHabits();
  const insets = useSafeAreaInsets();
  const currentDate = useCurrentDate();
  const todayKey = getDateKey(currentDate);
  const habit = state.habits.find(item => item.id === route.params.habitId);
  const active = habit !== undefined && isHabitActive(habit);
  const [selectedView, setSelectedView] =
    useState<HabitDetailsView>('calendar');
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  );
  const [isCelebrationVisible, setIsCelebrationVisible] = useState(false);
  const handleCelebrationDismiss = useCallback(() => {
    setIsCelebrationVisible(false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight:
        habit !== undefined && active
          ? () => (
              <Button
                color={appColors.accent}
                title="Изменить"
                onPress={() =>
                  navigation.navigate('EditHabit', { habitId: habit.id })
                }
              />
            )
          : undefined,
    });
  }, [active, habit, navigation]);

  const history = useMemo(
    () =>
      habit === undefined
        ? []
        : getHabitHistory(habit, state.completions, todayKey),
    [habit, state.completions, todayKey],
  );
  const completionStats = useMemo(
    () => getHabitCompletionStats(history),
    [history],
  );
  const streaks = useMemo(
    () =>
      habit === undefined
        ? { current: 0, best: 0 }
        : getHabitStreakStats(habit, state.completions, todayKey),
    [habit, state.completions, todayKey],
  );

  if (habit === undefined) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Привычка не найдена</Text>
      </View>
    );
  }

  const isCompletedToday = isHabitCompletedOn(
    state.completions,
    habit.id,
    todayKey,
  );
  const habitId = habit.id;
  const currentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const firstActivityMonthKey = habit.activityPeriods.reduce<string | null>(
    (firstMonthKey, period) => {
      const monthKey = period.startedOn.slice(0, 7);

      return firstMonthKey === null || monthKey < firstMonthKey
        ? monthKey
        : firstMonthKey;
    },
    null,
  );
  const visibleMonthKey = getDateKey(visibleMonth).slice(0, 7);
  const canOpenPreviousMonth =
    firstActivityMonthKey !== null && visibleMonthKey > firstActivityMonthKey;
  const canOpenNextMonth = visibleMonth < currentMonth;

  function handleCompletionPress() {
    const completesDay = doesCompletionFinishDay(
      state.habits,
      state.completions,
      habitId,
      todayKey,
    );

    dispatch({
      type: 'habitCompletionToggled',
      habitId,
      completedOn: todayKey,
    });

    if (completesDay) {
      setIsCelebrationVisible(true);
    }
  }

  function changeMonth(monthOffset: number) {
    setVisibleMonth(
      month => new Date(month.getFullYear(), month.getMonth() + monthOffset, 1),
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedView === 'history' ? history : []}
        keyExtractor={entry => entry.dateKey}
        renderItem={({ item }) => (
          <HabitHistoryRow entry={item} todayKey={todayKey} />
        )}
        ListHeaderComponent={
          <View>
            <HabitDetailsSummary
              habit={habit}
              isActive={active}
              isCompletedToday={isCompletedToday}
              currentStreak={streaks.current}
              bestStreak={streaks.best}
              percentage={completionStats.percentage}
              completedCount={completionStats.completedCount}
              plannedCount={completionStats.plannedCount}
              onCompletionPress={handleCompletionPress}
            />

            <HabitDetailsViewSwitch
              selectedView={selectedView}
              onViewChange={setSelectedView}
            />

            {selectedView === 'history' ? (
              <Text style={styles.sectionTitle}>ИСТОРИЯ ВЫПОЛНЕНИЯ</Text>
            ) : null}
          </View>
        }
        ListFooterComponent={
          selectedView === 'calendar' ? (
            <HabitHistoryCalendar
              month={visibleMonth}
              entries={history}
              todayKey={todayKey}
              canOpenPreviousMonth={canOpenPreviousMonth}
              canOpenNextMonth={canOpenNextMonth}
              onPreviousMonthPress={() => changeMonth(-1)}
              onNextMonthPress={() => changeMonth(1)}
            />
          ) : undefined
        }
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <TodayCompletionCelebration
        visible={isCelebrationVisible}
        onDismiss={handleCelebrationDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#747480',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111111',
  },
});
