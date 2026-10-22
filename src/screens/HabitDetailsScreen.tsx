import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { doesCompletionFinishDay } from '../features/habits/model/doesCompletionFinishDay';
import { getHabitArchivedAt } from '../features/habits/model/getHabitArchivedAt';
import { getHabitCompletionStats } from '../features/habits/model/getHabitCompletionStats';
import { getHabitHistory } from '../features/habits/model/getHabitHistory';
import { getHabitStreakStats } from '../features/habits/model/getHabitStreakStats';
import { isHabitActive } from '../features/habits/model/isHabitActive';
import { isHabitCompletedOn } from '../features/habits/model/isHabitCompletedOn';
import { ArchivedHabitActions } from '../features/habits/ui/ArchivedHabitActions';
import { ArchivedHabitDetailsSummary } from '../features/habits/ui/ArchivedHabitDetailsSummary';
import { HabitDetailsSummary } from '../features/habits/ui/HabitDetailsSummary';
import { TodayCompletionCelebration } from '../features/habits/ui/TodayCompletionCelebration';
import {
  HistoryViewSwitch,
  type HistoryView,
} from '../features/habits/ui/HistoryViewSwitch';
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
  const archivedAt = habit === undefined ? null : getHabitArchivedAt(habit);
  const archiveDateKey =
    archivedAt === null ? null : getDateKey(new Date(archivedAt));
  const [selectedView, setSelectedView] = useState<HistoryView>('calendar');
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initialDate =
      archivedAt === null ? currentDate : new Date(archivedAt);

    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
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
  const lastVisibleDate =
    active || archivedAt === null ? currentDate : new Date(archivedAt);
  const lastVisibleMonth = new Date(
    lastVisibleDate.getFullYear(),
    lastVisibleDate.getMonth(),
    1,
  );
  const canOpenNextMonth = visibleMonth < lastVisibleMonth;

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

  function handleRestorePress() {
    dispatch({
      type: 'habitRestored',
      habitId,
      startedOn: todayKey,
    });
    navigation.popTo('MainTabs', { screen: 'Today' });
  }

  function handleDeletePress() {
    Alert.alert(
      'Удалить привычку навсегда?',
      'Привычка и вся история выполнения будут удалены безвозвратно.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'habitDeleted', habitId });
            navigation.goBack();
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedView === 'history' ? history : []}
        keyExtractor={entry => entry.dateKey}
        renderItem={({ item }) => (
          <HabitHistoryRow
            entry={item}
            todayKey={todayKey}
            showsYear={!active}
          />
        )}
        ListHeaderComponent={
          <View>
            {!active && archivedAt !== null ? (
              <ArchivedHabitDetailsSummary
                habit={habit}
                archivedAt={archivedAt}
                bestStreak={streaks.best}
                percentage={completionStats.percentage}
                completedCount={completionStats.completedCount}
                plannedCount={completionStats.plannedCount}
              />
            ) : (
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
            )}

            <HistoryViewSwitch
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
              highlightedDateKey={archiveDateKey ?? todayKey}
              canOpenPreviousMonth
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

      {!active && archivedAt !== null ? (
        <ArchivedHabitActions
          onRestorePress={handleRestorePress}
          onDeletePress={handleDeletePress}
        />
      ) : null}

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
    backgroundColor: appColors.background,
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
    color: appColors.textSecondary,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.background,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
});
