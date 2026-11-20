import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlButton } from './NlButton';

describe('NlButton', () => {
  it('defaults to normal, primary, medium, no icon (OD-58)', () => {
    render(<NlButton>Save changes</NlButton>);
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-tone', 'normal');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'medium');
    expect(button).toHaveAttribute('data-icon', 'none');
    expect(button).toHaveClass('nl:bg-action-primary', 'nl:text-white-both');
  });

  it.each([
    ['normal', 'primary', 'nl:not-disabled:not-aria-disabled:hover:bg-action-primary-hovered'],
    ['normal', 'secondary', 'nl:not-disabled:not-aria-disabled:hover:inset-ring-hovered'],
    ['normal', 'tertiary', 'nl:not-disabled:not-aria-disabled:hover:bg-action-secondary-hovered'],
    ['normal', 'link', 'nl:not-disabled:not-aria-disabled:active:text-pressed'],
    ['destructive', 'primary', 'nl:not-disabled:not-aria-disabled:hover:bg-action-destructive-hovered'],
    ['destructive', 'secondary', 'nl:not-disabled:not-aria-disabled:hover:bg-action-destructive-secondary-hovered'],
    ['destructive', 'tertiary', 'nl:not-disabled:not-aria-disabled:active:bg-action-destructive-secondary-pressed'],
    ['white', 'primary', 'nl:not-disabled:not-aria-disabled:hover:bg-active'],
  ] as const)('tone %s, variant %s has its state colours', (tone, variant, stateClass) => {
    // Each pair is valid; the cast lets one table cover every tone.
    const props = { tone, variant } as Parameters<typeof NlButton>[0];
    render(<NlButton {...props}>Save</NlButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-tone', tone);
    expect(button).toHaveAttribute('data-variant', variant);
    expect(button).toHaveClass(
      stateClass,
      'nl:transition-colors',
      'nl:duration-fast',
      'nl:motion-reduce:transition-none',
    );
  });

  it('underlines the link label only, never the icon', () => {
    render(
      <NlButton variant="link" icon="trailing" iconName="chevron_right">
        View details
      </NlButton>,
    );
    const button = screen.getByRole('button');
    expect(button.className).not.toMatch(/:underline/);
    expect(button.querySelector('[data-slot="label"]')).toHaveClass(
      'nl:group-hover/button:underline',
      'nl:group-active/button:underline',
      'nl:group-disabled/button:no-underline',
    );
    expect(button.querySelector('[data-slot="trailing"]')?.className).not.toMatch(/underline/);
  });

  it('uses the pressed look for aria-expanded="true" (OD-57)', () => {
    render(
      <NlButton variant="secondary" aria-expanded="true">
        Filters
      </NlButton>,
    );
    const button = screen.getByRole('button', { name: 'Filters', expanded: true });
    expect(button).toHaveClass(
      'nl:not-disabled:not-aria-disabled:aria-expanded:bg-action-secondary-pressed',
      'nl:not-disabled:not-aria-disabled:aria-expanded:inset-ring-pressed',
    );
  });

  it.each([
    ['inverse', 'nl:text-inverse', 'nl:text-fg-inverse', 'nl:not-disabled:not-aria-disabled:hover:bg-alpha-light'],
    ['secondary', 'nl:text-secondary', 'nl:text-fg-secondary', 'nl:not-disabled:not-aria-disabled:hover:bg-alpha-sm'],
    ['error', 'nl:text-error', 'nl:text-fg-error', 'nl:not-disabled:not-aria-disabled:active:bg-alpha-sm'],
  ] as const)('tertiary content tone %s recolours label and icon', (contentTone, label, icon, background) => {
    render(
      <NlButton variant="tertiary" contentTone={contentTone} icon="only-icon" iconName="close">
        Close
      </NlButton>,
    );
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveClass(label, background, 'nl:disabled:text-disabled');
    expect(button).not.toHaveClass('nl:text-action');
    expect(button.querySelector('[data-slot]')).toHaveClass(icon, 'nl:group-disabled/button:text-fg-disabled');
  });

  it('activates with Enter and Space, and a click', async () => {
    const onClick = vi.fn();
    render(<NlButton onClick={onClick}>Save</NlButton>);
    const button = screen.getByRole('button');
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('disabled: native disabled, not focusable, no click', async () => {
    const onClick = vi.fn();
    render(
      <NlButton disabled onClick={onClick}>
        Save
      </NlButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.tab();
    expect(button).not.toHaveFocus();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a link with as and href', () => {
    render(
      <NlButton as="a" href="/rewards" variant="link">
        View details
      </NlButton>,
    );
    const link = screen.getByRole('link', { name: 'View details' });
    expect(link).toHaveAttribute('href', '/rewards');
    expect(link).not.toHaveAttribute('aria-disabled');
  });

  it('a disabled link has no href, aria-disabled and ignores clicks', () => {
    const onClick = vi.fn();
    render(
      <NlButton as="a" href="/rewards" variant="link" disabled onClick={onClick}>
        View details
      </NlButton>,
    );
    const link = screen.getByText((_, element) => element?.tagName === 'A');
    expect(link).not.toHaveAttribute('href');
    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    fireEvent(link, event);
    expect(event.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps a visually hidden label for icon-only', () => {
    render(
      <NlButton variant="tertiary" icon="only-icon" iconName="more_vert">
        More actions
      </NlButton>,
    );
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
    expect(screen.getByText('More actions')).toHaveClass('nl:sr-only');
  });

  it('appends className last and passes ref and native attributes', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NlButton tone="destructive" className="nl:ms-xs" id="probe" ref={ref}>
        Delete reward
      </NlButton>,
    );
    const button = screen.getByRole('button');
    expect(button.className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(button).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(button);
  });
  it('link takes content tones and can be flush (no side padding)', () => {
    render(
      <NlButton variant="link" contentTone="warning" flush size="xsmall">
        View details
      </NlButton>,
    );
    const button = screen.getByRole('button', { name: 'View details' });
    expect(button).toHaveClass('nl:text-warning', 'nl:px-none', 'nl:h-36');
    expect(button).not.toHaveClass('nl:text-action', 'nl:px-xl');
  });

  it('a plain link keeps its padding and action colour', () => {
    render(<NlButton variant="link">Plain</NlButton>);
    expect(screen.getByRole('button', { name: 'Plain' })).toHaveClass('nl:text-action', 'nl:px-3xl');
  });
});
