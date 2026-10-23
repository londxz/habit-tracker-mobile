import { Pressable, StyleSheet, Text } from 'react-native';

import { appColors } from '../../shared/theme/colors';

type AddHabitButtonProps = {
  onPress: () => void;
};

export function AddHabitButton({ onPress }: AddHabitButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Добавить привычку"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.title}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: appColors.separator,
    borderRadius: 26,
    backgroundColor: appColors.surface,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  title: {
    fontSize: 36,
    lineHeight: 38,
    fontWeight: '300',
    color: appColors.accent,
  },
});
