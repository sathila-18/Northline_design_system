// NlPageHeader classes (DESIGN.md §9, NlPageHeader). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (row) → start group (back button, text column) → NlNotificationButton; a hidden live region.
// No bottom edge: NlAppShell leaves a Space-XS gap under the header (OD-135).

/** The root: a row, Space-L block and Space-3XL inline padding, gap Space-XL, items centred, bg-primary. */
export const root = 'nl:flex nl:w-full nl:min-w-0 nl:items-center nl:gap-xl nl:bg-primary nl:px-3xl nl:py-l';

/** The start group: back button and text column, gap Space-L; takes the rest of the row. */
export const start = 'nl:flex nl:min-w-0 nl:flex-1 nl:items-center nl:gap-l';

/** Buttons keep their size. */
export const fixed = 'nl:shrink-0';

/** The text column: title, then the body, gap Space-XS. */
export const text = 'nl:flex nl:min-w-0 nl:flex-1 nl:flex-col nl:gap-xs';

/** The title text: one line, cut with an ellipsis. */
export const titleLine = 'nl:block nl:truncate';

/** The "3 new notifications" announcement: read politely, never shown. */
export const announcement = 'nl:sr-only';
