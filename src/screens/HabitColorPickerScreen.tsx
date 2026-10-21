import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCreateHabitDraft } from '../features/habits/context/CreateHabitDraftProvider';
import type { HabitColor } from '../features/habits/model/habitTypes';
import { habitColorOptions } from '../features/habits/ui/habitColors';
import { HabitPreviewCard } from '../features/habits/ui/HabitPreviewCard';
import { PickerDoneFooter } from '../features/habits/ui/PickerDoneFooter';
import { PickerSelectionIndicator } from '../features/habits/ui/PickerSelectionIndicator';
import type { CreateHabitStackParamList } from '../navigation/navigationTypes';
import { appColors } from '../shared/theme/colors';

type HabitColorPickerScreenProps = NativeStackScreenProps<
  CreateHabitStackParamList,
  'HabitColorPicker'
>;

export function HabitColorPickerScreen({
  navigation,
}: HabitColorPickerScreenProps) {
  const { draft, updateDraft } = useCreateHabitDraft();

  function handleColorPress(color: HabitColor | null) {
    updateDraft({ color });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Цвет помогает отличать привычки и не меняет статус выполнения.
        </Text>

        <ColorOption
          name="Без цвета"
          description="Нейтральное оформление"
          color="#E5E5EA"
          isSelected={draft.color === null}
          onPress={() => handleColorPress(null)}
        />

        <Text style={styles.sectionTitle}>ПАЛИТРА</Text>

        <View style={styles.palette}>
          {habitColorOptions.map(option => (
            <ColorOption
              key={option.value}
              name={option.name}
              color={option.hex}
              isSelected={draft.color === option.value}
              compact
              onPress={() => handleColorPress(option.value)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>ПРЕДПРОСМОТР</Text>

        <HabitPreviewCard
          name={draft.name}
          emoji={draft.emoji || null}
          color={draft.color}
          isReminderEnabled={draft.isReminderEnabled}
          reminderTime={draft.reminderTime}
        />
      </ScrollView>

      <PickerDoneFooter onPress={navigation.goBack} />
    </View>
  );
}

type ColorOptionProps = {
  name: string;
  description?: string;
  color: string;
  isSelected: boolean;
  compact?: boolean;
  onPress: () => void;
};

function ColorOption({
  name,
  description,
  color,
  isSelected,
  compact = false,
  onPress,
}: ColorOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.colorOption,
        compact && styles.colorOptionCompact,
        isSelected && styles.colorOptionSelected,
        pressed && styles.buttonPressed,
      ]}
    >
      {compact ? (
        <>
          <View style={styles.compactHeader}>
            <View style={[styles.swatch, { backgroundColor: color }]} />
            <PickerSelectionIndicator isSelected={isSelected} />
          </View>
          <Text numberOfLines={1} style={styles.colorNameCompact}>
            {name}
          </Text>
        </>
      ) : (
        <>
          <View style={[styles.swatch, { backgroundColor: color }]} />

          <View style={styles.colorText}>
            <Text style={styles.colorName}>{name}</Text>
            {description !== undefined ? (
              <Text style={styles.colorDescription}>{description}</Text>
            ) : null}
          </View>

          <PickerSelectionIndicator isSelected={isSelected} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  description: {
    marginHorizontal: 12,
    marginBottom: 20,
    fontSize: 17,
    lineHeight: 23,
    color: '#747B9A',
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#747B9A',
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  colorOptionCompact: {
    minHeight: 108,
    minWidth: '47%',
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  colorOptionSelected: {
    borderColor: appColors.accent,
  },
  swatch: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  colorText: {
    flex: 1,
    marginLeft: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#111111',
  },
  colorNameCompact: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },
  colorDescription: {
    marginTop: 2,
    fontSize: 14,
    color: '#747B9A',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
