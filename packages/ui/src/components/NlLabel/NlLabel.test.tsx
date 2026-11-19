import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlLabel } from './NlLabel';

describe('NlLabel', () => {
  it('defaults to a medium, tertiary span with no badge', () => {
    render(<NlLabel>Tier 2</NlLabel>);
    const label = screen.getByText('Tier 2');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveAttribute('data-size', 'medium');
    expect(label).toHaveAttribute('data-tone', 'tertiary');
    expect(label).toHaveClass(
      'nl:inline-flex',
      'nl:items-center',
      'nl:justify-start',
      'nl:gap-m',
      'nl:p-none',
      'nl:text-label-m',
      'nl:text-tertiary',
    );
    expect(label.querySelector('[data-digits]')).toBeNull();
  });

  it.each([
    ['medium', 'nl:text-label-m'],
    ['small', 'nl:text-label-s'],
  ] as const)('size %s uses its text style', (size, textStyle) => {
    render(<NlLabel size={size}>Tier 2</NlLabel>);
    expect(screen.getByText('Tier 2')).toHaveClass(textStyle);
  });

  it.each([
    ['tertiary', 'nl:text-tertiary'],
    ['primary', 'nl:text-primary'],
    ['secondary', 'nl:text-secondary'],
    ['action', 'nl:text-action'],
  ] as const)('tone %s uses its text colour (OD-50)', (tone, colour) => {
    render(<NlLabel tone={tone}>Tier 2</NlLabel>);
    expect(screen.getByText('Tier 2')).toHaveClass(colour);
    expect(screen.getByText('Tier 2')).toHaveAttribute('data-tone', tone);
  });

  it('shows a small error dot with hidden meaning, read after the label', () => {
    const { container } = render(
      <NlLabel badge badgeLabel="New">
        Rewards
      </NlLabel>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveTextContent('RewardsNew');
    const dot = root.querySelector('[data-digits="none"]');
    expect(dot).toHaveAttribute('data-size', 'small');
    expect(dot).toHaveAttribute('data-tone', 'error');
    expect(root.lastElementChild).toBe(dot);
  });

  it.each(['warning', 'success'] as const)('takes badgeTone %s (OD-65)', (badgeTone) => {
    const { container } = render(
      <NlLabel badge badgeTone={badgeTone} badgeLabel="Updated">
        Rewards
      </NlLabel>,
    );
    expect(container.querySelector('[data-digits="none"]')).toHaveAttribute('data-tone', badgeTone);
  });

  it('as="label" names its control and focuses it on click (OD-66)', async () => {
    render(
      <>
        <NlLabel as="label" htmlFor="member-id">
          Member ID
        </NlLabel>
        <input id="member-id" />
      </>,
    );
    const input = screen.getByRole('textbox', { name: 'Member ID' });
    expect(screen.getByText('Member ID').tagName).toBe('LABEL');
    await userEvent.click(screen.getByText('Member ID'));
    expect(input).toHaveFocus();
  });

  it('passes ref and native attributes and appends className last', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <NlLabel id="probe" className="nl:ms-xs" ref={ref}>
        Tier 2
      </NlLabel>,
    );
    const label = screen.getByText('Tier 2');
    expect(ref.current).toBe(label);
    expect(label).toHaveAttribute('id', 'probe');
    expect(label.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
