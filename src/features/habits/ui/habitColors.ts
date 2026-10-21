import type { HabitColor } from '../model/habitTypes';

export const habitColorOptions: Array<{
  value: HabitColor;
  hex: string;
}> = [
  { value: 'blue', hex: '#3478F6' },
  { value: 'teal', hex: '#30B0C7' },
  { value: 'purple', hex: '#AF52DE' },
  { value: 'coral', hex: '#FF6B5E' },
  { value: 'amber', hex: '#FFB340' },
  { value: 'pink', hex: '#FF375F' },
];

export function getHabitAccentColor(color: HabitColor | null): string {
  if (color === null) {
    return '#3478F6';
  }

  return (
    habitColorOptions.find(option => option.value === color)?.hex ?? '#3478F6'
  );
}
