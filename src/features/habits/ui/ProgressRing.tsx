import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../shared/theme/colors';

type ProgressRingProps = {
  percentage: number;
};

const ringSize = 64;
const strokeCount = 100;
const strokeWidth = 3;
const strokeHeight = 7;
const ringRadius = 27;
const ringCenter = ringSize / 2;

const strokePositions = Array.from({ length: strokeCount }, (_, index) => {
  const angle = (index / strokeCount) * Math.PI * 2 - Math.PI / 2;

  return {
    left: ringCenter + Math.cos(angle) * ringRadius - strokeWidth / 2,
    top: ringCenter + Math.sin(angle) * ringRadius - strokeHeight / 2,
    transform: [{ rotate: `${angle + Math.PI / 2}rad` }],
  };
});

export function ProgressRing({ percentage }: ProgressRingProps) {
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  const completedStrokes = Math.round(
    (normalizedPercentage / 100) * strokeCount,
  );
  const isComplete = normalizedPercentage === 100;

  return (
    <View style={styles.container}>
      <View style={[styles.track, isComplete && styles.completeTrack]} />

      {isComplete
        ? null
        : strokePositions
            .slice(0, completedStrokes)
            .map((position, index) => (
              <View key={index} style={[styles.progressStroke, position]} />
            ))}

      <Text style={styles.percentage}>{normalizedPercentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ringSize,
    height: ringSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    width: ringRadius * 2,
    height: ringRadius * 2,
    borderWidth: strokeHeight,
    borderRadius: ringRadius,
    borderColor: appColors.track,
  },
  completeTrack: {
    borderColor: appColors.accent,
  },
  progressStroke: {
    position: 'absolute',
    width: strokeWidth,
    height: strokeHeight,
    borderRadius: strokeWidth / 2,
    backgroundColor: appColors.accent,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
});
