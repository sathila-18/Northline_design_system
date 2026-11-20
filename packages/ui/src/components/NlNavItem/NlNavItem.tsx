'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ElementType,
  type RefObject,
} from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import { NlListItem } from '../NlListItem';
import { NlMenu, nlMenuTriggerProps } from '../NlMenu';
import { NlNavIcon } from '../NlNavIcon';
import { NlNavSubItem } from '../NlNavSubItem';
import { NlTooltip } from '../NlTooltip';
import * as styles from './NlNavItem.styles';

export type NlNavItemCurrent = 'page' | 'section';

export interface NlNavItemPage {
  label: string;
  href: string;
  /** The open page. */
  current?: boolean;
  /** A router link component. */
  as?: ElementType;
}

export interface NlNavItemProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> {
  /** The section's name. */
  children: string;
  /** The section's icon (NlNavIcon, filled when current). */
  icon: NlIconName;
  /** page: this row is the open page (white row). section: a page inside is open (grey row) (OD-130). Default: from
   * `pages` (OD-190). */
  current?: NlNavItemCurrent;
  /** The section's pages. With pages the row is a button that shows them. */
  pages?: NlNavItemPage[];
  /** Pages shown (controlled). */
  expanded?: boolean;
  /** Pages shown at first. Default: when one of them is current (OD-190). */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Link target, for a section without pages. */
  href?: string;
  /** A router link component, for a section without pages. */
  as?: ElementType;
  /** Icon only (set by NlSideNav): the label is a tooltip; pages open in a menu to the end (OD-118, OD-189). */
  minimized?: boolean;
  /** Placement only. */
  className?: string;
}

/**
 * A section in the side nav (DESIGN.md §9, NlNavItem): an icon and name that links to a page, or a button that
 * shows the section's pages (NlNavSubItem with the tree line). Minimized: icon only, the name in an NlTooltip, and a
 * section's pages in an NlMenu (kind navigation) to the end. 'use client' for state, refs and effects.
 */
export function NlNavItem({
  children,
  icon,
  current,
  pages,
  expanded,
  defaultExpanded,
  onExpandedChange,
  href,
  as,
  minimized = false,
  className,
  ...rest
}: NlNavItemProps) {
  const id = useId();
  const pagesId = `${id}-pages`;
  const menuId = `${id}-menu`;
  const hasPages = pages !== undefined && pages.length > 0;
  const pageOpen = hasPages && pages.some((page) => page.current);
  const resolved: NlNavItemCurrent | undefined = current ?? (pageOpen ? 'section' : undefined);
  const [innerExpanded, setInnerExpanded] = useState(defaultExpanded ?? pageOpen);
  const isExpanded = expanded ?? innerExpanded;
  const [menuOpen, setMenuOpen] = useState(false);
  const rowRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [fullText, setFullText] = useState<string | undefined>(undefined);

  // A title with the full name only when it is cut (OD-191). Measured after layout and on resize.
  useEffect(() => {
    const node = labelRef.current;
    if (!node || minimized) return;
    const measure = () => {
      setFullText(node.scrollWidth > node.clientWidth ? node.textContent : undefined);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [children, minimized]);

  const toggle = () => {
    const next = !isExpanded;
    if (expanded === undefined) setInnerExpanded(next);
    onExpandedChange?.(next);
  };

  const rowClasses = [styles.row, minimized ? styles.rowMinimized : undefined, styles.state[resolved ?? 'default']]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <NlNavIcon name={icon} selected={resolved !== undefined} />
      <span
        ref={labelRef}
        className={minimized ? styles.hidden : styles.label}
        title={minimized ? undefined : fullText}
      >
        {children}
      </span>
      {hasPages && !minimized && (
        <span className={styles.chevron[resolved ? 'current' : 'default']} data-slot="chevron">
          <NlIcon name={isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={20} tone="inherit" />
        </span>
      )}
    </>
  );

  let row;
  if (!hasPages) {
    const Link: ElementType = as ?? 'a';
    row = (
      <Link
        ref={rowRef}
        href={href}
        className={rowClasses}
        aria-current={resolved === 'page' ? 'page' : undefined}
        data-current={resolved}
      >
        {inner}
      </Link>
    );
  } else if (minimized) {
    row = (
      <button
        ref={rowRef as RefObject<HTMLButtonElement>}
        type="button"
        className={rowClasses}
        data-current={resolved}
        {...nlMenuTriggerProps({ kind: 'navigation', open: menuOpen, menuId })}
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        {inner}
      </button>
    );
  } else {
    row = (
      <button
        ref={rowRef as RefObject<HTMLButtonElement>}
        type="button"
        className={rowClasses}
        aria-expanded={isExpanded}
        aria-controls={pagesId}
        data-current={resolved}
        onClick={toggle}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      {...rest}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-minimized={minimized || undefined}
    >
      {minimized ? (
        <NlTooltip content={children} placement="end">
          {row}
        </NlTooltip>
      ) : (
        row
      )}
      {hasPages && !minimized && isExpanded && (
        <ul id={pagesId} className={styles.pages}>
          {pages.map((page, index) => (
            <li key={page.href}>
              <NlNavSubItem
                href={page.href}
                as={page.as}
                current={page.current}
                tree={index === pages.length - 1 ? 'last' : 'middle'}
              >
                {page.label}
              </NlNavSubItem>
            </li>
          ))}
        </ul>
      )}
      {hasPages && minimized && (
        <NlMenu
          id={menuId}
          kind="navigation"
          placement="end-start"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          anchorRef={rowRef}
          aria-label={children}
        >
          {pages.map((page) => (
            <NlListItem
              key={page.href}
              role="menuitem"
              href={page.href}
              as={page.as}
              title={page.label}
              size="small"
              density="compact"
              divider={false}
              selected={page.current}
              aria-current={page.current ? 'page' : undefined}
            />
          ))}
        </NlMenu>
      )}
    </div>
  );
}
