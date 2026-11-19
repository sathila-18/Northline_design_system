import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NlNotificationButton } from './NlNotificationButton';

describe('NlNotificationButton', () => {
  it('is a native button named "Notifications" with the bell and no badge by default', () => {
    render(<NlNotificationButton />);
    const button = screen.getByRole('button', { name: 'Notifications' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('nl:size-40', 'nl:rounded-full', 'nl:p-m', 'nl:bg-action-secondary', 'nl:relative');
    expect(button.querySelector('[data-icon="notifications"]')).toHaveAttribute('data-size', '20');
    expect(button.querySelector('[data-digits]')).toBeNull();
  });

  it('with a count: the number badge, decorative, and the count in the name', () => {
    render(<NlNotificationButton count={3} />);
    const button = screen.getByRole('button', { name: 'Notifications, 3 unread' });
    const badge = button.querySelector('[data-digits]');
    const slot = button.querySelector('[data-slot="badge"]');
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot).toHaveClass('nl:absolute', 'nl:-top-xs', 'nl:start-1/2');
    expect(badge).toHaveAttribute('data-tone', 'error');
    expect(badge).toHaveAttribute('data-size', 'small');
    expect(badge).toHaveTextContent('3');
  });

  it('over 99 shows 99+, in the badge and the name', () => {
    render(<NlNotificationButton count={120} />);
    const button = screen.getByRole('button', { name: 'Notifications, 99+ unread' });
    expect(button.querySelector('[data-digits]')).toHaveTextContent('99+');
  });

  it('showCount={false}: the dot, and "new" in the name', () => {
    render(<NlNotificationButton count={3} showCount={false} />);
    const button = screen.getByRole('button', { name: 'Notifications, new' });
    expect(button.querySelector('[data-digits="none"]')).not.toBeNull();
    const slot = button.querySelector('[data-slot="badge"]');
    expect(slot).toHaveClass('nl:absolute', 'nl:top-m', 'nl:end-m');
    expect(slot).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes a label', () => {
    render(<NlNotificationButton label="Alerts" count={2} />);
    expect(screen.getByRole('button', { name: 'Alerts, 2 unread' })).toBeInTheDocument();
  });

  it('disabled: native, no badge, the plain name', async () => {
    const onClick = vi.fn();
    render(<NlNotificationButton count={3} disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Notifications' });
    expect(button).toBeDisabled();
    expect(button.querySelector('[data-digits]')).toBeNull();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has its state colours, focus ring and expanded look', () => {
    render(<NlNotificationButton aria-expanded="true" />);
    const button = screen.getByRole('button', { expanded: true });
    expect(button).toHaveClass(
      'nl:enabled:hover:bg-action-secondary-hovered',
      'nl:enabled:active:bg-action-secondary-pressed',
      'nl:enabled:aria-expanded:bg-action-secondary-pressed',
      'nl:disabled:bg-disabled',
      'nl:focus-visible:outline-focused',
      'nl:duration-fast',
    );
    expect(button.querySelector('[data-slot="icon"]')).toHaveClass(
      'nl:text-fg-action',
      'nl:group-enabled/bell:group-hover/bell:text-fg-hovered',
      'nl:group-enabled/bell:group-active/bell:text-fg-pressed',
      'nl:group-disabled/bell:text-fg-disabled-on-bg',
    );
  });

  it('Enter and Space activate it; ref, attributes and className pass through', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<NlNotificationButton ref={ref} id="probe" className="nl:ms-xs" onClick={onClick} />);
    const button = screen.getByRole('button');
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('id', 'probe');
    expect(button.className.split(' ').at(-1)).toBe('nl:ms-xs');
  });
});
