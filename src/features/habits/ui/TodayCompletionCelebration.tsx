import { useEffect, useRef } from 'react';
import { impact } from 'react-native-haptic-feedback';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

type TodayCompletionCelebrationProps = {
  visible: boolean;
  onDismiss: () => void;
};

const ANIMATION_DURATION = 1900;

export function TodayCompletionCelebration({
  visible,
  onDismiss,
}: TodayCompletionCelebrationProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    progress.setValue(0);
    impact('impactMedium', 0.65, {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) {
        onDismiss();
      }
    });

    return () => {
      animation.stop();
    };
  }, [onDismiss, progress, visible]);

  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.82, 1],
    outputRange: [0, 1, 1, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.22, 0.45, 0.7, 1],
    outputRange: [0.2, 1.18, 0.94, 1.06, 1.45],
  });
  const rotation = progress.interpolate({
    inputRange: [0, 0.3, 0.55, 0.8, 1],
    outputRange: ['-10deg', '6deg', '-4deg', '3deg', '0deg'],
  });

  return (
    <Modal
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel="Все привычки выполнены. Закрыть"
        accessibilityRole="button"
        accessibilityViewIsModal
        onPress={onDismiss}
        style={styles.overlay}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity,
              transform: [{ scale }, { rotate: rotation }],
            },
          ]}
        >
          <Text style={styles.fire}>🔥</Text>
          <Text style={styles.title}>День закрыт</Text>
          <Text style={styles.subtitle}>Все привычки выполнены</Text>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 8, 12, 0.94)',
  },
  content: {
    alignItems: 'center',
  },
  fire: {
    fontSize: 176,
    lineHeight: 205,
  },
  title: {
    marginTop: 12,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
    lineHeight: 24,
    color: '#C7C7CC',
  },
});
