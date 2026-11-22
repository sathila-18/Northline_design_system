import { act, render, screen } from '@testing-library/react';
import { createRef, type ComponentPropsWithRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlNavSubItem } from './NlNavSubItem';

const link = (name = 'Members') => screen.getByRole('link', { name });

describe('NlNavSubItem', () => {
  it('is a link with Label M text, the default colours and the standard focus ring', () => {
    render(<NlNavSubItem href="#members">Members</NlNavSubItem>);
    expect(link().tagName).toBe('A');
    expect(link()).toHaveAttribute('href', '#members');
    expect(link()).not.toHaveAttribute('aria-current');
    expect(link()).toHaveAttribute('data-tree', 'none');
    expect(link()).toHaveClass(
      'nl:py-m',
      'nl:ps-6xl',
      'nl:pe-xl',
      'nl:rounded-s',
      'nl:bg-secondary',
      'nl:text-secondary',
      'nl:hover:bg-tertiary',
      'nl:active:bg-neutral',
      'nl:focus-visible:outline-2',
      'nl:focus-visible:outline-focused',
    );
    expect(screen.getByText('Members')).toHaveClass('nl:text-label-m', 'nl:truncate');
    expect(link().querySelector('[data-slot^="tree"]')).toBeNull();
  });

  it('current: aria-current="page", bg-primary and text-action', () => {
    render(
      <NlNavSubItem href="#tiers" current>
        Tiers
      </NlNavSubItem>,
    );
    expect(link('Tiers')).toHaveAttribute('aria-current', 'page');
    expect(link('Tiers')).toHaveClass('nl:bg-primary', 'nl:text-action');
    expect(link('Tiers')).not.toHaveClass('nl:hover:bg-tertiary');
  });

  it('tree middle draws the curve and the continuation, both hidden from screen readers', () => {
    render(
      <NlNavSubItem href="#members" tree="middle">
        Members
      </NlNavSubItem>,
    );
    const line = link().querySelector('[data-slot="tree-line"]');
    const rest = link().querySelector('[data-slot="tree-continue"]');
    expect(line).toHaveAttribute('aria-hidden', 'true');
    expect(line).toHaveClass('nl:nav-tree-line', 'nl:border-s', 'nl:border-b', 'nl:rounded-es-s', 'nl:border-default');
    expect(rest).toHaveAttribute('aria-hidden', 'true');
    expect(rest).toHaveClass('nl:nav-tree-continue', 'nl:border-s');
    expect(link()).toHaveAccessibleName('Members');
  });

  it('tree last draws only the curve', () => {
    render(
      <NlNavSubItem href="#rewards" tree="last">
        Rewards
      </NlNavSubItem>,
    );
    expect(link('Rewards').querySelector('[data-slot="tree-line"]')).not.toBeNull();
    expect(link('Rewards').querySelector('[data-slot="tree-continue"]')).toBeNull();
  });

  it('renders a router link through as', () => {
    function RouterLink({ to, ...rest }: ComponentPropsWithRef<'a'> & { to: string }) {
      return <a {...rest} href={to} data-router="yes" />;
    }
    render(
      <NlNavSubItem as={RouterLink} {...{ to: '/members' }}>
        Members
      </NlNavSubItem>,
    );
    expect(link()).toHaveAttribute('data-router', 'yes');
    expect(link()).toHaveAttribute('href', '/members');
  });

  it('passes ref and attributes; className is appended for placement', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <NlNavSubItem ref={ref} href="#members" id="members-link" className="nl:mt-xs">
        Members
      </NlNavSubItem>,
    );
    expect(ref.current).toBe(link());
    expect(link()).toHaveAttribute('id', 'members-link');
    expect(link().className.endsWith('nl:mt-xs')).toBe(true);
  });

  it('gets the full text as title only when the text is cut off', () => {
    const { rerender } = render(<NlNavSubItem href="#a">Members</NlNavSubItem>);
    expect(link()).not.toHaveAttribute('title');

    const text = screen.getByText('Members');
    Object.defineProperty(text, 'scrollWidth', { configurable: true, value: 300 });
    Object.defineProperty(text, 'clientWidth', { configurable: true, value: 120 });
    // The measure runs again when the children change (a new array, same text).
    act(() => {
      rerender(<NlNavSubItem href="#a">{['Members']}</NlNavSubItem>);
    });
    expect(link()).toHaveAttribute('title', 'Members');
  });

  it('keeps a title the caller sets', () => {
    render(
      <NlNavSubItem href="#a" title="All members">
        Members
      </NlNavSubItem>,
    );
    expect(link()).toHaveAttribute('title', 'All members');
  });
});
