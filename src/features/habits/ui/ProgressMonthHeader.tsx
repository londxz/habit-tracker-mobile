import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ProgressMonthHeaderProps = {
  month: Date;
  canOpenPreviousMonth: boolean;
  canOpenNextMonth: boolean;
  onPreviousMonthPress: () => void;
  onNextMonthPress: () => void;
};

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric',
});

export function ProgressMonthHeader({
  month,
  canOpenPreviousMonth,
  canOpenNextMonth,
  onPreviousMonthPress,
  onNextMonthPress,
}: ProgressMonthHeaderProps) {
  return (
    <View style={styles.container}>
      <MonthButton
        direction="back"
        isEnabled={canOpenPreviousMonth}
        onPress={onPreviousMonthPress}
      />

      <Text style={styles.title}>{getMonthTitle(month)}</Text>

      <MonthButton
        direction="forward"
        isEnabled={canOpenNextMonth}
        onPress={onNextMonthPress}
      />
    </View>
  );
}

type MonthButtonProps = {
  direction: 'back' | 'forward';
  isEnabled: boolean;
  onPress: () => void;
};

function MonthButton({ direction, isEnabled, onPress }: MonthButtonProps) {
  const accessibilityLabel =
    direction === 'back' ? 'Предыдущий месяц' : 'Следующий месяц';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isEnabled }}
      disabled={!isEnabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        !isEnabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      <Ionicons name={`chevron-${direction}`} size={26} color="#111111" />
    </Pressable>
  );
}

function getMonthTitle(month: Date): string {
  return monthFormatter
    .format(month)
    .replace(/\s*г\.$/i, '')
    .toLocaleUpperCase('ru-RU');
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.25,
  },
  buttonPressed: {
    opacity: 0.55,
  },
});
