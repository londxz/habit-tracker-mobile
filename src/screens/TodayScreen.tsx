import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { AddHabitButton } from '../features/habits/ui/AddHabitButton';
import type { RootStackParamList } from '../navigation/navigationTypes';

export function TodayScreen() {
  const navigation = useNavigation();
  const { state } = useHabits();
  const insets = useSafeAreaInsets();
  const todayTitle = getTodayTitle(new Date());

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
            state.habits.map(habit => (
              <Pressable
                key={habit.id}
                accessibilityRole="button"
                onPress={() => handleHabitPress(habit.id)}
                style={({ pressed }) => [
                  styles.habitCard,
                  pressed && styles.habitCardPressed,
                ]}
              >
                {habit.emoji !== null ? (
                  <Text style={styles.emoji}>{habit.emoji}</Text>
                ) : null}

                <View style={styles.habitContent}>
                  <Text style={styles.habitName}>{habit.name}</Text>

                  <Text style={styles.habitSchedule}>
                    Каждый день
                    {habit.reminder.isEnabled
                      ? ` · ${habit.reminder.time}`
                      : ''}
                  </Text>
                </View>

                <View style={styles.completionCircle} />
              </Pressable>
            ))
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
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  habitCardPressed: {
    opacity: 0.65,
  },
  emoji: {
    marginRight: 12,
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
  habitSchedule: {
    marginTop: 4,
    fontSize: 15,
    color: '#8E8E93',
  },
  completionCircle: {
    width: 28,
    height: 28,
    marginLeft: 12,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    borderRadius: 14,
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
