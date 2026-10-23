import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../../entities/habit/context/HabitsProvider';
import { doesCompletionFinishDay } from '../../entities/habit/model/doesCompletionFinishDay';
import { getHabitArchivedAt } from '../../entities/habit/model/getHabitArchivedAt';
import { getHabitCompletionStats } from '../../features/habit-details/getHabitCompletionStats';
import { getHabitHistory } from '../../features/habit-details/getHabitHistory';
import { getHabitStreakStats } from '../../entities/habit/model/getHabitStreakStats';
import { isHabitActive } from '../../entities/habit/model/isHabitActive';
import { isHabitCompletedOn } from '../../entities/habit/model/isHabitCompletedOn';
import { isHabitPlannedOn } from '../../entities/habit/model/isHabitPlannedOn';
import { ArchivedHabitActions } from '../../features/habit-archive/ArchivedHabitActions';
import { ArchivedHabitDetailsSummary } from '../../features/habit-archive/ArchivedHabitDetailsSummary';
import { HabitDetailsSummary } from '../../features/habit-details/HabitDetailsSummary';
import { TodayCompletionCelebration } from '../../features/today-habits/TodayCompletionCelebration';
import { showHabitSaveError } from '../../entities/habit/ui/showHabitSaveError';
import {
  HistoryViewSwitch,
  type HistoryView,
} from '../../features/habit-details/HistoryViewSwitch';
import { HabitHistoryCalendar } from '../../features/habit-details/HabitHistoryCalendar';
import { HabitHistoryRow } from '../../features/habit-details/HabitHistoryRow';
import type { RootStackParamList } from '../../navigation/navigationTypes';
import { getDateKey } from '../../shared/date/getDateKey';
import { useCurrentDate } from '../../shared/date/useCurrentDate';
import { appColors } from '../../shared/theme/colors';

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
  const archivedAt =
    habit === undefined || active ? null : getHabitArchivedAt(habit);
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
  const isPlannedToday = isHabitPlannedOn(habit, todayKey);
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
    if (!isPlannedToday) {
      return;
    }

    const completesDay = doesCompletionFinishDay(
      state.habits,
      state.completions,
      habitId,
      todayKey,
    );

    const didSave = dispatch({
      type: 'habitCompletionToggled',
      habitId,
      completedOn: todayKey,
    });

    if (!didSave) {
      showHabitSaveError();
      return;
    }

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
    const didSave = dispatch({
      type: 'habitRestored',
      habitId,
      startedOn: todayKey,
    });

    if (!didSave) {
      showHabitSaveError();
      return;
    }

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
            const didSave = dispatch({ type: 'habitDeleted', habitId });

            if (!didSave) {
              showHabitSaveError();
              return;
            }

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
                isPlannedToday={isPlannedToday}
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
