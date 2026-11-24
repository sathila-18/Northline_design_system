// NlChartMarker classes (DESIGN.md §9, NlChartMarker). Whole literal class strings only (CLAUDE.md, Tailwind rule 1).
//
// Structure: an <svg> with one shape, coloured by the series' chart token (D9).

/** The marker's box: Size-8 (tooltip, line points) or Size-12 (legend). Never shrinks. */
export const size = {
  '8': 'nl:block nl:size-8 nl:shrink-0',
  '12': 'nl:block nl:size-12 nl:shrink-0',
} as const;

/** Filled shapes: the series' colour as the fill. */
export const filled = {
  1: 'nl:fill-chart-series-1',
  2: 'nl:fill-chart-series-2',
  3: 'nl:fill-chart-series-3',
  4: 'nl:fill-chart-series-4',
  5: 'nl:fill-chart-series-5',
  6: 'nl:fill-chart-series-6',
  7: 'nl:fill-chart-series-7',
} as const;

/** Hollow shapes (series 5 and up): no fill, the series' colour as the outline. */
export const hollow = {
  1: 'nl:fill-none nl:stroke-chart-series-1',
  2: 'nl:fill-none nl:stroke-chart-series-2',
  3: 'nl:fill-none nl:stroke-chart-series-3',
  4: 'nl:fill-none nl:stroke-chart-series-4',
  5: 'nl:fill-none nl:stroke-chart-series-5',
  6: 'nl:fill-none nl:stroke-chart-series-6',
  7: 'nl:fill-none nl:stroke-chart-series-7',
} as const;
