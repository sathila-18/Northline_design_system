import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlIcon } from '../../icons';
import { NlInputChip } from './NlInputChip';

const chipOf = (button: HTMLElement) => {
  const chip = button.closest('[data-look]');
  if (!(chip instanceof HTMLElement)) throw new Error('No chip');
  return chip;
};

describe('NlInputChip', () => {
  it('is a non-interactive span, small and bordered, with a remove button named "Remove {label}"', () => {
    render(<NlInputChip>Tier 2</NlInputChip>);
    const remove = screen.getByRole('button', { name: 'Remove Tier 2' });
    expect(remove).toHaveAttribute('type', 'button');
    const chip = chipOf(remove);
    expect(chip.tagName).toBe('SPAN');
    expect(chip).toHaveAttribute('data-look', 'unselected-bordered');
    expect(chip).toHaveAttribute('data-size', 'small');
    expect(chip).toHaveClass('nl:bg-primary', 'nl:inset-ring-default', 'nl:shadow-resting', 'nl:text-primary');
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('builds the name from any label content', () => {
    render(
      <NlInputChip>
        <strong>Member</strong> 0042
      </NlInputChip>,
    );
    expect(screen.getByRole('button', { name: 'Remove Member 0042' })).toBeInTheDocument();
  });

  it('takes removeLabel', () => {
    render(<NlInputChip removeLabel="Clear Tier 2 filter">Tier 2</NlInputChip>);
    expect(screen.getByRole('button', { name: 'Clear Tier 2 filter' })).toBeInTheDocument();
  });

  it.each(['{Enter}', ' ', '{Backspace}', '{Delete}'])('%s on the remove button removes', async (key) => {
    const onRemove = vi.fn();
    render(<NlInputChip onRemove={onRemove}>Tier 2</NlInputChip>);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await userEvent.keyboard(key);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('a click on the remove button removes', async () => {
    const onRemove = vi.fn();
    render(<NlInputChip onRemove={onRemove}>Tier 2</NlInputChip>);
    await userEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disabled: greyed, no border or shadow, no remove button', () => {
    const { container } = render(<NlInputChip disabled>Tier 2</NlInputChip>);
    expect(screen.queryByRole('button')).toBeNull();
    const chip = container.querySelector('[data-look]');
    expect(chip).toHaveAttribute('data-disabled', 'true');
    expect(chip).toHaveClass('nl:bg-disabled', 'nl:text-disabled-on-bg');
    expect(chip?.className).not.toMatch(/shadow|inset-ring/);
  });

  it.each([
    ['xsmall', '16', 'nl:-m-xs'],
    ['small', '16', 'nl:-m-xs'],
    ['large', '20', 'nl:-m-xxs'],
  ] as const)('size %s: close icon %s in a 24 hit area with %s', (size, iconSize, margin) => {
    render(<NlInputChip size={size}>Tier 2</NlInputChip>);
    const remove = screen.getByRole('button');
    expect(remove).toHaveClass('nl:size-24', margin, 'nl:rounded-xs', 'nl:focus-visible:outline-focused');
    expect(remove).toHaveClass('nl:hover:text-fg-primary', 'nl:active:text-fg-primary');
    expect(remove.querySelector('[data-icon="close"]')).toHaveAttribute('data-size', iconSize);
    expect(remove.parentElement).toHaveClass('nl:text-fg-secondary');
  });

  it('shows the leading item before the label', () => {
    render(<NlInputChip leading={<NlIcon name="person" size={16} tone="inherit" />}>Member 0042</NlInputChip>);
    const chip = chipOf(screen.getByRole('button'));
    expect((chip.firstElementChild as HTMLElement).dataset.slot).toBe('leading');
  });

  it('passes ref and native attributes to the chip and appends className last', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <NlInputChip ref={ref} id="probe" className="nl:ms-xs">
        Tier 2
      </NlInputChip>,
    );
    const chip = chipOf(screen.getByRole('button'));
    expect(ref.current).toBe(chip);
    expect(chip).toHaveAttribute('id', 'probe');
    expect(chip.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
