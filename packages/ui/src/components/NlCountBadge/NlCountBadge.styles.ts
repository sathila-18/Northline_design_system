// NlCountBadge classes (DESIGN.md §9, NlCountBadge). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).

/** The pill: round, content centred, no border or shadow. "99+" stays on one line. */
export const root =
  'nl:inline-flex nl:shrink-0 nl:items-center nl:justify-center nl:rounded-full nl:whitespace-nowrap nl:text-inverse';

/**
 * Size and padding per size and digits. Double digits keep the single-digit height and get it as a minimum width
 * (OD-4), with Space-XS inline padding, so the pill only grows wider (designer's choice, 18 Nov 2026).
 */
export const form = {
  small: {
    none: 'nl:size-6',
    single: 'nl:size-16 nl:p-none nl:text-caption-s',
    double: 'nl:h-16 nl:min-w-16 nl:px-xs nl:text-caption-s',
  },
  large: {
    none: 'nl:size-12',
    single: 'nl:size-20 nl:p-none nl:text-caption-l',
    double: 'nl:h-20 nl:min-w-20 nl:px-xs nl:text-caption-l',
  },
} as const;

/** Background. fg-* on purpose: the solid status colours for small graphics. */
export const tone = {
  error: 'nl:bg-fg-error',
  warning: 'nl:bg-fg-warning',
  success: 'nl:bg-fg-success',
} as const;

/** The label, read by screen readers only. */
export const label = 'nl:sr-only';
