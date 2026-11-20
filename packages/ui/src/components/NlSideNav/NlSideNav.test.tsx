import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NlSideNav, type NlSideNavItem } from './NlSideNav';

const items: NlSideNavItem[] = [
  { icon: 'person', label: 'Members', href: '#members' },
  {
    icon: 'check_circle',
    label: 'Rewards',
    pages: [
      { label: 'All rewards', href: '#rewards' },
      { label: 'Reward X', href: '#rewards-x' },
    ],
  },
];
const user = { name: 'Member 0042', email: 'm0042@example.test', avatar: { initials: 'M4' } };

/** A stand-in for matchMedia whose answer the test can change. */
function mockMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return matches;
    },
    media: query,
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  }));
  return (next: boolean) => {
    matches = next;
    act(() => {
      for (const cb of listeners) cb();
    });
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('NlSideNav', () => {
  it('a nav "Main" with a list of sections, bg-secondary, Space-XL sides, Size-240 column expanded', () => {
    render(<NlSideNav items={items} logo={<span>Logo</span>} defaultMinimized={false} />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toHaveClass('nl:bg-secondary', 'nl:px-xl', 'nl:box-content', 'nl:w-240', 'nl:duration-slow');
    expect(within(nav).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('collapse button: dock_to_right, "Collapse navigation" / "Expand navigation", no aria-expanded; minimized is Size-48 + padding', async () => {
    const onMinimizedChange = vi.fn();
    render(
      <NlSideNav
        items={items}
        logo={<span>Logo</span>}
        defaultMinimized={false}
        onMinimizedChange={onMinimizedChange}
      />,
    );
    const button = screen.getByRole('button', { name: 'Collapse navigation' });
    expect(button).not.toHaveAttribute('aria-expanded');
    expect(button.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'dock_to_right');
    await userEvent.click(button);
    expect(onMinimizedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('navigation')).toHaveClass('nl:w-48');
    expect(screen.getByRole('button', { name: 'Expand navigation' })).not.toHaveAttribute('aria-expanded');
    expect(screen.queryByText('Logo')).toBeNull();
  });

  it('currentHref: a page marks its section current and open; a section link is the current page', () => {
    const { rerender } = render(<NlSideNav items={items} currentHref="#rewards-x" defaultMinimized={false} />);
    expect(screen.getByRole('link', { name: 'Reward X' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Rewards' })).toHaveAttribute('aria-expanded', 'true');
    rerender(<NlSideNav items={items} currentHref="#members" defaultMinimized={false} />);
    expect(screen.getByRole('link', { name: 'Members' })).toHaveAttribute('aria-current', 'page');
  });

  it('variant: default has no tree lines, tree has them', () => {
    const { rerender } = render(<NlSideNav items={items} currentHref="#rewards" defaultMinimized={false} />);
    expect(screen.getByRole('link', { name: 'All rewards' })).toHaveAttribute('data-tree', 'none');
    rerender(<NlSideNav items={items} currentHref="#rewards" variant="tree" defaultMinimized={false} />);
    expect(screen.getByRole('link', { name: 'All rewards' })).toHaveAttribute('data-tree', 'middle');
    expect(screen.getByRole('navigation')).toHaveAttribute('data-variant', 'tree');
  });

  it('minimized: sections and user minimized', () => {
    const { container } = render(<NlSideNav items={items} user={user} defaultMinimized />);
    expect(screen.getByRole('button', { name: 'Rewards' })).toHaveAttribute('aria-haspopup', 'menu');
    const userRow = container.querySelector('[data-appearance="nav"]');
    expect(userRow?.parentElement).toHaveAttribute('data-minimized', 'true');
  });

  it('follows Breakpoint-1280; a toggle holds until the window crosses it again', async () => {
    const setWide = mockMedia(true);
    render(<NlSideNav items={items} />);
    expect(screen.getByRole('navigation')).toHaveClass('nl:w-240');
    setWide(false);
    expect(screen.getByRole('navigation')).toHaveClass('nl:w-48');
    await userEvent.click(screen.getByRole('button', { name: 'Expand navigation' }));
    expect(screen.getByRole('navigation')).toHaveClass('nl:w-240');
    setWide(true);
    setWide(false);
    expect(screen.getByRole('navigation')).toHaveClass('nl:w-48');
  });

  it('controlled minimized wins', () => {
    mockMedia(true);
    render(<NlSideNav items={items} minimized />);
    expect(screen.getByRole('navigation')).toHaveClass('nl:w-48');
  });

  it('a custom name', () => {
    render(<NlSideNav items={items} aria-label="Admin" defaultMinimized={false} />);
    expect(screen.getByRole('navigation', { name: 'Admin' })).toBeInTheDocument();
  });
});
