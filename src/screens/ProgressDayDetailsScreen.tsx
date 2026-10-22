import { useMemo } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { getDayHabitStatuses } from '../features/habits/model/getDayHabitStatuses';
import { ProgressDayHabitRow } from '../features/habits/ui/ProgressDayHabitRow';
import type { RootStackParamList } from '../navigation/navigationTypes';
import { getDateKey } from '../shared/date/getDateKey';
import { useCurrentDate } from '../shared/date/useCurrentDate';
import { appColors } from '../shared/theme/colors';

type ProgressDayDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProgressDayDetails'
>;

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});

export function ProgressDayDetailsScreen({
  navigation,
  route,
}: ProgressDayDetailsScreenProps) {
  const { state } = useHabits();
  const insets = useSafeAreaInsets();
  const currentDate = useCurrentDate();
  const todayKey = getDateKey(currentDate);
  const items = useMemo(
    () =>
      getDayHabitStatuses(
        state.habits,
        state.completions,
        route.params.dateKey,
      ),
    [route.params.dateKey, state.completions, state.habits],
  );
  const completedCount = items.filter(item => item.isCompleted).length;

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={item => item.habit.id}
        renderItem={({ item }) => <ProgressDayHabitRow item={item} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>
                  {route.params.dateKey === todayKey ? 'СЕГОДНЯ' : 'ДЕНЬ'}
                </Text>
                <Text style={styles.date}>
                  {getDateTitle(route.params.dateKey)}
                </Text>
              </View>

              <Pressable
                accessibilityLabel="Закрыть"
                accessibilityRole="button"
                onPress={navigation.goBack}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <Ionicons name="close" size={26} color="#4B4B52" />
              </Pressable>
            </View>

            <Text style={styles.progressTitle}>
              {completedCount} из {items.length} выполнено
            </Text>

            <View style={styles.progressSegments}>
              {items.map((item, index) => (
                <View
                  key={item.habit.id}
                  style={[
                    styles.progressSegment,
                    index < completedCount && styles.progressSegmentCompleted,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>ПРИВЫЧКИ</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function getDateTitle(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);

  return dateFormatter.format(new Date(year, month - 1, day));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 22,
    paddingHorizontal: 20,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#747480',
  },
  date: {
    marginTop: 4,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#E5E5EA',
  },
  closeButtonPressed: {
    opacity: 0.6,
  },
  progressTitle: {
    marginTop: 14,
    paddingHorizontal: 20,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '600',
    color: '#34343A',
  },
  progressSegments: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  progressSegment: {
    height: 9,
    flex: 1,
    borderRadius: 5,
    backgroundColor: '#D8D8DC',
  },
  progressSegmentCompleted: {
    backgroundColor: appColors.accent,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 8,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '600',
    color: '#747480',
  },
});
