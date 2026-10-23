import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import {
  createNativeBottomTabNavigator,
  type NativeBottomTabIcon,
} from '@react-navigation/bottom-tabs/unstable';
import { Appearance, Platform } from 'react-native';

import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { TodayScreen } from '../screens/today/TodayScreen';
import type { MainTabsParamList } from './navigationTypes';

type TabBarIconProps = {
  focused: boolean;
};

const Tab = createNativeBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          title: 'Сегодня',
          tabBarIcon: getTodayTabIcon,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Прогресс',
          headerTitleAlign: 'center',
          tabBarIcon: getProgressTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

function getTodayTabIcon({ focused }: TabBarIconProps): NativeBottomTabIcon {
  if (Platform.OS === 'ios') {
    return {
      type: 'sfSymbol',
      name: focused ? 'calendar.badge.checkmark' : 'calendar',
    };
  }

  return {
    type: 'image',
    source: Ionicons.getImageSourceSync(
      focused ? 'today' : 'today-outline',
      24,
      getAndroidIconColor(),
    ),
  };
}

function getProgressTabIcon({ focused }: TabBarIconProps): NativeBottomTabIcon {
  if (Platform.OS === 'ios') {
    return {
      type: 'sfSymbol',
      name: focused ? 'chart.bar.fill' : 'chart.bar',
    };
  }

  return {
    type: 'image',
    source: Ionicons.getImageSourceSync(
      focused ? 'bar-chart' : 'bar-chart-outline',
      24,
      getAndroidIconColor(),
    ),
  };
}

function getAndroidIconColor(): string {
  return Appearance.getColorScheme() === 'dark' ? '#FFFFFF' : '#000000';
}
