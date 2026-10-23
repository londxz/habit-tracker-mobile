import { StyleSheet, Text, View } from 'react-native';

import type { HabitColor } from '../model/habitTypes';
import { getHabitDisplayName } from './getHabitDisplayName';
import { getHabitAccentColor } from './habitColors';

type HabitIconProps = {
  name: string;
  emoji: string | null;
  color: HabitColor | null;
  size?: number;
};

export function HabitIcon({ name, emoji, color, size = 52 }: HabitIconProps) {
  const accentColor = getHabitAccentColor(color);
  const normalizedEmoji = emoji?.trim() || null;
  const content = normalizedEmoji || getHabitInitial(getHabitDisplayName(name));

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderColor: `${accentColor}66`,
          borderRadius: size * 0.27,
          backgroundColor: `${accentColor}12`,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.content,
          {
            fontSize: size * 0.52,
            lineHeight: size * 0.65,
            color: accentColor,
          },
        ]}
      >
        {content}
      </Text>
    </View>
  );
}

function getHabitInitial(name: string): string {
  return name.trim().charAt(0).toLocaleUpperCase('ru-RU') || '•';
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  content: {
    fontWeight: '600',
  },
});
