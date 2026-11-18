import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlWhiteButton } from './NlWhiteButton';

describe('NlWhiteButton', () => {
  it('renders NlButtonBase as a native button with the white look', () => {
    render(<NlWhiteButton>Join now</NlWhiteButton>);
    const button = screen.getByRole('button', { name: 'Join now' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-tone', 'white');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'medium');
    expect(button).toHaveClass(
      'nl:bg-action-inverse',
      'nl:inset-ring',
      'nl:inset-ring-subtle',
      'nl:text-dark-both',
      'nl:focus-visible:outline-focused',
    );
    expect(button).not.toHaveClass('nl:bg-action-primary', 'nl:text-white-both');
  });

  it('colours icons fg-dark_both', () => {
    render(
      <NlWhiteButton icon="leading" iconName="add">
        Add
      </NlWhiteButton>,
    );
    expect(screen.getByRole('button').querySelector('[data-slot]')).toHaveClass('nl:text-fg-dark-both');
  });

  it.each([
    ['large', 'nl:h-56', 'nl:size-56'],
    ['medium', 'nl:h-48', 'nl:size-48'],
    ['small', 'nl:h-40', 'nl:size-36'],
    ['xsmall', 'nl:h-36', 'nl:size-32'],
  ] as const)('size %s uses the base sizes', (size, height, square) => {
    const { rerender } = render(<NlWhiteButton size={size}>Join now</NlWhiteButton>);
    expect(screen.getByRole('button')).toHaveClass(height, 'nl:inset-ring');
    rerender(
      <NlWhiteButton size={size} icon="only-icon" iconName="add">
        Add
      </NlWhiteButton>,
    );
    expect(screen.getByRole('button', { name: 'Add' })).toHaveClass(square, 'nl:inset-ring');
  });

  it('lets NlButton replace the appearance', () => {
    render(<NlWhiteButton appearance={{ button: 'nl:bg-active', icon: '' }}>Join now</NlWhiteButton>);
    expect(screen.getByRole('button')).toHaveClass('nl:bg-active');
    expect(screen.getByRole('button')).not.toHaveClass('nl:bg-action-inverse');
  });

  it('renders a link with as="a"', () => {
    render(
      <NlWhiteButton as="a" href="/join">
        Join now
      </NlWhiteButton>,
    );
    expect(screen.getByRole('link', { name: 'Join now' })).toHaveAttribute('href', '/join');
  });

  it('appends className last and passes native attributes and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NlWhiteButton className="nl:ms-xs" id="probe" ref={ref}>
        Join now
      </NlWhiteButton>,
    );
    const button = screen.getByRole('button');
    expect(button.className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(button).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(button);
  });
});
