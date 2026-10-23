import { Alert } from 'react-native';

export function showHabitSaveError() {
  Alert.alert(
    'Не удалось сохранить изменения',
    'Попробуйте ещё раз. Если ошибка повторится, перезапустите приложение.',
  );
}
