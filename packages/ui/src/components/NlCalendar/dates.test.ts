import { describe, expect, it } from 'vitest';
import { addDays, addMonths, dateLabel, daysInMonth, defaultNames, monthGrid, sameDayIn, startOfWeek } from './dates';

describe('NlCalendar dates', () => {
  it('adds days and months across year ends', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-03-01', -1)).toBe('2027-02-28');
    expect(addMonths('2026-12', 1)).toBe('2027-01');
    expect(addMonths('2027-01', -13)).toBe('2025-12');
  });

  it('knows month lengths, leap years included', () => {
    expect(daysInMonth('2027-02')).toBe(28);
    expect(daysInMonth('2028-02')).toBe(29);
    expect(sameDayIn('2028-01-31', '2028-02')).toBe('2028-02-29');
  });

  it('builds 6 weeks from the week start', () => {
    const grid = monthGrid('2027-03', 1);
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe('2027-03-01');
    expect(monthGrid('2027-03', 0)[0]).toBe('2027-02-28');
    expect(startOfWeek('2027-03-17', 1)).toBe('2027-03-15');
  });

  it('names a date in full', () => {
    expect(dateLabel('2027-03-17', defaultNames)).toBe('Wednesday 17 March 2027');
  });
});
