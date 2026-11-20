'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { NlSnackbar, type NlSnackbarAction, type NlSnackbarLayout, type NlSnackbarTone } from './NlSnackbar';
import * as styles from './NlSnackbarProvider.styles';

export interface NlSnackbarOptions {
  /** The message. */
  message: ReactNode;
  tone?: NlSnackbarTone;
  layout?: NlSnackbarLayout;
  showIcon?: boolean;
  /** With an action the snackbar stays until closed or acted on (WCAG 2.2.1). The snackbar closes after it runs. */
  action?: NlSnackbarAction;
  showClose?: boolean;
  /** Called when the snackbar goes: closed, acted on, timed out or replaced. */
  onClose?: () => void;
}

interface NlSnackbarContextValue {
  /** Shows a snackbar, replacing the current one. */
  show: (options: NlSnackbarOptions) => void;
  /** Hides the current snackbar. */
  hide: () => void;
}

const NlSnackbarContext = createContext<NlSnackbarContextValue | null>(null);

/** Show and hide snackbars. Throws outside NlSnackbarProvider. */
export function useNlSnackbar(): NlSnackbarContextValue {
  const context = useContext(NlSnackbarContext);
  if (!context) throw new Error('useNlSnackbar must be used inside NlSnackbarProvider.');
  return context;
}

const politeTones: NlSnackbarTone[] = ['neutral', 'success'];

/** Reads a --nl-duration-* custom property in milliseconds (browser only, never during render). */
function readDuration(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  return raw.endsWith('ms') ? value : value * 1000;
}

type Phase = 'entering' | 'shown' | 'leaving';

interface Current {
  id: number;
  options: NlSnackbarOptions;
  phase: Phase;
}

export interface NlSnackbarProviderProps {
  children?: ReactNode;
  /** Placement of the region only. */
  className?: string;
}

/**
 * The snackbar host (DESIGN.md §9, NlSnackbar, OD-166). Renders the page, then a region at the bottom centre that
 * holds one snackbar at a time inside a live region that exists from page load: role status for neutral and success,
 * alert for warning and error. A new snackbar replaces the old. Without an action it goes after
 * --nl-duration-snackbar (OD-92), restarting after hover or focus leaves; with one it stays. It never takes focus;
 * F6 moves focus into it (OD-110). 'use client' for state, effects and context.
 */
export function NlSnackbarProvider({ children, className }: NlSnackbarProviderProps) {
  const [current, setCurrent] = useState<Current | null>(null);
  const currentRef = useRef<Current | null>(null);
  useEffect(() => {
    currentRef.current = current;
  });
  const nextId = useRef(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paused = useRef(false);
  const closed = useRef(0);

  const clearTimer = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };

  const remove = useCallback((id: number) => {
    const now = currentRef.current;
    if (now?.id !== id || closed.current === id) return;
    closed.current = id;
    now.options.onClose?.();
    setCurrent((latest) => (latest?.id === id ? { ...latest, phase: 'leaving' } : latest));
    const leave = readDuration('--nl-duration-base', 200);
    setTimeout(() => {
      setCurrent((now) => (now?.id === id && now.phase === 'leaving' ? null : now));
    }, leave);
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    const now = currentRef.current;
    if (now) remove(now.id);
  }, [remove]);

  const show = useCallback((options: NlSnackbarOptions) => {
    clearTimer();
    nextId.current += 1;
    const id = nextId.current;
    const previous = currentRef.current;
    if (previous && closed.current !== previous.id) previous.options.onClose?.();
    const next: Current = { id, options, phase: 'entering' };
    currentRef.current = next;
    setCurrent(next);
  }, []);

  // Enter on the next frame, so the hidden look paints first and the transition runs.
  useEffect(() => {
    if (current?.phase !== 'entering') return;
    const id = current.id;
    const frame = requestAnimationFrame(() => {
      setCurrent((now) => (now?.id === id && now.phase === 'entering' ? { ...now, phase: 'shown' } : now));
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [current]);

  const startTimer = useCallback(() => {
    clearTimer();
    if (current?.phase !== 'shown' || current.options.action || paused.current) return;
    const id = current.id;
    timer.current = setTimeout(
      () => {
        remove(id);
      },
      readDuration('--nl-duration-snackbar', 6000),
    );
  }, [current, remove]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer]);

  // F6 moves focus into the snackbar's first button while one is shown (OD-110).
  useEffect(() => {
    if (current?.phase !== 'shown') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'F6') return;
      const target = frameRef.current?.querySelector<HTMLElement>('button, a[href]');
      if (!target) return;
      event.preventDefault();
      target.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [current?.phase]);

  const pause = () => {
    paused.current = true;
    clearTimer();
  };
  const resume = () => {
    paused.current = false;
    startTimer();
  };

  const context = useMemo(() => ({ show, hide }), [show, hide]);

  const snackbar = current && (
    <div
      ref={frameRef}
      className={[styles.frame, current.phase === 'shown' ? styles.motion.shown : styles.motion.hidden].join(' ')}
      data-state={current.phase}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) resume();
      }}
    >
      <NlSnackbar
        tone={current.options.tone}
        layout={current.options.layout}
        showIcon={current.options.showIcon}
        showClose={current.options.showClose}
        action={
          current.options.action && {
            label: current.options.action.label,
            onClick: () => {
              current.options.action?.onClick();
              hide();
            },
          }
        }
        onClose={hide}
      >
        {current.options.message}
      </NlSnackbar>
    </div>
  );
  const polite = current ? politeTones.includes(current.options.tone ?? 'neutral') : true;

  return (
    <NlSnackbarContext value={context}>
      {children}
      <div className={[styles.region, className].filter(Boolean).join(' ')} data-slot="snackbar-region">
        <div role="status" className={styles.live}>
          {polite && snackbar}
        </div>
        <div role="alert" className={styles.live}>
          {!polite && snackbar}
        </div>
      </div>
    </NlSnackbarContext>
  );
}
