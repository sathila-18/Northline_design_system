import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NlStatCard } from './NlStatCard';

describe('NlStatCard', () => {
  it('card look from the spec; label NlLabel medium secondary; value Data M primary', () => {
    const { container } = render(<NlStatCard label="Total points" value="806,400" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('nl:bg-active', 'nl:rounded-s', 'nl:p-2xl', 'nl:gap-none', 'nl:justify-center');
    expect(screen.getByText('Total points')).toHaveClass('nl:text-label-m', 'nl:text-secondary');
    const value = screen.getByText('806,400');
    expect(value.tagName).toBe('P');
    expect(value).toHaveClass('nl:text-data-m', 'nl:text-primary', 'nl:break-words');
  });

  it('inList: label in a <dt>, value in a <dd> (OD-175)', () => {
    render(
      <dl>
        <NlStatCard inList label="Members" value="12,480" />
      </dl>,
    );
    expect(screen.getByRole('term')).toHaveTextContent('Members');
    expect(screen.getByRole('definition')).toHaveTextContent('12,480');
  });

  it('as sets the root element', () => {
    const { container } = render(<NlStatCard as="section" label="A" value="1" />);
    expect(container.firstElementChild?.tagName).toBe('SECTION');
  });
});
