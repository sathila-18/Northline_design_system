import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlListItem } from '../NlListItem';
import { NlSideNavUser } from './NlSideNavUser';

const menu = (
  <>
    <NlListItem role="menuitem" title="Profile" size="small" density="compact" divider={false} />
    <NlListItem role="menuitem" title="Sign out" size="small" density="compact" divider={false} />
  </>
);

const user = { name: 'Member 0042', email: 'member0042@example.test', avatar: { initials: 'M4' } } as const;

describe('NlSideNavUser', () => {
  it('with a menu: a menu button named from its text plus the menu label, nav padding, radius and fills', () => {
    render(<NlSideNavUser {...user} menu={menu} />);
    const button = screen.getByRole('button', { name: 'Member 0042 member0042@example.test Account menu' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveClass(
      'nl:px-xl',
      'nl:py-l',
      'nl:rounded-m',
      'nl:bg-transparent',
      'nl:hover:bg-tertiary',
      'nl:active:bg-neutral',
      'nl:focus-visible:outline-focused',
    );
    expect(button.querySelector('[data-slot="leading"] > [data-size="medium"]')).not.toBeNull();
    expect(screen.getByText('Member 0042').parentElement).toHaveClass('nl:text-label-m', 'nl:text-primary');
    expect(screen.getByText('Member 0042')).toHaveClass('nl:truncate');
    expect(screen.getByText('member0042@example.test').closest('p')).toHaveClass('nl:text-body-m', 'nl:text-secondary');
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'keyboard_arrow_down');
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-size', '24');
  });

  it('opens the menu above it; open fill and chevron up; Escape closes and returns focus', async () => {
    const onOpenChange = vi.fn();
    render(<NlSideNavUser {...user} menu={menu} onOpenChange={onOpenChange} />);
    const button = screen.getByRole('button', { name: /Member 0042/ });
    await userEvent.click(button);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass('nl:bg-tertiary');
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'keyboard_arrow_up');
    const menuEl = screen.getByRole('menu', { name: 'Account menu' });
    expect(button).toHaveAttribute('aria-controls', menuEl.id);
    await act(async () => {
      await Promise.resolve();
    });
    await userEvent.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('controlled open', () => {
    render(<NlSideNavUser {...user} menu={menu} open />);
    expect(screen.getByRole('button', { name: /Member 0042/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('custom menu label names the menu and ends the row name', () => {
    render(<NlSideNavUser {...user} menu={menu} menuLabel="Your account" open />);
    expect(
      screen.getByRole('button', { name: 'Member 0042 member0042@example.test Your account' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('menu', { name: 'Your account' })).toBeInTheDocument();
  });

  it('with onClick and no menu: a plain button, no popup', async () => {
    const onClick = vi.fn();
    render(<NlSideNavUser {...user} onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Member 0042 member0042@example.test' });
    expect(button).not.toHaveAttribute('aria-haspopup');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('no menu: not a button, no hover, no side padding, no chevron', () => {
    const { container } = render(<NlSideNavUser {...user} />);
    expect(screen.queryByRole('button')).toBeNull();
    const row = container.querySelector('[data-appearance="nav"]');
    expect(row).toHaveClass('nl:px-none', 'nl:py-l');
    expect(row).not.toHaveClass('nl:hover:bg-tertiary');
    expect(row?.querySelector('[data-icon]')).toBeNull();
  });

  it('minimized: avatar only, Space-L padding, text hidden, no chevron, menu still named', () => {
    render(<NlSideNavUser {...user} menu={menu} minimized />);
    const button = screen.getByRole('button', { name: 'Member 0042 member0042@example.test Account menu' });
    expect(button).toHaveClass('nl:p-l');
    expect(button.querySelector('[data-slot="text"]')).toHaveClass('nl:sr-only');
    expect(button.querySelector('[data-icon]')).toBeNull();
  });
});
