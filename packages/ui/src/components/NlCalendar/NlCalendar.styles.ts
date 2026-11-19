// NlCalendar classes (DESIGN.md §9, NlCalendar). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (one month, or two for a range) → month (column) → header (previous · title · next) → grid
// (weekday row, then 6 week rows of NlCalendarDay).

/** The calendar: bg-primary (OD-90), padding Space-L; a range shows two months Space-2XL apart. */
export const root = 'nl:inline-flex nl:items-start nl:gap-2xl nl:bg-primary nl:p-l';

/** One month: a column, Space-S between header, weekday row and weeks. */
export const month = 'nl:flex nl:flex-col nl:gap-s';

/** The header: Size-40 high, previous and next at the ends, the title centred between them. */
export const header = 'nl:flex nl:h-40 nl:items-center';

/** The month and year: Title S, text-primary, centred. Also a polite live region. */
export const title = 'nl:min-w-0 nl:flex-1 nl:truncate nl:text-center nl:text-title-s nl:text-primary';

/** Holds the place of a missing previous or next button in a range, so the title stays centred (NlButton small, 36). */
export const navSpacer = 'nl:size-36 nl:shrink-0';

/** The grid: weekday row, then the weeks. */
export const grid = 'nl:flex nl:flex-col';

/** The weekday row: Space-S above the weeks (the month's gap). */
export const weekdayRow = 'nl:flex nl:pb-s';

/** A week row. */
export const weekRow = 'nl:flex';

/** A weekday column header: Size-40 square, the short name centred. */
export const weekdayCell = 'nl:flex nl:size-40 nl:items-center nl:justify-center';

/** A cell for another month's day in a range: empty, Size-40. */
export const emptyCell = 'nl:size-40';

/** The full weekday name for screen readers. */
export const srOnly = 'nl:sr-only';
