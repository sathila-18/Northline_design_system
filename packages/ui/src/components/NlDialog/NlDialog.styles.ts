// NlDialog classes (DESIGN.md §9, NlDialog). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: native <dialog> (fills the window, transparent) → NlOverlay → frame (centres the panel, Space-3XL
// from the edges) → panel → header (title, close) → body → footer (start action · end group).

/**
 * The native <dialog>: shown with showModal() in the top layer, filling the window, with the browser's own box,
 * border, padding and backdrop cleared (NlOverlay draws the scrim). max-*-full, not max-*-none: in this theme `none`
 * is the Space-none token (0), so max-h-none would collapse the dialog.
 */
export const dialog =
  'nl:fixed nl:inset-none nl:m-none nl:h-dvh nl:max-h-full nl:w-dvw nl:max-w-full nl:overflow-hidden nl:border-0 nl:bg-transparent nl:p-none nl:backdrop:bg-transparent';

/** The frame: centres the panel and keeps it Space-3XL from the window edges (OD-181). */
export const frame = 'nl:relative nl:flex nl:h-full nl:w-full nl:items-center nl:justify-center nl:p-3xl';

/**
 * The panel: Radius-L, bg-primary, a column no taller than the frame, above the overlay (--nl-z-modal). Fades and
 * scales from 95% with Duration slow and the standard ease (OD-125); reduced motion: no scale (and the durations are
 * zero there).
 */
export const panel =
  'nl:relative nl:z-modal nl:flex nl:max-h-full nl:w-full nl:flex-col nl:rounded-l nl:bg-primary nl:transition nl:duration-slow nl:ease-standard nl:motion-reduce:scale-100';

/** Width per size: small Size-560, large Size-720 (OD-115, OD-121). */
export const width = {
  small: 'nl:max-w-560',
  large: 'nl:max-w-720',
} as const;

/** Open: in, from 95% and transparent on first show. Closing: back out before the dialog closes. */
export const motion = {
  open: 'nl:scale-100 nl:opacity-100 nl:starting:scale-95 nl:starting:opacity-0',
  closing: 'nl:scale-95 nl:opacity-0',
} as const;

/** Header: Space-XL top, Space-3XL sides; title fills, close at the end, gap Space-3XL, aligned to the top. */
export const header = 'nl:flex nl:shrink-0 nl:items-start nl:gap-3xl nl:px-3xl nl:pt-xl';

/** The title fills the header. */
export const title = 'nl:min-w-0 nl:flex-1';

/**
 * The close button (ghost: tertiary icon-only, no fill at rest). Its 24 icon sits 16 from the top and 16 from the end
 * of the panel (designer's choice, 20 Nov 2026): pulled up Space-L (12: the header's Space-XL top minus the button's
 * own 12 around the icon) and out Space-2XL (20: the Space-3XL side minus 16, plus those 12). The hit area stays 48.
 */
export const close = 'nl:-me-2xl nl:-mt-l nl:shrink-0';

/** Body: Space-XL below the header; scrolls when the content is taller than the panel (OD-181). */
export const body =
  'nl:min-h-0 nl:flex-1 nl:overflow-y-auto nl:px-3xl nl:pt-xl nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none';

/** Body bottom padding: none above a footer (the footer's Space-3XL top makes the gap), Space-3XL without one. */
export const bodyEnd = {
  footer: 'nl:pb-none',
  alone: 'nl:pb-3xl',
} as const;

/** Footer: Space-3XL top (the body → footer gap), sides and bottom; start action, then the end group. */
export const footer = 'nl:flex nl:shrink-0 nl:flex-wrap nl:items-center nl:gap-l nl:p-3xl';

/** End group: secondary then primary, gap Space-L, at the end. */
export const end = 'nl:ms-auto nl:flex nl:flex-wrap nl:items-center nl:justify-end nl:gap-l';
