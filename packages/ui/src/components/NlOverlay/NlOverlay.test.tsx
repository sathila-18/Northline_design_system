import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlOverlay } from './NlOverlay';

const scrim = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlOverlay', () => {
  it('is always hidden from screen readers, with no role or name', () => {
    const { container } = render(<NlOverlay open aria-hidden={false} />);
    expect(scrim(container)).toHaveAttribute('aria-hidden', 'true');
    expect(scrim(container)).not.toHaveAttribute('role');
    expect(scrim(container)).not.toHaveAttribute('aria-label');
    expect(scrim(container)).toBeEmptyDOMElement();
  });

  it('is never focusable', () => {
    const { container } = render(<NlOverlay open />);
    expect(scrim(container)).not.toHaveAttribute('tabindex');
  });

  it('covers the viewport on the overlay layer with Alpha-md', () => {
    const { container } = render(<NlOverlay open />);
    expect(scrim(container)).toHaveClass('nl:fixed', 'nl:inset-none', 'nl:z-overlay', 'nl:bg-alpha-md');
  });

  it('when open, is shown at full opacity and fades in from 0', () => {
    const { container } = render(<NlOverlay open />);
    expect(scrim(container)).toHaveAttribute('data-open', 'true');
    expect(scrim(container)).toHaveClass('nl:block', 'nl:opacity-100', 'nl:starting:opacity-0');
    expect(scrim(container)).not.toHaveClass('nl:hidden');
  });

  it('when closed, stays in the page but is hidden (display none) so it can fade out', () => {
    const { container } = render(<NlOverlay open={false} />);
    expect(scrim(container)).toHaveAttribute('data-open', 'false');
    expect(scrim(container)).toHaveClass('nl:hidden', 'nl:opacity-0');
    expect(scrim(container)).not.toHaveClass('nl:block');
  });

  it('fades with the default transition, including display, and not under reduced motion', () => {
    const { container } = render(<NlOverlay open />);
    expect(scrim(container)).toHaveClass('nl:transition', 'nl:transition-discrete', 'nl:motion-reduce:transition-none');
  });

  it('passes clicks to the parent', () => {
    const onClick = vi.fn();
    const { container } = render(<NlOverlay open onClick={onClick} />);
    fireEvent.click(scrim(container));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('switches between shown and hidden when open changes', () => {
    const { container, rerender } = render(<NlOverlay open />);
    rerender(<NlOverlay open={false} />);
    expect(scrim(container)).toHaveClass('nl:hidden');
    rerender(<NlOverlay open />);
    expect(scrim(container)).toHaveClass('nl:block');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<NlOverlay open className="nl:z-modal" id="probe" ref={ref} />);
    expect(scrim(container).className.split(' ').at(-1)).toBe('nl:z-modal');
    expect(scrim(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(scrim(container));
  });
});
