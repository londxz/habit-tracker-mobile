import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appColors } from '../../../shared/theme/colors';

type PickerDoneFooterProps = {
  onPress: () => void;
};

export function PickerDoneFooter({ onPress }: PickerDoneFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.title}>Готово</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: appColors.separator,
    backgroundColor: appColors.background,
  },
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: appColors.accent,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: appColors.onAccent,
  },
});
