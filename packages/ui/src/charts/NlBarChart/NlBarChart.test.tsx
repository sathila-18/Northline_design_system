import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { NlBarChart } from './NlBarChart';

const data = [
  { month: '2026-01', earned: 12480, redeemed: 8210 },
  { month: '2026-02', earned: 10950, redeemed: 7300 },
  { month: '2026-03', earned: 13020, redeemed: 9100 },
];
const two = [
  { key: 'earned', label: 'Earned' },
  { key: 'redeemed', label: 'Redeemed' },
];

beforeAll(() => {
  // Reduced motion on: bars draw at once (no grow animation), so the tests see them.
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduce'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  for (const [property, value] of [
    ['clientWidth', 640],
    ['clientHeight', 240],
    ['offsetWidth', 640],
    ['offsetHeight', 240],
  ] as const) {
    Object.defineProperty(HTMLElement.prototype, property, { configurable: true, get: () => value });
  }
  HTMLElement.prototype.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 640,
    bottom: 240,
    width: 640,
    height: 240,
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

describe('NlBarChart', () => {
  it('one tab stop named by the title; orientation and layout as data attributes; legend for two series', async () => {
    render(<NlBarChart title="Points" data={data} xKey="month" series={two} layout="stacked" />);
    await settle();
    const chart = screen.getByRole('group', { name: 'Points' });
    expect(chart).toHaveAttribute('aria-roledescription', 'chart');
    expect(chart).toHaveAttribute('data-orientation', 'vertical');
    expect(chart).toHaveAttribute('data-layout', 'stacked');
    expect(screen.getByRole('list', { name: 'Legend' })).toBeInTheDocument();
  });

  it('one series is single, whatever the layout; no legend', async () => {
    render(<NlBarChart title="Points" data={data} xKey="month" series={two.slice(0, 1)} layout="stacked" />);
    await settle();
    expect(screen.getByRole('group')).toHaveAttribute('data-layout', 'single');
    expect(screen.queryByRole('list', { name: 'Legend' })).toBeNull();
  });

  it('keyboard: Right and End move and announce; stacked adds the total; horizontal uses Up and Down', async () => {
    const { rerender } = render(<NlBarChart title="Points" data={data} xKey="month" series={two} layout="stacked" />);
    await settle();
    const chart = screen.getByRole('group');
    fireEvent.keyDown(chart, { key: 'ArrowRight' });
    expect(screen.getByRole('status')).toHaveTextContent('Jan 2026: Earned 12,480, Redeemed 8,210, Total 20,690');
    fireEvent.keyDown(chart, { key: 'End' });
    expect(screen.getByRole('status')).toHaveTextContent('Mar 2026');
    rerender(<NlBarChart title="Points" data={data} xKey="month" series={two} orientation="horizontal" />);
    await settle();
    fireEvent.keyDown(screen.getByRole('group'), { key: 'ArrowUp' });
    expect(screen.getByRole('status')).toHaveTextContent('Feb 2026: Earned 10,950, Redeemed 7,300');
  });

  it('no hard-coded colour reaches Recharts: every fill and stroke is a chart token variable or none', async () => {
    const { container } = render(<NlBarChart title="Points" data={data} xKey="month" series={two} showValues />);
    await settle();
    expect(container.querySelectorAll('.recharts-bar-rectangle path').length).toBe(6);
    const coloured = [...container.querySelectorAll('[fill], [stroke]')];
    expect(coloured.length).toBeGreaterThan(0);
    for (const element of coloured) {
      for (const attribute of ['fill', 'stroke']) {
        const value = element.getAttribute(attribute);
        if (value === null || value === 'none' || value === 'transparent') continue;
        expect(value, `${element.tagName} ${attribute}`).toMatch(/^var\(--nl-chart-[a-z0-9-]+\)$/);
      }
    }
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
  });

  it('bars use the series colours in order', async () => {
    const { container } = render(<NlBarChart title="Points" data={data} xKey="month" series={two} />);
    await settle();
    const fills = new Set(
      [...container.querySelectorAll('.recharts-bar-rectangle path')].map((p) => p.getAttribute('fill')),
    );
    expect([...fills]).toEqual(['var(--nl-chart-series-1)', 'var(--nl-chart-series-2)']);
  });
});
