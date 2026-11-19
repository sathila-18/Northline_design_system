import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlSpinner } from './NlSpinner';

describe('NlSpinner', () => {
  it('loading by default: a named progressbar with no value, turning', () => {
    const { container } = render(<NlSpinner label="Loading rewards" />);
    const bar = screen.getByRole('progressbar', { name: 'Loading rewards' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(container.firstElementChild).toHaveAttribute('data-status', 'loading');
    const svg = bar.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('nl:size-40', 'nl:animate-spinner-turn', 'nl:motion-reduce:animate-none');
  });

  it('draws a track and a brand arc with a 4 stroke, the arc a quarter by default', () => {
    render(<NlSpinner label="Loading rewards" />);
    const circles = screen.getByRole('progressbar').querySelectorAll('circle');
    const track = circles.item(0);
    const arc = circles.item(1);
    expect(track).toHaveClass('nl:spinner-track');
    expect(track).toHaveAttribute('stroke-width', '4');
    expect(arc).toHaveClass('nl:spinner-arc', 'nl:spinner-value');
    expect(arc).toHaveAttribute('pathLength', '100');
    expect(arc.style.getPropertyValue('--nl-spinner-value')).toBe('');
  });

  it('with a value: arc length and aria values, clamped, and no turning', () => {
    const { rerender } = render(<NlSpinner label="Uploading file" value={40} />);
    let bar = screen.getByRole('progressbar', { name: 'Uploading file' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar.querySelector('svg')).not.toHaveClass('nl:animate-spinner-turn');
    expect(bar.querySelectorAll('circle').item(1).style.getPropertyValue('--nl-spinner-value')).toBe('40');
    rerender(<NlSpinner label="Uploading file" value={140} />);
    bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  it.each([
    ['success', 'check', 'nl:bg-success-secondary', 'nl:text-fg-success'],
    ['error', 'warning', 'nl:bg-error-secondary', 'nl:text-fg-error'],
  ] as const)('%s: a decorative result circle and the label in the status region', (status, icon, bg, fg) => {
    const { container } = render(<NlSpinner status={status} label="Upload done" />);
    expect(screen.queryByRole('progressbar')).toBeNull();
    const result = container.querySelector('[data-slot="result"]');
    expect(result).toHaveAttribute('aria-hidden', 'true');
    expect(result).toHaveClass('nl:size-48', 'nl:rounded-full', bg, fg);
    expect(result?.querySelector(`[data-icon="${icon}"]`)).toHaveAttribute('data-size', '24');
    expect(screen.getByRole('status')).toHaveTextContent('Upload done');
  });

  it('keeps the status region while loading, empty, so the result is announced', () => {
    const { rerender } = render(<NlSpinner label="Uploading file" />);
    const region = screen.getByRole('status');
    expect(region).toBeEmptyDOMElement();
    expect(region).toHaveClass('nl:sr-only');
    rerender(<NlSpinner status="error" label="Upload failed" />);
    expect(screen.getByRole('status')).toBe(region);
    expect(region).toHaveTextContent('Upload failed');
  });

  it('passes ref and native attributes to the root and appends className last', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlSpinner label="Loading" id="probe" className="nl:ms-xs" ref={ref} />);
    const root = container.firstElementChild as HTMLSpanElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('id', 'probe');
    expect(root.className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(root).toHaveClass('nl:size-48');
  });
});
