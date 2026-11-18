import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlSkeleton } from './NlSkeleton';

const shape = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlSkeleton', () => {
  it('is always hidden from screen readers and has no role', () => {
    const { container } = render(<NlSkeleton aria-hidden={false} />);
    expect(shape(container)).toHaveAttribute('aria-hidden', 'true');
    expect(shape(container)).not.toHaveAttribute('role');
    expect(shape(container)).toBeEmptyDOMElement();
  });

  it('is never focusable', () => {
    const { container } = render(<NlSkeleton />);
    expect(shape(container)).not.toHaveAttribute('tabindex');
  });

  it('fills with bg-neutral and pulses, with no animation under reduced motion', () => {
    const { container } = render(<NlSkeleton />);
    expect(shape(container)).toHaveClass('nl:bg-neutral', 'nl:animate-skeleton-pulse', 'nl:motion-reduce:animate-none');
  });

  it('defaults to text', () => {
    const { container } = render(<NlSkeleton />);
    expect(shape(container)).toHaveAttribute('data-shape', 'text');
  });

  it.each([
    ['text', ['nl:h-12', 'nl:block', 'nl:rounded-xs']],
    ['rect', ['nl:h-24', 'nl:block', 'nl:rounded-s']],
    ['circle', ['nl:size-24', 'nl:rounded-full']],
  ] as const)('shape %s uses %s', (value, classes) => {
    const { container } = render(<NlSkeleton shape={value} />);
    expect(shape(container)).toHaveAttribute('data-shape', value);
    expect(shape(container)).toHaveClass(...classes);
  });

  it.each(['text', 'rect'] as const)('%s sets no width of its own, so a caller width never competes', (value) => {
    const { container } = render(<NlSkeleton shape={value} />);
    expect(shape(container).className).not.toMatch(/nl:(w|size)-/);
  });

  it('appends className last (to resize it) and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlSkeleton className="nl:w-1/2" id="probe" ref={ref} />);
    expect(shape(container).className.split(' ').at(-1)).toBe('nl:w-1/2');
    expect(shape(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(shape(container));
  });
});
