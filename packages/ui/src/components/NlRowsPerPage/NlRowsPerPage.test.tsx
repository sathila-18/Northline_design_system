import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlRowsPerPage } from './NlRowsPerPage';

function Controlled({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <NlRowsPerPage
      value={10}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        onOpenChange?.(value);
      }}
      aria-controls="rows-menu"
    />
  );
}

describe('NlRowsPerPage', () => {
  it('is a listbox trigger named by its visible text, closed by default', () => {
    render(<NlRowsPerPage value={25} />);
    const trigger = screen.getByRole('button', { name: 'Rows per page 25', expanded: false });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('data-open', 'false');
    expect(trigger).toHaveClass(
      'nl:bg-secondary',
      'nl:inset-ring',
      'nl:inset-ring-subtle',
      'nl:rounded-full',
      'nl:py-xs',
      'nl:px-l',
      'nl:gap-m',
    );
    expect(trigger.querySelector('[data-icon="keyboard_arrow_down"]')).toHaveAttribute('data-size', '24');
  });

  it('takes a label', () => {
    render(<NlRowsPerPage value={10} label="Members per page" />);
    expect(screen.getByRole('button', { name: 'Members per page 10' })).toBeInTheDocument();
  });

  it('a click asks to open and close; open shows the pressed look and the up arrow', async () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-controls', 'rows-menu');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveClass('nl:bg-tertiary');
    expect(trigger).not.toHaveClass('nl:bg-secondary');
    expect(trigger.querySelector('[data-icon="keyboard_arrow_up"]')).not.toBeNull();
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('Enter, Space and Down arrow open it', async () => {
    const onOpenChange = vi.fn();
    render(<NlRowsPerPage value={10} onOpenChange={onOpenChange} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onOpenChange.mock.calls).toEqual([[true], [true], [true]]);
  });

  it('has hover, pressed, disabled and focus classes, and text colours that follow disabled', () => {
    render(<NlRowsPerPage value={10} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass(
      'nl:enabled:hover:bg-tertiary',
      'nl:enabled:active:bg-tertiary',
      'nl:disabled:bg-disabled',
      'nl:disabled:inset-ring-0',
      'nl:focus-visible:outline-focused',
      'nl:duration-fast',
    );
    expect(screen.getByText('Rows per page')).toHaveClass(
      'nl:text-body-s',
      'nl:text-tertiary',
      'nl:group-disabled/rows:text-disabled-on-bg',
    );
    expect(screen.getByText('10')).toHaveClass(
      'nl:text-label-s',
      'nl:text-primary',
      'nl:group-disabled/rows:text-disabled-on-bg',
    );
    expect(trigger.querySelector('[data-slot="icon"]')).toHaveClass(
      'nl:text-fg-secondary',
      'nl:group-disabled/rows:text-fg-disabled-on-bg',
    );
  });

  it('disabled: native, not focusable, no open request', async () => {
    const onOpenChange = vi.fn();
    render(<NlRowsPerPage value={10} disabled onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
    await userEvent.tab();
    expect(trigger).not.toHaveFocus();
    await userEvent.click(trigger);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('an onClick that calls preventDefault stops the request', async () => {
    const onOpenChange = vi.fn();
    render(
      <NlRowsPerPage
        value={10}
        onOpenChange={onOpenChange}
        onClick={(event) => {
          event.preventDefault();
        }}
      />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('passes ref and native attributes and appends className last', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<NlRowsPerPage value={10} ref={ref} id="probe" className="nl:ms-xs" />);
    const trigger = screen.getByRole('button');
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute('id', 'probe');
    expect(trigger.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
