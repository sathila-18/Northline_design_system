'use client';

import { useId, type ReactElement } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { NlChartLegend } from '../NlChartLegend';
import { NlChartMarker, type NlChartSeries } from '../NlChartMarker';
import { NlChartTooltip } from '../NlChartTooltip';
import { formatMonthLong, formatMonthTick, formatNumber, parseMonth } from '../shared/format';
import { useChartKeyboard } from '../shared/keyboard';
import { useElementWidth, useTextMeasure } from '../shared/measure';
import { pickTicks, valueTicks } from '../shared/ticks';
import { chartColour, seriesColour, useReducedMotion, useTokenNumber } from '../shared/tokens';
import * as styles from './NlLineChart.styles';

export interface NlLineChartSeries {
  /** The data key. */
  key: string;
  /** The name in the legend, tooltip and announcements. */
  label: string;
}

export interface NlLineChartProps<T extends Record<string, unknown>> {
  /** The accessible name (required) and the chart's title. */
  title: string;
  /** A one-line summary, read after the name. */
  description?: string;
  /** One row per point in time or category. */
  data: T[];
  /** The x value's key: an ISO month ("2026-03") or date, or a category. */
  xKey: keyof T & string;
  /** 1 to 7 series; colours and shapes follow the order (D9). */
  series: NlLineChartSeries[];
  /** Values on the axis, tooltip and announcements. Default "12,480". */
  formatValue?: (value: number) => string;
  /** The x value as text. Default: months as "Mar" on the axis and "Mar 2026" elsewhere; categories as they are. */
  formatX?: (value: unknown) => string;
  /** Size-240 or Size-320. */
  height?: keyof typeof styles.root;
  /** Placement only. */
  className?: string;
}

/** Points in time are announced and shown like this tooltip heading. */
function headingFor(value: unknown, formatX?: (value: unknown) => string) {
  return formatX ? formatX(value) : formatMonthLong(value);
}

/**
 * One or more series over time (DESIGN.md §9, NlLineChart). Recharts draws it with chart tokens only: 2px lines with
 * NlChartMarker points, a horizontal chart-grid, a time axis with a chart-axis line, axis labels in Data S, an
 * NlChartTooltip, and an NlChartLegend for two or more series. One tab stop (role group, "chart"): Left and Right
 * move between points, Home and End to the ends, Escape hides the tooltip; each step is announced (OD-253, OD-254).
 * Lines draw in over --nl-duration-slow with "ease-out" (OD-255); none under reduced motion. 'use client'.
 */
