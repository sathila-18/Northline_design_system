'use client';

import { useEffect, useRef, useState, type ComponentPropsWithRef, type ElementType } from 'react';
import * as styles from './NlNavSubItem.styles';

export type NlNavSubItemTree = 'none' | 'middle' | 'last';

export interface NlNavSubItemProps extends Omit<ComponentPropsWithRef<'a'>, 'className'> {
  /** The current page: aria-current="page", bg-primary and text-action. */
  current?: boolean;
  /** Tree line: none (default), middle (continues to the next item) or last (stops at the curve). */
  tree?: NlNavSubItemTree;
  /** The element to render: 'a' (default) or a router link component. */
  as?: ElementType;
  /** Placement only. */
  className?: string;
}

/**
 * A page link under an expanded section in the side nav (DESIGN.md §9, NlNavSubItem). Internal (§7.2): only NlNavItem
 * uses it. A link (`as`, default `<a>`) with `aria-current="page"` when current; the tree line is decorative. Text
 * that doesn't fit is cut with an ellipsis and then gets the full text as `title` (measured after layout and on
 * resize). 'use client' for the measuring.
 */
export function NlNavSubItem({ current = false, tree = 'none', as, className, children, ...rest }: NlNavSubItemProps) {
  const Element: ElementType = as ?? 'a';
  const textRef = useRef<HTMLSpanElement>(null);
  const [fullText, setFullText] = useState<string | undefined>(undefined);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;
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
  }, [children]);

  const classes = [styles.root, current ? styles.state.current : styles.state.default, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Element
      {...rest}
      className={classes}
      aria-current={current ? 'page' : undefined}
      title={rest.title ?? fullText}
      data-current={current || undefined}
      data-tree={tree}
    >
      {tree !== 'none' && <span aria-hidden="true" className={styles.treeLine} data-slot="tree-line" />}
      {tree === 'middle' && <span aria-hidden="true" className={styles.treeContinue} data-slot="tree-continue" />}
      <span ref={textRef} className={styles.text}>
        {children}
      </span>
    </Element>
  );
}
