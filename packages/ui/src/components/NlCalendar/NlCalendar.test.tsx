import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlCalendar, type NlCalendarRange } from './NlCalendar';

const day = (name: string) => screen.getByRole('button', { name });
const cellOf = (name: string) => day(name).closest('[role="gridcell"]');

describe('NlCalendar', () => {
  it('shows one month as a grid labelled by its title, 6 weeks, Monday first, with full weekday names', () => {
    render(<NlCalendar today="2027-03-17" />);
    const grid = screen.getByRole('grid', { name: 'March 2027' });
    const rows = within(grid).getAllByRole('row');
    expect(rows).toHaveLength(7);
    const headers = within(grid).getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent)).toEqual([
      'MoMonday',
      'TuTuesday',
      'WeWednesday',
      'ThThursday',
      'FrFriday',
      'SaSaturday',
      'SuSunday',
    ]);
    expect(within(grid).getAllByRole('gridcell')).toHaveLength(42);
    expect(screen.getByText('March 2027')).toHaveAttribute('aria-live', 'polite');
  });

  it('marks today, and days of other months as outside', () => {
    render(<NlCalendar today="2027-03-17" />);
    expect(day('Wednesday 17 March 2027')).toHaveAttribute('aria-current', 'date');
    expect(cellOf('Thursday 1 April 2027')).toHaveAttribute('data-type', 'outside');
  });

  it('starts weeks on Sunday when asked', () => {
    render(<NlCalendar today="2027-03-17" weekStartsOn={0} />);
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Sunday');
  });

  it('single: selects a day, calls onValueChange, and the day shows selected', async () => {
    const onValueChange = vi.fn();
    render(<NlCalendar today="2027-03-17" onValueChange={onValueChange} />);
    await userEvent.click(day('Tuesday 9 March 2027'));
    expect(onValueChange).toHaveBeenCalledWith('2027-03-09');
    expect(cellOf('Tuesday 9 March 2027')).toHaveAttribute('aria-selected', 'true');
  });

  it('single: picking an outside day selects it and moves to its month', async () => {
    const onMonthChange = vi.fn();
    render(<NlCalendar today="2027-03-17" onMonthChange={onMonthChange} />);
    await userEvent.click(day('Thursday 1 April 2027'));
    expect(onMonthChange).toHaveBeenCalledWith('2027-04');
    expect(screen.getByRole('grid', { name: 'April 2027' })).toBeInTheDocument();
  });

  it('previous and next change the month', async () => {
    render(<NlCalendar today="2027-03-17" />);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'April 2027' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'February 2027' })).toBeInTheDocument();
  });

  it('is one tab stop: the selected day, else today', async () => {
    const { unmount } = render(<NlCalendar today="2027-03-17" defaultValue="2027-03-09" />);
    const tabbable = screen.getAllByRole('button').filter((b) => b.getAttribute('tabindex') === '0');
    expect(tabbable.map((b) => b.getAttribute('aria-label'))).toEqual(['Tuesday 9 March 2027']);
    unmount();
    render(<NlCalendar today="2027-03-17" />);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(day('Wednesday 17 March 2027')).toHaveFocus();
  });

  it('arrows move a day or a week, Home and End to the week ends', async () => {
    render(<NlCalendar today="2027-03-17" />);
    act(() => {
      day('Wednesday 17 March 2027').focus();
    });
    await userEvent.keyboard('{ArrowRight}');
    expect(day('Thursday 18 March 2027')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(day('Thursday 25 March 2027')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}{ArrowUp}');
    expect(day('Wednesday 17 March 2027')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(day('Monday 15 March 2027')).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(day('Sunday 21 March 2027')).toHaveFocus();
  });

  it('arrows cross into the next month, and Page Up / Down move a month or (Shift) a year', async () => {
    render(<NlCalendar today="2027-03-31" />);
    act(() => {
      day('Wednesday 31 March 2027').focus();
    });
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('grid', { name: 'April 2027' })).toBeInTheDocument();
    expect(day('Thursday 1 April 2027')).toHaveFocus();
    await userEvent.keyboard('{PageUp}');
    expect(screen.getByRole('grid', { name: 'March 2027' })).toBeInTheDocument();
    expect(day('Monday 1 March 2027')).toHaveFocus();
    await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
    expect(day('Wednesday 1 March 2028')).toHaveFocus();
  });

  it('Page Down clamps to the shorter month (31 January → 28 February)', async () => {
    render(<NlCalendar today="2027-01-31" />);
    act(() => {
      day('Sunday 31 January 2027').focus();
    });
    await userEvent.keyboard('{PageDown}');
    expect(day('Sunday 28 February 2027')).toHaveFocus();
  });

  it('Enter and Space select the focused day', async () => {
    const onValueChange = vi.fn();
    render(<NlCalendar today="2027-03-17" onValueChange={onValueChange} />);
    act(() => {
      day('Wednesday 17 March 2027').focus();
    });
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('2027-03-18');
    await userEvent.keyboard('{ArrowRight} ');
    expect(onValueChange).toHaveBeenLastCalledWith('2027-03-19');
  });

  it('limits and isDateDisabled: unavailable days are reachable, named, and never select', async () => {
    const onValueChange = vi.fn();
    render(
      <NlCalendar
        today="2027-03-17"
        minDate="2027-03-05"
        maxDate="2027-03-26"
        isDateDisabled={(d) => d === '2027-03-10'}
        onValueChange={onValueChange}
      />,
    );
    const early = day('Thursday 4 March 2027, unavailable');
    expect(early).toHaveAttribute('aria-disabled', 'true');
    expect(day('Wednesday 10 March 2027, unavailable')).toHaveAttribute('aria-disabled', 'true');
    expect(day('Saturday 27 March 2027, unavailable')).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(early);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
  });

  it('range: two months; the left has only previous, the right only next; other months stay empty', () => {
    render(<NlCalendar mode="range" today="2027-03-17" />);
    expect(screen.getByRole('grid', { name: 'March 2027' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'April 2027' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Previous month' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Next month' })).toHaveLength(1);
    const march = screen.getByRole('grid', { name: 'March 2027' });
    expect(within(march).queryByRole('button', { name: 'Thursday 1 April 2027' })).toBeNull();
  });

  it('range: first pick sets the start, the second the end; the band joins them', async () => {
    const onValueChange = vi.fn();
    render(<NlCalendar mode="range" today="2027-03-17" onValueChange={onValueChange} />);
    await userEvent.click(day('Wednesday 24 March 2027'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2027-03-24', end: null });
    await userEvent.click(day('Tuesday 6 April 2027'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2027-03-24', end: '2027-04-06' });
    expect(cellOf('Wednesday 24 March 2027')).toHaveAttribute('data-type', 'range-start');
    expect(cellOf('Wednesday 31 March 2027')).toHaveAttribute('data-type', 'range-middle');
    expect(cellOf('Tuesday 6 April 2027')).toHaveAttribute('data-type', 'range-end');
  });

  it('range: a day before the start restarts the range; the same day twice is one selected day', async () => {
    const onValueChange = vi.fn();
    render(<NlCalendar mode="range" today="2027-03-17" onValueChange={onValueChange} />);
    await userEvent.click(day('Wednesday 24 March 2027'));
    await userEvent.click(day('Monday 15 March 2027'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2027-03-15', end: null });
    await userEvent.click(day('Monday 15 March 2027'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2027-03-15', end: '2027-03-15' });
    expect(cellOf('Monday 15 March 2027')).toHaveAttribute('data-type', 'selected');
  });

  it('range: hovering while the end is open previews the range', async () => {
    render(<NlCalendar mode="range" today="2027-03-17" defaultValue={{ start: '2027-03-10', end: null }} />);
    await userEvent.hover(day('Saturday 13 March 2027'));
    expect(cellOf('Wednesday 10 March 2027')).toHaveAttribute('data-type', 'range-start');
    expect(cellOf('Thursday 11 March 2027')).toHaveAttribute('data-type', 'range-middle');
    expect(cellOf('Saturday 13 March 2027')).toHaveAttribute('data-type', 'range-middle');
    expect(cellOf('Sunday 14 March 2027')).toHaveAttribute('data-type', 'default');
  });

  it('controlled: follows value and month from the parent', async () => {
    function Controlled() {
      const [value, setValue] = useState<NlCalendarRange>({ start: null, end: null });
      const [month, setMonth] = useState('2027-03');
      return (
        <NlCalendar
          mode="range"
          today="2027-03-17"
          value={value}
          onValueChange={setValue}
          month={month}
          onMonthChange={setMonth}
        />
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'April 2027' })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'May 2027' })).toBeInTheDocument();
    await userEvent.click(day('Monday 5 April 2027'));
    expect(cellOf('Monday 5 April 2027')).toHaveAttribute('aria-selected', 'true');
  });

  it('without a today prop, finds today in the browser and opens on its month', () => {
    vi.useFakeTimers({ now: new Date(2027, 5, 9, 12) });
    render(<NlCalendar />);
    expect(screen.getByRole('grid', { name: 'June 2027' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wednesday 9 June 2027' })).toHaveAttribute('aria-current', 'date');
    vi.useRealTimers();
  });

  it('takes its own names', () => {
    const names = {
      months: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
      weekdays: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
      weekdaysShort: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6'],
    };
    render(<NlCalendar today="2027-03-17" names={names} />);
    expect(screen.getByRole('grid', { name: 'M3 2027' })).toBeInTheDocument();
    expect(day('D3 17 M3 2027')).toBeInTheDocument();
  });
});
