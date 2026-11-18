import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlProgressBar } from './NlProgressBar';

const fillOf = (bar: HTMLElement) => bar.firstElementChild as HTMLElement;

describe('NlProgressBar', () => {
  it('is a progressbar from 0 to 100 named by its label', () => {
    render(<NlProgressBar value={50} label="Upload" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
  });

  it('can be named by a visible label instead', () => {
    render(
      <>
        <span id="cap">Import members</span>
        <NlProgressBar value={20} aria-labelledby="cap" />
      </>,
    );
    const bar = screen.getByRole('progressbar', { name: 'Import members' });
    expect(bar).not.toHaveAttribute('aria-label');
  });

  it('is never focusable', () => {
    render(<NlProgressBar value={50} label="Upload" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('tabindex');
  });

  it.each([
    [-10, '0'],
    [0, '0'],
    [37.5, '37.5'],
    [100, '100'],
    [140, '100'],
    [Number.NaN, '0'],
  ])('clamps %s to %s', (value, expected) => {
    render(<NlProgressBar value={value} label="Upload" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', expected);
    expect(fillOf(bar).style.getPropertyValue('--nl-progress-value')).toBe(`${expected}%`);
  });

  it('track is bg-active-hover with Radius-XS and clips the fill', () => {
    render(<NlProgressBar value={50} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveClass(
      'nl:bg-active-hover',
      'nl:rounded-xs',
      'nl:overflow-hidden',
      'nl:w-full',
    );
  });

  it('fill is fg-brand, full height, width from the value, animated except under reduced motion', () => {
    render(<NlProgressBar value={50} label="Upload" />);
    expect(fillOf(screen.getByRole('progressbar'))).toHaveClass(
      'nl:bg-fg-brand',
      'nl:h-full',
      'nl:rounded-xs',
      'nl:progress-fill',
      'nl:duration-base',
      'nl:ease-standard',
      'nl:motion-reduce:transition-none',
    );
  });

  it('fill is hidden from the accessibility tree as a plain element with no role', () => {
    render(<NlProgressBar value={50} label="Upload" />);
    const fill = fillOf(screen.getByRole('progressbar'));
    expect(fill).not.toHaveAttribute('role');
    expect(fill).toBeEmptyDOMElement();
  });

  it('defaults to small', () => {
    render(<NlProgressBar value={50} label="Upload" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('data-size', 'small');
    expect(bar).toHaveClass('nl:h-4');
  });

  it('large is Size-8', () => {
    render(<NlProgressBar size="large" value={50} label="Upload" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('data-size', 'large');
    expect(bar).toHaveClass('nl:h-8');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<NlProgressBar value={50} label="Upload" className="nl:mt-xs" id="probe" ref={ref} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.className.split(' ').at(-1)).toBe('nl:mt-xs');
    expect(bar).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(bar);
  });
});
