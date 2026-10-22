import type { HabitWeekday } from './habitTypes';

export const allHabitWeekdays: HabitWeekday[] = [1, 2, 3, 4, 5, 6, 7];

export const habitWeekdayOptions: Array<{
  label: string;
  accessibilityLabel: string;
  value: HabitWeekday;
}> = [
  { label: 'Пн', accessibilityLabel: 'Понедельник', value: 1 },
  { label: 'Вт', accessibilityLabel: 'Вторник', value: 2 },
  { label: 'Ср', accessibilityLabel: 'Среда', value: 3 },
  { label: 'Чт', accessibilityLabel: 'Четверг', value: 4 },
  { label: 'Пт', accessibilityLabel: 'Пятница', value: 5 },
  { label: 'Сб', accessibilityLabel: 'Суббота', value: 6 },
  { label: 'Вс', accessibilityLabel: 'Воскресенье', value: 7 },
];

export function getHabitWeekday(dateKey: string): HabitWeekday {
  const [year, month, day] = dateKey.split('-').map(Number);
  const weekday = new Date(year, month - 1, day).getDay();

  return (weekday === 0 ? 7 : weekday) as HabitWeekday;
}

export function getHabitScheduleTitle(weekdays: HabitWeekday[]): string {
  if (weekdays.length === 7) {
    return 'Каждый день';
  }

  if (areWeekdaysEqual(weekdays, [1, 2, 3, 4, 5])) {
    return 'По будням';
  }

  if (areWeekdaysEqual(weekdays, [6, 7])) {
    return 'По выходным';
  }

  if (weekdays.length > 3) {
    return `${weekdays.length} ${
      weekdays.length === 4 ? 'дня' : 'дней'
    } в неделю`;
  }

  return habitWeekdayOptions
    .filter(option => weekdays.includes(option.value))
    .map(option => option.label)
    .join(', ');
}

function areWeekdaysEqual(
  first: HabitWeekday[],
  second: HabitWeekday[],
): boolean {
  return (
    first.length === second.length &&
    second.every(weekday => first.includes(weekday))
  );
}
