// NlFileUpload classes (DESIGN.md §9, NlFileUpload). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Large: card (column, centred) → icon → text → progress → button.
// Small: card (column) → row (icon, text, button) → progress below.

/**
 * The card: full width, Radius-L, padding Space-XL, gap Space-XL, a 1px dashed border (§4.2, OD-114; the browser
 * sets the dash length). Colours ease with Duration fast; none under reduced motion.
 */
export const root =
  'nl:flex nl:w-full nl:flex-col nl:gap-xl nl:rounded-l nl:border nl:border-dashed nl:p-xl nl:transition-colors nl:duration-fast nl:motion-reduce:transition-none';

/** Layout per size: large centred; small stacks the row and the progress bar. */
export const size = {
  large: 'nl:items-center nl:text-center',
  small: 'nl:items-stretch nl:text-start',
} as const;

/** Border per state (the spec's table); disabled border-disabled (OD-123); drag-over border-active (OD-122). */
export const border = {
  enabled: 'nl:border-default',
  uploading: 'nl:border-active',
  complete: 'nl:border-strong',
  error: 'nl:border-error',
  disabled: 'nl:border-disabled',
  dragOver: 'nl:border-active',
} as const;

/** Card fill: bg-primary; drag-over bg-active (OD-122). */
export const background = {
  normal: 'nl:bg-primary',
  dragOver: 'nl:bg-active',
} as const;

/** Clicking the card opens the picker while it is empty and enabled. */
export const pickable = 'nl:cursor-pointer';

/** Small: the row of icon, text and button, items centred, gap Space-XL. */
export const row = 'nl:flex nl:w-full nl:items-center nl:gap-xl';

/** Text: full width (large); fills the space between icon and button (small). */
export const text = {
  large: 'nl:w-full',
  small: 'nl:min-w-0 nl:flex-1',
} as const;

/** The progress bar fills the width. */
export const progress = 'nl:w-full';

/** The button keeps its size. */
export const button = 'nl:shrink-0';

/** Hidden native input and live region. */
export const hidden = 'nl:sr-only';
