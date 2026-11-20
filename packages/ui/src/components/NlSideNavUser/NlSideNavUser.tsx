'use client';

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { NlIcon } from '../../icons';
import { NlAvatar, type NlAvatarProps } from '../NlAvatar';
import { NlListItemBase } from '../NlListItemBase';
import { NlMenu, nlMenuTriggerProps } from '../NlMenu';
import { NlTooltip } from '../NlTooltip';
import * as styles from './NlSideNavUser.styles';

export interface NlSideNavUserProps {
  /** The user's name. */
  name: string;
  /** The user's email. */
  email: string;
  /** The avatar, as NlAvatar props. Always drawn at medium (40) (OD-132). */
  avatar?: Omit<NlAvatarProps, 'size'>;
  /** The account menu's rows (NlListItem with role="menuitem"). With rows the user row opens an NlMenu. */
  menu?: ReactNode;
  /** The account menu's name, also the end of the row's accessible name. Default "Account menu". */
  menuLabel?: string;
  /** Menu shown (controlled). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Instead of a menu: the row is a plain button. */
  onClick?: () => void;
  /** Avatar only (set by NlSideNav): the name is hidden text and a tooltip; the menu opens to the end. */
  minimized?: boolean;
  /** Placement only. */
  className?: string;
}

/** Keeps a title with the full text on an element only while its text is cut (as OD-191). */
function useTitleWhenCut(ref: RefObject<HTMLElement | null>, deps: unknown[]) {
  const [title, setTitle] = useState<string | undefined>(undefined);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      setTitle(node.scrollWidth > node.clientWidth ? node.textContent : undefined);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
    // The caller lists what changes the text or layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return title;
}

/**
 * The signed-in user at the bottom of the side nav (DESIGN.md §9, NlSideNavUser). Mapped onto NlListItemBase
 * (appearance nav, small): NlAvatar (40), name, email and a chevron. With `menu` it is a button that opens the account
 * menu (NlMenu) above it, or to the end when minimized. Named from its own text (name, email) plus the menu label as hidden text, so the name holds the visible text (WCAG 2.5.3).
 * 'use client' for state, refs and effects.
 */
export function NlSideNavUser({
  name,
  email,
  avatar,
  menu,
  menuLabel = 'Account menu',
  open,
  onOpenChange,
  onClick,
  minimized = false,
  className,
}: NlSideNavUserProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const hasMenu = menu !== undefined && menu !== null && menu !== false;
  const interactive = hasMenu || onClick !== undefined;
  const [innerOpen, setInnerOpen] = useState(false);
  const isOpen = hasMenu && (open ?? innerOpen);
  const rowRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const emailRef = useRef<HTMLSpanElement>(null);
  const nameTitle = useTitleWhenCut(nameRef, [name, minimized]);
  const emailTitle = useTitleWhenCut(emailRef, [email, minimized]);

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  const textTitle = (text: string | undefined) => (minimized ? undefined : text);

  const row = (
    <NlListItemBase
      ref={rowRef as RefObject<HTMLDivElement>}
      as={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      appearance="nav"
      size="small"
      divider={false}
      actionable={interactive}
      selected={isOpen}
      hideText={minimized}
      leading={<NlAvatar {...avatar} size="medium" />}
      title={
        <span ref={nameRef} className={styles.line} title={textTitle(nameTitle)}>
          {name}
        </span>
      }
      description={
        <>
          <span ref={emailRef} className={styles.line} title={textTitle(emailTitle)}>
            {email}
          </span>
          {hasMenu && (
            <>
              {' '}
              <span className={styles.hiddenText}>{menuLabel}</span>
            </>
          )}
        </>
      }
      trailing={
        interactive && !minimized ? (
          <NlIcon
            name={isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            size={24}
            tone="inherit"
            data-slot="chevron"
          />
        ) : undefined
      }
      {...(hasMenu ? nlMenuTriggerProps({ kind: 'action', open: isOpen, menuId }) : {})}
      onClick={
        interactive
          ? () => {
              if (hasMenu) setOpen(!isOpen);
              onClick?.();
            }
          : undefined
      }
      data-open={isOpen || undefined}
    />
  );

  return (
    <div
      className={[minimized ? styles.rootMinimized : styles.root, className].filter(Boolean).join(' ')}
      data-minimized={minimized || undefined}
    >
      {minimized && interactive ? (
        <NlTooltip content={name} placement="end">
          {row}
        </NlTooltip>
      ) : (
        row
      )}
      {hasMenu && (
        <NlMenu
          id={menuId}
          placement={minimized ? 'end-end' : 'top-start'}
          open={isOpen}
          onOpenChange={setOpen}
          anchorRef={rowRef}
          aria-label={menuLabel}
        >
          {menu}
        </NlMenu>
      )}
    </div>
  );
}
