// NlBarChart classes (DESIGN.md §9, NlBarChart). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: root (the focusable group: plot, legend) + a hidden live region.

/** The chart at its height (Size-240 or Size-320): the plot fills what the legend leaves, Space-L apart. One tab stop. */
export const root = {
  '240':
    'nl:flex nl:h-240 nl:w-full nl:min-w-0 nl:flex-col nl:gap-l nl:rounded-xs nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none',
  '320':
    'nl:flex nl:h-320 nl:w-full nl:min-w-0 nl:flex-col nl:gap-l nl:rounded-xs nl:focus-visible:outline-2 nl:focus-visible:-outline-offset-1 nl:focus-visible:outline-focused nl:focus:not-focus-visible:outline-none',
} as const;

/** The plot takes the free height. */
export const plot = 'nl:min-h-0 nl:w-full nl:flex-1';

/** Axis labels and value labels: Data S (tabular figures); colour chart-axis-text, passed to Recharts as a variable. */
export const text = 'nl:text-data-s';

/** The highlight ring round the hovered or focused bar: chart-highlight, no fill. */
export const ring = 'nl:fill-none nl:stroke-chart-highlight';

/** Keyboard announcements: read politely, never shown. */
export const live = 'nl:sr-only';
