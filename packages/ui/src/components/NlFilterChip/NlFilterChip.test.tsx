import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlFilterChip } from './NlFilterChip';

describe('NlFilterChip', () => {
  it('is a toggle button, off and small by default', () => {
    render(<NlFilterChip>Active members</NlFilterChip>);
    const chip = screen.getByRole('button', { name: 'Active members', pressed: false });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('data-look', 'unselected');
    expect(chip).toHaveAttribute('data-size', 'small');
    expect(chip).toHaveClass('nl:bg-primary', 'nl:inset-ring-subtle', 'nl:text-primary');
  });

  it('toggles with a click, Space and Enter (uncontrolled)', async () => {
    const onSelectedChange = vi.fn();
    render(<NlFilterChip onSelectedChange={onSelectedChange}>Active members</NlFilterChip>);
    const chip = screen.getByRole('button');
    await userEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveAttribute('data-look', 'selected');
    await userEvent.keyboard(' ');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.keyboard('{Enter}');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(onSelectedChange.mock.calls).toEqual([[true], [false], [true]]);
  });

  it('follows the selected prop when controlled', async () => {
    function Controlled() {
      const [on, setOn] = useState(true);
      return (
        <NlFilterChip selected={on} onSelectedChange={setOn}>
          Tier 2
        </NlFilterChip>
      );
    }
    render(<Controlled />);
    const chip = screen.getByRole('button', { pressed: true });
    await userEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not toggle when onClick calls preventDefault', async () => {
    render(
      <NlFilterChip
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        Tier 2
      </NlFilterChip>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('disabled: native, not focusable, no toggle', async () => {
    const onSelectedChange = vi.fn();
    render(
      <NlFilterChip disabled onSelectedChange={onSelectedChange}>
        Tier 2
      </NlFilterChip>,
    );
    const chip = screen.getByRole('button');
    expect(chip).toBeDisabled();
    await userEvent.tab();
    expect(chip).not.toHaveFocus();
    await userEvent.click(chip);
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it.each([
    [
      false,
      [
        'nl:enabled:hover:bg-active-hover',
        'nl:enabled:hover:inset-ring-0',
        'nl:enabled:active:bg-action-primary-pressed',
        'nl:enabled:active:text-white-both',
        'nl:disabled:bg-disabled',
        'nl:disabled:inset-ring-0',
        'nl:disabled:text-disabled-on-bg',
      ],
      'nl:text-fg-primary',
    ],
    [
      true,
      [
        'nl:bg-active',
        'nl:inset-ring-active',
        'nl:text-action',
        'nl:enabled:active:inset-ring-pressed',
        'nl:disabled:inset-ring-disabled',
      ],
      'nl:text-fg-brand',
    ],
  ] as const)('selected=%s has its state colours, leading icon included', (selected, chipClasses, leading) => {
    render(
      <NlFilterChip selected={selected} leadingIcon="check">
        Tier 2
      </NlFilterChip>,
    );
    const chip = screen.getByRole('button');
    expect(chip).toHaveClass(...chipClasses, 'nl:focus-visible:outline-focused', 'nl:duration-fast');
    const slot = chip.querySelector('[data-slot="leading"]');
    expect(slot).toHaveClass(
      leading,
      'nl:group-active/chip:text-fg-white-both',
      'nl:group-disabled/chip:text-fg-disabled-on-bg',
    );
    expect(slot?.querySelector('[data-icon="check"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    ['xsmall', '16'],
    ['large', '20'],
  ] as const)('size %s draws the leading icon at %s', (size, iconSize) => {
    render(
      <NlFilterChip size={size} leadingIcon="calendar_today">
        This week
      </NlFilterChip>,
    );
    expect(screen.getByRole('button').querySelector('[data-icon]')).toHaveAttribute('data-size', iconSize);
  });

  it('passes ref and native attributes and appends className last', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NlFilterChip ref={ref} id="probe" className="nl:ms-xs">
        Tier 2
      </NlFilterChip>,
    );
    const chip = screen.getByRole('button');
    expect(ref.current).toBe(chip);
    expect(chip).toHaveAttribute('id', 'probe');
    expect(chip.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
