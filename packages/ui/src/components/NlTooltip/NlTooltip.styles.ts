// NlTooltip classes (DESIGN.md §9, NlTooltip). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: a fixed, transparent frame (role tooltip) with Space-XS padding all round, holding the dark box. The
// frame touches the trigger, so its padding is the visible Space-XS gap, and the pointer can cross from the trigger
// into the tooltip without leaving either (WCAG 1.4.13: hoverable), with no timer (durations are 0 under reduced
// motion).

/**
 * The frame: fixed, layer z-tooltip, at the measured position (nl:tooltip-position), Space-XS transparent padding.
 * Fades with Duration base; none under reduced motion. Hidden is display none, so it fades out and takes no pointer.
 */
export const frame =
  'nl:fixed nl:z-tooltip nl:p-xs nl:tooltip-position nl:transition nl:transition-discrete nl:duration-base nl:motion-reduce:transition-none';

/** Shown fades in from 0; hidden is display none. Until the first measure, shown is invisible. */
export const visibility = {
  shown: 'nl:block nl:opacity-100 nl:starting:opacity-0',
  hidden: 'nl:hidden nl:opacity-0',
} as const;

/** Before the first position is measured, so it never flashes at the corner. */
export const unmeasured = 'nl:invisible';

/** The dark box: bg-direct, Radius-S, no border or shadow. */
export const box = 'nl:rounded-s nl:bg-direct';

/** Padding and content per type. Single line: Caption L, text-inverse, no wrapping. Rich: up to Size-320 wide. */
export const type = {
  single: 'nl:py-m nl:px-xl nl:whitespace-nowrap nl:text-caption-l nl:text-inverse',
  rich: 'nl:py-l nl:px-xl nl:max-w-320',
} as const;
