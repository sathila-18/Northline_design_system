'use client';

import { useEffect, useRef, useState, type ComponentPropsWithRef, type ElementType, type ReactNode } from 'react';
import { NlButton } from '../NlButton';
import { NlNotificationButton, type NlNotificationButtonProps } from '../NlNotificationButton';
import { NlTextBlock, type NlTextBlockHeadingAs } from '../NlTextBlock';
import * as styles from './NlPageHeader.styles';

export interface NlPageHeaderProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'children' | 'className'> {
  /** The page title: one line, cut with an ellipsis (full text in a tooltip when cut). */
  title: string;
  /** The title's element. Default h1, the page's heading (OD-144). */
  headingAs?: NlTextBlockHeadingAs;
  /** Under the title: text (Body M, text-secondary), or any content. */
  children?: ReactNode;
  /** Shows a back button that calls this. */
  onBack?: () => void;
  /** Shows a back link to this address. */
  backHref?: string;
  /** A router link component for the back link. */
  backAs?: ElementType;
  /** The back button's name. Default "Back"; for example "Back to rewards". */
  backLabel?: string;
  /** The notification button, at the end. */
  notifications?: NlNotificationButtonProps;
  /** Placement only. */
  className?: string;
}

/** "3 new notifications", "1 new notification". */
const announce = (count: number) => `${String(count)} new notification${count === 1 ? '' : 's'}`;

/**
 * The bar at the top of the content panel (DESIGN.md §9, NlPageHeader): an optional back NlButton (or link), the page
 * title (NlTextBlock headline-small, h1) with an optional line under it, and an optional NlNotificationButton. A
 * `div`: NlAppShell's header slot is the `<header>`. No bottom edge (OD-135). When the unread count rises, "{n} new
 * notifications" is announced politely. 'use client' for state, refs and effects.
 */
export function NlPageHeader({
  title,
  headingAs = 'h1',
  children,
  onBack,
  backHref,
  backAs,
  backLabel = 'Back',
  notifications,
  className,
  ...rest
}: NlPageHeaderProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [fullTitle, setFullTitle] = useState<string | undefined>(undefined);

  // The full title as a tooltip only when it's cut. Measured after layout and on resize.
  useEffect(() => {
    const node = titleRef.current;
    if (!node) return;
    const measure = () => {
      setFullTitle(node.scrollWidth > node.clientWidth ? title : undefined);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [title]);

  // Announce a rise in the unread count, not the first count or a fall (adjusting state during render).
  const count = notifications?.count ?? 0;
  const [seenCount, setSeenCount] = useState(count);
  const [message, setMessage] = useState('');
  if (count !== seenCount) {
    setSeenCount(count);
    setMessage(count > seenCount ? announce(count) : '');
  }

  const textBody = typeof children === 'string';
  const hasBody = children !== undefined && children !== null && children !== '';
  const heading = (
    <span ref={titleRef} className={styles.titleLine} title={fullTitle}>
      {title}
    </span>
  );

  const backProps = {
    variant: 'tertiary' as const,
    size: 'xsmall' as const,
    icon: 'only-icon' as const,
    iconName: 'arrow_back' as const,
    children: backLabel,
  };

  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.start}>
        {backHref !== undefined ? (
          <span className={styles.fixed}>
            <NlButton {...backProps} as={backAs ?? 'a'} href={backHref} />
          </span>
        ) : onBack !== undefined ? (
          <span className={styles.fixed}>
            <NlButton {...backProps} type="button" onClick={onBack} />
          </span>
        ) : null}
        <div className={styles.text}>
          <NlTextBlock
            type="headline-small"
            heading={heading}
            headingAs={headingAs}
            description={textBody && hasBody ? children : undefined}
          />
          {!textBody && hasBody ? children : null}
        </div>
      </div>
      {notifications && (
        <span className={styles.fixed}>
          <NlNotificationButton {...notifications} />
        </span>
      )}
      <span role="status" className={styles.announcement}>
        {message}
      </span>
    </div>
  );
}
