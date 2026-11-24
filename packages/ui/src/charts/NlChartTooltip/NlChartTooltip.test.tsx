import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NlChartTooltip } from './NlChartTooltip';

const items = [
  { name: 'Members', value: '1,204', series: 1 as const },
  { name: 'New members', value: '96', series: 2 as const },
];

describe('NlChartTooltip', () => {
  it('heading, then a row per series with marker, name and value (Data S)', () => {
    const { container } = render(<NlChartTooltip heading="Mar 2026" items={items} />);
    expect(screen.getByText('Mar 2026')).toHaveClass('nl:text-label-s');
    const rows = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    const [first] = rows;
    if (!first) throw new Error('No first row');
    expect(within(first).getByText('Members')).toHaveClass('nl:truncate', 'nl:text-body-s');
    expect(within(first).getByText('1,204')).toHaveClass('nl:text-data-s', 'nl:shrink-0');
    const markers = container.querySelectorAll('svg[aria-hidden="true"]');
    expect([...markers].map((m) => m.getAttribute('data-series'))).toEqual(['1', '2']);
  });

  it('the box uses the chart tooltip tokens, Size-240 wide at most, and fades only without reduced motion', () => {
    const { container } = render(<NlChartTooltip heading="Mar 2026" items={items} />);
    expect(container.firstElementChild).toHaveClass(
      'nl:bg-chart-tooltip-bg',
      'nl:text-chart-tooltip-text',
      'nl:max-w-240',
      'nl:animate-chart-tooltip-in',
      'nl:motion-reduce:animate-none',
    );
  });

  it('total row only when given, with its label', () => {
    const { rerender } = render(<NlChartTooltip heading="Mar 2026" items={items} />);
    expect(screen.queryByText('Total')).toBeNull();
    rerender(<NlChartTooltip heading="Mar 2026" items={items} total="1,300" totalLabel="All points" />);
    expect(screen.getByText('All points')).toBeInTheDocument();
    expect(screen.getByText('1,300')).toHaveClass('nl:text-data-s');
  });

  it('no hard-coded colour: every colour comes from a chart token class', () => {
    const { container } = render(<NlChartTooltip heading="Mar 2026" items={items} total="1,300" />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i);
    expect(html).not.toMatch(/(fill|stroke|color)="(?!none)/);
    expect(container.querySelector('[style]')).toBeNull();
  });
});
