import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useHabitFormDraft } from '../features/habits/context/HabitFormDraftProvider';
import { habitEmojiSections } from '../features/habits/ui/habitEmojiSections';
import { HabitIcon } from '../features/habits/ui/HabitIcon';
import { HabitPreviewCard } from '../features/habits/ui/HabitPreviewCard';
import { PickerDoneFooter } from '../features/habits/ui/PickerDoneFooter';
import { PickerSelectionIndicator } from '../features/habits/ui/PickerSelectionIndicator';
import { appColors } from '../shared/theme/colors';

export function HabitIconPickerScreen() {
  const navigation = useNavigation();
  const { draft, updateDraft } = useHabitFormDraft();

  function handleEmojiPress(emoji: string) {
    updateDraft({ emoji });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Выбери значок, чтобы быстрее находить привычку в списке.
        </Text>

        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ checked: draft.emoji === '' }}
          onPress={() => handleEmojiPress('')}
          style={({ pressed }) => [
            styles.withoutIcon,
            draft.emoji === '' && styles.optionSelected,
            pressed && styles.buttonPressed,
          ]}
        >
          <HabitIcon
            name={draft.name}
            emoji={null}
            color={draft.color}
            size={46}
          />

          <View style={styles.withoutIconText}>
            <Text style={styles.withoutIconTitle}>Без значка</Text>
            <Text style={styles.withoutIconDescription}>
              Покажем первую букву названия
            </Text>
          </View>

          <PickerSelectionIndicator isSelected={draft.emoji === ''} />
        </Pressable>

        {habitEmojiSections.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.emojiCard}>
              {section.emojis.map((emoji, index) => {
                const isSelected = draft.emoji === emoji;

                return (
                  <Pressable
                    key={`${section.title}-${emoji}-${index}`}
                    accessibilityLabel={`Значок ${emoji}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    onPress={() => handleEmojiPress(emoji)}
                    style={({ pressed }) => [
                      styles.emojiOption,
                      isSelected && styles.emojiOptionSelected,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                    {isSelected ? (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkBadgeText}>✓</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>ПРЕДПРОСМОТР</Text>

        <HabitPreviewCard
          name={draft.name}
          emoji={draft.emoji || null}
          color={draft.color}
          weekdays={draft.weekdays}
          isReminderEnabled={draft.isReminderEnabled}
          reminderTime={draft.reminderTime}
        />
      </ScrollView>

      <PickerDoneFooter onPress={navigation.goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
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
    color: appColors.textSecondary,
  },
  withoutIcon: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  optionSelected: {
    borderColor: appColors.accent,
  },
  withoutIconText: {
    flex: 1,
    marginLeft: 12,
  },
  withoutIconTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: appColors.textPrimary,
  },
  withoutIconDescription: {
    marginTop: 2,
    fontSize: 14,
    color: appColors.textSecondary,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: appColors.textSecondary,
  },
  emojiCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  emojiOption: {
    width: '16.666%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 18,
  },
  emojiOptionSelected: {
    borderColor: appColors.accent,
    backgroundColor: appColors.selectedSurface,
  },
  emoji: {
    fontSize: 30,
  },
  checkBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appColors.surface,
    borderRadius: 9,
    backgroundColor: appColors.accent,
  },
  checkBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: appColors.onAccent,
  },
  buttonPressed: {
    opacity: 0.65,
  },
});
