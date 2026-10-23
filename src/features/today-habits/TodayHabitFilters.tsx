import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../shared/theme/colors';

import type { TodayHabitFilter } from './todayHabitFilter';

type TodayHabitFiltersProps = {
  selectedFilter: TodayHabitFilter;
  totalCount: number;
  remainingCount: number;
  completedCount: number;
  onFilterChange: (filter: TodayHabitFilter) => void;
};

const filterLabels: Record<TodayHabitFilter, string> = {
  all: 'Все',
  remaining: 'Осталось',
  completed: 'Готово',
};

export function TodayHabitFilters({
  selectedFilter,
  totalCount,
  remainingCount,
  completedCount,
  onFilterChange,
}: TodayHabitFiltersProps) {
  const counts: Record<TodayHabitFilter, number> = {
    all: totalCount,
    remaining: remainingCount,
    completed: completedCount,
  };

  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {(Object.keys(filterLabels) as TodayHabitFilter[]).map(filter => {
        const isSelected = selectedFilter === filter;

        return (
          <Pressable
            key={filter}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onFilterChange(filter)}
            style={({ pressed }) => [
              styles.filter,
              isSelected && styles.filterSelected,
              pressed && styles.filterPressed,
            ]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {filterLabels[filter]}
            </Text>
            <Text style={styles.count}>{counts[filter]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 28,
    padding: 4,
    borderRadius: 16,
    backgroundColor: appColors.controlBackground,
  },
  filter: {
    minHeight: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
  },
  filterSelected: {
    backgroundColor: appColors.surface,
    shadowColor: appColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  filterPressed: {
    opacity: 0.65,
  },
  label: {
    fontSize: 15,
    color: appColors.textPrimary,
  },
  labelSelected: {
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  count: {
    fontSize: 15,
    color: appColors.textSecondary,
  },
});
