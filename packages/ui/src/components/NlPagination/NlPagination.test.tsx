import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlPagination } from './NlPagination';
import { paginationEntries } from './pages';

const shape = (page: number, count: number, siblings = 1) =>
  paginationEntries(page, count, siblings)
    .map((entry) => (entry.kind === 'page' ? String(entry.page) : '…'))
    .join(' ');

describe('paginationEntries', () => {
  it('first, last, current ±siblings; one-page gaps show the page (OD-182)', () => {
    expect(shape(1, 5)).toBe('1 2 3 4 5');
    expect(shape(1, 7)).toBe('1 2 3 4 5 6 7');
    expect(shape(1, 8)).toBe('1 2 … 8');
    expect(shape(4, 10)).toBe('1 2 3 4 5 … 10');
    expect(shape(5, 10)).toBe('1 … 4 5 6 … 10');
    expect(shape(10, 10)).toBe('1 … 9 10');
    expect(shape(1, 10)).toBe('1 2 … 10');
    expect(shape(12, 24, 2)).toBe('1 … 10 11 12 13 14 … 24');
    expect(shape(1, 1)).toBe('1');
  });

  it('clamps an out-of-range page (OD-183)', () => {
    expect(shape(99, 5)).toBe('1 2 3 4 5');
    expect(shape(0, 10)).toBe('1 2 … 10');
  });
});

function Harness({ start = 4, count = 10 }: { start?: number; count?: number }) {
  const [page, setPage] = useState(start);
  return <NlPagination page={page} pageCount={count} onPageChange={setPage} />;
}

describe('NlPagination', () => {
  it('a named nav with a list; current page marked; secondary xsmall chevrons', () => {
    render(<NlPagination page={4} pageCount={10} onPageChange={() => undefined} />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
    const previous = screen.getByRole('button', { name: 'Previous page' });
    expect(previous).toHaveAttribute('data-variant', 'secondary');
    expect(previous).toHaveAttribute('data-size', 'xsmall');
    expect(previous.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'chevron_left');
    expect(screen.getByRole('button', { name: 'Next page' }).querySelector('[data-icon]')).toHaveAttribute(
      'data-icon',
      'chevron_right',
    );
  });

  it('previous is natively disabled on page 1, next on the last (OD-126); one page disables both', () => {
    const { rerender } = render(<NlPagination page={1} pageCount={10} onPageChange={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    rerender(<NlPagination page={10} pageCount={10} onPageChange={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    rerender(<NlPagination page={1} pageCount={1} onPageChange={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: /^Page/ })).toHaveLength(1);
  });

  it('picking a page calls onPageChange and moves focus to the new current page', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 5' }));
    const now = screen.getByRole('button', { name: 'Page 5' });
    expect(now).toHaveAttribute('aria-current', 'page');
    expect(now).toHaveFocus();
  });

  it('previous and next keep focus; at the end focus moves to the current page', async () => {
    render(<Harness start={8} />);
    const next = screen.getByRole('button', { name: 'Next page' });
    await userEvent.click(next);
    expect(next).toHaveFocus();
    await userEvent.click(next);
    expect(screen.getByRole('button', { name: 'Page 10' })).toHaveFocus();
  });

  it('the current page does nothing; custom name', async () => {
    const onPageChange = vi.fn();
    render(<NlPagination page={3} pageCount={5} onPageChange={onPageChange} aria-label="Members pages" />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole('navigation', { name: 'Members pages' })).toBeInTheDocument();
  });
});
