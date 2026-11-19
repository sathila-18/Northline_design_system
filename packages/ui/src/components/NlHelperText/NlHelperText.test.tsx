import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlHelperText } from './NlHelperText';

const rootOf = (text: string) => {
  const root = screen.getByText(text).parentElement;
  if (!root) throw new Error('NlHelperText text has no root');
  return root;
};

describe('NlHelperText', () => {
  it('defaults to the hint tone with an info icon, Body S, full width', () => {
    render(<NlHelperText>Use the member number on the card.</NlHelperText>);
    const root = rootOf('Use the member number on the card.');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveAttribute('data-tone', 'default');
    expect(root).toHaveClass(
      'nl:flex',
      'nl:w-full',
      'nl:items-start',
      'nl:gap-m',
      'nl:p-none',
      'nl:text-body-s',
      'nl:text-tertiary',
    );
    const icon = root.querySelector('[data-slot="icon"]');
    expect(icon).toHaveClass('nl:h-lh', 'nl:items-center', 'nl:text-fg-secondary');
    expect(icon?.querySelector('[data-icon="info"]')).toHaveAttribute('data-size', '20');
    expect(icon?.querySelector('[data-icon]')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    ['success', 'check_circle', 'nl:text-success', 'nl:text-fg-success'],
    ['warning', 'warning', 'nl:text-warning', 'nl:text-fg-warning'],
    ['error', 'error', 'nl:text-error', 'nl:text-fg-error'],
    ['disabled', 'info', 'nl:text-disabled', 'nl:text-fg-disabled'],
  ] as const)('tone %s: %s icon and its colours', (tone, glyph, text, icon) => {
    render(<NlHelperText tone={tone}>Message</NlHelperText>);
    const root = rootOf('Message');
    expect(root).toHaveAttribute('data-tone', tone);
    expect(root).toHaveClass(text);
    expect(root.querySelector('[data-slot="icon"]')).toHaveClass(icon);
    expect(root.querySelector(`[data-icon="${glyph}"]`)).not.toBeNull();
  });

  it('leaves out the icon with showIcon={false}', () => {
    render(<NlHelperText showIcon={false}>Message</NlHelperText>);
    expect(rootOf('Message').querySelector('[data-slot="icon"]')).toBeNull();
  });

  it('describes a field through its id', () => {
    render(
      <>
        <input aria-label="Member number" aria-describedby="member-help" />
        <NlHelperText id="member-help">Use the number on the card.</NlHelperText>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Member number' })).toHaveAccessibleDescription(
      'Use the number on the card.',
    );
  });

  it('passes ref and native attributes and appends className last', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <NlHelperText ref={ref} id="probe" className="nl:mt-xs">
        Message
      </NlHelperText>,
    );
    const root = rootOf('Message');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('id', 'probe');
    expect(root.className.split(' ').at(-1)).toBe('nl:mt-xs');
  });
});
