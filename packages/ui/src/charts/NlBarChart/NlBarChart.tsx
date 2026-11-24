'use client';

import { useId, type ReactElement } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type RectangleProps,
} from 'recharts';
import { NlChartLegend } from '../NlChartLegend';
import type { NlChartSeries } from '../NlChartMarker';
import { NlChartTooltip } from '../NlChartTooltip';
import { formatMonthLong, formatMonthTick, formatNumber, parseMonth } from '../shared/format';
import { useChartKeyboard } from '../shared/keyboard';
import { useElementWidth, useTextMeasure } from '../shared/measure';
import { pickTicks, truncateText, valueTicks } from '../shared/ticks';
import { chartColour, seriesColour, useReducedMotion, useTokenNumber } from '../shared/tokens';
import * as styles from './NlBarChart.styles';

export interface NlBarChartSeries {
  /** The data key. */
  key: string;
  /** The name in the legend, tooltip and announcements. */
  label: string;
}

export type NlBarChartOrientation = 'vertical' | 'horizontal';
export type NlBarChartLayout = 'grouped' | 'stacked';

export interface NlBarChartProps<T extends Record<string, unknown>> {
  /** The accessible name (required) and the chart's title. */
  title: string;
  /** A one-line summary, read after the name. */
  description?: string;
  /** One row per category, drawn in this order (the page sorts, designer 24 Nov 2026). */
  data: T[];
  /** The category's key: an ISO month ("2026-03") or a name. */
  xKey: keyof T & string;
  /** Series: one, grouped up to 3, stacked up to 5 (OD-260). Colours follow the order (D9). */
  series: NlBarChartSeries[];
  /** Vertical bars (default) or horizontal bars. */
  orientation?: NlBarChartOrientation;
  /** Two or more series: side by side (default) or stacked. */
  layout?: NlBarChartLayout;
  /** One series only: each bar's value at its end. */
  showValues?: boolean;
  /** Values on the axis, labels, tooltip and announcements. Default "12,480". */
  formatValue?: (value: number) => string;
  /** The category as text. Default: months as "Mar" on the axis and "Mar 2026" elsewhere; names as they are. */
  formatX?: (value: unknown) => string;
  /** Size-240 or Size-320. */
  height?: keyof typeof styles.root;
  /** Placement only. */
  className?: string;
}

const limit = { single: 1, grouped: 3, stacked: 5 } as const;

/**
 * Bars by category (DESIGN.md §9, NlBarChart): vertical or horizontal; one series, grouped (up to 3) or stacked (up
 * to 5). Recharts draws it with chart tokens only: bars with Radius-XS at the free end (stacked: the outer segment),
 * a group taking 60% of its slot with bars Space-XXS apart, gridlines across the value axis, five round value ticks,
 * Data S labels (categories cut with an ellipsis; horizontal in a Size-120 column), a chart-cursor band and a
 * chart-highlight ring on the hovered bar, NlChartTooltip (stacked: a total) and NlChartLegend for two or more series.
 * One tab stop (role group, "chart"): Left and Right (horizontal: Up and Down), Home, End, Escape; each step announced.
 * Bars grow over --nl-duration-slow with "ease-out" (OD-255); none under reduced motion. 'use client'.
 */
