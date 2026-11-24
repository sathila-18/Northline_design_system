import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NlSnackbar } from './NlSnackbar';
import { NlSnackbarProvider, useNlSnackbar, type NlSnackbarOptions } from './NlSnackbarProvider';

describe('NlSnackbar', () => {
  it('single line: 48 tall, Size-560 max, bg-direct, inverse text, Dismiss on by default', () => {
    const { container } = render(<NlSnackbar>Reward saved</NlSnackbar>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('nl:h-48', 'nl:max-w-560', 'nl:rounded-m', 'nl:bg-direct', 'nl:pe-xs');
    expect(screen.getByText('Reward saved')).toHaveClass('nl:text-body-m', 'nl:text-inverse', 'nl:truncate');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveAttribute('data-size', 'medium');
  });

  it.each([
    ['success', 'nl:bg-success-secondary', 'check_circle'],
    ['warning', 'nl:bg-warning-secondary', 'warning'],
    ['error', 'nl:bg-error-secondary', 'error'],
  ] as const)('%s: tint, primary text and its icon', (tone, bg, glyph) => {
    const { container } = render(<NlSnackbar tone={tone}>M</NlSnackbar>);
    expect(container.firstElementChild).toHaveClass(bg);
    expect(screen.getByText('M')).toHaveClass('nl:text-primary');
    expect(container.querySelector('[data-icon]')).toHaveAttribute('data-icon', glyph);
  });

  it('action is a tertiary small button; no buttons gives Space-XL at the end', async () => {
    const onClick = vi.fn();
    const { container, rerender } = render(<NlSnackbar action={{ label: 'Undo', onClick }}>M</NlSnackbar>);
    const undo = screen.getByRole('button', { name: 'Undo' });
    expect(undo).toHaveAttribute('data-size', 'small');
    await userEvent.click(undo);
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<NlSnackbar showClose={false}>M</NlSnackbar>);
    expect(container.firstElementChild).toHaveClass('nl:pe-xl');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('stacked: a column, message wraps, buttons on their own row at the end', () => {
    const { container } = render(<NlSnackbar layout="stacked">M</NlSnackbar>);
    expect(container.firstElementChild).toHaveClass('nl:flex-col');
    expect(screen.getByText('M')).not.toHaveClass('nl:truncate');
    expect(screen.getByRole('button', { name: 'Dismiss' }).parentElement).toHaveClass('nl:justify-end');
  });
});

type Api = ReturnType<typeof useNlSnackbar>;
const ref: { api: Api | null } = { api: null };
function Grab({ onReady }: { onReady: (api: Api) => void }) {
  const snackbar = useNlSnackbar();
  useEffect(() => {
    onReady(snackbar);
  });
  return <button type="button">Page button</button>;
}
const keep = (api: Api) => {
  ref.api = api;
};

describe('NlSnackbarProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const showSnack = (options: NlSnackbarOptions) => {
    act(() => {
      ref.api?.show(options);
    });
    act(() => {
      vi.advanceTimersByTime(20);
    });
  };

  it('live regions exist from load; neutral goes in status, error in alert', () => {
    render(
      <NlSnackbarProvider>
        <Grab onReady={keep} />
      </NlSnackbarProvider>,
    );
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
    showSnack({ message: 'Reward saved' });
    expect(screen.getByRole('status')).toHaveTextContent('Reward saved');
    showSnack({ tone: 'error', message: 'Reward not saved' });
    expect(screen.getByRole('alert')).toHaveTextContent('Reward not saved');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('without an action it goes after the duration and calls onClose', () => {
    const onClose = vi.fn();
    render(
      <NlSnackbarProvider>
        <Grab onReady={keep} />
      </NlSnackbarProvider>,
    );
    showSnack({ message: 'Reward saved', onClose });
    act(() => {
      vi.advanceTimersByTime(6100);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Reward saved')).toBeNull();
  });

  it('with an action it stays; the action runs and closes it', () => {
    const onClick = vi.fn();
    render(
      <NlSnackbarProvider>
        <Grab onReady={keep} />
      </NlSnackbarProvider>,
    );
    showSnack({ message: 'Reward deleted', action: { label: 'Undo', onClick } });
    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(screen.getByText('Reward deleted')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('Reward deleted')).toBeNull();
  });

  it('hover pauses the timer', () => {
    render(
      <NlSnackbarProvider>
        <Grab onReady={keep} />
      </NlSnackbarProvider>,
    );
    showSnack({ message: 'Reward saved' });
    const frame = screen.getByText('Reward saved').closest('[data-state]');
    if (!frame) throw new Error('No snackbar frame');
    fireEvent.mouseEnter(frame);
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText('Reward saved')).toBeInTheDocument();
  });

  it('a new snackbar replaces the old one', () => {
    const onClose = vi.fn();
    render(
      <NlSnackbarProvider>
        <Grab onReady={keep} />
      </NlSnackbarProvider>,
    );
    showSnack({ message: 'First', onClose, action: { label: 'Undo', onClick: () => undefined } });
    showSnack({ message: 'Second' });
    expect(screen.queryByText('First')).toBeNull();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('never takes focus; F6 moves focus into it', () => {
    render(
      <NlSnackbarProvider>
        <Grab onReady={keep} />
      </NlSnackbarProvider>,
    );
    screen.getByRole('button', { name: 'Page button' }).focus();
    showSnack({ message: 'Reward deleted', action: { label: 'Undo', onClick: () => undefined } });
    expect(screen.getByRole('button', { name: 'Page button' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'F6' });
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveFocus();
  });

  it('useNlSnackbar throws outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Grab onReady={keep} />)).toThrow(/inside NlSnackbarProvider/);
    spy.mockRestore();
  });
});

describe('NlSnackbarProvider placement (OD-245)', () => {
  it('bottom centre by default; top end on request', () => {
    const { container, unmount } = render(<NlSnackbarProvider />);
    expect(container.querySelector('[data-slot="snackbar-region"]')).toHaveAttribute('data-placement', 'bottom-center');
    unmount();
    const top = render(<NlSnackbarProvider placement="top-end" />);
    const region = top.container.querySelector('[data-slot="snackbar-region"]');
    expect(region).toHaveAttribute('data-placement', 'top-end');
    expect(region).toHaveClass('nl:top-3xl', 'nl:end-3xl');
  });
});
