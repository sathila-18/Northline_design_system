import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { NlDialog, type NlDialogProps } from './NlDialog';

beforeAll(() => {
  // jsdom has no modal dialog support: stand in for showModal() and close().
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
});

function Harness(props: Partial<NlDialogProps>) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Opener
      </button>
      <NlDialog title="Move member?" {...props} open={open} onOpenChange={setOpen} />
    </>
  );
}

const overlayOf = (container: HTMLElement) => {
  const overlay = container.querySelector('[aria-hidden="true"][data-open]');
  if (!overlay) throw new Error('No overlay');
  return overlay;
};

describe('NlDialog', () => {
  it('a modal dialog named by the h2 title, described by a string body (Body L)', () => {
    render(<Harness>Points move with them.</Harness>);
    const dialog = screen.getByRole('dialog', { name: 'Move member?' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAccessibleDescription('Points move with them.');
    expect(screen.getByRole('heading', { level: 2, name: 'Move member?' })).toHaveClass('nl:text-headline-large-h4');
    expect(screen.getByText('Points move with them.')).toHaveClass('nl:text-body-l', 'nl:text-secondary');
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('small by default (Size-560); large is Size-720', () => {
    const { rerender } = render(<NlDialog open onOpenChange={() => undefined} title="T" />);
    expect(screen.getByText('T').closest('[data-size]')).toHaveClass('nl:max-w-560');
    rerender(<NlDialog open onOpenChange={() => undefined} title="T" size="large" />);
    expect(screen.getByText('T').closest('[data-size]')).toHaveClass('nl:max-w-720');
  });

  it('footer buttons are medium; focus starts on the primary', () => {
    render(
      <Harness
        primaryAction={{ children: 'Move' }}
        secondaryAction={{ children: 'Cancel' }}
        startAction={{ children: 'Reset' }}
      />,
    );
    const buttons = ['Reset', 'Cancel', 'Move'].map((name) => screen.getByRole('button', { name }));
    expect(buttons.map((b) => b.getAttribute('data-variant'))).toEqual(['tertiary', 'secondary', 'primary']);
    for (const button of buttons) expect(button).toHaveAttribute('data-size', 'medium');
    expect(screen.getByRole('button', { name: 'Move' })).toHaveFocus();
  });

  it('destructive primary: alertdialog, focus on the secondary (OD-180)', () => {
    render(
      <Harness primaryAction={{ children: 'Delete', tone: 'destructive' }} secondaryAction={{ children: 'Cancel' }} />,
    );
    expect(screen.getByRole('alertdialog', { name: 'Move member?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-tone', 'destructive');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('focus starts on the first field in the body', () => {
    render(
      <Harness primaryAction={{ children: 'Save' }}>
        <input aria-label="Reward name" />
      </Harness>,
    );
    expect(screen.getByRole('textbox', { name: 'Reward name' })).toHaveFocus();
  });

  it('close button, Escape (cancel) and the overlay ask to close; the dialog closes after the animation', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { container, rerender } = render(<NlDialog open onOpenChange={onOpenChange} title="T" />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    fireEvent.click(overlayOf(container));
    expect(onOpenChange).toHaveBeenCalledTimes(3);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    rerender(<NlDialog open={false} onOpenChange={onOpenChange} title="T" />);
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open');
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
    expect(document.documentElement.style.overflow).toBe('');
    vi.useRealTimers();
  });

  it('the close button is a ghost icon button pulled out to the padding edges', () => {
    render(<NlDialog open onOpenChange={() => undefined} title="T" />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toHaveAttribute('data-variant', 'tertiary');
    expect(close.parentElement).toHaveClass('nl:-mt-l', 'nl:-me-2xl');
  });

  it('not dismissible: the overlay does nothing; hideClose hides the close button', () => {
    const onOpenChange = vi.fn();
    const { container } = render(<NlDialog open onOpenChange={onOpenChange} title="T" dismissible={false} hideClose />);
    fireEvent.click(overlayOf(container));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('a click inside the panel never closes it', async () => {
    const onOpenChange = vi.fn();
    render(
      <NlDialog open onOpenChange={onOpenChange} title="T">
        Body
      </NlDialog>,
    );
    await userEvent.click(screen.getByText('Body'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
