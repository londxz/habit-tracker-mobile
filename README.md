<div align="center">

# Habit Tracker

Мобильное приложение для ежедневных привычек: помогает планировать дела, отмечать выполнение и следить за прогрессом без регистрации и облачного аккаунта.

</div>

## Скриншоты

<table>
  <tr>
    <td align="center"><b>Сегодня</b><br><img src="docs/screenshots/today-light.png" width="240" alt="Экран Сегодня в светлой теме"></td>
    <td align="center"><b>Тёмная тема</b><br><img src="docs/screenshots/today-dark.png" width="240" alt="Экран Сегодня в тёмной теме"></td>
    <td align="center"><b>Завершение дня</b><br><img src="docs/screenshots/completion-celebration.png" width="240" alt="Анимация завершения дня"></td>
  </tr>
  <tr>
    <td align="center"><b>Новая привычка</b><br><img src="docs/screenshots/create-habit.png" width="240" alt="Создание привычки"></td>
    <td align="center"><b>Редактирование</b><br><img src="docs/screenshots/edit-habit.png" width="240" alt="Редактирование привычки"></td>
    <td align="center"><b>Детали</b><br><img src="docs/screenshots/habit-details.png" width="240" alt="Детали привычки"></td>
  </tr>
  <tr>
    <td align="center"><b>Календарь</b><br><img src="docs/screenshots/progress-calendar.png" width="240" alt="Календарь общего прогресса"></td>
    <td align="center"><b>История</b><br><img src="docs/screenshots/progress-history.png" width="240" alt="История выполнения"></td>
    <td align="center"><b>Архив</b><br><img src="docs/screenshots/archive.png" width="240" alt="Архив привычек"></td>
  </tr>
</table>

## Возможности

- Создание ежедневных привычек с названием, эмодзи и цветом.
- Отметка выполнения прямо на экране «Сегодня».
- Фильтры всех, оставшихся и выполненных привычек.
- Локальные напоминания в выбранные дни и время.
- Текущая серия, личный рекорд и процент выполнения.
- Общий календарь прогресса и история по дням.
- Подробная статистика и календарь для каждой привычки.
- Редактирование, завершение, восстановление и удаление привычек.
- Анимация и тактильный отклик после выполнения всех дел на день.
- Светлая и тёмная темы.
- Локальное хранение данных на устройстве.

## Запуск

Требуется стандартное React Native-окружение: Node.js 24, npm 11, Xcode и CocoaPods для iOS, Android Studio и JDK 17 для Android.

Клонируйте проект и установите зависимости:

```bash
git clone https://github.com/londxz/habit-tracker-mobile.git
cd habit-tracker-mobile
npm ci
```

### iOS

```bash
bundle install
bundle exec pod install --project-directory=ios
npm run ios
```

### Android

Запустите первый установленный AVD:

```bash
emulator -avd "$(emulator -list-avds | head -n 1)"
```

После загрузки эмулятора откройте второй терминал в корне проекта:

```bash
npm run android
```

## Технологии

- React Native 0.88, React 19 и TypeScript 6
- React Navigation: native stack и native bottom tabs
- MMKV для локального хранения данных
- Notifee для локальных уведомлений
- React Native Haptic Feedback для тактильного отклика
- React Native Vector Icons / Ionicons
- Liquid Glass с безопасным fallback для неподдерживаемых платформ
- CocoaPods и Gradle для нативных сборок
