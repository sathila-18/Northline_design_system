import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlNavIcon } from './NlNavIcon';

describe('NlNavIcon', () => {
  it('unselected: Size-20, fg-secondary, outlined, decorative', () => {
    const { container } = render(<NlNavIcon selected={false} name="person" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-selected', 'false');
    expect(root).toHaveClass(
      'nl:size-20',
      'nl:p-none',
      'nl:text-fg-secondary',
      'nl:duration-fast',
      'nl:motion-reduce:transition-none',
    );
    const icon = root.querySelector('[data-icon="person"]');
    expect(icon).toHaveAttribute('data-size', '20');
    expect(icon).not.toHaveClass('nl:icon-filled');
  });

  it('selected: fg-active and filled (OD-71)', () => {
    const { container } = render(<NlNavIcon selected name="person" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-selected', 'true');
    expect(root).toHaveClass('nl:text-fg-active');
    expect(root).not.toHaveClass('nl:text-fg-secondary');
    expect(root.querySelector('[data-icon]')).toHaveClass('nl:icon-filled');
  });

  it('passes ref and native attributes and appends className last', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlNavIcon selected={false} name="menu" ref={ref} id="probe" className="nl:ms-xs" />);
    const root = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('id', 'probe');
    expect(root.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
