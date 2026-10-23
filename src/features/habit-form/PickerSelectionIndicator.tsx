import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../shared/theme/colors';

type PickerSelectionIndicatorProps = {
  isSelected: boolean;
};

export function PickerSelectionIndicator({
  isSelected,
}: PickerSelectionIndicatorProps) {
  return (
    <View style={[styles.indicator, isSelected && styles.indicatorSelected]}>
      {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appColors.border,
    borderRadius: 13,
  },
  indicatorSelected: {
    borderColor: appColors.accent,
    backgroundColor: appColors.accent,
  },
  checkmark: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    color: appColors.onAccent,
  },
});
