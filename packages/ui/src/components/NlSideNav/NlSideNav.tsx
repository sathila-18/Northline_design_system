'use client';

import { useEffect, useState, type ComponentPropsWithRef, type ElementType, type ReactNode } from 'react';
import type { NlIconName } from '../../icons';
import { NlButton } from '../NlButton';
import { NlNavItem } from '../NlNavItem';
import { NlSideNavUser, type NlSideNavUserProps } from '../NlSideNavUser';
import * as styles from './NlSideNav.styles';

export interface NlSideNavPage {
  label: string;
  href: string;
  /** A router link component. */
  as?: ElementType;
}

export interface NlSideNavItem {
  icon: NlIconName;
  label: string;
  /** Link target, for a section without pages. */
  href?: string;
  /** A router link component, for a section without pages. */
  as?: ElementType;
  /** The section's pages. */
  pages?: NlSideNavPage[];
}

export interface NlSideNavProps extends Omit<ComponentPropsWithRef<'nav'>, 'className' | 'children'> {
  /** The sections. */
  items: NlSideNavItem[];
  /** The open page's address: marks its section (and page) current; that section opens by default. */
  currentHref?: string;
  /** default, or tree: lines from an open section to its pages (expanded only). */
  variant?: 'default' | 'tree';
  /** The logo, at the start of the header row. Hidden when minimized. */
  logo?: ReactNode;
  /** The signed-in user at the bottom. */
  user?: Omit<NlSideNavUserProps, 'minimized'>;
  /** Minimized (controlled). */
  minimized?: boolean;
  /** Minimized at first (uncontrolled). Default: from the window, minimized below Breakpoint-1280. */
  defaultMinimized?: boolean;
  /** Called when the nav is minimized or expanded. */
  onMinimizedChange?: (minimized: boolean) => void;
  /** Placement only. */
  className?: string;
}

/** Reads a --nl-breakpoint-* custom property in pixels (browser only, never during render). */
function readBreakpoint(name: string, fallback: number): number {
  const value = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isNaN(value) ? fallback : value;
}

/**
 * The app's main navigation (DESIGN.md §9, NlSideNav): a <nav> with a logo and collapse NlButton at the top, a list of
 * NlNavItem sections, and NlSideNavUser at the bottom. Expanded (Size-240 column, OD-134) or minimized (Size-80);
 * uncontrolled, it follows Breakpoint-1280 (expanded from there, minimized below) and the user can toggle it until the
 * window crosses 1280 again. The collapse button's name says what it does, with no aria-expanded (OD-233: NlButton
 * would draw it pressed). `currentHref` marks the current section and page. 'use client' for state and effects.
 */
export function NlSideNav({
  items,
  currentHref,
  variant = 'default',
  logo,
  user,
  minimized,
  defaultMinimized,
  onMinimizedChange,
  className,
  'aria-label': ariaLabel = 'Main',
  ...rest
}: NlSideNavProps) {
  const [ownMinimized, setOwnMinimized] = useState(defaultMinimized ?? false);
  const isMinimized = minimized ?? ownMinimized;

  // Uncontrolled and without a default: follow Breakpoint-1280, and again each time the window crosses it.
  useEffect(() => {
    if (minimized !== undefined || defaultMinimized !== undefined || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(`(min-width: ${String(readBreakpoint('--nl-breakpoint-1280', 1280))}px)`);
    const follow = () => {
      setOwnMinimized(!query.matches);
    };
    follow();
    query.addEventListener('change', follow);
    return () => {
      query.removeEventListener('change', follow);
    };
  }, [minimized, defaultMinimized]);

  const toggle = () => {
    const next = !isMinimized;
    if (minimized === undefined) setOwnMinimized(next);
    onMinimizedChange?.(next);
  };

  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      className={[styles.root, styles.width[isMinimized ? 'minimized' : 'expanded'], className]
        .filter(Boolean)
        .join(' ')}
      data-variant={variant}
      data-minimized={isMinimized || undefined}
    >
      <div className={styles.column}>
        <div className={styles.top}>
          <div className={styles.header[isMinimized ? 'minimized' : 'expanded']}>
            {!isMinimized && logo !== undefined && <div className={styles.logo}>{logo}</div>}
            <span className={styles.collapse}>
              <NlButton
                type="button"
                variant="tertiary"
                size="medium"
                contentTone="secondary"
                icon="only-icon"
                iconName="dock_to_right"
                onClick={toggle}
              >
                {isMinimized ? 'Expand navigation' : 'Collapse navigation'}
              </NlButton>
            </span>
          </div>
          <ul className={styles.sections}>
            {items.map((item) => {
              const pages = item.pages?.map((page) => ({ ...page, current: page.href === currentHref }));
              const current = !pages && item.href !== undefined && item.href === currentHref ? 'page' : undefined;
              return (
                <li key={item.label}>
                  <NlNavItem
                    icon={item.icon}
                    href={item.href}
                    as={item.as}
                    pages={pages}
                    current={current}
                    minimized={isMinimized}
                    tree={variant === 'tree'}
                  >
                    {item.label}
                  </NlNavItem>
                </li>
              );
            })}
          </ul>
        </div>
        {user && <NlSideNavUser {...user} minimized={isMinimized} />}
      </div>
    </nav>
  );
}
