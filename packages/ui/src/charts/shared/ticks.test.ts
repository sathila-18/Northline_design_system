import { describe, expect, it } from 'vitest';
import { monthTickLabel, pickTicks, tickLabelMap, truncateText, valueTicks } from './ticks';

const months = Array.from(
  { length: 15 },
  (_, i) => `${String(2026 + Math.floor(i / 12))}-${String((i % 12) + 1).padStart(2, '0')}`,
);
const label = monthTickLabel(months);
const measure = (text: string) => text.length * 7;

describe('pickTicks', () => {
  it('every month when there is room; first and last always shown', () => {
    expect(pickTicks(months, 2000, 16, label, measure)).toEqual(months.map((_, i) => i));
  });

  it('narrower: a step aligned to January, so every January is a tick, plus the first and last', () => {
    const ticks = pickTicks(months, 400, 16, label, measure);
    expect(ticks[0]).toBe(0);
    expect(ticks.at(-1)).toBe(14);
    expect(ticks).toContain(12); // Jan 2027
    expect(ticks.length).toBeLessThan(15);
  });

  it('very narrow: just the ends', () => {
    expect(pickTicks(months, 60, 16, label, measure)).toEqual([0, 14]);
  });

  it('categories thin the same way', () => {
    const categories = ['Reward X', 'Track day voucher', 'Event pass', 'Tier 2 bonus'];
    const ticks = pickTicks(categories, 2000, 16, monthTickLabel(categories), measure);
    expect(ticks).toEqual([0, 1, 2, 3]);
  });
});

describe('pickTicks with a December start (Dec 2025 to Nov 2026)', () => {
  const year = ['2025-12', ...Array.from({ length: 11 }, (_, i) => `2026-${String(i + 1).padStart(2, '0')}`)];
  const yearLabel = monthTickLabel(year);

  it('a narrow chart keeps months between the ends: the crowded January goes, not the whole row', () => {
    for (const layout of ['point', 'band'] as const) {
      const ticks = pickTicks(year, 400, 16, yearLabel, measure, layout);
      expect(ticks[0]).toBe(0);
      expect(ticks.at(-1)).toBe(11);
      expect(ticks.length).toBeGreaterThan(2);
    }
  });

  it('labels are month names only, with no year (OD-252, 25 Nov 2026)', () => {
    expect([...tickLabelMap(year, [0, 1, 5, 11], yearLabel).values()]).toEqual(['Dec', 'Jan', 'May', 'Nov']);
  });
});

describe('valueTicks', () => {
  it('five round ticks from 0 that cover the largest value', () => {
    expect(valueTicks(1730)).toEqual([0, 500, 1000, 1500, 2000]);
    expect(valueTicks(77)).toEqual([0, 20, 40, 60, 80]);
    expect(valueTicks(806400)).toEqual([0, 250000, 500000, 750000, 1000000]);
    expect(valueTicks(3)).toEqual([0, 1, 2, 3, 4]);
    expect(valueTicks(0)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('truncateText', () => {
  it('leaves short text, cuts long text with an ellipsis to fit', () => {
    expect(truncateText('Reward X', 120, measure)).toBe('Reward X');
    const cut = truncateText('Track day voucher for every tier', 120, measure);
    expect(cut.endsWith('…')).toBe(true);
    expect(measure(cut)).toBeLessThanOrEqual(120);
  });
});
