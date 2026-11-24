import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NlChartMarker, seriesShape, type NlChartSeries } from './NlChartMarker';

const all: NlChartSeries[] = [1, 2, 3, 4, 5, 6, 7];

describe('NlChartMarker', () => {
  it('series shapes: circle, square, triangle, diamond, then hollow again (OD-256)', () => {
    expect(all.map((s) => seriesShape(s))).toEqual([
      { shape: 'circle', hollow: false },
      { shape: 'square', hollow: false },
      { shape: 'triangle', hollow: false },
      { shape: 'diamond', hollow: false },
      { shape: 'circle', hollow: true },
      { shape: 'square', hollow: true },
      { shape: 'triangle', hollow: true },
    ]);
  });

  it('filled shapes use the series fill token; hollow ones the stroke token and no fill', () => {
    const { container: a } = render(<NlChartMarker series={2} />);
    expect(a.querySelector('svg')).toHaveClass('nl:fill-chart-series-2');
    const { container: b } = render(<NlChartMarker series={6} />);
    expect(b.querySelector('svg')).toHaveClass('nl:fill-none', 'nl:stroke-chart-series-6');
    expect(b.querySelector('svg')).toHaveAttribute('data-hollow', 'true');
  });

  it('a forced shape is filled (bars, slices) and sizes are Size-8 or Size-12', () => {
    const { container } = render(<NlChartMarker series={6} shape="square" size="12" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-shape', 'square');
    expect(svg).not.toHaveAttribute('data-hollow');
    expect(svg).toHaveClass('nl:size-12', 'nl:fill-chart-series-6');
  });

  it('decorative and never focusable; no colour in attributes', () => {
    for (const series of all) {
      const { container, unmount } = render(<NlChartMarker series={series} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
      expect(container.innerHTML).not.toMatch(/(fill|stroke|color)="(?!none)|#[0-9a-f]{3,8}\b/i);
      unmount();
    }
  });
});
