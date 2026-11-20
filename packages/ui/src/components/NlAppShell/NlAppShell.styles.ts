// NlAppShell classes (DESIGN.md §9, NlAppShell). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: shell (row, bg-secondary) → skip link (fixed wrapper) · nav slot · panel area → panel (column, clipped)
// → <header> · <main> (scrolls).

/** The shell: fills the window, a row with gap Space-none, bg-secondary. The window never scrolls. */
export const root = 'nl:flex nl:h-dvh nl:w-full nl:gap-none nl:overflow-hidden nl:bg-secondary';

/** The nav slot: full height; the nav sets its own width. */
export const nav = 'nl:flex nl:h-full nl:shrink-0';

/** The panel area: takes the rest; Space-M top, end and bottom, none at the start. Flexes as the nav resizes. */
export const panelArea = 'nl:flex nl:min-w-0 nl:flex-1 nl:pt-m nl:pe-m nl:pb-m nl:ps-none';

/**
 * The panel: Radius-L, clipped, a column with header then content, Space-XS apart (OD-135). No fill of its own, so the
 * page background shows in the gap; the header and the content carry bg-primary.
 */
export const panel = 'nl:flex nl:min-w-0 nl:flex-1 nl:flex-col nl:gap-xs nl:overflow-hidden nl:rounded-l';

/** The header slot: stays at the top. */
export const header = 'nl:shrink-0';

/**
 * The content: fills the rest, scrolls vertically, Space-3XL padding (OD-24), bg-primary. Focusable so the keyboard
 * can scroll it: a 2px border-focused ring fully inside the panel, on top of the content (OD-26).
 */
export const main =
  'nl:min-h-0 nl:flex-1 nl:overflow-y-auto nl:bg-primary nl:p-3xl nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-2 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';

/** Where the skip link appears: Space-M from the top and start edges, above everything (--nl-z-snackbar, OD-235). */
export const skipWrapper = 'nl:fixed nl:top-m nl:start-m nl:z-snackbar';

/**
 * Hides the skip link until it has focus. On its own element: sr-only and not-sr-only set padding, which would undo
 * the pill's.
 */
export const skipReveal = 'nl:sr-only nl:focus-within:not-sr-only';

/**
 * The skip link: a pill (Space-M block, Space-XL inline, Radius-Full, Label M text-action on bg-primary,
 * --nl-shadow-menu) with the standard focus ring (OD-25).
 */
export const skipLink =
  'nl:inline-flex nl:rounded-full nl:bg-primary nl:px-xl nl:py-m nl:text-label-m nl:text-action nl:no-underline nl:shadow-menu nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';
