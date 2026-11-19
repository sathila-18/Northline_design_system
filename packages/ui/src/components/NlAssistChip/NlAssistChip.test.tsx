import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlAssistChip } from './NlAssistChip';

function Dropdown({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <NlAssistChip
      dropdown
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        onOpenChange?.(value);
      }}
      aria-controls="date-menu"
      leadingIcon="calendar_today"
    >
      Date range
    </NlAssistChip>
  );
}

describe('NlAssistChip', () => {
  it('is an action button by default: bordered look, no arrow, no popup', async () => {
    const onClick = vi.fn();
    render(<NlAssistChip onClick={onClick}>Export</NlAssistChip>);
    const chip = screen.getByRole('button', { name: 'Export' });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('data-look', 'unselected-bordered');
    expect(chip).toHaveAttribute('data-size', 'small');
    expect(chip).not.toHaveAttribute('aria-haspopup');
    expect(chip).not.toHaveAttribute('aria-expanded');
    expect(chip.querySelector('[data-slot="trailing"]')).toBeNull();
    expect(chip).toHaveClass('nl:bg-primary', 'nl:inset-ring-default', 'nl:shadow-resting', 'nl:text-primary');
    await userEvent.click(chip);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('dropdown: popup, collapsed, arrow down; a click opens and closes it', async () => {
    const onOpenChange = vi.fn();
    render(<Dropdown onOpenChange={onOpenChange} />);
    const chip = screen.getByRole('button', { name: 'Date range', expanded: false });
    expect(chip).toHaveAttribute('aria-haspopup', 'menu');
    expect(chip).toHaveAttribute('aria-controls', 'date-menu');
    expect(chip.querySelector('[data-slot="trailing"] [data-icon="keyboard_arrow_down"]')).not.toBeNull();
    await userEvent.click(chip);
    expect(chip).toHaveAttribute('aria-expanded', 'true');
    expect(chip).toHaveAttribute('data-look', 'selected');
    expect(chip.querySelector('[data-icon="keyboard_arrow_up"]')).not.toBeNull();
    await userEvent.click(chip);
    expect(chip).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('Down arrow asks to open, and does nothing when already open', async () => {
    const onOpenChange = vi.fn();
    render(<Dropdown onOpenChange={onOpenChange} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(onOpenChange.mock.calls).toEqual([[true]]);
  });

  it('takes the popup type', () => {
    render(
      <NlAssistChip dropdown popup="dialog">
        More filters
      </NlAssistChip>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('closed has hover, pressed and disabled colours', () => {
    render(<NlAssistChip leadingIcon="calendar_today">Date range</NlAssistChip>);
    const chip = screen.getByRole('button');
    expect(chip).toHaveClass(
      'nl:enabled:hover:bg-active-hover',
      'nl:enabled:hover:inset-ring-0',
      'nl:enabled:hover:shadow-none',
      'nl:enabled:active:bg-action-primary-pressed',
      'nl:enabled:active:text-white-both',
      'nl:disabled:bg-disabled',
      'nl:disabled:shadow-none',
      'nl:disabled:text-disabled-on-bg',
      'nl:focus-visible:outline-focused',
    );
    expect(chip.querySelector('[data-slot="leading"]')).toHaveClass(
      'nl:text-fg-secondary',
      'nl:group-active/chip:text-fg-white-both',
      'nl:group-disabled/chip:text-fg-disabled-on-bg',
    );
  });

  it('open keeps its look on hover but still shows pressed', () => {
    render(
      <NlAssistChip dropdown open leadingIcon="calendar_today">
        Date range
      </NlAssistChip>,
    );
    const chip = screen.getByRole('button');
    expect(chip).toHaveClass('nl:bg-active', 'nl:inset-ring-active', 'nl:text-action');
    expect(chip).toHaveClass('nl:enabled:active:bg-action-primary-pressed');
    expect(chip.className).not.toMatch(/hover:/);
    expect(chip.querySelector('[data-slot="leading"]')).toHaveClass('nl:text-fg-brand');
    expect(chip.querySelector('[data-slot="trailing"]')).toHaveClass('nl:text-fg-secondary');
  });

  it('an onClick that calls preventDefault stops the open request', async () => {
    const onOpenChange = vi.fn();
    render(
      <NlAssistChip
        dropdown
        onOpenChange={onOpenChange}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        Date range
      </NlAssistChip>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('disabled: native, not focusable, no click', async () => {
    const onClick = vi.fn();
    render(
      <NlAssistChip disabled onClick={onClick}>
        Export
      </NlAssistChip>,
    );
    const chip = screen.getByRole('button');
    expect(chip).toBeDisabled();
    await userEvent.tab();
    expect(chip).not.toHaveFocus();
    await userEvent.click(chip);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes ref and native attributes and appends className last', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <NlAssistChip ref={ref} id="probe" className="nl:ms-xs">
        Export
      </NlAssistChip>,
    );
    const chip = screen.getByRole('button');
    expect(ref.current).toBe(chip);
    expect(chip).toHaveAttribute('id', 'probe');
    expect(chip.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
