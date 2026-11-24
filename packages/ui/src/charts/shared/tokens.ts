'use client';

import { useSyncExternalStore } from 'react';

// Runtime reads of motion and spacing tokens for Recharts, which takes numbers. Read in the browser after mount only
// (§7.4); until then the defaults match the token values, so server and first client render agree.

/** The chart series colours as CSS variables (D9). Recharts gets these strings, never a colour value. */
export const seriesColour = [
  'var(--nl-chart-series-1)',
  'var(--nl-chart-series-2)',
  'var(--nl-chart-series-3)',
  'var(--nl-chart-series-4)',
  'var(--nl-chart-series-5)',
  'var(--nl-chart-series-6)',
  'var(--nl-chart-series-7)',
] as const;

export const chartColour = {
  grid: 'var(--nl-chart-grid)',
  axis: 'var(--nl-chart-axis)',
  highlight: 'var(--nl-chart-highlight)',
} as const;

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener('change', onChange);
  return () => {
    query.removeEventListener('change', onChange);
  };
};

/** True under prefers-reduced-motion. False on the server and before hydration. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

/** Tokens don't change while the page runs, so there is nothing to subscribe to. */
const noSubscribe = () => () => undefined;

/** A token's value in px or ms (seconds are converted), read from :root; NaN when missing. */
function readToken(name: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parsed = Number.parseFloat(raw);
  return raw.endsWith('s') && !raw.endsWith('ms') ? parsed * 1000 : parsed;
}

/** A token's value in px or ms in the browser. `fallback` is the token's own value, used on the server and if missing. */
export function useTokenNumber(name: string, fallback: number): number {
  const value = useSyncExternalStore(
    noSubscribe,
    () => readToken(name),
    () => fallback,
  );
  return Number.isFinite(value) ? value : fallback;
}
