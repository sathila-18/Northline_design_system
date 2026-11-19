// Plain date helpers for NlCalendar (DESIGN.md §9, NlCalendar). Dates are ISO strings ('YYYY-MM-DD'), months are
// 'YYYY-MM'. Arithmetic runs in UTC so a time zone or daylight saving change can never shift a day. No locale
// formatting anywhere (CLAUDE.md): names come from NlCalendarNames.

/** Month and weekday names. English by default; an app can pass its own. */
export interface NlCalendarNames {
  /** 12 month names, January first. */
  months: readonly string[];
  /** 7 full weekday names, Sunday first. */
  weekdays: readonly string[];
  /** 7 short weekday names for the column headers, Sunday first. */
  weekdaysShort: readonly string[];
}

export const defaultNames: NlCalendarNames = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};

const pad = (n: number) => String(n).padStart(2, '0');

/** A UTC Date for an ISO date. */
function toUTC(iso: string) {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** The ISO date of a UTC Date. */
function fromUTC(date: Date) {
  return `${String(date.getUTCFullYear())}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** The ISO date for a local Date (used once, after mount, to find today). */
export function localISO(date: Date) {
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(iso: string, days: number) {
  const date = toUTC(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUTC(date);
}

/** The month ('YYYY-MM') of a date. */
export const monthOf = (iso: string) => iso.slice(0, 7);

/** The first day of a month. */
export const firstOfMonth = (month: string) => `${month}-01`;

export function addMonths(month: string, months: number) {
  const [y = 1970, m = 1] = month.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1 + months, 1));
  return fromUTC(date).slice(0, 7);
}

export function daysInMonth(month: string) {
  const [y = 1970, m = 1] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export const lastOfMonth = (month: string) => `${month}-${pad(daysInMonth(month))}`;

/** The same day of the month in another month, clamped to that month's length (31 January → 28 February). */
export function sameDayIn(iso: string, month: string) {
  const day = Math.min(Number(iso.slice(8, 10)), daysInMonth(month));
  return `${month}-${pad(day)}`;
}

/** Day of the week, 0 = Sunday. */
export const weekday = (iso: string) => toUTC(iso).getUTCDay();

/** The day number (1–31). */
export const dayOf = (iso: string) => Number(iso.slice(8, 10));

/** The first day of the week holding `iso`. */
export function startOfWeek(iso: string, weekStartsOn: number) {
  return addDays(iso, -((weekday(iso) - weekStartsOn + 7) % 7));
}

/** The 42 dates (6 weeks) shown for a month, starting on the week day `weekStartsOn`. */
export function monthGrid(month: string, weekStartsOn: number) {
  const start = startOfWeek(firstOfMonth(month), weekStartsOn);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** "Wednesday 3 March 2027". */
export function dateLabel(iso: string, names: NlCalendarNames) {
  const month = Number(iso.slice(5, 7));
  return `${names.weekdays[weekday(iso)] ?? ''} ${String(dayOf(iso))} ${names.months[month - 1] ?? ''} ${iso.slice(0, 4)}`;
}

/** "March 2027". */
export function monthLabel(month: string, names: NlCalendarNames) {
  return `${names.months[Number(month.slice(5, 7)) - 1] ?? ''} ${month.slice(0, 4)}`;
}
