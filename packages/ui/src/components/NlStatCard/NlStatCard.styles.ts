// NlStatCard classes (DESIGN.md §9, NlStatCard). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: card (vertical) → label (NlLabel) → value.

/**
 * The card: fills its grid column, bg-active, Radius-L, padding Space-2XL, vertical, gap Space-none, content centred
 * vertically.
 */
export const root =
  'nl:flex nl:w-full nl:min-w-0 nl:flex-col nl:justify-center nl:gap-none nl:rounded-l nl:bg-active nl:p-2xl';

/** The label's wrapper (a <dt> in a list): no margin of its own. */
export const term = 'nl:m-none';

/** The value: Data M (tabular figures, OD-113), text-primary; wraps when too wide (OD-176). */
export const value = 'nl:m-none nl:min-w-0 nl:break-words nl:text-data-m nl:text-primary';
