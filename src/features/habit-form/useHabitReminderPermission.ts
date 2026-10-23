import { useState } from 'react';
import { Alert } from 'react-native';

import { habitReminderNotifications } from '../habit-reminders/habitReminderNotifications';
import { useHabitFormDraft } from './HabitFormDraftProvider';

export function useHabitReminderPermission() {
  const { updateDraft } = useHabitFormDraft();
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  async function setReminderEnabled(isEnabled: boolean) {
    if (!isEnabled) {
      updateDraft({ isReminderEnabled: false });
      return;
    }

    setIsRequestingPermission(true);

    try {
      const isGranted = await habitReminderNotifications.requestPermission();

      updateDraft({ isReminderEnabled: isGranted });

      if (!isGranted) {
        showPermissionDeniedAlert();
      }
    } catch {
      updateDraft({ isReminderEnabled: false });
      Alert.alert(
        'Не удалось включить напоминание',
        'Попробуй ещё раз или проверь настройки уведомлений.',
      );
    } finally {
      setIsRequestingPermission(false);
    }
  }

  return { isRequestingPermission, setReminderEnabled };
}

function showPermissionDeniedAlert() {
  Alert.alert(
    'Уведомления выключены',
    'Разреши уведомления в настройках устройства, чтобы включить напоминание.',
    [
      { text: 'Не сейчас', style: 'cancel' },
      {
        text: 'Настройки',
        onPress: () => {
          habitReminderNotifications.openSettings().catch(() => undefined);
        },
      },
    ],
  );
}
