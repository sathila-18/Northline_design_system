// Time-axis ticks for charts (DESIGN.md §9, Charts: shared rules; OD-251, OD-252). The chart picks the month ticks
// itself, so labels are measured once with their final text: a step of 1, 2, 3, 4, 6 or 12 months, aligned to
// January (so every January is a tick and carries its year), plus the first and last points; the smallest step whose
// labels keep `gap` apart wins.

import { parseMonth } from './format';

const steps = [1, 2, 3, 4, 6, 12];

/** Positions of `count` points spread evenly over `width`, as the line chart's x scale does. */
const positionOf = (index: number, count: number, width: number) => (count <= 1 ? 0 : (index / (count - 1)) * width);

/**
 * The indices of the points that get a tick. `label(index, isFirst)` gives a tick's text; `measure` its width in px.
 * Non-month values: every point, thinned by the same spacing rule.
 */
export function pickTicks(
  values: readonly unknown[],
  width: number,
  gap: number,
  label: (index: number, isFirst: boolean) => string,
  measure: (text: string) => number,
): number[] {
  const count = values.length;
  if (count === 0) return [];
  const last = count - 1;
  const months = values.map((value) => parseMonth(value));
  const fits = (indices: number[]) =>
    indices.every((index, i) => {
      if (i === 0) return true;
      const previous = indices[i - 1] ?? 0;
      const room = positionOf(index, count, width) - positionOf(previous, count, width);
      return room >= (measure(label(previous, i - 1 === 0)) + measure(label(index, false))) / 2 + gap;
    });

  for (const step of steps) {
    const aligned = values
      .map((_, index) => index)
      .filter((index) => {
        const month = months[index];
        return month ? (month.month - 1) % step === 0 : index % step === 0;
      });
    const chosen = [...new Set([0, ...aligned, last])].sort((a, b) => a - b);
    // The last point always shows; if it crowds the tick before it, that tick goes (never the first).
    if (chosen.length > 2 && !fits(chosen.slice(-2))) chosen.splice(chosen.length - 2, 1);
    if (fits(chosen)) return chosen;
  }
  return count > 1 ? [0, last] : [0];
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
