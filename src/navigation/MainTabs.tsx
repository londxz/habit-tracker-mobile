import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ProgressScreen } from '../screens/ProgressScreen';
import { TodayScreen } from '../screens/TodayScreen';
import type { MainTabsParamList } from './navigationTypes';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          title: 'Сегодня',
        }}
      />

      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Прогресс',
        }}
      />
    </Tab.Navigator>
  );
}
