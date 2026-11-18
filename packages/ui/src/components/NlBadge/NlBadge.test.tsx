import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlBadge } from './NlBadge';

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlBadge', () => {
  it('defaults to tone neutral and size small, with no icons', () => {
    const { container } = render(<NlBadge>Member</NlBadge>);
    expect(root(container)).toHaveAttribute('data-tone', 'neutral');
    expect(root(container)).toHaveAttribute('data-size', 'small');
    expect(root(container)).toHaveClass('nl:bg-neutral', 'nl:text-secondary', 'nl:text-label-s');
    expect(container.querySelector('[data-icon]')).toBeNull();
  });

  it('is plain text in a span that a screen reader reads', () => {
    const { container } = render(<NlBadge tone="success">Active</NlBadge>);
    expect(root(container).tagName).toBe('SPAN');
    expect(root(container)).not.toHaveAttribute('role');
    expect(root(container)).not.toHaveAttribute('aria-hidden');
    expect(root(container)).toHaveTextContent('Active');
    expect(container.querySelector('[tabindex]')).toBeNull();
  });

  it.each([
    ['primary', ['nl:bg-brand', 'nl:text-white-both'], 'nl:text-fg-white-both'],
    ['secondary', ['nl:inset-ring', 'nl:inset-ring-strong', 'nl:text-secondary'], 'nl:text-fg-secondary'],
    [
      'success',
      ['nl:bg-success-secondary', 'nl:inset-ring', 'nl:inset-ring-success', 'nl:text-success'],
      'nl:text-fg-success',
    ],
    ['error', ['nl:bg-error-secondary', 'nl:inset-ring', 'nl:inset-ring-error', 'nl:text-error'], 'nl:text-fg-error'],
    ['info', ['nl:bg-info-secondary', 'nl:inset-ring', 'nl:inset-ring-info', 'nl:text-info'], 'nl:text-fg-info'],
    [
      'warning',
      ['nl:bg-warning-secondary', 'nl:inset-ring', 'nl:inset-ring-warning', 'nl:text-warning'],
      'nl:text-fg-warning',
    ],
    ['neutral', ['nl:bg-neutral', 'nl:text-secondary'], 'nl:text-fg-secondary'],
    ['disabled', ['nl:bg-disabled', 'nl:text-disabled-on-bg'], 'nl:text-fg-disabled-on-bg'],
  ] as const)('tone %s uses %s with icons %s', (tone, badge, icon) => {
    const { container } = render(
      <NlBadge tone={tone} leadingIcon="check" trailingIcon="close">
        Label
      </NlBadge>,
    );
    expect(root(container)).toHaveAttribute('data-tone', tone);
    expect(root(container)).toHaveClass(...badge);
    for (const slot of container.querySelectorAll('[data-slot]')) expect(slot).toHaveClass(icon);
  });

  it('has no fill on secondary and no border on primary, neutral and disabled', () => {
    const { container: a } = render(<NlBadge tone="secondary">Draft</NlBadge>);
    expect(root(a).className).not.toMatch(/nl:bg-/);
    for (const tone of ['primary', 'neutral', 'disabled'] as const) {
      const { container } = render(<NlBadge tone={tone}>Label</NlBadge>);
      expect(root(container)).not.toHaveClass('nl:inset-ring');
    }
  });

  it('passes size and icons through to the base', () => {
    const { container } = render(
      <NlBadge size="large" leadingIcon="check" trailingIcon="close">
        Active
      </NlBadge>,
    );
    expect(root(container)).toHaveAttribute('data-size', 'large');
    expect(root(container)).toHaveClass('nl:text-label-m', 'nl:min-h-32');
    const icons = container.querySelectorAll('[data-icon]');
    expect(icons).toHaveLength(2);
    expect(icons[0]).toHaveAttribute('data-size', '20');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <NlBadge className="nl:ms-xs" id="probe" ref={ref}>
        Member
      </NlBadge>,
    );
    expect(root(container).className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(root(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(root(container));
  });
});
