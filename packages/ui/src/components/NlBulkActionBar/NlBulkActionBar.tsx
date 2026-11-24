'use client';

import { useId, useLayoutEffect, useRef, useState, type ComponentPropsWithRef } from 'react';
import type { NlIconName } from '../../icons';
import { NlButton } from '../NlButton';
import { NlListItem } from '../NlListItem';
import { NlMenu } from '../NlMenu';
import * as styles from './NlBulkActionBar.styles';

export interface NlBulkAction {
  label: string;
  /** Leading icon that stands for the action. */
  icon: NlIconName;
  onSelect: () => void;
  /** Destructive actions are solid red (D21), always shown, after the others; never in the more menu. */
  tone?: 'normal' | 'destructive';
  disabled?: boolean;
}

export interface NlBulkActionBarProps extends Omit<ComponentPropsWithRef<'div'>, 'className' | 'children' | 'role'> {
  /** How many items are selected. */
  count: number;
  /** Empties the selection. */
  onClear: () => void;
  /** The actions, in order. Up to 7 show (as many as fit); the rest go into the more menu. */
  actions: NlBulkAction[];
  /** The region's name. Default "Bulk actions". */
  'aria-label'?: string;
  /** Placement only. */
  className?: string;
}

/** At most this many actions show in the bar; the rest go into the more menu (D21). */
const MAX_VISIBLE = 7;

const px = (value: string) => Number.parseFloat(value) || 0;

/**
 * The bar for acting on selected items (DESIGN.md §9, NlBulkActionBar, D21). A floating bg-direct pill: a clear
 * selection button, "{n} selected", the actions as small buttons with leading icons (normal actions tertiary on the
 * inverse surface, destructive ones solid red), and a more button with an NlMenu for actions that don't fit. Up to 7
 * actions show, fewer when the container is narrow; destructive actions always show, last. The page or NlTable places
 * it. 'use client' for state, refs and measuring.
 */
export function NlBulkActionBar({
  count,
  onClear,
  actions,
  'aria-label': ariaLabel = 'Bulk actions',
  className,
  ...rest
}: NlBulkActionBarProps) {
  const id = useId();
  const menuId = `${id}-more`;
  const normal = actions.filter((action) => action.tone !== 'destructive');
  const destructive = actions.filter((action) => action.tone === 'destructive');
  const limit = Math.max(0, Math.min(normal.length, MAX_VISIBLE - destructive.length));

  // How many normal actions show. Starts at the limit (server and first render), then fits the container.
  const [shown, setShown] = useState(limit);
  const [moreOpen, setMoreOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);

  const actionKey = actions.map((action) => action.label).join('\u0000');
  useLayoutEffect(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    const container = root?.parentElement;
    if (!root || !measure || !container) return;
    const fit = () => {
      const style = getComputedStyle(root);
      const gap = px(style.columnGap);
      const widths = [...measure.children].map((child) => (child as HTMLElement).offsetWidth);
      const normalWidths = widths.slice(0, normal.length);
      const destructiveWidths = widths.slice(normal.length, normal.length + destructive.length);
      const moreWidth = widths.at(-1) ?? 0;
      // Clear button and count: every child before the actions row.
      const lead = [...root.children].slice(0, 2).reduce((sum, child) => sum + (child as HTMLElement).offsetWidth, 0);
      const actionGap = px(getComputedStyle(measure).columnGap);
      const available = container.clientWidth - px(style.paddingInlineStart) - px(style.paddingInlineEnd);
      for (let k = limit; k >= 0; k -= 1) {
        const buttons = [...normalWidths.slice(0, k), ...destructiveWidths, ...(k < normal.length ? [moreWidth] : [])];
        const row = buttons.reduce((sum, w) => sum + w, 0) + actionGap * Math.max(0, buttons.length - 1);
        if (lead + gap * 2 + row <= available || k === 0) {
          setShown(k);
          return;
        }
      }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
    // actionKey stands for the actions; their widths only change with their labels.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionKey, limit]);

  const visible = normal.slice(0, shown);
  const overflow = normal.slice(shown);

  const button = (action: NlBulkAction) =>
    action.tone === 'destructive' ? (
      <NlButton
        key={action.label}
        tone="destructive"
        variant="primary"
        size="small"
        icon="leading"
        iconName={action.icon}
        disabled={action.disabled}
        onClick={action.onSelect}
      >
        {action.label}
      </NlButton>
    ) : (
      <NlButton
        key={action.label}
        variant="tertiary"
        contentTone="inverse"
        size="small"
        icon="leading"
        iconName={action.icon}
        disabled={action.disabled}
        onClick={action.onSelect}
      >
        {action.label}
      </NlButton>
    );

  return (
    <div
      {...rest}
      ref={rootRef}
      role="region"
      aria-label={ariaLabel}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <NlButton
        variant="tertiary"
        contentTone="inverse"
        size="small"
        icon="only-icon"
        iconName="close"
        onClick={onClear}
      >
        Clear selection
      </NlButton>
      <p className={styles.count}>{`${String(count)} selected`}</p>
      <div className={styles.actions}>
        {visible.map(button)}
        {destructive.map(button)}
        {overflow.length > 0 && (
          <NlButton
            ref={moreRef}
            variant="tertiary"
            contentTone="inverse"
            size="small"
            icon="only-icon"
            iconName="more_vert"
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            aria-controls={menuId}
            onClick={() => {
              setMoreOpen(!moreOpen);
            }}
          >
            More actions
          </NlButton>
        )}
      </div>
      {/* Every action at its natural width, for fitting. Not seen, not read, not focusable. */}
      <div ref={measureRef} className={styles.measure} aria-hidden inert>
        {normal.map(button)}
        {destructive.map(button)}
        <NlButton variant="tertiary" size="small" icon="only-icon" iconName="more_vert">
          More actions
        </NlButton>
      </div>
      {overflow.length > 0 && (
        <NlMenu
          id={menuId}
          kind="action"
          placement="top-start"
          open={moreOpen}
          onOpenChange={setMoreOpen}
          anchorRef={moreRef}
          aria-label="More actions"
        >
          {overflow.map((action) => (
            <NlListItem
              key={action.label}
              role="menuitem"
              title={action.label}
              icon={action.icon}
              size="small"
              density="compact"
              divider={false}
              disabled={action.disabled}
              onClick={() => {
                setMoreOpen(false);
                action.onSelect();
              }}
            />
          ))}
        </NlMenu>
      )}
    </div>
  );
}
