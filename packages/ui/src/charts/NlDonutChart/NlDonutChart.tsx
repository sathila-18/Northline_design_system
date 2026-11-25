'use client';

import { useId, useState, type ReactElement } from 'react';
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip, type PieSectorShapeProps } from 'recharts';
import { NlChartLegend } from '../NlChartLegend';
import type { NlChartSeries } from '../NlChartMarker';
import { NlChartTooltip } from '../NlChartTooltip';
import { formatNumber } from '../shared/format';
import { useChartKeyboard } from '../shared/keyboard';
import { useElementWidth } from '../shared/measure';
import { seriesColour, useReducedMotion, useTokenNumber } from '../shared/tokens';
import * as styles from './NlDonutChart.styles';

export interface NlDonutChartSlice {
  key: string;
  label: string;
  value: number;
}

export type NlDonutChartLegendPosition = 'end' | 'below';

export interface NlDonutChartProps {
  /** The accessible name (required) and the chart's title. */
  title: string;
  /** A one-line summary, read after the name. */
  description?: string;
  /** The parts of the whole. Above 5, the largest 4 show and the rest become "Other", last. */
  data: NlDonutChartSlice[];
  /** Largest first (default) or the data order (members by tier keeps Bronze, Silver, Gold, Platinum). */
  sortBy?: 'value' | 'data';
  /** The centre label under the total. Default "Total". */
  totalLabel?: string;
  /** Values in the centre, legend, tooltip and announcements. Default "12,480". */
  formatValue?: (value: number) => string;
  /** Legend beside the ring or below it. Default: beside from Size-560 wide, below when narrower. */
  legendPosition?: NlDonutChartLegendPosition;
  /** Size-240 or Size-320. */
  height?: keyof typeof styles.root;
  /** Placement only. */
  className?: string;
}

