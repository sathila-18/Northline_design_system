// NlDonutChart classes (DESIGN.md §9, NlDonutChart). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (the focusable group) → body (ring with the centre total · legend) + a hidden live region.

/** The chart at its height (Size-240 or Size-320). One tab stop with the standard focus ring. */
export const root = {
  '240':
    'nl:flex nl:h-240 nl:w-full nl:min-w-0 nl:rounded-xs nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none',
  '320':
    'nl:flex nl:h-320 nl:w-full nl:min-w-0 nl:rounded-xs nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none',
} as const;

/** Ring and legend: beside each other (end, Space-3XL apart, centred) or stacked (below, Space-L apart). */
export const body = {
  end: 'nl:flex nl:h-full nl:w-full nl:min-w-0 nl:flex-row nl:items-center nl:gap-3xl',
  below: 'nl:flex nl:h-full nl:w-full nl:min-w-0 nl:flex-col nl:gap-l',
} as const;

/** The ring's box: a square as tall as the chart (end), or the free height (below). Holds the centre total. */
export const ring = {
  end: 'nl:relative nl:aspect-square nl:h-full nl:shrink-0',
  below: 'nl:relative nl:min-h-0 nl:w-full nl:flex-1',
} as const;

/** The centre: the total (Data L) over its label (Body S), centred in the ring; never takes the pointer. */
export const centre =
  'nl:pointer-events-none nl:absolute nl:inset-none nl:flex nl:flex-col nl:items-center nl:justify-center';

export const total = 'nl:m-none nl:text-data-l nl:text-primary';

export const totalLabel = 'nl:m-none nl:text-body-s nl:text-chart-axis-text';

/** The legend beside the ring takes the rest of the width. */
export const legend = 'nl:min-w-0';

/** The highlight ring round the keyboard-focused slice only: chart-highlight, no fill (OD-261). */
export const highlight = 'nl:fill-none nl:stroke-chart-highlight';

/**
 * A slice. While another slice is hovered it dims to 40% (OD-261). There is no opacity token: 40 is the designer's
 * approved value, a rule 9 exception like the skeleton's 0.6 (25 Nov 2026). The fade uses Duration fast, none under
 * reduced motion (rule 6).
 */
export const slice = {
  resting: 'nl:transition-opacity nl:duration-fast nl:motion-reduce:transition-none',
  dimmed: 'nl:opacity-40 nl:transition-opacity nl:duration-fast nl:motion-reduce:transition-none',
} as const;

/** Keyboard announcements: read politely, never shown. */
export const live = 'nl:sr-only';
