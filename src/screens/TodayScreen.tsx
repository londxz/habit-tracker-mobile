import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { isHabitCompletedOn } from '../features/habits/model/isHabitCompletedOn';
import { AddHabitButton } from '../features/habits/ui/AddHabitButton';
import { getHabitAccentColor } from '../features/habits/ui/habitColors';
import type { RootStackParamList } from '../navigation/navigationTypes';
import { getDateKey } from '../shared/date/getDateKey';

export function TodayScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useHabits();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const todayKey = getDateKey(today);
  const todayTitle = getTodayTitle(today);

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
    dispatch({
      type: 'habitCompletionToggled',
      habitId,
      completedOn: getDateKey(new Date()),
    });
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
          <Text style={styles.headerSubtitle}>{todayTitle}</Text>
        </View>

        <AddHabitButton onPress={handleCreateHabitPress} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.habits}>
          {state.habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Пока нет привычек</Text>

              <Text style={styles.emptyDescription}>
                Добавь первую привычку, которую хочешь выполнять каждый день.
              </Text>
            </View>
          ) : (
            state.habits.map(habit => {
              const isCompleted = isHabitCompletedOn(
                state.completions,
                habit.id,
                todayKey,
              );
              const accentColor = getHabitAccentColor(habit.color);

              return (
                <View
                  key={habit.id}
                  style={[
                    styles.habitCard,
                    isCompleted && styles.habitCardCompleted,
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Открыть привычку ${habit.name}`}
                    onPress={() => handleHabitPress(habit.id)}
                    style={({ pressed }) => [
                      styles.habitDetailsButton,
                      pressed && styles.habitButtonPressed,
                    ]}
                  >
                    {habit.emoji !== null ? (
                      <View
                        style={[
                          styles.emojiContainer,
                          {
                            borderColor: `${accentColor}66`,
                            backgroundColor: `${accentColor}12`,
                          },
                        ]}
                      >
                        <Text style={styles.emoji}>{habit.emoji}</Text>
                      </View>
                    ) : null}

                    <View style={styles.habitContent}>
                      <Text
                        style={[
                          styles.habitName,
                          isCompleted && styles.habitNameCompleted,
                        ]}
                      >
                        {habit.name}
                      </Text>

                      <Text style={styles.habitSchedule}>
                        Каждый день
                        {habit.reminder.isEnabled
                          ? ` · ${habit.reminder.time}`
                          : ''}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityLabel={
                      isCompleted
                        ? `${habit.name}: отменить выполнение сегодня`
                        : `${habit.name}: выполнить сегодня`
                    }
                    accessibilityState={{ checked: isCompleted }}
                    hitSlop={6}
                    onPress={() => handleCompletionPress(habit.id)}
                    style={({ pressed }) => [
                      styles.completionButton,
                      pressed && styles.habitButtonPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.completionCircle,
                        isCompleted && styles.completionCircleCompleted,
                      ]}
                    >
                      {isCompleted ? (
                        <Text style={styles.checkmark}>✓</Text>
                      ) : null}
                    </View>
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '700',
    color: '#000000',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 21,
    lineHeight: 27,
    color: '#6C6C70',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  habits: {
    flex: 1,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
  },
  emptyDescription: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 23,
    color: '#8E8E93',
  },
  habitCard: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  habitCardCompleted: {
    backgroundColor: '#EDF4FF',
  },
  habitDetailsButton: {
    minHeight: 76,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 16,
  },
  habitButtonPressed: {
    opacity: 0.65,
  },
  emojiContainer: {
    width: 52,
    height: 52,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 14,
  },
  emoji: {
    fontSize: 30,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  habitNameCompleted: {
    color: '#6C6C70',
  },
  habitSchedule: {
    marginTop: 4,
    fontSize: 15,
    color: '#8E8E93',
  },
  completionButton: {
    width: 60,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionCircle: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C7C7CC',
    borderRadius: 14,
  },
  completionCircleCompleted: {
    borderColor: '#3478F6',
    backgroundColor: '#3478F6',
  },
  checkmark: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
    color: '#FFFFFF',
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
