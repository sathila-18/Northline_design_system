import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { NlDonutChart, shares, toSlices } from './NlDonutChart';

const tiers = [
  { key: 'bronze', label: 'Bronze', value: 52 },
  { key: 'silver', label: 'Silver', value: 32 },
  { key: 'gold', label: 'Gold', value: 25 },
  { key: 'platinum', label: 'Platinum', value: 11 },
];

beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduce'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  for (const [property, value] of [
    ['clientWidth', 640],
    ['clientHeight', 320],
    ['offsetWidth', 640],
    ['offsetHeight', 320],
  ] as const) {
    Object.defineProperty(HTMLElement.prototype, property, { configurable: true, get: () => value });
  }
  HTMLElement.prototype.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 640,
    bottom: 320,
    width: 640,
    height: 320,
    toJSON: () => ({}),
  });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = () => undefined;
      unobserve = () => undefined;
      disconnect = () => undefined;
    },
  );
});

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

describe('shares and slices', () => {
  it('whole percentages that add up to 100', () => {
    expect(shares([52, 32, 25, 11])).toEqual([43, 27, 21, 9]);
    expect(shares([1, 1, 1])).toEqual([34, 33, 33]);
    expect(shares([0, 0])).toEqual([0, 0]);
  });

  it('sortBy value or data; above 5, the largest 4 and "Other" last', () => {
    expect(toSlices(tiers, 'value').map((s) => s.label)).toEqual(['Bronze', 'Silver', 'Gold', 'Platinum']);
    expect(toSlices([...tiers].reverse(), 'data').map((s) => s.label)).toEqual([
      'Platinum',
      'Gold',
      'Silver',
      'Bronze',
    ]);
    const many = [...tiers, { key: 'x', label: 'X', value: 5 }, { key: 'y', label: 'Y', value: 3 }];
    const slices = toSlices(many, 'data');
    expect(slices.map((s) => s.label)).toEqual(['Bronze', 'Silver', 'Gold', 'Platinum', 'Other']);
    expect(slices.at(-1)?.value).toBe(8);
  });
});

describe('NlDonutChart', () => {
  it('one tab stop named by the title and described by the total; the legend has values and shares', async () => {
    render(<NlDonutChart title="Members by tier" data={tiers} sortBy="data" />);
    await settle();
    const chart = screen.getByRole('group', { name: 'Members by tier' });
    expect(chart).toHaveAttribute('aria-roledescription', 'chart');
    expect(chart).toHaveAccessibleDescription('Total: 120');
    expect(screen.getByText('52 · 43%')).toBeInTheDocument();
    expect(chart).toHaveAttribute('data-legend', 'end');
  });

  it('keyboard: arrows, Home and End move between slices and announce them', async () => {
    render(<NlDonutChart title="Members by tier" data={tiers} sortBy="data" />);
    await settle();
    const chart = screen.getByRole('group');
    fireEvent.keyDown(chart, { key: 'ArrowDown' });
    expect(screen.getByRole('status')).toHaveTextContent('Bronze: 52, 43%');
    fireEvent.keyDown(chart, { key: 'End' });
    expect(screen.getByRole('status')).toHaveTextContent('Platinum: 11, 9%');
    fireEvent.keyDown(chart, { key: 'ArrowLeft' });
    expect(screen.getByRole('status')).toHaveTextContent('Gold: 25, 21%');
  });

  it('hover dims the other slices and shows no ring; keyboard focus shows the ring (OD-261)', async () => {
    const { container } = render(<NlDonutChart title="Tiers" data={tiers} sortBy="data" />);
    await settle();
    const ring = () => container.querySelector('.nl\\:stroke-chart-highlight');
    const sector = container.querySelector('.recharts-pie-sector');
    if (!sector) throw new Error('No slice rendered');
    fireEvent.mouseEnter(sector);
    await settle();
    expect(container.querySelectorAll('.recharts-pie-sector path.nl\\:opacity-40')).toHaveLength(tiers.length - 1);
    expect(ring()).toBeNull();
    fireEvent.mouseLeave(screen.getByRole('group'));
    await settle();
    expect(container.querySelectorAll('.recharts-pie-sector path.nl\\:opacity-40')).toHaveLength(0);
    fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowDown' });
    await settle();
    expect(ring()).not.toBeNull();
  });

  it('legend below when asked', async () => {
    render(<NlDonutChart title="Tiers" data={tiers} legendPosition="below" />);
    await settle();
    expect(screen.getByRole('group')).toHaveAttribute('data-legend', 'below');
  });

  it('no hard-coded colour reaches Recharts: slices are the series colours in order, no stroke', async () => {
    const { container } = render(<NlDonutChart title="Tiers" data={tiers} sortBy="data" />);
    await settle();
    const sectors = [...container.querySelectorAll('.recharts-pie-sector path')];
    expect(sectors.map((p) => p.getAttribute('fill'))).toEqual([
      'var(--nl-chart-series-1)',
      'var(--nl-chart-series-2)',
      'var(--nl-chart-series-3)',
      'var(--nl-chart-series-4)',
    ]);
    for (const element of container.querySelectorAll('[fill], [stroke]')) {
      for (const attribute of ['fill', 'stroke']) {
        const value = element.getAttribute(attribute);
        if (value === null || value === 'none' || value === 'transparent') continue;
        expect(value, `${element.tagName} ${attribute}`).toMatch(/^var\(--nl-chart-[a-z0-9-]+\)$/);
      }
    }
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
  });
});
