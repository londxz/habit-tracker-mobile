import { getDateKey } from './getDateKey';

export function getAdjacentDateKey(dateKey: string, dayOffset: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day + dayOffset);

  return getDateKey(date);
}
