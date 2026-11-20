import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NlEmptyState } from './NlEmptyState';

describe('NlEmptyState', () => {
  it('medium by default: 64 primary icon container, Headline Medium h2, centred, Space-3XL / Space-XL', () => {
    const { container } = render(<NlEmptyState icon="add" heading="No rewards yet" description="Add one." />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-size', 'medium');
    expect(root).toHaveClass('nl:items-center', 'nl:gap-3xl', 'nl:text-center');
    expect(root).not.toHaveAttribute('role');
    const icon = container.querySelector('[data-slot="icon"]');
    expect(icon).toHaveAttribute('data-size', '64');
    expect(icon).toHaveAttribute('data-tone', 'primary');
    expect(icon?.parentElement).toHaveClass('nl:gap-xl');
    const heading = screen.getByRole('heading', { level: 2, name: 'No rewards yet' });
    expect(heading).toHaveClass('nl:text-headline-medium-h5');
    expect(screen.getByText('Add one.')).toHaveClass('nl:text-secondary');
  });

  it('small: 48 icon, Headline Small; headingAs changes the level', () => {
    const { container } = render(<NlEmptyState size="small" icon="add" heading="H" headingAs="h3" />);
    expect(container.querySelector('[data-slot="icon"]')).toHaveAttribute('data-size', '48');
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('nl:text-headline-small-h6');
  });

  it('the icon is decorative', () => {
    const { container } = render(<NlEmptyState icon="add" heading="H" />);
    expect(container.querySelector('[data-icon]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('iconSlot wins over icon; no icon when neither is given (OD-112, OD-173)', () => {
    const { container, rerender } = render(<NlEmptyState icon="add" iconSlot={<em>Custom</em>} heading="H" />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(container.querySelector('[data-icon]')).toBeNull();
    rerender(<NlEmptyState heading="H" />);
    expect(container.querySelector('[data-slot="icon"]')).toBeNull();
  });

  it('action shows when given', () => {
    const { rerender } = render(<NlEmptyState heading="H" />);
    expect(screen.queryByRole('button')).toBeNull();
    rerender(<NlEmptyState heading="H" action={<button type="button">Add reward</button>} />);
    expect(screen.getByRole('button', { name: 'Add reward' })).toBeInTheDocument();
  });

  it('live announces it with role status (OD-174)', () => {
    render(<NlEmptyState live heading="No results" />);
    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });
});
