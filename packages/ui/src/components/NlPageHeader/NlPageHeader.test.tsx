import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlPageHeader } from './NlPageHeader';

describe('NlPageHeader', () => {
  it('a div with the spec padding, gap and fill; the title is an h1 in headline-small, one line', () => {
    const { container } = render(<NlPageHeader title="Rewards" />);
    const root = container.firstElementChild;
    expect(root?.tagName).toBe('DIV');
    expect(root).toHaveClass('nl:px-3xl', 'nl:py-l', 'nl:gap-xl', 'nl:items-center', 'nl:bg-primary');
    const heading = screen.getByRole('heading', { level: 1, name: 'Rewards' });
    expect(heading).toHaveClass('nl:text-headline-small-h6', 'nl:text-primary');
    expect(screen.getByText('Rewards')).toHaveClass('nl:truncate');
  });

  it('text body: Body M text-secondary under the title; a slot body goes in as is', () => {
    const { rerender } = render(<NlPageHeader title="Rewards">Manage rewards</NlPageHeader>);
    expect(screen.getByText('Manage rewards')).toHaveClass('nl:text-body-m', 'nl:text-secondary');
    rerender(
      <NlPageHeader title="Rewards">
        <em>Slot</em>
      </NlPageHeader>,
    );
    expect(screen.getByText('Slot').tagName).toBe('EM');
  });

  it('headingAs changes the element', () => {
    render(<NlPageHeader title="Rewards" headingAs="h2" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('back button: onBack, xsmall tertiary icon-only arrow_back named "Back"', async () => {
    const onBack = vi.fn();
    render(<NlPageHeader title="Reward X" onBack={onBack} />);
    const back = screen.getByRole('button', { name: 'Back' });
    expect(back.querySelector('[data-icon]')).toHaveAttribute('data-icon', 'arrow_back');
    expect(back.querySelector('[data-icon]')).toHaveAttribute('data-size', '20');
    await userEvent.click(back);
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('back link: backHref with a custom name', () => {
    render(<NlPageHeader title="Reward X" backHref="/rewards" backLabel="Back to rewards" />);
    expect(screen.getByRole('link', { name: 'Back to rewards' })).toHaveAttribute('href', '/rewards');
  });

  it('notification button passes through; a rising count is announced, the first and a fall are not', () => {
    const { rerender } = render(<NlPageHeader title="Rewards" notifications={{ count: 3 }} />);
    expect(screen.getByRole('button', { name: 'Notifications, 3 unread' })).toBeInTheDocument();
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('');
    expect(status).toHaveClass('nl:sr-only');
    rerender(<NlPageHeader title="Rewards" notifications={{ count: 4 }} />);
    expect(status).toHaveTextContent('4 new notifications');
    rerender(<NlPageHeader title="Rewards" notifications={{ count: 1 }} />);
    expect(status).toHaveTextContent('');
    rerender(<NlPageHeader title="Rewards" notifications={{ count: 2 }} />);
    expect(status).toHaveTextContent('2 new notifications');
  });

  it('one new notification is singular', () => {
    const { rerender } = render(<NlPageHeader title="Rewards" notifications={{ count: 0 }} />);
    rerender(<NlPageHeader title="Rewards" notifications={{ count: 1 }} />);
    expect(screen.getByRole('status')).toHaveTextContent('1 new notification');
    expect(screen.getByRole('status')).not.toHaveTextContent('notifications');
  });

  it('passes native attributes and appends className last', () => {
    const { container } = render(<NlPageHeader title="Rewards" id="probe" className="nl:mb-xs" />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('id', 'probe');
    expect(root?.className.split(' ').at(-1)).toBe('nl:mb-xs');
  });
});
