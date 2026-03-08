/**
 * Parse a numeric string, removing currency symbols and formatting.
 * Returns fallback if parsing fails.
 */
export function parseNum(value: string | number | undefined | null, fallback = 0): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'number') return value;
  const cleaned = value.replace(/[^\d.,\-]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
}
