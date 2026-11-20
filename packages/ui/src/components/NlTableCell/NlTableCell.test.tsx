import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlTableCell } from './NlTableCell';

const inRow = (cell: ReactNode) => (
  <table>
    <tbody>
      <tr>{cell}</tr>
    </tbody>
  </table>
);

describe('NlTableCell', () => {
  it('default: a td, Size-40, Space-3XL, Body M text-secondary, one line', () => {
    render(inRow(<NlTableCell>Member 0042</NlTableCell>));
    const cell = screen.getByRole('cell', { name: 'Member 0042' });
    expect(cell).toHaveAttribute('data-type', 'default');
    expect(cell).toHaveClass('nl:h-40', 'nl:px-3xl', 'nl:py-none', 'nl:text-body-m', 'nl:text-secondary');
    expect(screen.getByText('Member 0042')).toHaveClass('nl:truncate');
  });

  it('rowHeader: th scope row; narrow: Space-XL', () => {
    render(
      inRow(
        <NlTableCell rowHeader narrow>
          Member 0042
        </NlTableCell>,
      ),
    );
    const header = screen.getByRole('rowheader', { name: 'Member 0042' });
    expect(header).toHaveAttribute('scope', 'row');
    expect(header).toHaveClass('nl:px-xl');
  });

  it('badge: a small NlBadge', () => {
    render(inRow(<NlTableCell type="badge" badge={{ tone: 'success', label: 'Tier 2' }} />));
    expect(screen.getByText('Tier 2').closest('[data-tone]')).toHaveAttribute('data-tone', 'success');
  });

  it('link: a flush xsmall link button; an href renders an anchor (OD-117)', () => {
    render(inRow(<NlTableCell type="link" link={{ label: 'View profile', href: '#m' }} />));
    const link = screen.getByRole('link', { name: 'View profile' });
    expect(link).toHaveAttribute('href', '#m');
    expect(link).toHaveAttribute('data-variant', 'link');
    expect(link).toHaveClass('nl:px-none');
  });

  it('row actions: a 32 icon-only menu button in a Size-64 column', async () => {
    const onClick = vi.fn();
    render(
      inRow(<NlTableCell type="row-actions" actions={{ label: 'Actions for Member 0042', expanded: true, onClick }} />),
    );
    const button = screen.getByRole('button', { name: 'Actions for Member 0042' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('data-size', 'xsmall');
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'more_vert');
    expect(screen.getByRole('cell')).toHaveClass('nl:w-64', 'nl:px-xl');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('checkbox and leading select: named checkboxes', async () => {
    const onChange = vi.fn();
    render(
      inRow(
        <>
          <NlTableCell select={{ checked: false, onChange, label: 'Select Member 0042' }}>Member 0042</NlTableCell>
          <NlTableCell type="checkbox" checkbox={{ checked: true, onChange, label: 'Member 0042, Can redeem' }} />
        </>,
      ),
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Member 0042' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox', { name: 'Member 0042, Can redeem' })).toBeChecked();
  });

  it('stickyEnd: sticky at the end with the sticky-end shadow, fill from the row (OD-187)', () => {
    render(inRow(<NlTableCell stickyEnd type="row-actions" actions={{ label: 'A', onClick: () => undefined }} />));
    expect(screen.getByRole('cell')).toHaveClass(
      'nl:sticky',
      'nl:end-none',
      'nl:z-sticky',
      'nl:bg-inherit',
      'nl:shadow-sticky-end',
    );
  });

  it('cut-off text gets the full text as title (OD-186)', () => {
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300);
    const client = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
    render(inRow(<NlTableCell>A very long reward name</NlTableCell>));
    expect(screen.getByText('A very long reward name')).toHaveAttribute('title', 'A very long reward name');
    scroll.mockRestore();
    client.mockRestore();
  });
});