export function NlLineChart<T extends Record<string, unknown>>({
  title,
  description,
  data,
  xKey,
  series: allSeries,
  formatValue = formatNumber,
  formatX,
  height = '320',
  className,
}: NlLineChartProps<T>) {
  const id = useId();
  const series = allSeries.slice(0, 7);
  const reduced = useReducedMotion();
  const drawDuration = useTokenNumber('--nl-duration-slow', 300);
  const tooltipDuration = useTokenNumber('--nl-duration-base', 200);
  const tickGap = useTokenNumber('--nl-space-xl', 16);
  const margin = useTokenNumber('--nl-space-m', 8);
  const slack = useTokenNumber('--nl-space-xs', 4);
  const marker = useTokenNumber('--nl-size-8', 8);
  const measure = useTextMeasure('--nl-font-data-s', 7);
  const [plotRef, plotWidth] = useElementWidth();

  const xDataKey: string = xKey;
  const isMonths = data.length > 0 && parseMonth(data[0]?.[xKey]) !== null;
  // Five round value ticks from 0; the axis is as wide as its widest label.
  const largest = Math.max(0, ...data.flatMap((row) => series.map((s) => Number(row[s.key] ?? 0))));
  const yTicks = valueTicks(largest);
  const yWidth = Math.ceil(Math.max(...yTicks.map((tick) => measure(formatValue(tick))))) + margin + slack;

  // Time-axis ticks, picked here so each label is measured with its final text (OD-251, OD-252).
  const xValues = data.map((row) => row[xKey]);
  const labelFor = (index: number, isFirst: boolean) => {
    const value = xValues[index];
    if (formatX) return formatX(value);
    return isMonths ? formatMonthTick(value, isFirst ? 0 : 1) : String(value);
  };
  // The last label is centred on the last point at the plot's end, so the end margin holds half of it.
  const lastLabel = xValues.length > 0 ? labelFor(xValues.length - 1, xValues.length === 1) : '';
  const endMargin = Math.max(margin, Math.ceil(measure(lastLabel) / 2) + slack);
  const tickIndices = pickTicks(
    xValues,
    Math.max(0, (plotWidth || 640) - yWidth - endMargin),
    tickGap,
    labelFor,
    measure,
  );
  const tickLabels = new Map<unknown, string>();
  let previousYear: number | null = null;
  tickIndices.forEach((index, i) => {
    const value = xValues[index];
    const month = parseMonth(value);
    // The year on the first tick, every January, and a new year whose January isn't a tick.
    const newYear = month !== null && previousYear !== null && month.year !== previousYear;
    previousYear = month?.year ?? previousYear;
    tickLabels.set(value, newYear && !formatX ? formatMonthTick(value, 0) : labelFor(index, i === 0));
  });
  const tickFormatter = (value: unknown) => tickLabels.get(value) ?? '';

  const describe = (row: T) =>
    `${headingFor(row[xKey], formatX)}: ${series
      .map((s) => `${s.label} ${formatValue(Number(row[s.key] ?? 0))}`)
      .join(', ')}`;

  const keyboard = useChartKeyboard({
    count: data.length,
    describe: (point) => {
      const row = data[point];
      return row ? describe(row) : '';
    },
  });

  const dot = (n: NlChartSeries) =>
    function Dot(props: { cx?: number; cy?: number; index?: number }): ReactElement {
      const { cx = 0, cy = 0, index: point = 0 } = props;
      return (
        <NlChartMarker
          key={`${String(n)}-${String(point)}`}
          series={n}
          x={cx - marker / 2}
          y={cy - marker / 2}
          box={marker}
        />
      );
    };

  const activeDot = (n: NlChartSeries) =>
    function ActiveDot(props: { cx?: number; cy?: number }): ReactElement {
      const { cx = 0, cy = 0 } = props;
      // The ring: 2px of chart-highlight, a 2px gap outside the Size-8 marker.
      return (
        <g>
          <circle cx={cx} cy={cy} r={marker / 2 + 3} strokeWidth={2} className={styles.ring} />
          <NlChartMarker series={n} x={cx - marker / 2} y={cy - marker / 2} box={marker} />
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
    return (
      <NlChartTooltip
        heading={headingFor(label, formatX)}
        items={series.map((s, i) => {
          const item = payload.find((p) => p.dataKey === s.key);
          return { name: s.label, value: formatValue(Number(item?.value ?? 0)), series: (i + 1) as NlChartSeries };
        })}
      />
    );
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
        data-chart="line"
      >
        <div ref={plotRef} className={styles.plot}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 240 }}>
            <LineChart
              data={data}
              accessibilityLayer={false}
              margin={{ top: margin + slack, right: endMargin, bottom: 0, left: 0 }}
            >
              <CartesianGrid vertical={false} stroke={chartColour.grid} />
              <XAxis
                dataKey={xDataKey}
                ticks={tickIndices.map((index) => xValues[index]) as (string | number)[]}
                interval={0}
                tickFormatter={tickFormatter}
                tickLine={false}
                tickSize={0}
                axisLine={{ stroke: chartColour.axis }}
                tick={{ fill: 'var(--nl-chart-axis-text)', className: styles.tick }}
                tickMargin={margin}
              />
              <YAxis
                width={yWidth}
                tickFormatter={(value: number) => formatValue(value)}
                ticks={yTicks}
                interval={0}
                domain={[0, yTicks.at(-1) ?? 'auto']}
                axisLine={false}
                tickLine={false}
                tickSize={0}
                tick={{ fill: 'var(--nl-chart-axis-text)', className: styles.tick }}
                tickMargin={margin}
              />
              <Tooltip
                content={tooltipContent}
                cursor={{ stroke: chartColour.axis, strokeWidth: 1 }}
                defaultIndex={keyboard.index ?? undefined}
                active={keyboard.tooltipActive}
                isAnimationActive={!reduced}
                animationDuration={tooltipDuration}
                wrapperStyle={{ zIndex: 'var(--nl-z-tooltip)' }}
              />
              {series.map((s, i) => {
                const n = (i + 1) as NlChartSeries;
                return (
                  <Line
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    type="linear"
                    stroke={seriesColour[i]}
                    strokeWidth={2}
                    dot={dot(n)}
                    activeDot={activeDot(n)}
                    isAnimationActive={!reduced}
                    animationDuration={drawDuration}
                    animationEasing="ease-out"
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {series.length > 1 && (
          <NlChartLegend
            kind="line"
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
