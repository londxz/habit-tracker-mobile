import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../shared/theme/colors';

type HabitsLoadErrorProps = {
  onRetry: () => void;
};

export function HabitsLoadError({ onRetry }: HabitsLoadErrorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Не удалось загрузить привычки</Text>
      <Text style={styles.description}>
        Данные остались на устройстве. Попробуй загрузить их ещё раз.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
        ]}
      >
        <Text style={styles.retryButtonTitle}>Повторить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: appColors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: appColors.textPrimary,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: appColors.textSecondary,
  },
  retryButton: {
    minWidth: 140,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: appColors.accent,
  },
  retryButtonPressed: {
    opacity: 0.7,
  },
  retryButtonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: appColors.onAccent,
  },
});
