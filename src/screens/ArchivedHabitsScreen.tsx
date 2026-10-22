import { useMemo } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '../features/habits/context/HabitsProvider';
import { getArchivedHabits } from '../features/habits/model/getArchivedHabits';
import { ArchivedHabitRow } from '../features/habits/ui/ArchivedHabitRow';
import type { RootStackParamList } from '../navigation/navigationTypes';
import { appColors } from '../shared/theme/colors';

type ArchivedHabitsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ArchivedHabits'
>;

export function ArchivedHabitsScreen({
  navigation,
}: ArchivedHabitsScreenProps) {
  const { state } = useHabits();
  const insets = useSafeAreaInsets();
  const archivedHabits = useMemo(
    () => getArchivedHabits(state.habits, state.completions),
    [state.completions, state.habits],
  );

  return (
    <FlatList
      data={archivedHabits}
      keyExtractor={item => item.habit.id}
      renderItem={({ item }) => (
        <ArchivedHabitRow
          item={item}
          onPress={() =>
            navigation.navigate('HabitDetails', { habitId: item.habit.id })
          }
        />
      )}
      ListHeaderComponent={
        <View>
          <Text style={styles.description}>
            Завершённые привычки не влияют на сегодняшний прогресс. Их история
            сохранена.
          </Text>

          {archivedHabits.length > 0 ? (
            <Text style={styles.sectionTitle}>ЗАВЕРШЁННЫЕ</Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={<ArchivedHabitsEmptyState />}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

function ArchivedHabitsEmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="archive-outline"
          size={34}
          color={appColors.textTertiary}
        />
      </View>
      <Text style={styles.emptyTitle}>Архив пока пуст</Text>
      <Text style={styles.emptyDescription}>
        Здесь появятся завершённые привычки. Их история останется доступна.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  content: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  description: {
    marginHorizontal: 12,
    fontSize: 17,
    lineHeight: 24,
    color: appColors.textSecondary,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: appColors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 420,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    backgroundColor: appColors.controlBackground,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 21,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  emptyDescription: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: appColors.textSecondary,
  },
});
