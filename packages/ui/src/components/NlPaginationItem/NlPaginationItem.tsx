'use client';

import type { ComponentPropsWithRef } from 'react';
import * as styles from './NlPaginationItem.styles';

interface NlPaginationItemCommonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'children' | 'onSelect' | 'className'
> {
  /** Placement only. */
  className?: string;
}

export type NlPaginationItemProps = NlPaginationItemCommonProps &
  (
    | {
        /** A page number button (default). */
        kind?: 'page';
        /** The page number. */
        page: number;
        /** The current page: aria-current="page", bg-active, no state change, never calls onSelect. */
        current?: boolean;
        /** Called with the page on click, Enter or Space. */
        onSelect?: (page: number) => void;
      }
    | {
        /** The "…" gap between page ranges: hidden from screen readers, no states. */
        kind: 'ellipsis';
        page?: undefined;
        current?: undefined;
        onSelect?: undefined;
      }
  );

/**
 * One page number button in the table pagination, or the "…" gap (DESIGN.md §9, NlPaginationItem). Internal (§7.2):
 * only NlPagination uses it, inside its named <nav>. A page is a native button named "Page 3"; the current page has
 * `aria-current="page"` and stays focusable but does nothing when pressed. The ellipsis is one "…" character,
 * `aria-hidden`. 'use client' for the click handler.
 */
export function NlPaginationItem(props: NlPaginationItemProps) {
  if (props.kind === 'ellipsis') {
    const { className } = props;
    return (
      <span
        aria-hidden="true"
        className={[styles.box, styles.ellipsis, className].filter(Boolean).join(' ')}
        data-kind="ellipsis"
      >
        …
      </span>
    );
  }

  const { kind = 'page', page, current = false, onSelect, onClick, className, ...rest } = props;
  const classes = [styles.box, styles.page, current ? styles.state.current : styles.state.default, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...rest}
      type="button"
      aria-label={`Page ${String(page)}`}
      aria-current={current ? 'page' : undefined}
      className={classes}
      data-kind={kind}
      data-current={current || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!current && !event.defaultPrevented) onSelect?.(page);
      }}
    >
      {page}
    </button>
  );
}
