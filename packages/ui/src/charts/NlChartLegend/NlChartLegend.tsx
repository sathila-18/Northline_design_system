import type { ComponentPropsWithRef } from 'react';
import { NlChartMarker, type NlChartSeries } from '../NlChartMarker';
import * as styles from './NlChartLegend.styles';

export interface NlChartLegendItem {
  /** The series or slice name. */
  label: string;
  /** The series, 1 to 7: its colour and shape. */
  series: NlChartSeries;
  /** Donut: the value and share, already formatted ("312 · 26%"). */
  value?: string;
}

export type NlChartLegendKind = 'line' | 'block';
export type NlChartLegendPosition = 'below' | 'end';

export interface NlChartLegendProps extends Omit<ComponentPropsWithRef<'ul'>, 'className' | 'children'> {
  items: NlChartLegendItem[];
  /** Line charts: a short line with the series' shape. Bars and donut slices: a square. */
  kind?: NlChartLegendKind;
  /** Below the plot (a wrapping row) or at the end (a column, beside a donut). */
  position?: NlChartLegendPosition;
  /** The list's name. Default "Legend". */
  'aria-label'?: string;
  /** Placement only. */
  className?: string;
}

/**
 * The key to a chart's series or slices (DESIGN.md §9, NlChartLegend). A list of items: marker (line charts: a
 * Size-16 line with the series' shape; bars and slices: a Size-12 square), label, and for the donut the value and
 * share. Not interactive in v1 (OD-257). Markers are decorative; each item reads its label and value.
 * Presentational, so no 'use client'.
 */
export function NlChartLegend({
  items,
  kind = 'line',
  position = 'below',
  'aria-label': ariaLabel = 'Legend',
  className,
  ...rest
}: NlChartLegendProps) {
  return (
    <ul
      {...rest}
      aria-label={ariaLabel}
      className={[styles.list[position], className].filter(Boolean).join(' ')}
      data-kind={kind}
      data-position={position}
    >
      {items.map((item) => (
        <li key={item.label} className={styles.item}>
          {kind === 'line' ? (
            <span className={styles.lineMarker} aria-hidden="true" data-slot="marker">
              <span className={styles.line[item.series]} />
              <NlChartMarker series={item.series} className={styles.shape} />
            </span>
          ) : (
            <NlChartMarker series={item.series} shape="square" size="12" />
          )}
          <span className={styles.label}>{item.label}</span>
          {item.value !== undefined && <span className={styles.value}>{item.value}</span>}
        </li>
      ))}
    </ul>
  );
}
