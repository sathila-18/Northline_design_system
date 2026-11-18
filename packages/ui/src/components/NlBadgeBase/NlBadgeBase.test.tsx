import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlBadgeBase } from './NlBadgeBase';

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlBadgeBase', () => {
  it('renders the label in a span that hugs its content on one line', () => {
    const { container } = render(<NlBadgeBase>Tier 2</NlBadgeBase>);
    expect(root(container).tagName).toBe('SPAN');
    expect(root(container)).toHaveTextContent('Tier 2');
    expect(root(container)).toHaveClass(
      'nl:inline-flex',
      'nl:items-center',
      'nl:whitespace-nowrap',
      'nl:px-m',
      'nl:py-xs',
      'nl:gap-xs',
      'nl:rounded-s',
    );
  });

  it('defaults to small', () => {
    const { container } = render(<NlBadgeBase leadingIcon="check">Tier 2</NlBadgeBase>);
    expect(root(container)).toHaveAttribute('data-size', 'small');
    expect(root(container)).toHaveClass('nl:text-label-s');
    expect(root(container)).not.toHaveClass('nl:min-h-32');
    expect(container.querySelector('[data-icon]')).toHaveAttribute('data-size', '16');
  });

  it('large uses Label M, 20 icons and a Size-32 minimum height', () => {
    const { container } = render(
      <NlBadgeBase size="large" leadingIcon="check">
        Tier 2
      </NlBadgeBase>,
    );
    expect(root(container)).toHaveAttribute('data-size', 'large');
    expect(root(container)).toHaveClass('nl:text-label-m', 'nl:min-h-32');
    expect(container.querySelector('[data-icon]')).toHaveAttribute('data-size', '20');
  });

  it('renders no icons by default', () => {
    const { container } = render(<NlBadgeBase>Tier 2</NlBadgeBase>);
    expect(container.querySelector('[data-icon]')).toBeNull();
  });

  it('puts the leading icon before the label and the trailing icon after it', () => {
    const { container } = render(
      <NlBadgeBase leadingIcon="check" trailingIcon="close">
        Tier 2
      </NlBadgeBase>,
    );
    const nodes = Array.from(root(container).childNodes);
    expect(nodes).toHaveLength(3);
    expect((nodes[0] as HTMLElement).dataset.slot).toBe('leading');
    expect(nodes[1]?.textContent).toBe('Tier 2');
    expect((nodes[2] as HTMLElement).dataset.slot).toBe('trailing');
    expect(container.querySelector('[data-slot="leading"] [data-icon]')).toHaveAttribute('data-icon', 'check');
    expect(container.querySelector('[data-slot="trailing"] [data-icon]')).toHaveAttribute('data-icon', 'close');
  });

  it('keeps icons decorative, inheriting the slot colour', () => {
    render(
      <NlBadgeBase leadingIcon="check" trailingIcon="close">
        Tier 2
      </NlBadgeBase>,
    );
    expect(screen.queryByRole('img')).toBeNull();
    for (const icon of document.querySelectorAll('[data-icon]')) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('data-tone', 'inherit');
    }
  });

  it('applies the appearance to the badge and the icon slots', () => {
    const { container } = render(
      <NlBadgeBase
        leadingIcon="check"
        trailingIcon="close"
        appearance={{ badge: 'nl:bg-neutral nl:text-secondary', icon: 'nl:text-fg-secondary' }}
      >
        Tier 2
      </NlBadgeBase>,
    );
    expect(root(container)).toHaveClass('nl:bg-neutral', 'nl:text-secondary');
    for (const slot of container.querySelectorAll('[data-slot]')) expect(slot).toHaveClass('nl:text-fg-secondary');
  });

  it('is never focusable', () => {
    const { container } = render(<NlBadgeBase leadingIcon="check">Tier 2</NlBadgeBase>);
    expect(container.querySelector('[tabindex]')).toBeNull();
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <NlBadgeBase appearance={{ badge: 'nl:bg-neutral', icon: '' }} className="nl:ms-xs" id="probe" ref={ref}>
        Tier 2
      </NlBadgeBase>,
    );
    expect(root(container).className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(root(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(root(container));
  });
});
