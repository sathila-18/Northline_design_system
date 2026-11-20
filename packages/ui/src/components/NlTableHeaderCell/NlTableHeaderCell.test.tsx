import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlTableHeaderCell } from './NlTableHeaderCell';

const inRow = (cell: ReactNode) => (
  <table>
    <thead>
      <tr>{cell}</tr>
    </thead>
  </table>
);

describe('NlTableHeaderCell', () => {
  it('a th scope col, Size-40, Space-3XL inline padding, NlLabel medium title; no aria-sort when not sortable', () => {
    render(inRow(<NlTableHeaderCell>Member</NlTableHeaderCell>));
    const cell = screen.getByRole('columnheader', { name: 'Member' });
    expect(cell).toHaveAttribute('scope', 'col');
    expect(cell).not.toHaveAttribute('aria-sort');
    expect(cell).toHaveClass('nl:h-40', 'nl:px-3xl', 'nl:py-none', 'nl:bg-transparent');
    expect(screen.getByText('Member')).toHaveClass('nl:text-label-m', 'nl:text-tertiary');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('grey and narrow', () => {
    render(
      inRow(
        <NlTableHeaderCell appearance="grey" narrow>
          A
        </NlTableHeaderCell>,
      ),
    );
    expect(screen.getByRole('columnheader')).toHaveClass('nl:bg-tertiary', 'nl:px-xl');
  });

  it('sortable: the title is a button; aria-sort; cycles none → ascending → descending → none', async () => {
    const onSortChange = vi.fn();
    const { rerender } = render(
      inRow(
        <NlTableHeaderCell sortable onSortChange={onSortChange}>
          Points
        </NlTableHeaderCell>,
      ),
    );
    const cell = screen.getByRole('columnheader');
    expect(cell).toHaveAttribute('aria-sort', 'none');
    const button = screen.getByRole('button', { name: 'Points' });
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'unfold_more');
    expect(button.querySelector('[data-slot="sort-icon"]')).toHaveClass('nl:text-fg-secondary');
    await userEvent.click(button);
    expect(onSortChange).toHaveBeenLastCalledWith('ascending');
    rerender(
      inRow(
        <NlTableHeaderCell sortable sort="ascending" onSortChange={onSortChange}>
          Points
        </NlTableHeaderCell>,
      ),
    );
    expect(cell).toHaveAttribute('aria-sort', 'ascending');
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'arrow_upward');
    expect(button.querySelector('[data-slot="sort-icon"]')).toHaveClass('nl:text-fg-action');
    await userEvent.click(button);
    expect(onSortChange).toHaveBeenLastCalledWith('descending');
    rerender(
      inRow(
        <NlTableHeaderCell sortable sort="descending" onSortChange={onSortChange}>
          Points
        </NlTableHeaderCell>,
      ),
    );
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'arrow_downward');
    await userEvent.click(button);
    expect(onSortChange).toHaveBeenLastCalledWith('none');
  });

  it('filter: named button with haspopup dialog; open expands and flips the icon; applied is in the name (OD-185)', async () => {
    const onFilterClick = vi.fn();
    const { rerender } = render(
      inRow(
        <NlTableHeaderCell filter="available" onFilterClick={onFilterClick}>
          Tier
        </NlTableHeaderCell>,
      ),
    );
    const button = screen.getByRole('button', { name: 'Filter Tier' });
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveClass('nl:text-fg-secondary');
    await userEvent.click(button);
    expect(onFilterClick).toHaveBeenCalledTimes(1);
    rerender(inRow(<NlTableHeaderCell filter="open">Tier</NlTableHeaderCell>));
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass('nl:text-fg-action');
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'keyboard_arrow_up');
    rerender(inRow(<NlTableHeaderCell filter="applied">Tier</NlTableHeaderCell>));
    expect(screen.getByRole('button', { name: 'Filter Tier, applied' })).toHaveClass('nl:text-fg-action');
  });

  it('select all: a checkbox named "Select all rows", indeterminate when asked', async () => {
    const onChange = vi.fn();
    render(
      inRow(
        <NlTableHeaderCell narrow hideTitle selectAll={{ checked: false, indeterminate: true, onChange }}>
          Select
        </NlTableHeaderCell>,
      ),
    );
    const box = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Select all rows' });
    expect(box.indeterminate).toBe(true);
    await userEvent.click(box);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('hideTitle keeps the column name', () => {
    render(inRow(<NlTableHeaderCell hideTitle>Actions</NlTableHeaderCell>));
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    expect(screen.getByText('Actions').parentElement).toHaveClass('nl:sr-only');
  });
});
