/**
 * @format
 */

import 'react-native-get-random-values';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerHabitReminderBackgroundHandler } from './src/features/habit-reminders/habitReminderNotifications';

registerHabitReminderBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
