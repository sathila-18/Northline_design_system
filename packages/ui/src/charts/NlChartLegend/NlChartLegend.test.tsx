import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NlChartLegend } from './NlChartLegend';

const items = [
  { label: 'Members', series: 1 as const },
  { label: 'New members', series: 6 as const },
];

describe('NlChartLegend', () => {
  it('a list named "Legend", one item per series with its label', () => {
    render(<NlChartLegend items={items} />);
    const list = screen.getByRole('list', { name: 'Legend' });
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(within(list).getByText('Members')).toHaveClass('nl:text-body-s', 'nl:text-chart-axis-text', 'nl:truncate');
  });

  it('line: a Size-16 line in the series colour with the series shape on top (hollow from series 5)', () => {
    const { container } = render(<NlChartLegend items={items} kind="line" />);
    const markers = container.querySelectorAll('[data-slot="marker"]');
    expect(markers[0]).toHaveClass('nl:w-16');
    expect(markers[0]).toHaveAttribute('aria-hidden', 'true');
    expect(markers[0]?.firstElementChild).toHaveClass('nl:h-2', 'nl:bg-chart-series-1');
    expect(markers[1]?.querySelector('svg')).toHaveAttribute('data-hollow', 'true');
  });

  it('block: Size-12 filled squares; donut values in Data S', () => {
    const { container } = render(
      <NlChartLegend kind="block" items={[{ label: 'Gold', series: 3, value: '25 · 21%' }]} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-shape', 'square');
    expect(svg).toHaveClass('nl:size-12', 'nl:fill-chart-series-3');
    expect(screen.getByText('25 · 21%')).toHaveClass('nl:text-data-s');
  });

  it('positions: a wrapping row below, a column at the end', () => {
    const { rerender } = render(<NlChartLegend items={items} />);
    expect(screen.getByRole('list')).toHaveClass('nl:flex-wrap', 'nl:gap-x-xl');
    rerender(<NlChartLegend items={items} position="end" />);
    expect(screen.getByRole('list')).toHaveClass('nl:flex-col', 'nl:gap-m');
  });

  it('no hard-coded colour: every colour comes from a chart token class', () => {
    const { container } = render(<NlChartLegend items={items} />);
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i);
    expect(container.innerHTML).not.toMatch(/(fill|stroke|color)="(?!none)/);
    expect(container.querySelector('[style]')).toBeNull();
  });
});
