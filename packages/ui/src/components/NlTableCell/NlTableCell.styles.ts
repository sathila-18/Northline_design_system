// NlTableCell classes (DESIGN.md §9, NlTableCell). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: td (or th scope row) → row (leading select, content).

/** The cell: Size-40 high, no block padding, start-aligned, vertically centred, Body M text-secondary, no fill. */
export const root = 'nl:h-40 nl:py-none nl:text-start nl:align-middle nl:text-body-m nl:text-secondary';

/** Inline padding: Space-3XL; narrow Space-XL. */
export const padding = {
  default: 'nl:px-3xl',
  narrow: 'nl:px-xl',
} as const;

/** Row actions: the column is Size-64 wide (Space-XL + 32 button + Space-XL). */
export const actionsWidth = 'nl:w-64';

/**
 * Sticky at the end (OD-187): stays put when the table scrolls sideways, above the scrolled cells (--nl-z-sticky),
 * with --nl-shadow-sticky-end; the fill comes from the row so its hover and selected colours still show.
 */
export const stickyEnd = 'nl:sticky nl:end-none nl:z-sticky nl:bg-inherit nl:shadow-sticky-end';

/** The row inside the cell: horizontal, gap Space-M, items centred; min-w-0 so text can be cut. */
export const row = 'nl:flex nl:min-w-0 nl:items-center nl:gap-m';

/** Text content: one line, cut with an ellipsis. */
export const text = 'nl:min-w-0 nl:truncate';
