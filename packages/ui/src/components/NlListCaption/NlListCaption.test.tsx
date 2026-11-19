import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlListCaption } from './NlListCaption';

describe('NlListCaption', () => {
  it('is a one-line span in Label M, text-tertiary, by default', () => {
    render(<NlListCaption>250 pts</NlListCaption>);
    const caption = screen.getByText('250 pts');
    expect(caption.tagName).toBe('SPAN');
    expect(caption).toHaveClass('nl:text-label-m', 'nl:text-tertiary', 'nl:whitespace-nowrap', 'nl:shrink-0');
    expect(caption).toHaveAttribute('data-size', 'medium');
    expect(caption).toHaveAttribute('data-weight', 'heavy');
  });

  it.each([
    ['heavy', 'small', 'nl:text-label-s'],
    ['heavy', 'large', 'nl:text-label-l'],
    ['light', 'small', 'nl:text-body-s'],
    ['light', 'medium', 'nl:text-body-m'],
    ['light', 'large', 'nl:text-body-l'],
  ] as const)('%s %s uses %s', (weight, size, cls) => {
    render(
      <NlListCaption weight={weight} size={size}>
        Tier 2
      </NlListCaption>,
    );
    expect(screen.getByText('Tier 2')).toHaveClass(cls);
  });

  it('disabled switches to text-disabled', () => {
    render(<NlListCaption disabled>Tier 2</NlListCaption>);
    const caption = screen.getByText('Tier 2');
    expect(caption).toHaveClass('nl:text-disabled');
    expect(caption).not.toHaveClass('nl:text-tertiary');
  });

  it('passes ref and attributes; className is appended for placement', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <NlListCaption ref={ref} id="caption" className="nl:ms-m">
        19 Nov
      </NlListCaption>,
    );
    const caption = screen.getByText('19 Nov');
    expect(ref.current).toBe(caption);
    expect(caption).toHaveAttribute('id', 'caption');
    expect(caption.className.endsWith('nl:ms-m')).toBe(true);
  });
});
