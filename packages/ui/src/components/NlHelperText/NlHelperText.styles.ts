// NlHelperText classes (DESIGN.md §9, NlHelperText). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/**
 * The row: gap Space-M, no padding, full width, Body S. Items start at the top so a wrapped text keeps the icon on its
 * first line (OD-70).
 */
export const root = 'nl:flex nl:w-full nl:items-start nl:gap-m nl:p-none nl:text-body-s';

/**
 * The icon slot: one line of Body S high (1lh, 18), with the 20 icon centred in it, so the icon sits centred on the
 * first line whether the text wraps or not (OD-70). It carries the icon colour; the NlIcon inside inherits it.
 */
export const iconSlot = 'nl:inline-flex nl:h-lh nl:shrink-0 nl:items-center';

/** Text and icon colour per tone. Default uses text-tertiary, as the fields do (OD-43). */
export const tone = {
  default: { text: 'nl:text-tertiary', icon: 'nl:text-fg-secondary' },
  success: { text: 'nl:text-success', icon: 'nl:text-fg-success' },
  warning: { text: 'nl:text-warning', icon: 'nl:text-fg-warning' },
  error: { text: 'nl:text-error', icon: 'nl:text-fg-error' },
  disabled: { text: 'nl:text-disabled', icon: 'nl:text-fg-disabled' },
} as const;
