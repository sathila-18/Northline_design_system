// NlChartTooltip classes (DESIGN.md §9, NlChartTooltip). Whole literal class strings only (CLAUDE.md, Tailwind
// rule 1).
//
// Structure: root (heading, list of rows, optional total row).

/**
 * The box: chart-tooltip-bg and -text, Radius-S, Space-M top and bottom, Space-L sides, rows Space-XS apart, at most
 * Size-240 wide, --nl-shadow-menu. Fades in over Duration base; no fade under reduced motion. Recharts places it.
 */
export const root =
  'nl:flex nl:max-w-240 nl:flex-col nl:gap-xs nl:rounded-s nl:bg-chart-tooltip-bg nl:px-l nl:py-m nl:text-chart-tooltip-text nl:shadow-menu nl:animate-chart-tooltip-in nl:motion-reduce:animate-none';

/** The category or date: Label S. */
export const heading = 'nl:m-none nl:text-label-s';

/** The rows, as a list, Space-XS apart. */
export const list = 'nl:m-none nl:flex nl:list-none nl:flex-col nl:gap-xs nl:p-none';

/** A row: marker, name, value; Space-S between marker and name. */
export const row = 'nl:flex nl:min-w-0 nl:items-center nl:gap-s';

/** The total row (stacked bars): Space-XS more above it instead of a divider (designer, 24 Nov 2026). */
export const totalRow = 'nl:m-none nl:flex nl:min-w-0 nl:items-center nl:gap-s nl:pt-xs';

/** The series name: Body S, one line, cut with an ellipsis. */
export const name = 'nl:min-w-0 nl:truncate nl:text-body-s';

/** The value: Data S (tabular figures), end-aligned, never cut; Space-XL from the name. */
export const value = 'nl:ms-auto nl:shrink-0 nl:ps-xl nl:text-data-s';
