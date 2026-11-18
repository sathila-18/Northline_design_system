import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlDivider } from './NlDivider';

const line = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlDivider', () => {
  it('renders an <hr> with role separator by default', () => {
    render(<NlDivider />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('HR');
    expect(separator).not.toHaveAttribute('aria-hidden');
  });

  it('renders a hidden <div> when decorative', () => {
    const { container } = render(<NlDivider decorative />);
    expect(line(container).tagName).toBe('DIV');
    expect(line(container)).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('is never focusable', () => {
    const { container } = render(<NlDivider />);
    expect(line(container)).not.toHaveAttribute('tabindex');
  });

  it('defaults to divider: a 1px top border in border-default', () => {
    const { container } = render(<NlDivider />);
    expect(line(container)).toHaveAttribute('data-type', 'divider');
    expect(line(container)).toHaveClass('nl:border-t', 'nl:border-default', 'nl:w-full');
  });

  it.each([false, true])('section is Size-8 filled with border-default (decorative %s)', (decorative) => {
    const { container } = render(<NlDivider type="section" decorative={decorative} />);
    expect(line(container)).toHaveAttribute('data-type', 'section');
    expect(line(container)).toHaveClass('nl:h-8', 'nl:border-0', 'nl:bg-border-default');
    expect(line(container)).not.toHaveClass('nl:border-t');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<NlDivider className="nl:my-xl" id="probe" ref={ref} />);
    expect(line(container).className.split(' ').at(-1)).toBe('nl:my-xl');
    expect(line(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(line(container));
  });

  it('passes the ref to the <div> when decorative', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<NlDivider decorative ref={ref} />);
    expect(ref.current).toBe(line(container));
  });
});
