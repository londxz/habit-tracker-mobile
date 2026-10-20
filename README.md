# Habit Tracker

Кроссплатформенное мобильное приложение для отслеживания ежедневных привычек, разработанное на React Native.

## Статус проекта

Подготовлен базовый React Native-проект, который собирается и запускается на iOS и Android. Пользовательская функциональность находится в разработке.

## Технологии

- React Native 0.88
- React 19
- TypeScript 6
- npm
- Gradle
- CocoaPods

## Требования

Для локального запуска необходимы:

- Node.js 24.22.0
- npm 11
- JDK 17
- Android SDK Platform 37
- Android SDK Build-Tools 37.0.0
- Xcode
- Ruby и Bundler

Подробная настройка окружения описана в официальной [документации React Native](https://reactnative.dev/docs/set-up-your-environment).

## Установка

Клонируйте репозиторий и перейдите в папку проекта:

```bash
git clone https://github.com/londxz/habit-tracker-mobile.git
cd habit-tracker-mobile
```

Установите JavaScript-зависимости:

```bash
npm ci
```

Для iOS дополнительно установите Ruby-зависимости и CocoaPods:

```bash
bundle install
cd ios
bundle exec pod install
cd ..
```

## Запуск

Запустите Metro из корня проекта:

```bash
npm start
```

Оставьте Metro работающим и используйте отдельный терминал для запуска приложения.

### iOS

```bash
npm run ios
```

### Android

Посмотрите список доступных эмуляторов:

```bash
emulator -list-avds
```

Запустите нужный эмулятор:

```bash
emulator -avd <AVD_NAME>
```

После загрузки эмулятора проверьте подключение и запустите приложение из корня проекта:

```bash
adb devices
npm run android
```

Вместо эмулятора можно использовать физическое Android-устройство с включённой USB-отладкой.

## Проверка качества

```bash
npm run lint
npx tsc --noEmit
npm test -- --runInBand
```

Проект использует npm. Не создавайте `yarn.lock` и не устанавливайте зависимости через Yarn.

## Структура проекта

```text
android/       нативный Android-проект
ios/           нативный iOS-проект
__tests__/     автоматические тесты
App.tsx        корневой React-компонент
index.js       точка регистрации приложения
app.json       имя React Native-приложения
package.json   зависимости и npm-команды
```
