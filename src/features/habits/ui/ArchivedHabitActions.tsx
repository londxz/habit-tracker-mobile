import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '../../../shared/theme/colors';

type ArchivedHabitActionsProps = {
  onRestorePress: () => void;
  onDeletePress: () => void;
};

export function ArchivedHabitActions({
  onRestorePress,
  onDeletePress,
}: ArchivedHabitActionsProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onRestorePress}
        style={({ pressed }) => [
          styles.restoreButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.restoreTitle}>Вернуть в Сегодня</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onDeletePress}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.deleteTitle}>Удалить навсегда</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  restoreButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#A8AEC0',
    borderRadius: 14,
  },
  restoreTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: appColors.accent,
  },
  deleteButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTitle: {
    fontSize: 16,
    color: '#FF3B30',
  },
  pressed: {
    opacity: 0.55,
  },
});
