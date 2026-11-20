'use client';

import { useEffect, useId, useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { NlButton } from '../NlButton';
import type { NlButtonBaseProps } from '../NlButtonBase';
import { NlOverlay } from '../NlOverlay';
import { NlTextBlock, type NlTextBlockHeadingAs } from '../NlTextBlock';
import * as styles from './NlDialog.styles';

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** A dialog button: NlButton props without the ones the dialog fixes (variant, size). */
export type NlDialogActionProps = DistributiveOmit<NlButtonBaseProps, 'variant' | 'size' | 'appearance' | 'flush'>;

export type NlDialogSize = keyof typeof styles.width;

export interface NlDialogProps {
  /** Shown or hidden. */
  open: boolean;
  /** Called with false when Escape, the close button or the overlay asks to close. */
  onOpenChange: (open: boolean) => void;
  /** The title: names the dialog. */
  title: ReactNode;
  /** Title element. Default h2 (OD-179). */
  headingAs?: NlTextBlockHeadingAs;
  /** The body. A string is Body L text-secondary (NlTextBlock body) and describes the dialog. */
  children?: ReactNode;
  /** Hides the close button. */
  hideClose?: boolean;
  /** A click on the overlay closes it. Off for required confirmations (Escape and close still work). */
  dismissible?: boolean;
  /** small (Size-560, default) or large (Size-720). */
  size?: NlDialogSize;
  /** The primary button, last at the end. `tone: 'destructive'` for a destructive confirmation (role alertdialog). */
  primaryAction?: NlDialogActionProps & { tone?: 'normal' | 'destructive' };
  /** The secondary button, before the primary. */
  secondaryAction?: NlDialogActionProps;
  /** A tertiary button at the start of the footer. */
  startAction?: NlDialogActionProps;
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
 * A modal window for a short task or a confirmation (DESIGN.md §9, NlDialog). A native <dialog> shown with
 * showModal(): the browser keeps focus inside, makes the page inert, handles Escape and returns focus to the opener.
 * The dialog also locks page scroll, puts first focus in the body (or on the primary, or the secondary when the
 * primary is destructive), and animates in and out (OD-125). role alertdialog when the primary is destructive
 * (OD-180). 'use client' for state, refs and effects.
 */
export function NlDialog({
  open,
  onOpenChange,
  title,
  headingAs = 'h2',
  children,
  hideClose = false,
  dismissible = true,
  size = 'small',
  primaryAction,
  secondaryAction,
  startAction,
  className,
}: NlDialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const secondaryRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);
  const [bodyScrolls, setBodyScrolls] = useState(false);

  const destructive = primaryAction?.tone === 'destructive';
  const textBody = typeof children === 'string';
  const hasFooter = primaryAction !== undefined || secondaryAction !== undefined || startAction !== undefined;

  // Open and close the native dialog; close only after the panel has animated out.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setClosing(false);
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      const first =
        bodyRef.current?.querySelector<HTMLElement>(focusable) ??
        (destructive ? secondaryRef.current : primaryRef.current) ??
        primaryRef.current ??
        secondaryRef.current ??
        closeRef.current;
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
  }, [open, destructive]);

  // Unlock scroll if the dialog unmounts while open.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = '';
    },
    [],
  );

  // A body that scrolls takes keyboard focus, so it can be scrolled without a mouse.
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

  const buttonSize = 'medium' as const;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      role={destructive ? 'alertdialog' : 'dialog'}
      aria-labelledby={titleId}
      aria-describedby={textBody ? descriptionId : undefined}
      onCancel={handleCancel}
    >
      <NlOverlay
        open={open && !closing}
        onClick={() => {
          if (dismissible) requestClose();
        }}
      />
      <div
        className={styles.frame}
        onClick={(event) => {
          if (event.target === event.currentTarget && dismissible) requestClose();
        }}
      >
        <div
          className={[styles.panel, styles.width[size], closing ? styles.motion.closing : styles.motion.open, className]
            .filter(Boolean)
            .join(' ')}
          data-size={size}
        >
          <div className={styles.header}>
            <div className={styles.title}>
              <NlTextBlock id={titleId} type="headline-large" heading={title} headingAs={headingAs} />
            </div>
            {!hideClose && (
              <span className={styles.close}>
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
          <div
            ref={bodyRef}
            className={[styles.body, styles.bodyEnd[hasFooter ? 'footer' : 'alone']].join(' ')}
            tabIndex={bodyScrolls ? 0 : undefined}
            data-slot="body"
          >
            {textBody ? <NlTextBlock id={descriptionId} type="body" description={children} /> : children}
          </div>
          {hasFooter && (
            <div className={styles.footer}>
              {startAction && <NlButton {...startAction} variant="tertiary" size={buttonSize} />}
              {(secondaryAction ?? primaryAction) && (
                <div className={styles.end}>
                  {secondaryAction && (
                    <NlButton {...secondaryAction} ref={secondaryRef} variant="secondary" size={buttonSize} />
                  )}
                  {primaryAction &&
                    (destructive ? (
                      <NlButton
                        {...primaryAction}
                        ref={primaryRef}
                        tone="destructive"
                        variant="primary"
                        size={buttonSize}
                      />
                    ) : (
                      <NlButton {...primaryAction} ref={primaryRef} tone="normal" variant="primary" size={buttonSize} />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
