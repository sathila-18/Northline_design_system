import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlCountBadge } from './NlCountBadge';

const badge = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlCountBadge', () => {
  it('defaults to small, error, and a decorative dot without a count', () => {
    const { container } = render(<NlCountBadge />);
    const el = badge(container);
    expect(el).toHaveAttribute('data-size', 'small');
    expect(el).toHaveAttribute('data-tone', 'error');
    expect(el).toHaveAttribute('data-digits', 'none');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('nl:size-6', 'nl:bg-fg-error');
    expect(el).toBeEmptyDOMElement();
  });

  it('renders nothing when the count is 0', () => {
    const { container } = render(<NlCountBadge count={0} label="No notifications" />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([-1, 2.5, Number.NaN])('treats %s as no count (the dot)', (count) => {
    const { container } = render(<NlCountBadge count={count} />);
    expect(badge(container)).toHaveAttribute('data-digits', 'none');
  });

  it.each([
    [7, '7', 'single'],
    [42, '42', 'double'],
    [99, '99', 'double'],
    [100, '99+', 'double'],
  ] as const)('count %i shows "%s" as %s digits', (count, text, digits) => {
    const { container } = render(<NlCountBadge count={count} />);
    expect(badge(container)).toHaveTextContent(text);
    expect(badge(container)).toHaveAttribute('data-digits', digits);
  });

  it('uses max for the cap', () => {
    const { container } = render(<NlCountBadge count={12} max={9} />);
    expect(badge(container)).toHaveTextContent('9+');
  });

  it.each([
    ['small', 'single', ['nl:size-16', 'nl:p-none', 'nl:text-caption-s']],
    ['small', 'double', ['nl:h-16', 'nl:min-w-16', 'nl:px-xs', 'nl:text-caption-s']],
    ['large', 'none', ['nl:size-12']],
    ['large', 'single', ['nl:size-20', 'nl:p-none', 'nl:text-caption-l']],
    ['large', 'double', ['nl:h-20', 'nl:min-w-20', 'nl:px-xs', 'nl:text-caption-l']],
  ] as const)('%s %s uses its size, padding and text style', (size, digits, classes) => {
    const count = { none: undefined, single: 5, double: 50 }[digits];
    const { container } = render(<NlCountBadge size={size} count={count} />);
    expect(badge(container)).toHaveClass(...classes);
  });

  it.each(['error', 'warning', 'success'] as const)('tone %s uses fg-%s with text-inverse', (tone) => {
    const { container } = render(<NlCountBadge tone={tone} count={3} />);
    expect(badge(container)).toHaveClass(`nl:bg-fg-${tone}`, 'nl:text-inverse');
  });

  it('reads the digits when there is no label', () => {
    const { container } = render(<NlCountBadge count={3} />);
    expect(badge(container)).not.toHaveAttribute('aria-hidden');
    expect(badge(container).querySelector('[aria-hidden]')).toBeNull();
  });

  it('reads the label instead of the digits when labelled', () => {
    const { container } = render(<NlCountBadge count={3} label="3 unread notifications" />);
    const el = badge(container);
    expect(el).not.toHaveAttribute('aria-hidden');
    expect(el.querySelector('[aria-hidden="true"]')).toHaveTextContent('3');
    expect(el.querySelector('.nl\\:sr-only')).toHaveTextContent('3 unread notifications');
  });

  it('reads the label on the dot form', () => {
    const { container } = render(<NlCountBadge label="New activity" />);
    expect(badge(container)).not.toHaveAttribute('aria-hidden');
    expect(badge(container)).toHaveTextContent('New activity');
  });

  it('is never focusable', () => {
    const { container } = render(<NlCountBadge count={3} label="3 unread" />);
    expect(badge(container)).not.toHaveAttribute('tabindex');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlCountBadge count={3} className="nl:ms-xs" id="probe" ref={ref} />);
    expect(badge(container).className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(badge(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(badge(container));
  });
});
