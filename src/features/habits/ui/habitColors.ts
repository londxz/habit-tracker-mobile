import type { HabitColor } from '../model/habitTypes';

export const habitColorOptions: Array<{
  value: HabitColor;
  name: string;
  hex: string;
}> = [
  { value: 'blue', name: 'Синий', hex: '#3478F6' },
  { value: 'teal', name: 'Бирюзовый', hex: '#30B0C7' },
  { value: 'purple', name: 'Фиолетовый', hex: '#AF52DE' },
  { value: 'coral', name: 'Коралловый', hex: '#FF6B5E' },
  { value: 'amber', name: 'Янтарный', hex: '#FFB340' },
  { value: 'pink', name: 'Розовый', hex: '#FF375F' },
];

export const neutralHabitColor = '#8E8E93';

export function getHabitAccentColor(color: HabitColor | null): string {
  if (color === null) {
    return neutralHabitColor;
  }

  return (
    habitColorOptions.find(option => option.value === color)?.hex ??
    neutralHabitColor
  );
}

export function getHabitColorName(color: HabitColor | null): string {
  if (color === null) {
    return 'Без цвета';
  }

  return (
    habitColorOptions.find(option => option.value === color)?.name ??
    'Без цвета'
  );
}
