import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { NlLineChart } from './NlLineChart';

const data = [
  { month: '2026-01', members: 820, newMembers: 64 },
  { month: '2026-02', members: 871, newMembers: 58 },
  { month: '2026-03', members: 1204, newMembers: 72 },
];
const two = [
  { key: 'members', label: 'Members' },
  { key: 'newMembers', label: 'New members' },
];

beforeAll(() => {
  // jsdom has no matchMedia: no reduced motion here.
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  // jsdom has no layout: give every element a size, so Recharts draws.
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

describe('NlLineChart', () => {
  it('one tab stop: a group with the chart role description, named by the title, described by the summary', async () => {
    render(<NlLineChart title="Member growth" description="Jan to Mar 2026" data={data} xKey="month" series={two} />);
    await settle();
    const chart = screen.getByRole('group', { name: 'Member growth' });
    expect(chart).toHaveAttribute('aria-roledescription', 'chart');
    expect(chart).toHaveAttribute('tabindex', '0');
    expect(chart).toHaveAccessibleDescription('Jan to Mar 2026');
  });

  it('a legend for two or more series, none for one', async () => {
    const { rerender } = render(<NlLineChart title="Growth" data={data} xKey="month" series={two} />);
    await settle();
    expect(screen.getByRole('list', { name: 'Legend' })).toBeInTheDocument();
    rerender(<NlLineChart title="Growth" data={data} xKey="month" series={two.slice(0, 1)} />);
    await settle();
    expect(screen.queryByRole('list', { name: 'Legend' })).toBeNull();
  });

  it('keyboard: Right, End and Home move between points and announce them; Escape hides the tooltip', async () => {
    render(<NlLineChart title="Growth" data={data} xKey="month" series={two} />);
    await settle();
    const chart = screen.getByRole('group', { name: 'Growth' });
    fireEvent.keyDown(chart, { key: 'ArrowRight' });
    expect(screen.getByRole('status')).toHaveTextContent('Jan 2026: Members 820, New members 64');
    fireEvent.keyDown(chart, { key: 'End' });
    expect(screen.getByRole('status')).toHaveTextContent('Mar 2026: Members 1,204, New members 72');
    fireEvent.keyDown(chart, { key: 'Home' });
    expect(screen.getByRole('status')).toHaveTextContent('Jan 2026');
    fireEvent.keyDown(chart, { key: 'Escape' });
    expect(screen.getByRole('status')).toHaveTextContent('Jan 2026');
  });

  it('no hard-coded colour reaches Recharts: every fill and stroke is a chart token variable or none', async () => {
    const { container } = render(<NlLineChart title="Growth" data={data} xKey="month" series={two} />);
    await settle();
    const coloured = [...container.querySelectorAll('[fill], [stroke], [stop-color]')];
    expect(coloured.length).toBeGreaterThan(0);
    for (const element of coloured) {
      for (const attribute of ['fill', 'stroke', 'stop-color']) {
        const value = element.getAttribute(attribute);
        if (value === null || value === 'none' || value === 'transparent') continue;
        expect(value, `${element.tagName} ${attribute}`).toMatch(/^var\(--nl-chart-[a-z0-9-]+\)$/);
      }
    }
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
  });

  it('series lines use the series colours in order', async () => {
    const { container } = render(<NlLineChart title="Growth" data={data} xKey="month" series={two} />);
    await settle();
    const strokes = [...container.querySelectorAll('path.recharts-line-curve')].map((p) => p.getAttribute('stroke'));
    expect(strokes).toEqual(['var(--nl-chart-series-1)', 'var(--nl-chart-series-2)']);
  });
});
