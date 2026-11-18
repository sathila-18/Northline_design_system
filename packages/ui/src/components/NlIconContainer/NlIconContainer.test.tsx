import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlIconContainer } from './NlIconContainer';

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const icon = (container: HTMLElement) => root(container).firstElementChild as HTMLElement;

describe('NlIconContainer', () => {
  it('defaults to size 48 and tone primary', () => {
    const { container } = render(<NlIconContainer icon="search" />);
    expect(root(container)).toHaveAttribute('data-size', '48');
    expect(root(container)).toHaveAttribute('data-tone', 'primary');
    expect(root(container)).toHaveClass('nl:size-48', 'nl:rounded-full', 'nl:bg-icons', 'nl:text-fg-primary');
  });

  it('renders one NlIcon that inherits the colour', () => {
    const { container } = render(<NlIconContainer icon="search" />);
    expect(root(container).children).toHaveLength(1);
    expect(icon(container)).toHaveAttribute('data-icon', 'search');
    expect(icon(container)).toHaveAttribute('data-tone', 'inherit');
  });

  it.each([
    [40, 'nl:size-40', '24'],
    [48, 'nl:size-48', '24'],
    [64, 'nl:size-64', '36'],
  ] as const)('size %s uses %s and a %s icon', (size, cls, iconSize) => {
    const { container } = render(<NlIconContainer icon="search" size={size} />);
    expect(root(container)).toHaveAttribute('data-size', String(size));
    expect(root(container)).toHaveClass(cls);
    expect(icon(container)).toHaveAttribute('data-size', iconSize);
  });

  it.each([
    ['primary', 'nl:bg-icons', 'nl:text-fg-primary'],
    ['secondary', 'nl:bg-secondary', 'nl:text-fg-secondary'],
    ['disabled', 'nl:bg-disabled', 'nl:text-fg-disabled-on-bg'],
    ['success', 'nl:bg-success-secondary', 'nl:text-fg-success'],
    ['warning', 'nl:bg-warning-secondary', 'nl:text-fg-warning'],
    ['error', 'nl:bg-error-secondary', 'nl:text-fg-error'],
    ['info', 'nl:bg-info-secondary', 'nl:text-fg-info'],
  ] as const)('tone %s uses %s and %s', (tone, bg, fg) => {
    const { container } = render(<NlIconContainer icon="search" tone={tone} />);
    expect(root(container)).toHaveAttribute('data-tone', tone);
    expect(root(container)).toHaveClass(bg, fg);
  });

  it('is decorative by default', () => {
    const { container } = render(<NlIconContainer icon="search" />);
    expect(icon(container)).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('gives the icon role img and the label as its name when labelled', () => {
    render(<NlIconContainer icon="check_circle" label="Upload complete" />);
    expect(screen.getByRole('img', { name: 'Upload complete' })).not.toHaveAttribute('aria-hidden');
  });

  it('is never focusable', () => {
    const { container } = render(<NlIconContainer icon="search" label="Search" />);
    expect(root(container)).not.toHaveAttribute('tabindex');
    expect(icon(container)).not.toHaveAttribute('tabindex');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlIconContainer icon="search" className="nl:ms-xs" id="probe" ref={ref} />);
    expect(root(container).className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(root(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(root(container));
  });
});
