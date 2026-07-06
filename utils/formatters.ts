/**
 * Formats numeric values into standard USD currency strings.
 * e.g. 1234.5 -> "$1,234.50"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats integer or floating numbers with thousand separators.
 * e.g. 10000 -> "10,000"
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Formats conversion rates as percentages.
 * e.g. 0.1234 -> "12.34%"
 */
export function formatPercentage(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return "0.00%";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);
}

/**
 * Formats ISO date strings to readable short dates.
 * e.g. "2024-07-14" -> "Jul 14, 2024"
 */
export function formatDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return isoDateString;
  }
}
