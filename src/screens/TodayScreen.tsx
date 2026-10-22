import { useCallback, useMemo, useState } from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { doesCompletionFinishDay } from '../features/habits/model/doesCompletionFinishDay';
import { getHabitStreakStats } from '../features/habits/model/getHabitStreakStats';
import { isHabitActive } from '../features/habits/model/isHabitActive';
import { isHabitCompletedOn } from '../features/habits/model/isHabitCompletedOn';
import { AddHabitButton } from '../features/habits/ui/AddHabitButton';
import { TodayCompletionCelebration } from '../features/habits/ui/TodayCompletionCelebration';
import { TodayEmptyState } from '../features/habits/ui/TodayEmptyState';
import { TodayFilteredEmptyState } from '../features/habits/ui/TodayFilteredEmptyState';
import { TodayHabitCard } from '../features/habits/ui/TodayHabitCard';
import { TodayHabitFilters } from '../features/habits/ui/TodayHabitFilters';
import { TodayProgressSummary } from '../features/habits/ui/TodayProgressSummary';
import { showHabitSaveError } from '../features/habits/ui/showHabitSaveError';
import type { TodayHabitFilter } from '../features/habits/ui/todayHabitFilter';
import type {
  MainTabsParamList,
  RootStackParamList,
} from '../navigation/navigationTypes';
import { getDateKey } from '../shared/date/getDateKey';
import { useCurrentDate } from '../shared/date/useCurrentDate';
import { appColors } from '../shared/theme/colors';

const TAB_BAR_CONTENT_INSET = Platform.OS === 'ios' ? 72 : 64;
const TAB_BAR_INDICATOR_INSET = Platform.OS === 'ios' ? 56 : 48;

export function TodayScreen() {
  const navigation = useNavigation<NavigationProp<MainTabsParamList>>();
  const { state, dispatch } = useHabits();
  const insets = useSafeAreaInsets();
  const currentDate = useCurrentDate();
  const todayKey = getDateKey(currentDate);
  const [selectedFilter, setSelectedFilter] = useState<TodayHabitFilter>('all');
  const [isCelebrationVisible, setIsCelebrationVisible] = useState(false);
  const handleCelebrationDismiss = useCallback(() => {
    setIsCelebrationVisible(false);
  }, []);

  const habitItems = useMemo(
    () =>
      state.habits.filter(isHabitActive).map(habit => ({
        habit,
        isCompleted: isHabitCompletedOn(state.completions, habit.id, todayKey),
        streaks: getHabitStreakStats(habit, state.completions, todayKey),
      })),
    [state.habits, state.completions, todayKey],
  );

  const completedCount = habitItems.filter(item => item.isCompleted).length;
  const remainingCount = habitItems.length - completedCount;
  const filteredHabitItems = habitItems.filter(item => {
    switch (selectedFilter) {
      case 'remaining':
        return !item.isCompleted;
      case 'completed':
        return item.isCompleted;
      case 'all':
        return true;
    }
  });

  function getRootNavigation() {
    return navigation.getParent<NavigationProp<RootStackParamList>>();
  }

  function handleCreateHabitPress() {
    getRootNavigation()?.navigate('CreateHabit');
  }

  function handleHabitPress(habitId: string) {
    getRootNavigation()?.navigate('HabitDetails', {
      habitId,
    });
  }

  function handleCompletionPress(habitId: string) {
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

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 20,
          },
        ]}
      >
        <View>
          <Text style={styles.headerTitle}>Сегодня</Text>
          <Text style={styles.headerSubtitle}>
            {getTodayTitle(currentDate)}
          </Text>
        </View>

        <AddHabitButton onPress={handleCreateHabitPress} />
      </View>

      {habitItems.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <TodayEmptyState
            hasArchivedHabits={state.habits.length > 0}
            onCreateHabitPress={handleCreateHabitPress}
          />
        </View>
      ) : (
        <View style={styles.dashboard}>
          <TodayProgressSummary
            completedCount={completedCount}
            totalCount={habitItems.length}
          />

          <TodayHabitFilters
            selectedFilter={selectedFilter}
            totalCount={habitItems.length}
            remainingCount={remainingCount}
            completedCount={completedCount}
            onFilterChange={setSelectedFilter}
          />

          <Text style={styles.sectionTitle}>МОИ ПРИВЫЧКИ</Text>

          <FlatList
            style={styles.habitsList}
            data={filteredHabitItems}
            keyExtractor={item => item.habit.id}
            renderItem={({ item, index }) => (
              <TodayHabitCard
                habit={item.habit}
                isCompleted={item.isCompleted}
                currentStreak={item.streaks.current}
                bestStreak={item.streaks.best}
                isFirst={index === 0}
                isLast={index === filteredHabitItems.length - 1}
                onPress={() => handleHabitPress(item.habit.id)}
                onCompletionPress={() => handleCompletionPress(item.habit.id)}
              />
            )}
            ListEmptyComponent={
              <TodayFilteredEmptyState
                filter={selectedFilter}
                onShowAllPress={() => setSelectedFilter('all')}
              />
            }
            contentContainerStyle={[
              styles.habitsListContent,
              {
                paddingBottom: insets.bottom + TAB_BAR_CONTENT_INSET,
              },
              filteredHabitItems.length === 0 && styles.filteredEmptyContent,
            ]}
            scrollIndicatorInsets={{
              bottom: insets.bottom + TAB_BAR_INDICATOR_INSET,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 21,
    lineHeight: 27,
    color: appColors.textSecondary,
  },
  emptyStateContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dashboard: {
    flex: 1,
    paddingHorizontal: 16,
  },
  habitsList: {
    flex: 1,
    marginHorizontal: -16,
  },
  habitsListContent: {
    paddingHorizontal: 16,
  },
  filteredEmptyContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 10,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: appColors.textSecondary,
  },
});

function getTodayTitle(date: Date): string {
  const title = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

  return title.charAt(0).toLocaleUpperCase('ru-RU') + title.slice(1);
}
