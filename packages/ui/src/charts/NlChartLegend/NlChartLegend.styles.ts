// NlChartLegend classes (DESIGN.md §9, NlChartLegend). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: <ul> (items) → <li> (marker, label, value).

/** The list per position: below the plot, a wrapping row (Space-XL across, Space-S down); at the end, a column. */
export const list = {
  below: 'nl:m-none nl:flex nl:list-none nl:flex-wrap nl:gap-x-xl nl:gap-y-s nl:p-none',
  end: 'nl:m-none nl:flex nl:list-none nl:flex-col nl:gap-m nl:p-none',
} as const;

/** An item: marker, label and value, Space-S apart (designer, 24 Nov 2026). */
export const item = 'nl:flex nl:min-w-0 nl:items-center nl:gap-s';

/** A line chart's marker: a Size-16 line, 2px thick, with the series' Size-8 shape on top (designer, 24 Nov 2026). */
export const lineMarker = 'nl:relative nl:flex nl:h-12 nl:w-16 nl:shrink-0 nl:items-center nl:justify-center';

/** The line under the shape, in the series' colour. */
export const line = {
  1: 'nl:absolute nl:inset-x-none nl:h-2 nl:rounded-full nl:bg-chart-series-1',
  2: 'nl:absolute nl:inset-x-none nl:h-2 nl:rounded-full nl:bg-chart-series-2',
  3: 'nl:absolute nl:inset-x-none nl:h-2 nl:rounded-full nl:bg-chart-series-3',
  4: 'nl:absolute nl:inset-x-none nl:h-2 nl:rounded-full nl:bg-chart-series-4',
  5: 'nl:absolute nl:inset-x-none nl:h-2 nl:rounded-full nl:bg-chart-series-5',
  6: 'nl:absolute nl:inset-x-none nl:h-2 nl:rounded-full nl:bg-chart-series-6',
  7: 'nl:absolute nl:inset-x-none nl:h-2 nl:rounded-full nl:bg-chart-series-7',
} as const;

/** The shape sits above the line. */
export const shape = 'nl:relative';

/** The label: Body S, chart-axis-text, one line, cut with an ellipsis at Size-240. */
export const label = 'nl:min-w-0 nl:max-w-240 nl:truncate nl:text-body-s nl:text-chart-axis-text';

/** The donut's value and share: Data S (tabular figures), text-primary. */
export const value = 'nl:shrink-0 nl:text-data-s nl:text-primary';
