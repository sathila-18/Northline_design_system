import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlNavItem } from './NlNavItem';

const pages = [
  { label: 'All rewards', href: '#all' },
  { label: 'Reward X', href: '#x' },
];

describe('NlNavItem', () => {
  it('without pages: a link row with the spec padding, radius and default colours', () => {
    render(
      <NlNavItem icon="person" href="#members">
        Members
      </NlNavItem>,
    );
    const link = screen.getByRole('link', { name: 'Members' });
    expect(link).toHaveAttribute('href', '#members');
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).toHaveClass(
      'nl:px-l',
      'nl:py-m',
      'nl:rounded-m',
      'nl:gap-l',
      'nl:bg-secondary',
      'nl:text-secondary',
      'nl:hover:bg-tertiary',
      'nl:active:bg-neutral',
    );
    expect(screen.getByText('Members')).toHaveClass('nl:text-label-m', 'nl:truncate');
  });

  it('current page: aria-current, bg-primary, text-action, filled icon, no hover', () => {
    render(
      <NlNavItem icon="person" href="#members" current="page">
        Members
      </NlNavItem>,
    );
    const link = screen.getByRole('link', { name: 'Members' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('nl:bg-primary', 'nl:text-action');
    expect(link).not.toHaveClass('nl:hover:bg-tertiary');
  });

  it('with pages: a button that shows the pages with tree lines; chevron flips', async () => {
    const onExpandedChange = vi.fn();
    render(
      <NlNavItem icon="check_circle" pages={pages} onExpandedChange={onExpandedChange}>
        Rewards
      </NlNavItem>,
    );
    const button = screen.getByRole('button', { name: 'Rewards' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'All rewards' })).toBeNull();
    expect(button.querySelector('[data-slot="chevron"] [data-icon]')).toHaveAttribute(
      'data-icon',
      'keyboard_arrow_down',
    );
    await userEvent.click(button);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const list = document.getElementById(button.getAttribute('aria-controls') ?? '');
    expect(list).toHaveClass('nl:mt-xs', 'nl:gap-xs');
    expect(screen.getByRole('link', { name: 'All rewards' })).toHaveAttribute('data-tree', 'middle');
    expect(screen.getByRole('link', { name: 'Reward X' })).toHaveAttribute('data-tree', 'last');
    expect(button.querySelector('[data-slot="chevron"] [data-icon]')).toHaveAttribute('data-icon', 'keyboard_arrow_up');
  });

  it('a current page inside: current="section" and open by default (OD-190)', () => {
    render(
      <NlNavItem
        icon="check_circle"
        pages={[
          { label: 'All rewards', href: '#all' },
          { label: 'Reward X', href: '#x', current: true },
        ]}
      >
        Rewards
      </NlNavItem>,
    );
    const button = screen.getByRole('button', { name: 'Rewards' });
    expect(button).toHaveAttribute('data-current', 'section');
    expect(button).toHaveClass('nl:bg-secondary', 'nl:text-action');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Reward X' })).toHaveAttribute('aria-current', 'page');
  });

  it('Enter toggles a section from the keyboard', async () => {
    render(
      <NlNavItem icon="check_circle" pages={pages}>
        Rewards
      </NlNavItem>,
    );
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Rewards' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('minimized: icon only with a hidden name; pages open in a navigation menu to the end (OD-118)', async () => {
    render(
      <NlNavItem minimized icon="check_circle" pages={pages}>
        Rewards
      </NlNavItem>,
    );
    const button = screen.getByRole('button', { name: 'Rewards' });
    expect(screen.getByText('Rewards', { selector: 'span' })).toHaveClass('nl:sr-only');
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button.querySelector('[data-slot="chevron"]')).toBeNull();
    await userEvent.click(button);
    await act(async () => {
      await Promise.resolve();
    });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const item = screen.getByRole('menuitem', { name: 'Reward X', hidden: true });
    expect(item).toHaveAttribute('href', '#x');
  });
});