export function NlBarChart<T extends Record<string, unknown>>({
  title,
  description,
  data,
  xKey,
  series: allSeries,
  orientation = 'vertical',
  layout: layoutProp = 'grouped',
  showValues = false,
  formatValue = formatNumber,
  formatX,
  height = '320',
  className,
}: NlBarChartProps<T>) {
  const id = useId();
  const layout = allSeries.length <= 1 ? 'single' : layoutProp;
  const series = allSeries.slice(0, limit[layout]);
  const stacked = layout === 'stacked';
  const horizontal = orientation === 'horizontal';
  const values = showValues && layout === 'single';

  const reduced = useReducedMotion();
  const drawDuration = useTokenNumber('--nl-duration-slow', 300);
  const tooltipDuration = useTokenNumber('--nl-duration-base', 200);
  const tickGap = useTokenNumber('--nl-space-xl', 16);
  const margin = useTokenNumber('--nl-space-m', 8);
  const slack = useTokenNumber('--nl-space-xs', 4);
  const barGap = useTokenNumber('--nl-space-xxs', 2);
  const radius = useTokenNumber('--nl-radius-xs', 4);
  const labelColumn = useTokenNumber('--nl-size-120', 120);
  const lineHeight = useTokenNumber('--nl-font-data-s-line-height', 18);
  const measure = useTextMeasure('--nl-font-data-s', 7);
  const [plotRef, plotWidth] = useElementWidth();

  const xDataKey: string = xKey;
  const categories = data.map((row) => row[xKey]);
  const isMonths = categories.length > 0 && parseMonth(categories[0]) !== null;
  const longLabel = (value: unknown) => (formatX ? formatX(value) : isMonths ? formatMonthLong(value) : String(value));
  const numberOf = (row: T, key: string) => Number(row[key] ?? 0);
  const totalOf = (row: T) => series.reduce((sum, s) => sum + numberOf(row, s.key), 0);

  // Five round value ticks from 0, covering the largest bar (stacked: the largest total).
  const largest = Math.max(
    0,
    ...data.map((row) => (stacked ? totalOf(row) : Math.max(...series.map((s) => numberOf(row, s.key))))),
  );
  const vTicks = valueTicks(largest);
  const valueLabelWidth = Math.ceil(Math.max(...vTicks.map((tick) => measure(formatValue(tick)))));
  const barLabelWidth = values ? Math.ceil(Math.max(0, ...data.map((row) => measure(formatValue(totalOf(row)))))) : 0;

  // Category labels: months as "Mar" (the year on the first tick and each January); names cut to fit.
  const width = plotWidth || 640;
  const categoryTicks = (() => {
    if (horizontal || !isMonths) return categories.map((_, index) => index);
    const plot = Math.max(0, width - valueLabelWidth - margin - slack);
    return pickTicks(
      categories,
      plot,
      tickGap,
      (index, isFirst) => formatMonthTick(categories[index], isFirst ? 0 : 1),
      measure,
    );
  })();
  const slot = horizontal
    ? labelColumn
    : Math.max(0, (width - valueLabelWidth - margin - slack) / Math.max(1, categories.length) - tickGap);
  const tickLabels = new Map<unknown, string>();
  let previousYear: number | null = null;
  categoryTicks.forEach((index, i) => {
    const value = categories[index];
    const month = parseMonth(value);
    const newYear = month !== null && previousYear !== null && month.year !== previousYear;
    previousYear = month?.year ?? previousYear;
    const text = formatX ? formatX(value) : month ? formatMonthTick(value, i === 0 || newYear ? 0 : 1) : String(value);
    tickLabels.set(value, isMonths && !formatX ? text : truncateText(text, slot, measure));
  });

  const describe = (row: T) =>
    `${longLabel(row[xKey])}: ${series.map((s) => `${s.label} ${formatValue(numberOf(row, s.key))}`).join(', ')}${
      stacked ? `, Total ${formatValue(totalOf(row))}` : ''
    }`;
  const keyboard = useChartKeyboard({
    count: data.length,
    describe: (index) => {
      const row = data[index];
      return row ? describe(row) : '';
    },
    previousKeys: horizontal ? ['ArrowUp'] : ['ArrowLeft'],
    nextKeys: horizontal ? ['ArrowDown'] : ['ArrowRight'],
  });

  // Radius-XS on the free end only: the outer segment of a stack, every bar otherwise.
  const radiusFor = (index: number): [number, number, number, number] => {
    const outer = !stacked || index === series.length - 1;
    if (!outer) return [0, 0, 0, 0];
    return horizontal ? [0, radius, radius, 0] : [radius, radius, 0, 0];
  };

  // The hovered or focused bar: a 2px chart-highlight ring, 2px outside the bar.
  const activeBar = (props: unknown): ReactElement => {
    const bar = props as RectangleProps;
    const x = bar.x ?? 0;
    const y = bar.y ?? 0;
    const w = bar.width ?? 0;
    const h = bar.height ?? 0;
    return (
      <g>
        <Rectangle {...bar} />
        <rect
          x={x - 3}
          y={y - 3}
          width={w + 6}
          height={h + 6}
          rx={radius + 2}
          strokeWidth={2}
          className={styles.ring}
        />
      </g>
    );
  };

  const tooltipContent = (props: {
    active?: boolean;
    payload?: readonly { dataKey?: unknown; value?: unknown }[];
    label?: unknown;
  }) => {
    const { active, payload, label } = props;
    if (!active || !payload || payload.length === 0) return null;
    const items = series.map((s, i) => {
      const item = payload.find((p) => p.dataKey === s.key);
      return {
        name: s.label,
        value: formatValue(Number(item?.value ?? 0)),
        series: (i + 1) as NlChartSeries,
        shape: 'square' as const,
      };
    });
    const total = stacked ? formatValue(payload.reduce((sum, p) => sum + Number(p.value ?? 0), 0)) : undefined;
    return <NlChartTooltip heading={longLabel(label)} items={items} total={total} />;
  };

  const tick = { fill: 'var(--nl-chart-axis-text)', className: styles.text };
  const categoryAxis = {
    dataKey: xDataKey,
    type: 'category' as const,
    ticks: categoryTicks.map((index) => categories[index]) as (string | number)[],
    interval: 0 as const,
    tickFormatter: (value: unknown) => tickLabels.get(value) ?? '',
    tickLine: false,
    tickSize: 0,
    tickMargin: margin,
    axisLine: { stroke: chartColour.axis },
    tick,
  };
  const valueAxis = {
    type: 'number' as const,
    ticks: vTicks,
    interval: 0 as const,
    domain: [0, vTicks.at(-1) ?? 'auto'] as [number, number | 'auto'],
    tickFormatter: (value: number) => formatValue(value),
    axisLine: false,
    tickLine: false,
    tickSize: 0,
    tickMargin: margin,
    tick,
  };

  return (
    <>
      <div
        role="group"
        aria-roledescription="chart"
        aria-label={title}
        aria-describedby={description ? `${id}-description` : undefined}
        tabIndex={0}
        onKeyDown={keyboard.onKeyDown}
        onBlur={keyboard.onBlur}
        className={[styles.root[height], className].filter(Boolean).join(' ')}
        data-chart="bar"
        data-orientation={orientation}
        data-layout={layout}
      >
        <div ref={plotRef} className={styles.plot}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 240 }}>
            <BarChart
              data={data}
              layout={horizontal ? 'vertical' : 'horizontal'}
              accessibilityLayer={false}
              // Recharts puts this gap on each side of a group: 20% + 20%, so a group takes 60% of its slot (OD-260).
              barCategoryGap="20%"
              barGap={barGap}
              margin={{
                top: margin + slack + (values && !horizontal ? lineHeight : 0),
                right: horizontal ? margin + (values ? barLabelWidth + slack : 0) : margin,
                bottom: 0,
                left: 0,
              }}
            >
              <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke={chartColour.grid} />
              {horizontal ? (
                <>
                  <XAxis {...valueAxis} />
                  <YAxis {...categoryAxis} width={labelColumn + margin + slack} />
                </>
              ) : (
                <>
                  <XAxis {...categoryAxis} />
                  <YAxis {...valueAxis} width={valueLabelWidth + margin + slack} />
                </>
              )}
              <Tooltip
                content={tooltipContent}
                cursor={{ fill: 'var(--nl-chart-cursor)' }}
                defaultIndex={keyboard.index ?? undefined}
                active={keyboard.tooltipActive}
                isAnimationActive={!reduced}
                animationDuration={tooltipDuration}
                wrapperStyle={{ zIndex: 'var(--nl-z-tooltip)' }}
              />
              {series.map((s, i) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  fill={seriesColour[i]}
                  stackId={stacked ? 'stack' : undefined}
                  radius={radiusFor(i)}
                  activeBar={activeBar}
                  isAnimationActive={!reduced}
                  animationDuration={drawDuration}
                  animationEasing="ease-out"
                >
                  {values && (
                    <LabelList
                      dataKey={s.key}
                      position={horizontal ? 'right' : 'top'}
                      offset={slack}
                      formatter={(value: unknown) => formatValue(Number(value))}
                      fill="var(--nl-chart-axis-text)"
                      className={styles.text}
                    />
                  )}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {series.length > 1 && (
          <NlChartLegend
            kind="block"
            items={series.map((s, i) => ({ label: s.label, series: (i + 1) as NlChartSeries }))}
          />
        )}
      </div>
      {description && (
        <span id={`${id}-description`} hidden>
          {description}
        </span>
      )}
      <span role="status" className={styles.live}>
        {keyboard.message}
      </span>
    </>
  );
}
