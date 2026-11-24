import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlChartFrame } from './NlChartFrame';

const chart = <p>The chart</p>;
const table = <p>The table</p>;

describe('NlChartFrame', () => {
  it('a section named by the title, with the heading (h2) and description', () => {
    render(
      <NlChartFrame title="Members by tier" description="All members">
        {chart}
      </NlChartFrame>,
    );
    expect(screen.getByRole('region', { name: 'Members by tier' })).toHaveAttribute('data-status', 'ready');
    expect(screen.getByRole('heading', { level: 2, name: 'Members by tier' })).toBeInTheDocument();
    expect(screen.getByText('All members')).toBeInTheDocument();
    expect(screen.getByText('The chart')).toBeInTheDocument();
  });

  it('the "View as" switch shows the table and back; onViewChange gets the view', async () => {
    const onViewChange = vi.fn();
    render(
      <NlChartFrame title="Members by tier" table={table} onViewChange={onViewChange}>
        {chart}
      </NlChartFrame>,
    );
    expect(screen.getByRole('radiogroup', { name: 'View as' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'Table' }));
    expect(screen.getByText('The table')).toBeInTheDocument();
    expect(screen.queryByText('The chart')).toBeNull();
    expect(onViewChange).toHaveBeenCalledWith('table');
  });

  it('no table, no switch', () => {
    render(<NlChartFrame title="Members by tier">{chart}</NlChartFrame>);
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  it('loading: aria-busy, five skeleton bars, the switch hidden but keeping its space', () => {
    const { container } = render(
      <NlChartFrame title="Members by tier" status="loading" table={table}>
        {chart}
      </NlChartFrame>,
    );
    expect(screen.getByRole('region')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('[data-shape="rect"]')).toHaveLength(5);
    expect(screen.queryByText('The chart')).toBeNull();
    const slot = container.querySelector('.nl\\:invisible');
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot).toHaveAttribute('inert');
  });

  it('empty and error states; Try again calls onRetry', async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<NlChartFrame title="Points" status="empty" />);
    expect(screen.getByText('No data for this period')).toBeInTheDocument();
    rerender(<NlChartFrame title="Points" status="error" onRetry={onRetry} />);
    expect(screen.getByText("This chart couldn't load")).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps the chart height in every state; card or plain look', () => {
    const { container, rerender } = render(<NlChartFrame title="Points" height="240" status="empty" />);
    expect(container.querySelector('[class*="nl:h-240"]')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveClass('nl:rounded-m', 'nl:border-subtle', 'nl:p-3xl');
    rerender(<NlChartFrame title="Points" variant="plain" />);
    expect(screen.getByRole('region')).not.toHaveClass('nl:p-3xl');
    expect(container.querySelector('[class*="nl:h-320"]')).toBeInTheDocument();
  });
});
