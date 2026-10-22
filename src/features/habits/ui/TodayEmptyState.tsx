import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../shared/theme/colors';

type TodayEmptyStateProps = {
  onCreateHabitPress: () => void;
};

export function TodayEmptyState({ onCreateHabitPress }: TodayEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="calendar-clear-outline"
        size={72}
        color={appColors.textTertiary}
      />
      <Text style={styles.title}>Привычек пока нет</Text>
      <Text style={styles.description}>
        Создайте первую привычку, чтобы начать отслеживать прогресс.
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={onCreateHabitPress}
        style={({ pressed }) => [
          styles.createButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.createButtonTitle}>Создать привычку</Text>
      </Pressable>

      <Text style={styles.privacy}>
        Все данные останутся на этом устройстве.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  title: {
    marginTop: 24,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  description: {
    maxWidth: 320,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 23,
    color: appColors.textSecondary,
  },
  createButton: {
    width: '100%',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    borderRadius: 16,
    backgroundColor: appColors.accent,
  },
  createButtonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: appColors.onAccent,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  privacy: {
    marginTop: 20,
    fontSize: 14,
    color: appColors.textTertiary,
  },
});
