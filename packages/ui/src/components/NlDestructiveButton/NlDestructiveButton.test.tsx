import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlDestructiveButton } from './NlDestructiveButton';

describe('NlDestructiveButton', () => {
  it('renders NlButtonBase as a native button, primary by default', () => {
    render(<NlDestructiveButton>Delete reward</NlDestructiveButton>);
    const button = screen.getByRole('button', { name: 'Delete reward' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-tone', 'destructive');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'medium');
    expect(button).toHaveClass('nl:bg-action-destructive', 'nl:text-white-both', 'nl:focus-visible:outline-focused');
    expect(button).not.toHaveClass('nl:bg-action-primary');
  });

  it.each([
    ['primary', ['nl:bg-action-destructive', 'nl:text-white-both'], 'nl:text-fg-white-both'],
    ['secondary', ['nl:inset-ring-2', 'nl:inset-ring-error', 'nl:text-error'], 'nl:text-fg-error'],
    ['tertiary', ['nl:text-error'], 'nl:text-fg-error'],
  ] as const)('variant %s has its resting colours', (variant, button, icon) => {
    render(
      <NlDestructiveButton variant={variant} icon="leading" iconName="delete">
        Delete reward
      </NlDestructiveButton>,
    );
    const el = screen.getByRole('button');
    expect(el).toHaveAttribute('data-variant', variant);
    expect(el).toHaveClass(...button);
    expect(el).not.toHaveClass('nl:text-action');
    expect(el.querySelector('[data-slot]')).toHaveClass(icon);
  });

  it('only secondary has a border, and tertiary has no background', () => {
    render(<NlDestructiveButton variant="tertiary">Delete reward</NlDestructiveButton>);
    expect(screen.getByRole('button').className).not.toMatch(/inset-ring|nl:bg-/);
  });

  it('does not accept the link variant', () => {
    // @ts-expect-error: link is a normal-tone variant only (D12).
    render(<NlDestructiveButton variant="link">Delete reward</NlDestructiveButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it.each([
    ['large', 'nl:h-56', 'nl:size-56'],
    ['medium', 'nl:h-48', 'nl:size-48'],
    ['small', 'nl:h-40', 'nl:size-36'],
    ['xsmall', 'nl:h-36', 'nl:size-32'],
  ] as const)('size %s uses the base sizes', (size, height, square) => {
    const { rerender } = render(<NlDestructiveButton size={size}>Delete reward</NlDestructiveButton>);
    expect(screen.getByRole('button')).toHaveClass(height);
    rerender(
      <NlDestructiveButton size={size} icon="only-icon" iconName="delete">
        Delete reward
      </NlDestructiveButton>,
    );
    expect(screen.getByRole('button', { name: 'Delete reward' })).toHaveClass(square);
    expect(screen.getByText('Delete reward')).toHaveClass('nl:sr-only');
  });

  it('lets NlButton replace the appearance', () => {
    render(
      <NlDestructiveButton variant="secondary" appearance={{ button: 'nl:bg-active', icon: '' }}>
        Delete reward
      </NlDestructiveButton>,
    );
    expect(screen.getByRole('button')).toHaveClass('nl:bg-active');
    expect(screen.getByRole('button')).not.toHaveClass('nl:inset-ring-error');
  });

  it('renders a link with as="a"', () => {
    render(
      <NlDestructiveButton as="a" href="/remove" variant="tertiary">
        Remove member
      </NlDestructiveButton>,
    );
    expect(screen.getByRole('link', { name: 'Remove member' })).toHaveAttribute('href', '/remove');
  });

  it('appends className last and passes native attributes and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NlDestructiveButton className="nl:ms-xs" id="probe" ref={ref}>
        Delete reward
      </NlDestructiveButton>,
    );
    const button = screen.getByRole('button');
    expect(button.className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(button).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(button);
  });
});
