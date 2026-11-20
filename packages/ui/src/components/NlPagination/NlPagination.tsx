'use client';

import { useEffect, useRef, type ComponentPropsWithRef } from 'react';
import { NlButton } from '../NlButton';
import { NlPaginationItem } from '../NlPaginationItem';
import { paginationEntries } from './pages';
import * as styles from './NlPagination.styles';

export interface NlPaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'className' | 'children'> {
  /** The current page, 1-based. Clamped to 1…pageCount (OD-183). */
  page: number;
  /** The number of pages. */
  pageCount: number;
  /** Called with the page to show. */
  onPageChange: (page: number) => void;
  /** Pages shown either side of the current one. Default 1 (OD-127). */
  siblingCount?: number;
  /** The nav's name. Default "Pagination". */
  'aria-label'?: string;
  /** Placement only. */
  className?: string;
}

type Source = 'page' | 'previous' | 'next' | null;

/**
 * Page numbers with previous and next buttons, for the table footer (DESIGN.md §9, NlPagination). A named <nav>
 * around a list: previous and next NlButtons (secondary, xsmall, icon-only; native disabled at the ends, OD-126) and
 * NlPaginationItem pages with "…" gaps. Controlled. After a change, focus moves to the new current page when a page
 * was picked, or stays on previous or next unless that end is now disabled. 'use client' for refs and effects.
 */
export function NlPagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  'aria-label': ariaLabel = 'Pagination',
  className,
  ...rest
}: NlPaginationProps) {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.min(Math.max(1, Math.floor(page)), count);
  const entries = paginationEntries(current, count, siblingCount);
  const navRef = useRef<HTMLElement>(null);
  const source = useRef<Source>(null);
  const atStart = current <= 1;
  const atEnd = current >= count;

  useEffect(() => {
    const from = source.current;
    source.current = null;
    if (!from) return;
    const endReached = (from === 'previous' && atStart) || (from === 'next' && atEnd);
    if (from === 'page' || endReached) {
      navRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
    }
  }, [current, atStart, atEnd]);

  const go = (target: number, from: Source) => {
    if (target === current || target < 1 || target > count) return;
    source.current = from;
    onPageChange(target);
  };

  const classes = [styles.root, className].filter(Boolean).join(' ');

  return (
    <nav {...rest} ref={navRef} aria-label={ariaLabel} className={classes}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <NlButton
            variant="secondary"
            size="xsmall"
            icon="only-icon"
            iconName="chevron_left"
            disabled={atStart}
            onClick={() => {
              go(current - 1, 'previous');
            }}
          >
            Previous page
          </NlButton>
        </li>
        {entries.map((entry) =>
          entry.kind === 'page' ? (
            <li key={entry.page} className={styles.item}>
              <NlPaginationItem
                page={entry.page}
                current={entry.page === current}
                onSelect={(target) => {
                  go(target, 'page');
                }}
              />
            </li>
          ) : (
            <li key={`gap-${entry.key}`} className={styles.item} aria-hidden="true">
              <NlPaginationItem kind="ellipsis" />
            </li>
          ),
        )}
        <li className={styles.item}>
          <NlButton
            variant="secondary"
            size="xsmall"
            icon="only-icon"
            iconName="chevron_right"
            disabled={atEnd}
            onClick={() => {
              go(current + 1, 'next');
            }}
          >
            Next page
          </NlButton>
        </li>
      </ul>
    </nav>
  );
}
