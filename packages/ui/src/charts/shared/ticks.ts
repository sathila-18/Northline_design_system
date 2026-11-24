// Time-axis ticks for charts (DESIGN.md §9, Charts: shared rules; OD-251, OD-252). The chart picks the month ticks
// itself, so every label is measured with the text it is drawn with: a step of 1, 2, 3, 4, 6 or 12 months, aligned to
// January, plus the first and last points; the smallest step whose labels keep `gap` apart wins. A tick that crowds the
// first or the last one is dropped instead (a December start puts "Dec 2025" right next to "Jan 2026").

import { formatMonthTick, parseMonth } from './format';

const steps = [1, 2, 3, 4, 6, 12];

/**
 * Where a value's label is centred, over `width`: points spread end to end (line charts) or the middle of equal bands
 * (bar charts).
 */
function positionOf(index: number, count: number, width: number, layout: 'point' | 'band') {
  if (layout === 'band') return ((index + 0.5) / Math.max(1, count)) * width;
  return count <= 1 ? 0 : (index / (count - 1)) * width;
}

/**
 * A tick's text: months as the short month name, "Mar", with no year on the axis (OD-252, changed by the designer 25
 * Nov 2026; the tooltip and table show "Mar 2026"). Other values as text.
 */
export function monthTickLabel(values: readonly unknown[]) {
  return (index: number): string => formatMonthTick(values[index]);
}

/**
 * The indices of the values that get a tick. `label(index, previous)` gives a tick's text (it can depend on the tick
 * before it); `measure` its width in px. Non-month values: every value, thinned by the same spacing rule.
 */
export function pickTicks(
  values: readonly unknown[],
  width: number,
  gap: number,
  label: (index: number, previous: number | null) => string,
  measure: (text: string) => number,
  layout: 'point' | 'band' = 'point',
): number[] {
  const count = values.length;
  if (count === 0) return [];
  const last = count - 1;
  const months = values.map((value) => parseMonth(value));
  const at = (index: number) => positionOf(index, count, width, layout);
  // Whether ticks `a` then `b` keep `gap` apart, given the tick before `a` (for its label).
  const pairFits = (before: number | null, a: number, b: number) =>
    at(b) - at(a) >= (measure(label(a, before)) + measure(label(b, a))) / 2 + gap;
  const fits = (indices: number[]) =>
    indices.every((index, i) => {
      if (i === 0) return true;
      const a = indices[i - 1] ?? 0;
      return pairFits(i >= 2 ? (indices[i - 2] ?? null) : null, a, index);
    });

  for (const step of steps) {
    const aligned = values
      .map((_, index) => index)
      .filter((index) => {
        const month = months[index];
        return month ? (month.month - 1) % step === 0 : index % step === 0;
      });
    const chosen = [...new Set([0, ...aligned, last])].sort((a, b) => a - b);
    // The first and last always show; a tick that crowds either of them goes instead.
    const second = chosen[1];
    if (chosen.length > 2 && second !== undefined && !pairFits(null, 0, second)) chosen.splice(1, 1);
    const end = chosen.length;
    const beforeLast = chosen[end - 2];
    if (end > 2 && beforeLast !== undefined && !pairFits(chosen[end - 3] ?? null, beforeLast, last)) {
      chosen.splice(end - 2, 1);
    }
    if (fits(chosen)) return chosen;
  }
  return count > 1 ? [0, last] : [0];
}

/** The tick labels for the drawn ticks, in order (each knows the tick before it). */
export function tickLabelMap(
  values: readonly unknown[],
  ticks: readonly number[],
  label: (index: number, previous: number | null) => string,
): Map<unknown, string> {
  const map = new Map<unknown, string>();
  ticks.forEach((index, i) => {
    map.set(values[index], label(index, i === 0 ? null : (ticks[i - 1] ?? null)));
  });
  return map;
}

/**
 * Five value-axis ticks from 0 on a round step (1, 2, 2.5 or 5 × a power of ten) that covers `largest` (OD-251).
 * 1,730 → 0, 500, 1,000, 1,500, 2,000.
 */
export function valueTicks(largest: number): number[] {
  if (!(largest > 0)) return [0, 1, 2, 3, 4];
  const rough = largest / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((candidate) => candidate >= rough) ?? 10 * power;
  // Whole steps only: the axis shows whole numbers.
  const whole = Math.max(1, Math.ceil(step));
  return [0, 1, 2, 3, 4].map((i) => i * whole);
}

/** Cuts `text` with an ellipsis so it measures at most `max` px (axis labels, shared rules). The full text is in the
 * tooltip and the table view. */
export function truncateText(text: string, max: number, measure: (text: string) => number): string {
  if (measure(text) <= max) return text;
  let end = text.length;
  while (end > 1 && measure(`${text.slice(0, end).trimEnd()}…`) > max) end -= 1;
  return `${text.slice(0, end).trimEnd()}…`;
}
