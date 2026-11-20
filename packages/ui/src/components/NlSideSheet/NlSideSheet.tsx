'use client';

import { useEffect, useId, useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { NlButton } from '../NlButton';
import { NlButtonDock, type NlButtonDockProps } from '../NlButtonDock';
import { NlDivider } from '../NlDivider';
import { NlOverlay } from '../NlOverlay';
import { NlTextBlock, type NlTextBlockHeadingAs } from '../NlTextBlock';
import * as styles from './NlSideSheet.styles';

export type NlSideSheetSize = keyof typeof styles.width;

export interface NlSideSheetProps {
  /** Shown or hidden. */
  open: boolean;
  /** Called when the sheet asks to close: Escape, the close button, or a click on the overlay. */
  onOpenChange: (open: boolean) => void;
  /** The title. Text is drawn as NlTextBlock headline-large; anything else goes in as a slot. Names the dialog. */
  title: ReactNode;
  /** The text title's element. Default h2. */
  headingAs?: NlTextBlockHeadingAs;
  /** Shows a back button before the title; called when it's pressed. It doesn't close the sheet. */
  onBack?: () => void;
  /** Leaves out the close button. */
  hideClose?: boolean;
  /** A divider under the header. */
  divider?: boolean;
  /** A click on the overlay closes the sheet (default). false while there are unsaved changes the page confirms. */
  dismissible?: boolean;
  /** Width: small Size-560 (default) or large Size-720 (OD-133). */
  size?: NlSideSheetSize;
  /** The body. Scrolls when long. */
  children?: ReactNode;
  /** An NlButtonDock pinned at the bottom; sticky while the body scrolls. */
  footer?: NlButtonDockProps;
  /** Placement only, on the panel. */
  className?: string;
}

const focusable =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Reads a --nl-duration-* custom property in milliseconds (browser only, never during render). */
function readDuration(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return fallback;
  return raw.endsWith('ms') ? value : value * 1000;
}

/**
 * A full-height panel that slides in from the end edge, for creating or editing without leaving the page
 * (DESIGN.md §9, NlSideSheet). A native <dialog> shown with showModal() (focus kept inside, page inert, Escape, focus
 * back to the opener), as NlDialog: page scroll locks, first focus goes to the body's first field (or the close
 * button, the back button, then the panel), and it closes after sliding out. Header: optional back NlButton, the
 * title, the close NlButton; optional NlDivider; the body; an optional NlButtonDock. 'use client' for state, refs and
 * effects.
 */
export function NlSideSheet({
  open,
  onOpenChange,
  title,
  headingAs = 'h2',
  onBack,
  hideClose = false,
  divider = false,
  dismissible = true,
  size = 'small',
  children,
  footer,
  className,
}: NlSideSheetProps) {
  const titleId = `${useId()}-title`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);
  const [bodyScrolls, setBodyScrolls] = useState(false);

  // Open and close the native dialog; close only after the panel has slid out.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setClosing(false);
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      const first =
        bodyRef.current?.querySelector<HTMLElement>(focusable) ??
        closeRef.current ??
        backRef.current ??
        panelRef.current;
      first?.focus();
      return;
    }
    if (!open && dialog.open) {
      setClosing(true);
      const timer = setTimeout(
        () => {
          dialog.close();
          document.documentElement.style.overflow = '';
          setClosing(false);
        },
        readDuration('--nl-duration-slow', 300),
      );
      return () => {
        clearTimeout(timer);
      };
    }
  }, [open]);

  // Unlock scroll if the sheet unmounts while open.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = '';
    },
    [],
  );

  // A body that scrolls takes keyboard focus, and the dock takes its sticky look.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      setBodyScrolls(body.scrollHeight > body.clientHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => {
      observer.disconnect();
    };
  }, [open]);

  const requestClose = () => {
    onOpenChange(false);
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    requestClose();
  };

  const textTitle = typeof title === 'string';

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} onCancel={handleCancel}>
      <NlOverlay
        open={open && !closing}
        onClick={() => {
          if (dismissible) requestClose();
        }}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={[styles.panel, styles.width[size], closing ? styles.motion.closing : styles.motion.open, className]
          .filter(Boolean)
          .join(' ')}
        data-size={size}
      >
        <div className={styles.header}>
          {onBack && (
            <span className={styles.headerButton}>
              <NlButton
                ref={backRef}
                variant="tertiary"
                size="medium"
                contentTone="secondary"
                icon="only-icon"
                iconName="arrow_back"
                onClick={onBack}
              >
                Back
              </NlButton>
            </span>
          )}
          <div id={titleId} className={styles.title}>
            {textTitle ? <NlTextBlock type="headline-large" heading={title} headingAs={headingAs} /> : title}
          </div>
          {!hideClose && (
            <span className={styles.headerButton}>
              <NlButton
                ref={closeRef}
                variant="tertiary"
                size="medium"
                contentTone="secondary"
                icon="only-icon"
                iconName="close"
                onClick={requestClose}
              >
                Close
              </NlButton>
            </span>
          )}
        </div>
        {divider && <NlDivider decorative className={styles.divider} />}
        <div ref={bodyRef} className={styles.body} tabIndex={bodyScrolls ? 0 : undefined} data-slot="body">
          {children}
        </div>
        {footer && <NlButtonDock {...footer} sticky={bodyScrolls} className={styles.footer} />}
      </div>
    </dialog>
  );
}