/** Whole percentages that add up to 100 (largest remainder). */
export function shares(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return values.map(() => 0);
  const exact = values.map((value) => (value / total) * 100);
  const result = exact.map(Math.floor);
  const left = 100 - result.reduce((sum, value) => sum + value, 0);
  const order = exact
    .map((value, index) => ({ index, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest);
  for (let i = 0; i < left; i += 1) {
    const target = order[i]?.index;
    if (target !== undefined) result[target] = (result[target] ?? 0) + 1;
  }
  return result;
}

/** At most 5 slices: above 5, the largest 4 (kept in the chosen order) and "Other" with the rest, last. */
export function toSlices(data: NlDonutChartSlice[], sortBy: 'value' | 'data'): NlDonutChartSlice[] {
  const ordered = sortBy === 'value' ? [...data].sort((a, b) => b.value - a.value) : data;
  if (ordered.length <= 5) return ordered;
  const largest = new Set(
    [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, 4)
      .map((slice) => slice.key),
  );
  const kept = ordered.filter((slice) => largest.has(slice.key));
  const rest = ordered.filter((slice) => !largest.has(slice.key)).reduce((sum, slice) => sum + slice.value, 0);
  return [...kept, { key: '\u0000other', label: 'Other', value: rest }];
}

/**
 * Parts of a whole, up to 5 slices (DESIGN.md §9, NlDonutChart). A ring a quarter of its radius wide, starting at 12
 * o'clock and going clockwise, with true gaps between slices (about 2px, designer 24 Nov 2026); the total (Data L) and
 * its label in the centre; NlChartLegend with each slice's value and share, beside the ring from Size-560 wide or below
 * it (designer, 24 Nov 2026). The hovered or focused slice moves out by Space-XS; hover dims the other slices to 40%
 * and keyboard focus adds a chart-highlight ring (OD-261); the
 * NlChartTooltip shows its value and share. One tab stop (role group, "chart"): the arrow keys, Home, End, Escape;
 * each step announced. Slices sweep in over --nl-duration-slow with "ease-out"; none under reduced motion. 'use client'.
 */
export function NlDonutChart({
  title,
  description,
  data,
  sortBy = 'value',
  totalLabel = 'Total',
  formatValue = formatNumber,
  legendPosition,
  height = '320',
  className,
}: NlDonutChartProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const drawDuration = useTokenNumber('--nl-duration-slow', 300);
  const tooltipDuration = useTokenNumber('--nl-duration-base', 200);
  const pull = useTokenNumber('--nl-space-xs', 4);
  const wide = useTokenNumber('--nl-size-560', 560);
  const chartHeight = useTokenNumber(
    height === '240' ? '--nl-size-240' : '--nl-size-320',
    height === '240' ? 240 : 320,
  );
  const [rootRef, rootWidth] = useElementWidth();
  // The slice under the pointer, or null. Only hover dims the other slices (OD-261).
  const [hovered, setHovered] = useState<number | null>(null);

  const slices = toSlices(data, sortBy);
  const percent = shares(slices.map((slice) => slice.value));
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const position: NlDonutChartLegendPosition = legendPosition ?? ((rootWidth || wide) >= wide ? 'end' : 'below');

  // The ring: outer radius 90% (room for the pulled-out slice and its ring), a quarter of the radius wide. The gap
  // between slices is about 2px at the middle of the ring, as an angle (none for a single slice).
  const outer = (chartHeight / 2) * 0.9;
  const middle = outer * 0.875;
  const gapAngle = slices.length > 1 ? (2 / middle) * (180 / Math.PI) : 0;

  const shareText = (index: number) => `${formatValue(slices[index]?.value ?? 0)} · ${String(percent[index] ?? 0)}%`;
  const keyboard = useChartKeyboard({
    count: slices.length,
    describe: (index) =>
      `${slices[index]?.label ?? ''}: ${formatValue(slices[index]?.value ?? 0)}, ${String(percent[index] ?? 0)}%`,
    previousKeys: ['ArrowLeft', 'ArrowUp'],
    nextKeys: ['ArrowRight', 'ArrowDown'],
  });

  // Each slice. The hovered or focused one sits Space-XS further out. While a slice is hovered the others dim; the
  // 2px chart-highlight ring shows only for the keyboard-focused slice (OD-261).
  const shape = (props: PieSectorShapeProps): ReactElement => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, isActive, index } = props;
    if (!isActive) {
      return (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className={hovered !== null && hovered !== index ? styles.slice.dimmed : styles.slice.resting}
        />
      );
    }
    const focused = keyboard.index === index;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + pull}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className={styles.slice.resting}
        />
        {focused ? (
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={Math.max(0, innerRadius - 3)}
            outerRadius={outerRadius + pull + 3}
            startAngle={startAngle}
            endAngle={endAngle}
            strokeWidth={2}
            className={styles.highlight}
          />
        ) : null}
      </g>
    );
  };

  const tooltipContent = (props: { active?: boolean; payload?: readonly { name?: unknown }[] }) => {
    const { active, payload } = props;
    if (!active || !payload || payload.length === 0) return null;
    const index = slices.findIndex((slice) => slice.label === payload[0]?.name);
    const slice = slices[index];
    if (!slice) return null;
    return (
      <NlChartTooltip
        heading={slice.label}
        items={[{ name: slice.label, value: shareText(index), series: (index + 1) as NlChartSeries, shape: 'square' }]}
      />
    );
  };

  return (
    <>
      <div
        ref={rootRef}
        role="group"
        aria-roledescription="chart"
        aria-label={title}
        aria-describedby={`${id}-description`}
        tabIndex={0}
        onKeyDown={keyboard.onKeyDown}
        onBlur={keyboard.onBlur}
        onMouseLeave={() => {
          setHovered(null);
        }}
        className={[styles.root[height], className].filter(Boolean).join(' ')}
        data-chart="donut"
        data-legend={position}
      >
        <div className={styles.body[position]}>
          <div className={styles.ring[position]}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 240, height: 240 }}>
              <PieChart accessibilityLayer={false}>
                <Tooltip
                  content={tooltipContent}
                  defaultIndex={keyboard.index ?? undefined}
                  active={keyboard.tooltipActive}
                  isAnimationActive={!reduced}
                  animationDuration={tooltipDuration}
                  wrapperStyle={{ zIndex: 'var(--nl-z-tooltip)' }}
                />
                <Pie
                  data={slices.map((slice, index) => ({ ...slice, fill: seriesColour[index] }))}
                  dataKey="value"
                  nameKey="label"
                  startAngle={90}
                  endAngle={-270}
                  outerRadius="90%"
                  innerRadius="67.5%"
                  paddingAngle={gapAngle}
                  stroke="none"
                  shape={shape}
                  onMouseEnter={(_, index) => {
                    setHovered(index);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                  }}
                  isAnimationActive={!reduced}
                  animationDuration={drawDuration}
                  animationEasing="ease-out"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.centre} aria-hidden="true">
              <p className={styles.total}>{formatValue(total)}</p>
              <p className={styles.totalLabel}>{totalLabel}</p>
            </div>
          </div>
          <NlChartLegend
            kind="block"
            position={position}
            className={styles.legend}
            items={slices.map((slice, index) => ({
              label: slice.label,
              series: (index + 1) as NlChartSeries,
              value: shareText(index),
            }))}
          />
        </div>
      </div>
      <span id={`${id}-description`} hidden>
        {[description, `${totalLabel}: ${formatValue(total)}`].filter(Boolean).join('. ')}
      </span>
      <span role="status" className={styles.live}>
        {keyboard.message}
      </span>
    </>
  );
}
