// NlIconContainer classes (DESIGN.md §9, NlIconContainer). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The circle: Radius-Full, icon centred. Fixed size, so no padding or gap (OD-45). No border, no shadow. */
export const root = 'nl:inline-flex nl:shrink-0 nl:items-center nl:justify-center nl:rounded-full';

/** Circle size, from Size-*. */
export const size = {
  40: 'nl:size-40',
  48: 'nl:size-48',
  64: 'nl:size-64',
} as const;

/** NlIcon size for each circle size. */
export const iconSize = {
  40: 24,
  48: 24,
  64: 36,
} as const;

/** Background and icon colour. The icon takes the colour from here (NlIcon tone="inherit"). */
export const tone = {
  primary: 'nl:bg-icons nl:text-fg-primary',
  secondary: 'nl:bg-secondary nl:text-fg-secondary',
  disabled: 'nl:bg-disabled nl:text-fg-disabled-on-bg',
  success: 'nl:bg-success-secondary nl:text-fg-success',
  warning: 'nl:bg-warning-secondary nl:text-fg-warning',
  error: 'nl:bg-error-secondary nl:text-fg-error',
  info: 'nl:bg-info-secondary nl:text-fg-info',
} as const;
