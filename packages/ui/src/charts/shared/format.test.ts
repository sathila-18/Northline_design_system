import { describe, expect, it } from 'vitest';
import { formatMonthLong, formatMonthTick, formatNumber, parseMonth } from './format';

describe('chart formatting', () => {
  it('whole numbers with commas, no locale formatting', () => {
    expect(formatNumber(12480)).toBe('12,480');
    expect(formatNumber(806400.4)).toBe('806,400');
    expect(formatNumber(-1250)).toBe('-1,250');
    expect(formatNumber(0)).toBe('0');
  });

  it('months: "Mar" on the axis, the year on the first tick and every January (OD-252)', () => {
    expect(formatMonthTick('2026-03', 0)).toBe('Mar 2026');
    expect(formatMonthTick('2026-04', 1)).toBe('Apr');
    expect(formatMonthTick('2027-01', 9)).toBe('Jan 2027');
    expect(formatMonthLong('2026-03-15')).toBe('Mar 2026');
  });

  it('anything else passes through', () => {
    expect(parseMonth('Track day voucher')).toBeNull();
    expect(parseMonth('2026-13')).toBeNull();
    expect(formatMonthTick('Reward X', 0)).toBe('Reward X');
  });
});
