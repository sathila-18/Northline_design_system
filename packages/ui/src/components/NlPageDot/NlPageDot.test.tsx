import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlPageDot } from './NlPageDot';

describe('NlPageDot', () => {
  it('is a decorative Size-6 dot in fg-placeholder by default', () => {
    const { container } = render(<NlPageDot />);
    const dot = container.firstElementChild;
    expect(dot?.tagName).toBe('SPAN');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot).not.toHaveAttribute('data-current');
    expect(dot).toHaveClass('nl:h-6', 'nl:w-6', 'nl:rounded-full', 'nl:bg-fg-placeholder');
    expect(dot).toBeEmptyDOMElement();
  });

  it('current is a Size-24 pill in fg-brand', () => {
    const { container } = render(<NlPageDot current />);
    const dot = container.firstElementChild;
    expect(dot).toHaveAttribute('data-current', 'true');
    expect(dot).toHaveClass('nl:w-24', 'nl:bg-fg-brand');
    expect(dot).not.toHaveClass('nl:w-6');
  });

  it('eases width and colour with Duration base, none under reduced motion', () => {
    const { container } = render(<NlPageDot />);
    expect(container.firstElementChild).toHaveClass(
      'nl:transition-all',
      'nl:duration-base',
      'nl:ease-standard',
      'nl:motion-reduce:transition-none',
    );
  });

  it('is not interactive', () => {
    const { container } = render(<NlPageDot current />);
    const dot = container.firstElementChild;
    expect(dot).not.toHaveAttribute('tabindex');
    expect(dot).not.toHaveAttribute('role');
  });

  it('passes ref and attributes; className is appended for placement', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlPageDot ref={ref} id="dot" className="nl:ms-xs" />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveAttribute('id', 'dot');
    expect(ref.current?.className.endsWith('nl:ms-xs')).toBe(true);
  });
});
