import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlBanner } from './NlBanner';

describe('NlBanner', () => {
  it('defaults: info, static (no role), tinted and rounded, icon on the title line', () => {
    const { container } = render(<NlBanner title="Sync scheduled">Every night.</NlBanner>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveAttribute('data-tone', 'info');
    expect(root).toHaveClass('nl:bg-info-secondary', 'nl:rounded-m', 'nl:p-xl', 'nl:gap-m', 'nl:items-start');
    expect(container.querySelector('[data-slot="icon"]')).toHaveClass(
      'nl:h-lh',
      'nl:text-headline-small-h6',
      'nl:text-fg-info',
    );
    expect(screen.getByText('Sync scheduled')).toHaveClass('nl:text-headline-small-h6', 'nl:text-info');
    expect(screen.getByText('Every night.')).toHaveClass('nl:text-body-m', 'nl:text-info');
  });

  it.each([
    ['success', 'nl:bg-success-secondary', 'nl:text-success', 'check_circle'],
    ['error', 'nl:bg-error-secondary', 'nl:text-error', 'error'],
    ['warning', 'nl:bg-warning-secondary', 'nl:text-warning', 'warning'],
  ] as const)('%s tone colours and icon', (tone, bg, text, glyph) => {
    const { container } = render(
      <NlBanner tone={tone} title="T">
        D
      </NlBanner>,
    );
    expect(container.firstElementChild).toHaveClass(bg);
    expect(screen.getByText('T')).toHaveClass(text);
    expect(container.querySelector('[data-slot="icon"] [data-icon]')).toHaveAttribute('data-icon', glyph);
  });

  it('neutral: bg-neutral, primary title, secondary description and icon', () => {
    const { container } = render(
      <NlBanner tone="neutral" title="T">
        D
      </NlBanner>,
    );
    expect(container.firstElementChild).toHaveClass('nl:bg-neutral');
    expect(screen.getByText('T')).toHaveClass('nl:text-primary');
    expect(screen.getByText('D')).toHaveClass('nl:text-secondary');
    expect(container.querySelector('[data-slot="icon"]')).toHaveClass('nl:text-fg-secondary');
  });

  it('without a title the icon follows the description line; showIcon off hides it', () => {
    const { container, rerender } = render(<NlBanner>D</NlBanner>);
    expect(container.querySelector('[data-slot="icon"]')).toHaveClass('nl:text-body-m');
    rerender(<NlBanner showIcon={false}>D</NlBanner>);
    expect(container.querySelector('[data-slot="icon"]')).toBeNull();
  });

  it('action is an xsmall link button, close a tertiary xsmall icon button; close is named "Dismiss {title}"', async () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(
      <NlBanner title="Import failed" tone="error" action={{ label: 'Try again', onClick }} onClose={onClose}>
        D
      </NlBanner>,
    );
    const action = screen.getByRole('button', { name: 'Try again' });
    expect(action).toHaveAttribute('data-size', 'xsmall');
    expect(action).toHaveAttribute('data-variant', 'link');
    expect(action).toHaveClass('nl:px-none', 'nl:text-error');
    await userEvent.click(action);
    expect(onClick).toHaveBeenCalledTimes(1);
    const close = screen.getByRole('button', { name: 'Dismiss Import failed' });
    await userEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close without a title is "Dismiss"', () => {
    render(<NlBanner onClose={() => undefined}>D</NlBanner>);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('live: status for info, success, neutral; alert for error, warning (OD-109)', () => {
    const { rerender } = render(<NlBanner live>D</NlBanner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(
      <NlBanner live tone="warning">
        D
      </NlBanner>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
