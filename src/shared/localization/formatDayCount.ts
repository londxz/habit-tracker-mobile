export function formatDayCount(dayCount: number): string {
  const lastTwoDigits = dayCount % 100;
  const lastDigit = dayCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${dayCount} дней`;
  }

  if (lastDigit === 1) {
    return `${dayCount} день`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${dayCount} дня`;
  }

  return `${dayCount} дней`;
}
