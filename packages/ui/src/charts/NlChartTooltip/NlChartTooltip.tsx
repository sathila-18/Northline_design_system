import type { ComponentPropsWithRef } from 'react';
import { NlChartMarker, type NlChartMarkerShape, type NlChartSeries } from '../NlChartMarker';
import * as styles from './NlChartTooltip.styles';

export interface NlChartTooltipItem {
  /** The series name. */
  name: string;
  /** The value, already formatted ("1,204"). */
  value: string;
  /** The series, 1 to 7: its colour and marker. */
  series: NlChartSeries;
  /** Force the marker shape (bars and donut slices: `square`). Default: the series' own shape. */
  shape?: NlChartMarkerShape;
}

export interface NlChartTooltipProps extends Omit<ComponentPropsWithRef<'div'>, 'className' | 'children'> {
  /** The category or date ("Mar 2026"). */
  heading: string;
  /** One row per series. */
  items: NlChartTooltipItem[];
  /** Stacked bars: the total, already formatted. */
  total?: string;
  /** The total row's name. Default "Total". */
  totalLabel?: string;
  /** Placement only. */
  className?: string;
}

/**
 * The values at the hovered or focused point of a chart (DESIGN.md §9, NlChartTooltip). A heading, then a row per
 * series (marker, name, value in Data S), and a total row for stacked bars. Never focusable; the chart announces the
 * same text politely. Recharts renders it as its tooltip content. Presentational, so no 'use client'.
 */
export function NlChartTooltip({
  heading,
  items,
  total,
  totalLabel = 'Total',
  className,
  ...rest
}: NlChartTooltipProps) {
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <p className={styles.heading}>{heading}</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.name} className={styles.row}>
            <NlChartMarker series={item.series} shape={item.shape} />
            <span className={styles.name}>{item.name}</span>
            <span className={styles.value}>{item.value}</span>
          </li>
        ))}
      </ul>
      {total !== undefined && (
        <p className={styles.totalRow}>
          <span className={styles.name}>{totalLabel}</span>
          <span className={styles.value}>{total}</span>
        </p>
      )}
    </div>
  );
}
