// NlBanner classes (DESIGN.md §9, NlBanner). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (tinted, rounded, horizontal) → icon slot → text column (title, description, action) → close.

/** The root: full width, padding Space-XL, Radius-M, horizontal, gap Space-M, aligned to the top. */
export const root = 'nl:flex nl:w-full nl:items-start nl:gap-m nl:rounded-m nl:p-xl';

/** Background per tone. */
export const background = {
  info: 'nl:bg-info-secondary',
  success: 'nl:bg-success-secondary',
  error: 'nl:bg-error-secondary',
  warning: 'nl:bg-warning-secondary',
  neutral: 'nl:bg-neutral',
} as const;

/**
 * The icon slot: one line high (1lh) of the first text line's style, the 20 icon centred in it, so it sits on the
 * title's first line (or the description's when there is no title) (OD-165). Colour per tone.
 */
export const iconSlot = 'nl:inline-flex nl:h-lh nl:shrink-0 nl:items-center';

export const iconLine = {
  title: 'nl:text-headline-small-h6',
  description: 'nl:text-body-m',
} as const;

export const iconColour = {
  info: 'nl:text-fg-info',
  success: 'nl:text-fg-success',
  error: 'nl:text-fg-error',
  warning: 'nl:text-fg-warning',
  neutral: 'nl:text-fg-secondary',
} as const;

/** The text column: vertical, gap Space-XS, takes the remaining width; the action keeps its own width. */
export const textColumn = 'nl:flex nl:min-w-0 nl:flex-1 nl:flex-col nl:items-start nl:gap-xs';

/** Title: Headline Small-H6, plain text coloured by tone (OD-93). */
export const title = 'nl:m-none nl:text-headline-small-h6';

export const titleColour = {
  info: 'nl:text-info',
  success: 'nl:text-success',
  error: 'nl:text-error',
  warning: 'nl:text-warning',
  neutral: 'nl:text-primary',
} as const;

/** Description: Body M, plain text coloured by tone (OD-93). */
export const description = 'nl:m-none nl:w-full nl:text-body-m';

export const descriptionColour = {
  info: 'nl:text-info',
  success: 'nl:text-success',
  error: 'nl:text-error',
  warning: 'nl:text-warning',
  neutral: 'nl:text-secondary',
} as const;

/** The close button's place: keeps its size at the end. */
export const close = 'nl:shrink-0';
