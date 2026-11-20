// NlSideSheet classes (DESIGN.md §9, NlSideSheet). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: native <dialog> (fills the window, transparent) → NlOverlay → panel (end edge, full height) → header
// (back, title, close) → NlDivider (optional) → body (scrolls) → NlButtonDock (optional).

/**
 * The native <dialog>: shown with showModal() in the top layer, filling the window, with the browser's own box,
 * border, padding and backdrop cleared (NlOverlay draws the scrim), as NlDialog. max-*-full, not max-*-none (none is
 * the Space-none token here).
 */
export const dialog =
  'nl:fixed nl:inset-none nl:m-none nl:h-dvh nl:max-h-full nl:w-dvw nl:max-w-full nl:overflow-hidden nl:border-0 nl:bg-transparent nl:p-none nl:backdrop:bg-transparent';

/**
 * The panel: fixed to the end edge (the right, the left in right-to-left), full height, bg-primary, above the overlay
 * (--nl-z-modal), a column. The spec's Space-3XL gaps are paddings on the parts (the body's sit inside its scroll
 * area, so a floating field label at the top isn't cut off). No shadow (the overlay separates it). Slides with Duration slow and the
 * standard ease (OD-143).
 */
export const panel =
  'nl:fixed nl:inset-y-none nl:end-none nl:z-modal nl:flex nl:h-dvh nl:w-full nl:flex-col nl:gap-none nl:bg-primary nl:transition nl:duration-slow nl:ease-standard';

/** Width per size: small Size-560 (default), large Size-720, the dialog widths (OD-133). */
export const width = {
  small: 'nl:max-w-560',
  large: 'nl:max-w-720',
} as const;

/**
 * Open: in from beyond the end edge on first show. Closing: back out before the dialog closes. Reduced motion: no
 * slide, a fade only (OD-143).
 */
export const motion = {
  open: 'nl:translate-x-none nl:opacity-100 nl:starting:translate-x-full nl:rtl:starting:-translate-x-full nl:motion-reduce:starting:translate-x-none nl:motion-reduce:starting:opacity-0',
  closing: 'nl:translate-x-full nl:rtl:-translate-x-full nl:motion-reduce:translate-x-none nl:motion-reduce:opacity-0',
} as const;

/** Header: Space-4XL top, Space-3XL sides; back button, title (fills), close button; gap Space-XS (OD-216). */
export const header = 'nl:flex nl:shrink-0 nl:items-start nl:gap-xs nl:px-3xl nl:pt-4xl';

/** The title fills the header row. */
export const title = 'nl:min-w-0 nl:flex-1 nl:self-center';

/** Header buttons keep their size. */
export const headerButton = 'nl:shrink-0';

/**
 * Body: Space-3XL all round (the header → body and body → footer gaps, inside the scroll area), gap Space-3XL between
 * blocks; scrolls when long, and takes keyboard focus then (as NlDialog).
 */
export const body =
  'nl:flex nl:min-h-0 nl:flex-1 nl:flex-col nl:gap-3xl nl:overflow-y-auto nl:p-3xl nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';

/** The divider under the header: Space-3XL below the header (the body's own top padding follows it). */
export const divider = 'nl:mt-3xl nl:shrink-0';

/** The footer dock: stays at the bottom of the panel. */
export const footer = 'nl:shrink-0';
