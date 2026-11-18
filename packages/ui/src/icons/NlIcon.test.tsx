import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlIcon } from './NlIcon';
import { nlIconNames, nlIcons } from './nlIcons';

const icon = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlIcon', () => {
  it('renders the glyph at its code point, decorative by default', () => {
    const { container } = render(<NlIcon name="close" />);
    const el = icon(container);
    expect(el.textContent).toBe(String.fromCodePoint(nlIcons.close));
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('has role img and the label as its name when labelled', () => {
    render(<NlIcon name="warning" label="Warning" />);
    const el = screen.getByRole('img', { name: 'Warning' });
    expect(el).not.toHaveAttribute('aria-hidden');
  });

  it('is never focusable', () => {
    const { container } = render(<NlIcon name="info" label="Info" />);
    expect(icon(container)).not.toHaveAttribute('tabindex');
  });

  it('defaults to size 24, inherit and outlined', () => {
    const { container } = render(<NlIcon name="info" />);
    const el = icon(container);
    expect(el).toHaveAttribute('data-size', '24');
    expect(el).toHaveAttribute('data-tone', 'inherit');
    expect(el).toHaveAttribute('data-filled', 'false');
    expect(el).toHaveClass('nl:size-24', 'nl:icon-24');
    expect(el.className).not.toMatch(/nl:text-fg-|nl:icon-filled/);
  });

  it.each([16, 20, 24, 36, 48, 64] as const)('size %i sets the box and glyph size', (size) => {
    const { container } = render(<NlIcon name="info" size={size} />);
    const el = icon(container);
    expect(el).toHaveAttribute('data-size', String(size));
    expect(el).toHaveClass(`nl:size-${size}`, `nl:icon-${size}`);
  });

  it.each(['primary', 'secondary', 'disabled', 'success', 'warning', 'error', 'info'] as const)(
    'tone %s uses fg-%s',
    (tone) => {
      const { container } = render(<NlIcon name="info" tone={tone} />);
      expect(icon(container)).toHaveClass(`nl:text-fg-${tone}`);
      expect(icon(container)).toHaveAttribute('data-tone', tone);
    },
  );

  it('filled sets the FILL axis', () => {
    const { container } = render(<NlIcon name="check_circle" filled />);
    expect(icon(container)).toHaveClass('nl:icon-filled');
    expect(icon(container)).toHaveAttribute('data-filled', 'true');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlIcon name="info" className="nl:ms-xs" id="probe" title="Tip" ref={ref} />);
    const el = icon(container);
    expect(el.className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(el).toHaveAttribute('id', 'probe');
    expect(el).toHaveAttribute('title', 'Tip');
    expect(ref.current).toBe(el);
  });
});

describe('nlIcons registry', () => {
  it('has unique code points in the private use area', () => {
    const codePoints = Object.values(nlIcons);
    expect(new Set(codePoints).size).toBe(codePoints.length);
    for (const codePoint of codePoints) expect(codePoint).toBeGreaterThanOrEqual(0xe000);
  });

  it('is in alphabetical order', () => {
    expect(nlIconNames).toEqual([...nlIconNames].sort());
  });
});
