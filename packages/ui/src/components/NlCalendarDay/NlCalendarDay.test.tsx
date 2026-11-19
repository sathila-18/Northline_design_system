import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlCalendarDay } from './NlCalendarDay';

const base = { day: 3, date: '2027-03-03', label: 'Wednesday 3 March' };
const inRow = (children: ReactNode) => (
  <div role="grid">
    <div role="row">{children}</div>
  </div>
);
const day = () => screen.getByRole('button', { name: 'Wednesday 3 March' });
const cell = () => screen.getByRole('gridcell');

describe('NlCalendarDay', () => {
  it('is a gridcell holding a native button named by the full date, showing the number', () => {
    render(inRow(<NlCalendarDay {...base} />));
    expect(day()).toHaveTextContent('3');
    expect(day()).toHaveAttribute('type', 'button');
    expect(cell()).toHaveAttribute('data-type', 'default');
    expect(cell()).not.toHaveAttribute('aria-selected');
    expect(cell()).toHaveClass('nl:size-40');
    expect(day()).toHaveClass('nl:size-40', 'nl:rounded-s', 'nl:text-body-m', 'nl:text-primary');
    expect(day()).toHaveClass('nl:focus-visible:outline-2', 'nl:focus-visible:outline-focused');
  });

  it('calls onSelect with the date on click, Enter and Space', async () => {
    const onSelect = vi.fn();
    render(inRow(<NlCalendarDay {...base} onSelect={onSelect} />));
    await userEvent.click(day());
    day().focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onSelect).toHaveBeenCalledTimes(3);
    expect(onSelect).toHaveBeenCalledWith('2027-03-03');
  });

  it.each(['selected', 'range-start', 'range-middle', 'range-end'] as const)(
    '%s is announced as selected on the cell',
    (type) => {
      render(inRow(<NlCalendarDay {...base} type={type} />));
      expect(cell()).toHaveAttribute('aria-selected', 'true');
    },
  );

  it.each([
    ['range-start', 'nl:rounded-s-s'],
    ['range-middle', 'nl:bg-active'],
    ['range-end', 'nl:rounded-e-s'],
  ] as const)('%s draws the band on the cell', (type, cls) => {
    render(inRow(<NlCalendarDay {...base} type={type} />));
    expect(cell()).toHaveClass('nl:bg-active', cls);
  });

  it.each(['selected', 'range-start', 'range-end'] as const)('%s fills the day with action-primary', (type) => {
    render(inRow(<NlCalendarDay {...base} type={type} />));
    expect(day()).toHaveClass(
      'nl:bg-action-primary',
      'nl:text-white-both',
      'nl:enabled:hover:bg-action-primary-hovered',
    );
  });

  it('outside uses text-tertiary', () => {
    render(inRow(<NlCalendarDay {...base} type="outside" />));
    expect(day()).toHaveClass('nl:text-tertiary', 'nl:enabled:hover:bg-secondary');
  });

  it('disabled: aria-disabled, still focusable, never selects, no state colours', async () => {
    const onSelect = vi.fn();
    render(inRow(<NlCalendarDay {...base} type="disabled" onSelect={onSelect} />));
    expect(day()).toHaveAttribute('aria-disabled', 'true');
    expect(day()).not.toBeDisabled();
    day().focus();
    expect(day()).toHaveFocus();
    await userEvent.click(day());
    await userEvent.keyboard('{Enter}');
    expect(onSelect).not.toHaveBeenCalled();
    expect(day()).toHaveClass('nl:text-disabled');
    expect(day().className).not.toMatch(/hover:/);
  });

  it('today: aria-current="date" and a border-strong ring', () => {
    render(inRow(<NlCalendarDay {...base} today />));
    expect(day()).toHaveAttribute('aria-current', 'date');
    expect(day()).toHaveClass('nl:inset-ring', 'nl:inset-ring-strong');
    expect(cell()).toHaveAttribute('data-today', 'true');
  });

  it.each(['selected', 'range-start', 'range-end'] as const)('today on %s has no border', (type) => {
    render(inRow(<NlCalendarDay {...base} type={type} today />));
    expect(day()).toHaveAttribute('aria-current', 'date');
    expect(day()).not.toHaveClass('nl:inset-ring');
  });

  it.each(['outside', 'range-middle'] as const)('today on %s keeps the border', (type) => {
    render(inRow(<NlCalendarDay {...base} type={type} today />));
    expect(day()).toHaveClass('nl:inset-ring-strong');
  });

  it('today on a disabled day uses border-disabled', () => {
    render(inRow(<NlCalendarDay {...base} type="disabled" today />));
    expect(day()).toHaveClass('nl:inset-ring', 'nl:inset-ring-disabled');
  });

  it('passes ref, tabIndex and key handlers for the roving focus, and its own onClick', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onKeyDown = vi.fn();
    const onClick = vi.fn();
    render(inRow(<NlCalendarDay {...base} ref={ref} tabIndex={-1} onKeyDown={onKeyDown} onClick={onClick} />));
    expect(ref.current).toBe(day());
    expect(day()).toHaveAttribute('tabindex', '-1');
    day().focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onKeyDown).toHaveBeenCalled();
    await userEvent.click(day());
    expect(onClick).toHaveBeenCalled();
  });
});
