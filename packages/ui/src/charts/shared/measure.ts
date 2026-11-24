'use client';

import { useCallback, useRef, useState } from 'react';

/** A 2D canvas context, or null where there is none (jsdom). */
function canvasContext(): CanvasRenderingContext2D | null {
  try {
    return document.createElement('canvas').getContext('2d');
  } catch {
    return null;
  }
}

/**
 * Measures text in a token's font shorthand (for example --nl-font-data-s) with a canvas, in the browser only.
 * Before the browser can measure, it estimates from the character count, so server output stays the same.
 */
export function useTextMeasure(fontToken: string, fallbackCharWidth: number): (text: string) => number {
  const context = useRef<CanvasRenderingContext2D | null | undefined>(undefined);
  return useCallback(
    (text: string) => {
      if (typeof document === 'undefined') return text.length * fallbackCharWidth;
      if (context.current === undefined) {
        const ctx = canvasContext();
        const font = getComputedStyle(document.documentElement).getPropertyValue(fontToken).trim();
        if (ctx && font) ctx.font = font;
        context.current = ctx;
      }
      // Data S uses tabular figures, which a canvas can't apply: measure every digit as a 0 (the widest digit).
      const tabular = text.replace(/[0-9]/g, '0');
      return context.current ? context.current.measureText(tabular).width : text.length * fallbackCharWidth;
    },
    [fontToken, fallbackCharWidth],
  );
}

/** The width of an element in px, kept up to date (0 until measured in the browser). */
export function useElementWidth(): [(node: HTMLElement | null) => void, number] {
  const [width, setWidth] = useState(0);
  const observer = useRef<ResizeObserver | null>(null);
  const ref = useCallback((node: HTMLElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!node || typeof ResizeObserver === 'undefined') return;
    observer.current = new ResizeObserver((entries) => {
      setWidth(entries[0]?.contentRect.width ?? 0);
    });
    observer.current.observe(node);
  }, []);
  return [ref, width];
}
