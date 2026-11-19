'use client';

import { autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type Ref,
  type RefObject,
} from 'react';
import { NlTextBlock } from '../NlTextBlock';
import * as styles from './NlTooltip.styles';

export type NlTooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

/** The trigger's own props that the tooltip merges with its own. */
interface TriggerProps {
  ref?: Ref<HTMLElement>;
  'aria-describedby'?: string;
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
}

interface NlTooltipCommonProps {
  /** The element it describes: one element that takes a ref and focus, for example an NlButton. */
  children: ReactElement<TriggerProps>;
  /** Side of the trigger. Flips when there isn't room. Start and end follow the text direction. Default top. */
  placement?: NlTooltipPlacement;
}

/** Single line (`content`) or rich (`heading` and an optional `description`). */
type NlTooltipContentProps =
  | { content: string; heading?: undefined; description?: undefined }
  | { content?: undefined; heading: string; description?: string };

export type NlTooltipProps = NlTooltipCommonProps & NlTooltipContentProps;

/** A token's value in px or ms, read from the document (positioning and timing need numbers). */
const tokenNumber = (name: string) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

/** Sets a caller's ref, callback or object. */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/**
 * A short dark label next to an element, on hover or keyboard focus (DESIGN.md §9, NlTooltip). The rich form adds a
 * heading and a description (NlTextBlock, inverse). role tooltip; the trigger gets `aria-describedby`, so it is
 * always a description, never the name. Shows after Duration base on hover (OD-73), at once on keyboard focus.
 * Hides on pointer leave (unless the pointer moves into the tooltip), blur or Escape. Positioned with
 * @floating-ui/dom: Space-XS from the trigger, Space-M from the window edge (OD-74). Holds no interactive content.
 */
export function NlTooltip({ children, placement = 'top', content, heading, description }: NlTooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [shown, setShown] = useState(false);
  const [position, setPosition] = useState<{ x: string; y: string } | null>(null);

  const clearTimer = () => {
    clearTimeout(showTimer.current);
  };
  const show = () => {
    clearTimer();
    setShown(true);
  };
  const hide = () => {
    clearTimer();
    setShown(false);
  };
  useEffect(() => clearTimer, []);

  // Escape hides it without moving focus (WCAG 1.4.13: dismissible).
  useEffect(() => {
    if (!shown) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      clearTimeout(showTimer.current);
      setShown(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [shown]);

  // Position while shown: the frame touches the trigger (its Space-XS padding is the gap), Space-M from the edge.
  useEffect(() => {
    const trigger = triggerRef.current;
    const frame = frameRef.current;
    if (!shown || !trigger || !frame) return;
    const gap = tokenNumber('--nl-space-xs');
    const edge = tokenNumber('--nl-space-m');
    const rtl = getComputedStyle(trigger).direction === 'rtl';
    const side: Record<NlTooltipPlacement, Placement> = {
      top: 'top',
      bottom: 'bottom',
      start: rtl ? 'right' : 'left',
      end: rtl ? 'left' : 'right',
    };
    const update = () => {
      void computePosition(trigger, frame, {
        strategy: 'fixed',
        placement: side[placement],
        middleware: [offset(0), flip({ padding: edge - gap }), shift({ padding: edge - gap })],
      }).then(({ x, y }) => {
        setPosition({ x: `${String(x)}px`, y: `${String(y)}px` });
      });
    };
    const stop = autoUpdate(trigger, frame, update);
    return () => {
      stop();
      setPosition(null);
    };
  }, [shown, placement]);

  const triggerProps = useTriggerProps({
    id,
    own: isValidElement(children) ? children.props : {},
    triggerRef,
    frameRef,
    showTimer,
    show,
    hide,
  });
  const frameLeave = useFrameLeave({ triggerRef, hide });
  if (!isValidElement(children)) return children;
  const trigger = cloneElement(children, triggerProps);

  const rich = heading !== undefined;
  const frameClasses = [
    styles.frame,
    shown ? styles.visibility.shown : styles.visibility.hidden,
    shown && position === null ? styles.unmeasured : '',
  ]
    .filter(Boolean)
    .join(' ');
  // The only inline values are data: the measured position, read by nl:tooltip-position.
  const frameStyle = position
    ? ({ '--nl-tooltip-x': position.x, '--nl-tooltip-y': position.y } as CSSProperties)
    : undefined;

  return (
    <>
      {trigger}
      <div
        ref={frameRef}
        id={id}
        role="tooltip"
        className={frameClasses}
        style={frameStyle}
        data-type={rich ? 'rich' : 'single'}
        data-shown={shown}
        onPointerLeave={frameLeave}
      >
        <div className={`${styles.box} ${rich ? styles.type.rich : styles.type.single}`}>
          {rich ? (
            <NlTextBlock
              type="headline-small"
              tone="inverse"
              heading={heading}
              headingAs="p"
              description={description}
            />
          ) : (
            content
          )}
        </div>
      </div>
    </>
  );
}

/** True when the pointer left for somewhere outside `other` (not into the tooltip or back to the trigger). */
const leftFor = (event: PointerEvent<HTMLElement>, other: HTMLElement | null) =>
  !(event.relatedTarget instanceof Node && other?.contains(event.relatedTarget));

interface TriggerWiring {
  id: string;
  own: TriggerProps;
  triggerRef: RefObject<HTMLElement | null>;
  frameRef: RefObject<HTMLDivElement | null>;
  showTimer: RefObject<ReturnType<typeof setTimeout> | undefined>;
  show: () => void;
  hide: () => void;
}

/**
 * The props NlTooltip adds to its trigger, merged with the trigger's own: the ref, `aria-describedby`, and the hover
 * and focus handlers. A hook, so the handlers (which use refs) are made outside render-time calls.
 */
function useTriggerProps({ id, own, triggerRef, frameRef, showTimer, show, hide }: TriggerWiring): TriggerProps {
  return {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      assignRef(own.ref, node);
    },
    'aria-describedby': [own['aria-describedby'], id].filter(Boolean).join(' '),
    onPointerEnter: (event) => {
      own.onPointerEnter?.(event);
      if (event.pointerType === 'touch') return;
      clearTimeout(showTimer.current);
      showTimer.current = setTimeout(show, tokenNumber('--nl-duration-base'));
    },
    onPointerLeave: (event) => {
      own.onPointerLeave?.(event);
      if (leftFor(event, frameRef.current)) hide();
    },
    onFocus: (event) => {
      own.onFocus?.(event);
      if (event.currentTarget.matches(':focus-visible')) show();
    },
    onBlur: (event) => {
      own.onBlur?.(event);
      hide();
    },
  };
}

/** The tooltip's own pointer leave: hides unless the pointer went back to the trigger. */
function useFrameLeave({ triggerRef, hide }: Pick<TriggerWiring, 'triggerRef' | 'hide'>) {
  return (event: PointerEvent<HTMLElement>) => {
    if (leftFor(event, triggerRef.current)) hide();
  };
}
