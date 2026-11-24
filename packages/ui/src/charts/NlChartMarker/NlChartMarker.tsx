import * as styles from './NlChartMarker.styles';

/** A chart series, 1 to 7: series 1 is the brand, 2 to 7 the fixed set (D9). */
export type NlChartSeries = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type NlChartMarkerShape = 'circle' | 'square' | 'triangle' | 'diamond';

export interface NlChartMarkerProps {
  /** The series: picks the colour, and the shape unless `shape` is given. */
  series: NlChartSeries;
  /** Force a shape (bars and donut slices use `square`). Default: the series' own shape. */
  shape?: NlChartMarkerShape;
  /** Size-8 (tooltip, line points) or Size-12 (legend). */
  size?: '8' | '12';
  /**
   * Inside a chart's SVG: the top-left corner and the size in px, so the marker sits on a point (line charts). A nested
   * SVG ignores the CSS size class, so the chart passes the Size-8 token's value here.
   */
  x?: number;
  y?: number;
  box?: number;
  /** Placement only. */
  className?: string;
}

const order: NlChartMarkerShape[] = ['circle', 'square', 'triangle', 'diamond'];

/** The series' own shape: circle, square, triangle, diamond, then the same again hollow (OD-256). */
export function seriesShape(series: NlChartSeries): { shape: NlChartMarkerShape; hollow: boolean } {
  return { shape: order[(series - 1) % order.length] ?? 'circle', hollow: series > order.length };
}

/*
 * Shape geometry in a 12 × 12 viewBox. Artwork (CLAUDE.md, "No hardcoded values": artwork is the exception); hollow
 * shapes sit 1 unit inside the box so their 1.5 outline stays within it.
 */
const geometry = {
  filled: {
    circle: <circle cx="6" cy="6" r="6" />,
    square: <rect x="0" y="0" width="12" height="12" rx="2" />,
    triangle: <path d="M6 0.5 L11.8 11.5 H0.2 Z" />,
    diamond: <path d="M6 0 L12 6 L6 12 L0 6 Z" />,
  },
  hollow: {
    circle: <circle cx="6" cy="6" r="5" strokeWidth="1.5" />,
    square: <rect x="1" y="1" width="10" height="10" rx="1.5" strokeWidth="1.5" />,
    triangle: <path d="M6 1.6 L10.8 10.75 H1.2 Z" strokeWidth="1.5" strokeLinejoin="round" />,
    diamond: <path d="M6 1 L11 6 L6 11 L1 6 Z" strokeWidth="1.5" strokeLinejoin="round" />,
  },
} as const;

/**
 * A series marker (DESIGN.md §9, NlChartMarker; internal). An SVG shape in the series' chart colour, used by
 * NlChartTooltip and NlChartLegend, so series differ by shape as well as colour. Decorative: always aria-hidden.
 * Presentational, so no 'use client'.
 */
export function NlChartMarker({ series, shape, size = '8', x, y, box, className }: NlChartMarkerProps) {
  const own = seriesShape(series);
  const drawn = shape ?? own.shape;
  const isHollow = shape === undefined ? own.hollow : false;
  return (
    <svg
      viewBox="0 0 12 12"
      x={x}
      y={y}
      width={box}
      height={box}
      aria-hidden="true"
      focusable="false"
      className={[styles.size[size], isHollow ? styles.hollow[series] : styles.filled[series], className]
        .filter(Boolean)
        .join(' ')}
      data-series={series}
      data-shape={drawn}
      data-hollow={isHollow || undefined}
    >
      {isHollow ? geometry.hollow[drawn] : geometry.filled[drawn]}
    </svg>
  );
}
