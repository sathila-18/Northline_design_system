// NlLabel classes (DESIGN.md §9, NlLabel). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The row: horizontal, gap Space-M, no padding, items centred, aligned to the start, hugging its content. */
export const root = 'nl:inline-flex nl:items-center nl:justify-start nl:gap-m nl:p-none';

/** Text style per size: medium Label M, small Label S. */
export const size = {
  medium: 'nl:text-label-m',
  small: 'nl:text-label-s',
} as const;

/** Text colour per tone (OD-50). Tertiary is the reference's only colour and the default. */
export const tone = {
  tertiary: 'nl:text-tertiary',
  primary: 'nl:text-primary',
  secondary: 'nl:text-secondary',
  action: 'nl:text-action',
} as const;
