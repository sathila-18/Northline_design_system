import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NlAppShell } from './NlAppShell';

const nav = <nav aria-label="Main">Nav</nav>;

describe('NlAppShell', () => {
  it('fills the window on bg-secondary; landmarks: the nav slot as given, <header>, <main>', () => {
    const { container } = render(
      <NlAppShell nav={nav} header={<div>Header</div>}>
        Page
      </NlAppShell>,
    );
    expect(container.firstElementChild).toHaveClass('nl:h-dvh', 'nl:overflow-hidden', 'nl:bg-secondary', 'nl:gap-none');
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(screen.getByRole('banner')).toHaveTextContent('Header');
    expect(screen.getByRole('main')).toHaveTextContent('Page');
  });

  it('panel area and panel: Space-M top, end, bottom; Radius-L, clipped, Space-XS gap, no fill', () => {
    render(
      <NlAppShell nav={nav} header={<div>Header</div>}>
        Page
      </NlAppShell>,
    );
    const panel = screen.getByRole('main').parentElement;
    expect(panel).toHaveClass('nl:rounded-l', 'nl:overflow-hidden', 'nl:gap-xs');
    expect(panel?.className).not.toMatch(/bg-/);
    expect(panel?.parentElement).toHaveClass('nl:pt-m', 'nl:pe-m', 'nl:pb-m', 'nl:ps-none');
  });

  it('content: the only scroller, Space-3XL padding, bg-primary, focusable with an inside ring', () => {
    render(<NlAppShell nav={nav}>Page</NlAppShell>);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabindex', '0');
    expect(main).toHaveClass(
      'nl:overflow-y-auto',
      'nl:p-3xl',
      'nl:bg-primary',
      'nl:focus-visible:outline-2',
      'nl:focus-visible:-outline-offset-2',
      'nl:focus-visible:outline-focused',
    );
  });

  it('no header: no banner', () => {
    render(<NlAppShell nav={nav}>Page</NlAppShell>);
    expect(screen.queryByRole('banner')).toBeNull();
  });

  it('skip link: off by default; when on, the first tab stop, hidden until focused, moves focus to main', async () => {
    const { rerender } = render(<NlAppShell nav={nav}>Page</NlAppShell>);
    expect(screen.queryByRole('link', { name: 'Skip to content' })).toBeNull();
    rerender(
      <NlAppShell nav={nav} skipLink>
        Page
      </NlAppShell>,
    );
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link).toHaveClass('nl:rounded-full', 'nl:px-xl', 'nl:py-m', 'nl:text-action', 'nl:shadow-menu');
    expect(link.parentElement).toHaveClass('nl:sr-only', 'nl:focus-within:not-sr-only');
    expect(link.parentElement?.parentElement).toHaveClass('nl:fixed', 'nl:top-m', 'nl:start-m', 'nl:z-snackbar');
    await userEvent.tab();
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('custom skip text and main id', () => {
    render(
      <NlAppShell nav={nav} skipLink skipLinkLabel="Skip to rewards" mainId="page">
        Page
      </NlAppShell>,
    );
    expect(screen.getByRole('link', { name: 'Skip to rewards' })).toHaveAttribute('href', '#page');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'page');
  });
});
