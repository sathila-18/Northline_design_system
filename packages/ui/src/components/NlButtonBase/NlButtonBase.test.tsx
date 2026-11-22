import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlButtonBase } from './NlButtonBase';

describe('NlButtonBase', () => {
  it('renders a native button with type="button" and the defaults', () => {
    render(<NlButtonBase>Save changes</NlButtonBase>);
    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'medium');
    expect(button).toHaveAttribute('data-icon', 'none');
    expect(button.querySelector('[data-icon]:not(button)')).toBeNull();
  });

  it('keeps a type passed by the caller', () => {
    render(<NlButtonBase type="submit">Save</NlButtonBase>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('has the standard focus ring and the button group', () => {
    render(<NlButtonBase>Save</NlButtonBase>);
    expect(screen.getByRole('button')).toHaveClass(
      'nl:group/button',
      'nl:focus-visible:outline-2',
      'nl:focus-visible:-outline-offset-1',
      'nl:focus-visible:outline-focused',
    );
  });

  it.each([
    ['large', ['nl:h-56', 'nl:px-3xl', 'nl:py-xl', 'nl:rounded-s', 'nl:text-button-xl'], 'nl:size-56', '24'],
    ['medium', ['nl:h-48', 'nl:px-3xl', 'nl:py-l', 'nl:rounded-s', 'nl:text-button-l'], 'nl:size-48', '24'],
    ['small', ['nl:h-40', 'nl:px-xl', 'nl:py-m', 'nl:rounded-xs', 'nl:text-button-m'], 'nl:size-36', '20'],
    ['xsmall', ['nl:h-36', 'nl:px-xl', 'nl:py-s', 'nl:rounded-xs', 'nl:text-button-m'], 'nl:size-32', '20'],
  ] as const)('size %s', (size, labelled, square, iconSize) => {
    const { rerender } = render(
      <NlButtonBase size={size} icon="leading" iconName="add">
        Add
      </NlButtonBase>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass(...labelled);
    expect(button.querySelector('[data-slot] [data-icon]')).toHaveAttribute('data-size', iconSize);
    rerender(
      <NlButtonBase size={size} icon="only-icon" iconName="add">
        Add
      </NlButtonBase>,
    );
    expect(screen.getByRole('button')).toHaveClass(square, 'nl:p-none');
    expect(screen.getByRole('button')).not.toHaveClass(labelled[0]);
  });

  it.each([
    ['primary', ['nl:bg-action-primary', 'nl:text-white-both'], 'nl:text-fg-white-both'],
    ['secondary', ['nl:inset-ring-2', 'nl:inset-ring-active', 'nl:text-action'], 'nl:text-fg-action'],
    ['tertiary', ['nl:text-action'], 'nl:text-fg-action'],
    ['link', ['nl:text-action'], 'nl:text-fg-action'],
  ] as const)('variant %s has its resting colours', (variant, button, icon) => {
    render(
      <NlButtonBase variant={variant} icon="leading" iconName="add">
        Add
      </NlButtonBase>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
    expect(screen.getByRole('button')).toHaveClass(...button);
    expect(screen.getByRole('button').querySelector('[data-slot]')).toHaveClass(icon);
  });

  it('only secondary has a border, and tertiary and link have no background', () => {
    for (const variant of ['primary', 'tertiary', 'link'] as const) {
      const { unmount } = render(<NlButtonBase variant={variant}>Save</NlButtonBase>);
      expect(screen.getByRole('button').className).not.toMatch(/inset-ring/);
      if (variant !== 'primary') expect(screen.getByRole('button').className).not.toMatch(/nl:bg-/);
      unmount();
    }
  });

  it('replaces the resting colours with appearance', () => {
    render(
      <NlButtonBase
        variant="secondary"
        icon="leading"
        iconName="add"
        appearance={{ button: 'nl:text-secondary', icon: 'nl:text-fg-secondary' }}
      >
        Add
      </NlButtonBase>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('nl:text-secondary');
    expect(button).not.toHaveClass('nl:text-action', 'nl:inset-ring-active');
    expect(button.querySelector('[data-slot]')).toHaveClass('nl:text-fg-secondary');
  });

  it('puts the leading icon before the label and the trailing icon after it, both decorative', () => {
    const { rerender } = render(
      <NlButtonBase icon="leading" iconName="add">
        Add
      </NlButtonBase>,
    );
    let button = screen.getByRole('button', { name: 'Add' });
    expect((button.firstChild as HTMLElement).dataset.slot).toBe('leading');
    expect(button.querySelector('[data-icon="add"]')).toHaveAttribute('aria-hidden', 'true');
    rerender(
      <NlButtonBase icon="trailing" iconName="chevron_right">
        Next
      </NlButtonBase>,
    );
    button = screen.getByRole('button', { name: 'Next' });
    expect((button.lastChild as HTMLElement).dataset.slot).toBe('trailing');
  });

  it('keeps the label as a visually hidden name for icon-only', () => {
    render(
      <NlButtonBase icon="only-icon" iconName="more_vert">
        More actions
      </NlButtonBase>,
    );
    const button = screen.getByRole('button', { name: 'More actions' });
    expect(screen.getByText('More actions')).toHaveClass('nl:sr-only');
    expect(button.querySelector('[data-icon="more_vert"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a link with as="a" and href, without a type', () => {
    render(
      <NlButtonBase as="a" href="/rewards" variant="link">
        View details
      </NlButtonBase>,
    );
    const link = screen.getByRole('link', { name: 'View details' });
    expect(link).toHaveAttribute('href', '/rewards');
    expect(link).not.toHaveAttribute('type');
  });

  it('passes native disabled through', () => {
    render(<NlButtonBase disabled>Save</NlButtonBase>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('appends className last and passes native attributes and ref to the element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NlButtonBase className="nl:ms-xs" id="probe" ref={ref}>
        Save
      </NlButtonBase>,
    );
    const button = screen.getByRole('button');
    expect(button.className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(button).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(button);
  });
});
