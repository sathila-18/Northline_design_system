import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlBulkActionBar, type NlBulkAction } from './NlBulkActionBar';

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

const actions = (count: number, destructive = true): NlBulkAction[] => [
  ...Array.from({ length: count }, (_, i) => ({
    label: `Action ${String(i + 1)}`,
    icon: 'check' as const,
    onSelect: vi.fn(),
  })),
  ...(destructive
    ? [{ label: 'Remove', icon: 'delete' as const, tone: 'destructive' as const, onSelect: vi.fn() }]
    : []),
];

describe('NlBulkActionBar', () => {
  it('a labelled region: clear selection, the count, actions with leading icons', () => {
    render(<NlBulkActionBar count={3} onClear={() => undefined} actions={actions(2)} />);
    const region = screen.getByRole('region', { name: 'Bulk actions' });
    expect(region).toHaveClass('nl:bg-direct', 'nl:rounded-full', 'nl:shadow-menu');
    expect(within(region).getByText('3 selected')).toHaveClass('nl:text-inverse');
    const action = within(region).getByRole('button', { name: 'Action 1' });
    expect(action).toHaveAttribute('data-icon', 'leading');
  });

  it('Clear selection calls onClear; an action calls its onSelect', async () => {
    const onClear = vi.fn();
    const list = actions(1);
    render(<NlBulkActionBar count={1} onClear={onClear} actions={list} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Action 1' }));
    expect(list[0]?.onSelect).toHaveBeenCalledTimes(1);
  });

  it('destructive actions are solid red and come last', () => {
    render(<NlBulkActionBar count={2} onClear={() => undefined} actions={[...actions(0), ...actions(2, false)]} />);
    const buttons = within(screen.getByRole('region')).getAllByRole('button');
    expect(buttons.at(-1)).toHaveAccessibleName('Remove');
    expect(buttons.at(-1)).toHaveAttribute('data-tone', 'destructive');
    expect(buttons.at(-1)).toHaveAttribute('data-variant', 'primary');
  });

  it('shows up to 7 actions; the rest open from More actions, never the destructive one (D21)', async () => {
    render(<NlBulkActionBar count={4} onClear={() => undefined} actions={actions(8)} />);
    const region = screen.getByRole('region');
    // 6 normal actions + the destructive one = 7.
    expect(within(region).getByRole('button', { name: 'Action 6' })).toBeInTheDocument();
    expect(within(region).queryByRole('button', { name: 'Action 7' })).toBeNull();
    expect(within(region).getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    await userEvent.click(within(region).getByRole('button', { name: 'More actions' }));
    await settle();
    const menu = screen.getByRole('menu', { name: 'More actions' });
    const items = within(menu).getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAccessibleName('Action 7');
    expect(items[1]).toHaveAccessibleName('Action 8');
  });

  it('no More actions button when everything fits', () => {
    render(<NlBulkActionBar count={1} onClear={() => undefined} actions={actions(3)} />);
    expect(screen.queryByRole('button', { name: 'More actions' })).toBeNull();
  });

  it('the measuring row is hidden from assistive tech and the keyboard', () => {
    const { container } = render(<NlBulkActionBar count={1} onClear={() => undefined} actions={actions(2)} />);
    const measure = container.querySelector('.nl\\:invisible');
    expect(measure).toHaveAttribute('aria-hidden', 'true');
    expect(measure).toHaveAttribute('inert');
    expect(measure).toHaveClass('nl:invisible');
  });
});
