import {
  isLiquidGlassSupported,
  LiquidGlassView,
} from '@callstack/liquid-glass';
import { PlatformColor, Pressable, StyleSheet, Text } from 'react-native';

import { appColors } from '../../../shared/theme/colors';

type AddHabitButtonProps = {
  onPress: () => void;
};

export function AddHabitButton({ onPress }: AddHabitButtonProps) {
  if (!isLiquidGlassSupported) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Добавить привычку"
        hitSlop={8}
        onPress={onPress}
        style={({ pressed }) => [
          styles.fallback,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.title}>+</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Добавить привычку"
      hitSlop={8}
      onPress={onPress}
      style={styles.button}
    >
      <LiquidGlassView effect="clear" interactive style={styles.glass}>
        <Text style={styles.title}>+</Text>
      </LiquidGlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  glass: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 26,
  },
  fallback: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: appColors.separator,
    borderRadius: 26,
    backgroundColor: appColors.surface,
  },
  buttonPressed: {
    opacity: 0.65,
  },
  title: {
    fontSize: 36,
    lineHeight: 38,
    fontWeight: '300',
    color: PlatformColor('systemBlueColor'),
  },
});
