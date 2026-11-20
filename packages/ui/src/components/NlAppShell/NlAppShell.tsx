'use client';

import { useId, useRef, type MouseEvent, type ReactNode } from 'react';
import * as styles from './NlAppShell.styles';

export interface NlAppShellProps {
  /** The side nav (NlSideNav). It renders its own <nav>; the shell adds no landmark around it (OD-236). */
  nav: ReactNode;
  /** The page header (NlPageHeader), in a <header> that doesn't scroll. */
  header?: ReactNode;
  /** The page, in <main>: the only part that scrolls. The page spaces its blocks Space-4XL apart. */
  children?: ReactNode;
  /** A "Skip to content" link as the first tab stop. */
  skipLink?: boolean;
  /** The skip link's text. Default "Skip to content". */
  skipLinkLabel?: string;
  /** The <main> element's id (the skip link's target). Default: a generated one. */
  mainId?: string;
  /** Placement only. */
  className?: string;
}

/**
 * The page frame for every admin screen (DESIGN.md §9, NlAppShell): the nav slot on the left and, on the right, a
 * rounded panel with the header slot and the scrolling content (<main>), Space-XS apart on the page background. Only
 * the content scrolls; it takes keyboard focus with an inside ring. An optional skip link moves focus to <main>.
 * 'use client' for the skip link's focus move.
 */
export function NlAppShell({
  nav,
  header,
  children,
  skipLink = false,
  skipLinkLabel = 'Skip to content',
  mainId,
  className,
}: NlAppShellProps) {
  const generatedId = useId();
  const contentId = mainId ?? `${generatedId}-main`;
  const mainRef = useRef<HTMLElement>(null);

  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    mainRef.current?.focus();
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {skipLink && (
        <div className={styles.skipWrapper}>
          <span className={styles.skipReveal}>
            <a href={`#${contentId}`} className={styles.skipLink} onClick={skip}>
              {skipLinkLabel}
            </a>
          </span>
        </div>
      )}
      <div className={styles.nav} data-slot="nav">
        {nav}
      </div>
      <div className={styles.panelArea}>
        <div className={styles.panel}>
          {header !== undefined && header !== null && <header className={styles.header}>{header}</header>}
          <main ref={mainRef} id={contentId} tabIndex={0} className={styles.main}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
