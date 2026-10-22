import { StyleSheet, Text, View } from 'react-native';

import type { ProgressDayStatus } from '../model/getProgressHistory';
import { appColors } from '../../../shared/theme/colors';

type ProgressDayIndicatorProps = {
  status: ProgressDayStatus;
  size?: number;
};

export function ProgressDayIndicator({
  status,
  size = 24,
}: ProgressDayIndicatorProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        status === 'complete' && styles.complete,
        status === 'partial' && styles.partial,
        status === 'none' && styles.none,
      ]}
    >
      {status === 'partial' ? (
        <View style={[styles.partialFill, { width: size / 2 }]} />
      ) : null}

      {status === 'complete' ? (
        <Text
          style={[
            styles.checkmark,
            { fontSize: size * 0.58, lineHeight: size },
          ]}
        >
          ✓
        </Text>
      ) : null}

      {status === 'none' ? (
        <Text
          style={[styles.dash, { fontSize: size * 0.58, lineHeight: size }]}
        >
          —
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  complete: {
    backgroundColor: appColors.accent,
  },
  partial: {
    borderWidth: 1.5,
    borderColor: appColors.accent,
    backgroundColor: appColors.track,
  },
  partialFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: appColors.accent,
  },
  none: {
    backgroundColor: appColors.track,
  },
  checkmark: {
    fontWeight: '700',
    color: appColors.onAccent,
  },
  dash: {
    color: appColors.textTertiary,
  },
});
