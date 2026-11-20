// NlMultiSelect classes (DESIGN.md §9, NlMultiSelect). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
// The field, chips, menu and rows are their components' own; only the chip measuring row and the empty message here.

/** The visible chips: one row filling the value area, gap Space-XS (OD-136); the measuring row sits inside it. */
export const chipRow = 'nl:relative nl:flex nl:w-full nl:min-w-0 nl:items-center nl:gap-xs';

/**
 * A copy of every chip and a "+N" chip at their natural widths, out of the layout and unseen, so the visible row knows
 * how many fit (OD-136). Invisible elements take no focus and are hidden from assistive tech.
 */
export const measureRow = 'nl:invisible nl:absolute nl:start-none nl:flex nl:w-max nl:gap-xs';

/** The search header's "No results" line: a polite live region; empty while there are results. */
export const status = 'nl:contents';
