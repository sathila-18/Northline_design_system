'use client';

import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import * as styles from './NlMenu.styles';

export type NlMenuKind = 'action' | 'select' | 'filter' | 'navigation';

/**
 * Where the menu opens: below the trigger (default); above it (side nav user); or beside it at the end, aligned to its
 * top (minimized nav item) or its bottom (minimized side nav user).
 */
export type NlMenuPlacement = 'bottom-start' | 'top-start' | 'end-start' | 'end-end';

/** Size-* token names, for maxHeight (OD-20). */
export type NlMenuMaxHeight = '24' | '32' | '36' | '40' | '48' | '56' | '64' | '80' | '96' | '120' | '320';

interface NlMenuBaseProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby'
> {
  /** Shown or hidden. Hidden, it stays in the page with display none, so it can fade out. */
  open: boolean;
  /** Called when the menu asks to open or close: Escape, a click outside, Tab, or activating a row. */
  onOpenChange: (open: boolean) => void;
  /** The trigger. The menu sits below it (or above, when there isn't room) and is at least as wide. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Where focus goes back when the menu closes, when that isn't the anchor (NlSelect: the field inside the box). */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Sets the role and keyboard. Default action. */
  kind?: NlMenuKind;
  /** Select only: several options can be selected; selecting doesn't close the menu. */
  multiple?: boolean;
  /** Rows: elements with role menuitem (action, navigation) or option (select), usually tabIndex -1. */
  children?: ReactNode;
  /** Optional slot that stays at the top, for example a search field. */
  header?: ReactNode;
  /**
   * Where focus goes on open: rows (default: the selected row, else the first) or header (its first field, for a
   * search; Down then moves into the rows) (NlMultiSelect, OD-205).
   */
  initialFocus?: 'rows' | 'header';
  /** Optional slot that stays at the bottom, for example two buttons. Laid out in a row, aligned to the end. */
  footer?: ReactNode;
  /** Optional maximum height, as a Size-* token name. The menu never grows past the window either way. */
  maxHeight?: NlMenuMaxHeight;
  /**
   * bottom-start (default): below the trigger. top-start: above it. end-start, end-end: beside it at the end, aligned
   * to its top (OD-118) or bottom (NlSideNavUser minimized). Each flips to the other side when there isn't room.
   */
  placement?: NlMenuPlacement;
}

/** An accessible name is required: aria-label, or the id of a visible label (usually the trigger). */
export type NlMenuProps = NlMenuBaseProps &
  ({ 'aria-label': string; 'aria-labelledby'?: never } | { 'aria-label'?: never; 'aria-labelledby': string });

const ROLE: Record<NlMenuKind, 'menu' | 'listbox' | 'dialog'> = {
  action: 'menu',
  select: 'listbox',
  filter: 'dialog',
  navigation: 'menu',
};

const HASPOPUP: Record<NlMenuKind, 'menu' | 'listbox' | 'dialog'> = ROLE;

/**
 * Props for the caller's trigger button: aria-haspopup, aria-expanded and aria-controls (DESIGN.md §9, NlMenu).
 * `menuId` is the menu's `id`.
 */
export function nlMenuTriggerProps({
  kind = 'action',
  open,
  menuId,
}: {
  kind?: NlMenuKind;
  open: boolean;
  menuId: string;
}) {
  return { 'aria-haspopup': HASPOPUP[kind], 'aria-expanded': open, 'aria-controls': menuId } as const;
}

const ROW_SELECTOR: Record<NlMenuKind, string | null> = {
  action: '[role="menuitem"]',
  select: '[role="option"]',
  filter: null,
  navigation: '[role="menuitem"]',
};

const FOCUSABLE =
  'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const isEnabled = (row: HTMLElement) =>
  row.getAttribute('aria-disabled') !== 'true' && !(row as HTMLButtonElement).disabled;

/** Our logical placement as a @floating-ui placement; "end" is the right in left-to-right, the left in right-to-left. */
const floatingPlacement = (placement: NlMenuPlacement, rtl: boolean) => {
  const end = rtl ? 'left' : 'right';
  switch (placement) {
    case 'top-start':
      return 'top-start';
    case 'end-start':
      return `${end}-start` as const;
    case 'end-end':
      return `${end}-end` as const;
    default:
      return 'bottom-start';
  }
};

/** A design token in pixels, read from the page (Space-* are length custom properties). */
const tokenPx = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

/**
 * The floating surface for every menu (DESIGN.md §9, NlMenu): a panel with an optional sticky header and footer and
 * scrolling content between them. `kind` sets the role and keyboard. Positioned against `anchorRef` with
 * @floating-ui/dom. Render it right after its trigger, so Tab out of the menu continues from there.
 * `id` names the element that carries the role (pass it to `nlMenuTriggerProps`); other attributes and `className`
 * go to the panel.
 */
