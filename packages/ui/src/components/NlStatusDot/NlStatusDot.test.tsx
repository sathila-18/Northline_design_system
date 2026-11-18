import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlStatusDot } from './NlStatusDot';

const dot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlStatusDot', () => {
  it('is decorative by default', () => {
    const { container } = render(<NlStatusDot />);
    expect(dot(container)).toHaveAttribute('aria-hidden', 'true');
    expect(dot(container)).not.toHaveAttribute('role');
    expect(dot(container)).toBeEmptyDOMElement();
  });

  it('has role img and the label as its name when labelled', () => {
    render(<NlStatusDot label="Online" />);
    expect(screen.getByRole('img', { name: 'Online' })).not.toHaveAttribute('aria-hidden');
  });

  it('is never focusable', () => {
    const { container } = render(<NlStatusDot label="Online" />);
    expect(dot(container)).not.toHaveAttribute('tabindex');
  });

  it('uses fg-success with a 1px border-inverse ring outside the diameter', () => {
    const { container } = render(<NlStatusDot />);
    expect(dot(container)).toHaveClass(
      'nl:bg-fg-success',
      'nl:border',
      'nl:border-inverse',
      'nl:box-content',
      'nl:rounded-full',
    );
  });

  it('defaults to medium', () => {
    const { container } = render(<NlStatusDot />);
    expect(dot(container)).toHaveAttribute('data-size', 'medium');
    expect(dot(container)).toHaveClass('nl:size-12');
  });

  it.each([
    ['xsmall', 'nl:size-6'],
    ['small', 'nl:size-8'],
    ['medium', 'nl:size-12'],
    ['large', 'nl:size-16'],
    ['xlarge', 'nl:size-24'],
  ] as const)('size %s uses %s', (size, cls) => {
    const { container } = render(<NlStatusDot size={size} />);
    expect(dot(container)).toHaveAttribute('data-size', size);
    expect(dot(container)).toHaveClass(cls);
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlStatusDot className="nl:ms-xs" id="probe" ref={ref} />);
    expect(dot(container).className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(dot(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(dot(container));
  });
});
