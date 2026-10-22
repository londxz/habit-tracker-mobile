import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useCurrentDate(): Date {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout> | undefined;

    function refreshDate() {
      if (midnightTimer !== undefined) {
        clearTimeout(midnightTimer);
      }

      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      setCurrentDate(now);
      midnightTimer = setTimeout(
        refreshDate,
        nextMidnight.getTime() - now.getTime() + 100,
      );
    }

    refreshDate();

    const appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active') {
          refreshDate();
        }
      },
    );

    return () => {
      if (midnightTimer !== undefined) {
        clearTimeout(midnightTimer);
      }

      appStateSubscription.remove();
    };
  }, []);

  return currentDate;
}
