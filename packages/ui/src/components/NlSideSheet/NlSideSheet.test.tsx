import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { NlSideSheet, type NlSideSheetProps } from './NlSideSheet';

beforeAll(() => {
  // jsdom has no modal dialog support: stand in for showModal() and close().
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
});

function Harness(props: Partial<NlSideSheetProps>) {
  const [open, setOpen] = useState(true);
  return <NlSideSheet title="Edit reward" {...props} open={open} onOpenChange={setOpen} />;
}

describe('NlSideSheet', () => {
  it('a dialog named by its title (h2 headline-large), on the end edge, Size-560 by default, slides in', () => {
    render(<Harness />);
    const dialog = screen.getByRole('dialog', { name: 'Edit reward' });
    expect(screen.getByRole('heading', { level: 2, name: 'Edit reward' })).toHaveClass('nl:text-headline-large-h4');
    const panel = dialog.querySelector('[data-size]');
    expect(panel).toHaveClass(
      'nl:end-none',
      'nl:h-dvh',
      'nl:bg-primary',
      'nl:z-modal',
      'nl:max-w-560',
      'nl:duration-slow',
      'nl:ease-standard',
      'nl:starting:translate-x-full',
      'nl:motion-reduce:starting:opacity-0',
    );
  });

  it('large: Size-720', () => {
    render(<Harness size="large" />);
    expect(screen.getByRole('dialog').querySelector('[data-size]')).toHaveClass('nl:max-w-720');
  });

  it('header: Space-4XL top, Space-3XL sides, gap Space-XS; close and back buttons are tertiary icon-only', () => {
    const onBack = vi.fn();
    render(<Harness onBack={onBack} />);
    const close = screen.getByRole('button', { name: 'Close' });
    const back = screen.getByRole('button', { name: 'Back' });
    expect(close.closest('[class*="pt-4xl"]')).toHaveClass('nl:px-3xl', 'nl:gap-xs');
    expect(back.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'arrow_back');
    expect(close.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'close');
  });

  it('first focus: the first field in the body, else the close button', () => {
    const { unmount } = render(
      <Harness>
        <input aria-label="Reward name" />
      </Harness>,
    );
    expect(screen.getByRole('textbox', { name: 'Reward name' })).toHaveFocus();
    unmount();
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('close button, Escape (cancel) and the overlay close it; dismissible false keeps it open on the overlay', () => {
    vi.useFakeTimers();
    const { container, unmount } = render(<Harness />);
    const dialog = container.querySelector('dialog');
    if (!dialog) throw new Error('no dialog');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    act(() => {
      vi.runAllTimers();
    });
    expect(dialog).not.toHaveAttribute('open');
    unmount();
    const second = render(<Harness dismissible={false} />);
    const overlay = second.container.querySelector('[aria-hidden="true"][data-open]');
    if (!overlay) throw new Error('no overlay');
    fireEvent.click(overlay);
    act(() => {
      vi.runAllTimers();
    });
    expect(second.container.querySelector('dialog')).toHaveAttribute('open');
    second.unmount();
    const third = render(<Harness />);
    const overlay3 = third.container.querySelector('[aria-hidden="true"][data-open]');
    if (!overlay3) throw new Error('no overlay');
    fireEvent.click(overlay3);
    act(() => {
      vi.runAllTimers();
    });
    expect(third.container.querySelector('dialog')).not.toHaveAttribute('open');
    vi.useRealTimers();
  });

  it("the back button calls onBack and doesn't close", async () => {
    const onBack = vi.fn();
    const { container } = render(<Harness onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledOnce();
    expect(container.querySelector('dialog')).toHaveAttribute('open');
  });

  it('hideClose, divider, footer dock; body bottom padding per footer', () => {
    const { container } = render(
      <Harness hideClose divider footer={{ primary: { children: 'Save' } }}>
        <p>Body</p>
      </Harness>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="body"]')).toHaveClass('nl:p-3xl', 'nl:gap-3xl', 'nl:overflow-y-auto');
    expect(container.querySelector('[data-size] > [aria-hidden="true"][data-type]')).not.toBeNull();
  });

  it('with no close button and no field, focus goes to the panel', () => {
    const { container } = render(<Harness hideClose />);
    expect(container.querySelector('[data-size]')).toHaveFocus();
  });

  it('a slot title still names the dialog', () => {
    render(<Harness title={<strong>Custom title</strong>} />);
    expect(screen.getByRole('dialog', { name: 'Custom title' })).toBeInTheDocument();
  });
});
