/**
 * Utility functions for currency and numerical formatting
 */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    return `$${val % 1 === 0 ? val : val.toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return `$${val % 1 === 0 ? val : val.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    const val = amount / 1_000;
    return `$${val % 1 === 0 ? val : val.toFixed(1)}K`;
  }
  return `$${amount}`;
}

export function formatNumber(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}
