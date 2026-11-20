// NlSnackbar classes (DESIGN.md §9, NlSnackbar). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Single line: root (row) → leading (icon, message) → trailing (action, close).
// Stacked: root (column) → top row (icon, message) → button row.

/** The root per layout: Radius-M, hugs its content up to Size-560 (OD-91). */
export const layout = {
  single: 'nl:flex nl:h-48 nl:w-fit nl:max-w-560 nl:items-center nl:gap-m nl:rounded-m',
  stacked: 'nl:flex nl:w-fit nl:max-w-560 nl:flex-col nl:gap-m nl:rounded-m',
} as const;

/** End padding of a single-line snackbar: Space-XS with buttons, Space-XL (matching the start) with none. */
export const singleEnd = {
  buttons: 'nl:pe-xs',
  none: 'nl:pe-xl',
} as const;

/** Background per tone. */
export const background = {
  neutral: 'nl:bg-direct',
  success: 'nl:bg-success-secondary',
  warning: 'nl:bg-warning-secondary',
  error: 'nl:bg-error-secondary',
} as const;

/** Leading part per layout: icon → message, gap Space-M, Space-XL at the start (stacked: top and sides too). */
export const leading = {
  single: 'nl:flex nl:min-w-0 nl:items-center nl:gap-m nl:ps-xl',
  stacked: 'nl:flex nl:min-w-0 nl:items-start nl:gap-m nl:px-xl nl:pt-xl',
} as const;

/** Icon colour per tone; 24 icon. Stacked: the icon sits on the message's first line (1lh of Body M). */
export const iconColour = {
  neutral: 'nl:text-fg-inverse',
  success: 'nl:text-fg-success',
  warning: 'nl:text-fg-warning',
  error: 'nl:text-fg-error',
} as const;

export const iconSlot = 'nl:inline-flex nl:h-lh nl:shrink-0 nl:items-center nl:text-body-m';

/** The message: Body M, plain text coloured by tone (OD-93). Single line: one line, cut with an ellipsis. */
export const message = {
  single: 'nl:m-none nl:min-w-0 nl:truncate nl:text-body-m',
  stacked: 'nl:m-none nl:min-w-0 nl:text-body-m',
} as const;

export const messageColour = {
  neutral: 'nl:text-inverse',
  success: 'nl:text-primary',
  warning: 'nl:text-primary',
  error: 'nl:text-primary',
} as const;

/** Buttons: single line at the end; stacked a row of their own, aligned to the end, Space-XS end and bottom. */
export const buttons = {
  single: 'nl:flex nl:shrink-0 nl:items-center',
  stacked: 'nl:flex nl:items-center nl:justify-end nl:pe-xs nl:pb-xs',
} as const;
