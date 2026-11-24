'use client';

import { useState, type KeyboardEvent } from 'react';

/**
 * Keyboard for a chart's one tab stop (DESIGN.md §9, Charts: shared rules; OD-253). Previous and next keys move
 * between items (points, categories or slices), Home and End go to the ends, Escape hides the tooltip; each move sets
 * a polite announcement. The chart passes `index` to Recharts' tooltip as `defaultIndex`.
 */
export function useChartKeyboard({
  count,
  describe,
  previousKeys = ['ArrowLeft'],
  nextKeys = ['ArrowRight'],
}: {
  count: number;
  describe: (index: number) => string;
  previousKeys?: string[];
  nextKeys?: string[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState('');

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (count === 0) return;
    if (event.key === 'Escape') {
      setHidden(true);
      return;
    }
    const last = count - 1;
    const current = index ?? -1;
    let next: number | undefined;
    if (nextKeys.includes(event.key)) next = Math.min(last, current + 1);
    else if (previousKeys.includes(event.key)) next = Math.max(0, current - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === undefined) return;
    event.preventDefault();
    setIndex(next);
    setHidden(false);
    setMessage(describe(next));
  };

  return {
    /** The focused item, or null. */
    index,
    /** Recharts' tooltip `active`: false after Escape, true while an item is focused, else Recharts decides. */
    tooltipActive: hidden ? false : index !== null ? true : undefined,
    message,
    onKeyDown,
    onBlur: () => {
      setIndex(null);
    },
  };
}
