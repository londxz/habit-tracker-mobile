export function formatCompletionCount(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} выполнений`;
  }

  if (lastDigit === 1) {
    return `${count} выполнение`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} выполнения`;
  }

  return `${count} выполнений`;
}
