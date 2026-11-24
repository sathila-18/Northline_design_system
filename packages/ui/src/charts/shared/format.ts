// Number and month formatting for charts (DESIGN.md §9, Charts: shared rules). No locale formatting, so server and
// browser output match (§7.4).

/** Whole numbers with a comma every three digits: 12480 → "12,480". */
export function formatNumber(value: number): string {
  const whole = Math.round(value);
  const sign = whole < 0 ? '-' : '';
  return sign + String(Math.abs(whole)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "YYYY-MM" or "YYYY-MM-DD" → year and month (1 to 12), or null for anything else. */
export function parseMonth(value: unknown): { year: number; month: number } | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(value);
  if (!match) return null;
  const month = Number(match[2]);
  return month >= 1 && month <= 12 ? { year: Number(match[1]), month } : null;
}

/** Axis label (OD-252): "Mar", with the year on the first tick and every January ("Jan 2027"). */
export function formatMonthTick(value: unknown, index: number): string {
  const parsed = parseMonth(value);
  if (!parsed) return String(value);
  const name = monthNames[parsed.month - 1] ?? '';
  return index === 0 || parsed.month === 1 ? `${name} ${String(parsed.year)}` : name;
}

/** Tooltip and table (OD-252): "Mar 2026". */
export function formatMonthLong(value: unknown): string {
  const parsed = parseMonth(value);
  if (!parsed) return String(value);
  return `${monthNames[parsed.month - 1] ?? ''} ${String(parsed.year)}`;
}