export function NlMenu({
  open,
  onOpenChange,
  anchorRef,
  returnFocusRef,
  kind = 'action',
  multiple = false,
  children,
  header,
  initialFocus = 'rows',
  footer,
  maxHeight,
  placement = 'bottom-start',
  id,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...rest
}: NlMenuProps) {
  const generatedId = useId();
  const menuId = id ?? generatedId;
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Record<string, string> | null>(null);

  const role = ROLE[kind];
  const rowSelector = ROW_SELECTOR[kind];
  const rows = () =>
    rowSelector ? [...(contentRef.current?.querySelectorAll<HTMLElement>(rowSelector) ?? [])].filter(isEnabled) : [];

  // Position while open: below the trigger, Space-XS away, flipping above; Space-M from the window edge; at least the
  // trigger's width; never taller or wider than the room left (OD-18). Follows scroll and resize.
  useEffect(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!open || !anchor || !panel) return;
    const gap = tokenPx('--nl-space-xs');
    const edge = tokenPx('--nl-space-m');
    const update = () => {
      void computePosition(anchor, panel, {
        strategy: 'fixed',
        placement: floatingPlacement(placement, getComputedStyle(anchor).direction === 'rtl'),
        middleware: [
          offset(gap),
          flip({ padding: edge }),
          shift({ padding: edge }),
          size({
            padding: edge,
            apply({ availableWidth, availableHeight, rects }) {
              panel.style.setProperty('--nl-menu-min-width', `${String(rects.reference.width)}px`);
              panel.style.setProperty('--nl-menu-available-width', `${String(Math.max(0, availableWidth))}px`);
              panel.style.setProperty('--nl-menu-available-height', `${String(Math.max(0, availableHeight))}px`);
            },
          }),
        ],
      }).then(({ x, y, placement }) => {
        setPosition({ x: `${String(x)}px`, y: `${String(y)}px`, placement });
      });
    };
    const stop = autoUpdate(anchor, panel, update);
    return () => {
      stop();
      setPosition(null);
    };
  }, [open, anchorRef, placement]);

  // Focus on open: the selected row (select), the first row (action, navigation), the first field (filter).
  // Waits for the first position: until then the panel is visibility hidden, and hidden elements can't take focus.
  const positioned = position !== null;
  useEffect(() => {
    if (!open || !positioned) return;
    if (kind === 'filter') {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
      return;
    }
    if (initialFocus === 'header' && header !== undefined) {
      headerRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
      return;
    }
    const enabled = rows();
    const selected = enabled.find((row) => row.getAttribute('aria-selected') === 'true');
    (selected ?? enabled[0])?.focus();
    // rows() reads the DOM at the moment the menu opens; it isn't a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, kind, positioned, initialFocus]);

  // A click outside the panel and the trigger closes the menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onOpenChange(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, anchorRef, onOpenChange]);

  const close = (returnFocus: boolean) => {
    onOpenChange(false);
    if (returnFocus) (returnFocusRef ?? anchorRef).current?.focus();
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    }
  };

  // Down from the header (a search field) moves into the rows.
  const onHeaderKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown') return;
    const first = rows()[0];
    if (!first) return;
    event.preventDefault();
    first.focus();
  };

  // Arrow keys (wrapping), Home and End, a letter to jump, Enter or Space to activate, Tab to close (OD-19).
  const onContentKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!rowSelector) return;
    const enabled = rows();
    if (enabled.length === 0) return;
    const current = enabled.indexOf(document.activeElement as HTMLElement);
    const focusAt = (index: number) => {
      event.preventDefault();
      enabled[(index + enabled.length) % enabled.length]?.focus();
    };
    switch (event.key) {
      case 'ArrowDown':
        focusAt(current + 1);
        return;
      case 'ArrowUp':
        focusAt(current < 0 ? -1 : current - 1);
        return;
      case 'Home':
        focusAt(0);
        return;
      case 'End':
        focusAt(-1);
        return;
      case 'Tab':
        onOpenChange(false);
        return;
      case 'Enter':
      case ' ': {
        const row = (event.target as HTMLElement).closest<HTMLElement>(rowSelector);
        if (row && current >= 0) {
          event.preventDefault();
          row.click();
        }
        return;
      }
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const letter = event.key.toLowerCase();
          for (let step = 1; step <= enabled.length; step += 1) {
            const index = (current + step) % enabled.length;
            if (enabled[index]?.textContent.trim().toLowerCase().startsWith(letter)) {
              focusAt(index);
              return;
            }
          }
        }
    }
  };

  // Activating a row closes the menu, except multiple select. Disabled rows do nothing.
  const onContentClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!rowSelector) return;
    const row = (event.target as HTMLElement).closest<HTMLElement>(rowSelector);
    if (!row || !isEnabled(row)) return;
    if (kind === 'select' && multiple) return;
    close(true);
  };

  const positionStyle = {
    ...style,
    ...(position ? { '--nl-menu-x': position.x, '--nl-menu-y': position.y } : {}),
    ...(maxHeight ? { '--nl-menu-max-height': `var(--nl-size-${maxHeight})` } : {}),
  } as CSSProperties;
  const classes = [
    styles.panel,
    open ? styles.state.open : styles.state.closed,
    open && !position ? styles.unpositioned : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const naming = { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby };
  const isDialog = role === 'dialog';

  return (
    <div
      {...rest}
      {...(isDialog ? { id: menuId, role, 'aria-modal': false, ...naming } : {})}
      ref={panelRef}
      className={classes}
      style={positionStyle}
      onKeyDown={onPanelKeyDown}
      data-kind={kind}
      data-open={open}
      data-placement={position?.placement}
    >
      {header !== undefined && (
        <div ref={headerRef} className={styles.header} onKeyDown={onHeaderKeyDown}>
          {header}
        </div>
      )}
      <div
        ref={contentRef}
        className={styles.content}
        {...(isDialog
          ? {}
          : {
              id: menuId,
              role,
              ...naming,
              ...(kind === 'select' && multiple ? { 'aria-multiselectable': true } : {}),
            })}
        onKeyDown={onContentKeyDown}
        onClick={onContentClick}
      >
        {children}
      </div>
      {footer !== undefined && (
        <div className={styles.footer}>
          <div className={styles.footerRow}>{footer}</div>
        </div>
      )}
    </div>
  );
}
