'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { NlIconName } from '../../icons';
import { NlButton } from '../NlButton';
import { NlIconContainer, type NlIconContainerTone } from '../NlIconContainer';
import { NlProgressBar } from '../NlProgressBar';
import { NlTextBlock } from '../NlTextBlock';
import * as styles from './NlFileUpload.styles';

export type NlFileUploadSize = keyof typeof styles.size;
export type NlFileUploadState = 'enabled' | 'uploading' | 'complete' | 'error';

export interface NlFileUploadProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'title' | 'className' | 'children' | 'onDrop'
> {
  /** large (default): stacked and centred. small: a row, progress bar below. */
  size?: NlFileUploadSize;
  /** Set by the page: enabled (empty), uploading, complete or error. Default enabled. */
  state?: NlFileUploadState;
  /** Upload progress, 0 to 100 (uploading). */
  progress?: number;
  /** File types for the picker and for drops, as in <input accept>. */
  accept?: string;
  /** The size limit, shown in the hint, for example "Up to 5 MB". */
  maxSizeLabel?: string;
  /** The prompt, file name or error title. */
  title: ReactNode;
  /** Details under the title. In the empty state this is the hint the input is described by. */
  description?: ReactNode;
  /** Accessible name of the hidden file input. Default "Upload a file". */
  inputLabel?: string;
  /** Name of the progress bar. Default "Uploading {title}". */
  progressLabel?: string;
  /** A file was chosen or dropped. The page uploads it and sets `state`. */
  onFileSelect: (file: File) => void;
  /** A dropped file that doesn't match `accept` (OD-178). */
  onFileReject?: (file: File) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onRetry?: () => void;
  /** Disabled look (OD-123): no picking or dropping, button disabled. */
  disabled?: boolean;
  /** Placement only. */
  className?: string;
}

const iconFor: Record<NlFileUploadState, { icon: NlIconName; tone: NlIconContainerTone }> = {
  enabled: { icon: 'cloud_upload', tone: 'info' },
  uploading: { icon: 'cloud_upload', tone: 'info' },
  complete: { icon: 'check', tone: 'success' },
  error: { icon: 'error', tone: 'error' },
};

/** Whether a file matches an <input accept> list: ".ext", "type/*" or an exact type. Empty accepts anything. */
function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .some((part) => {
      if (part.startsWith('.')) return name.endsWith(part);
      if (part.endsWith('/*')) return type.startsWith(part.slice(0, -1));
      return type === part;
    });
}

/**
 * A drop zone for one file that also shows the upload's progress, success or error (DESIGN.md §9, NlFileUpload).
 * A hidden native file input, opened by the button or a click on the card; the card is also a drop target. The page
 * does the upload and sets `state`. Completion and errors are announced in a polite live region; after cancel or
 * delete, focus returns to the choose button. 'use client' for state, refs and events.
 */
export function NlFileUpload({
  size = 'large',
  state = 'enabled',
  progress = 0,
  accept,
  maxSizeLabel,
  title,
  description,
  inputLabel = 'Upload a file',
  progressLabel,
  onFileSelect,
  onFileReject,
  onCancel,
  onDelete,
  onRetry,
  disabled = false,
  className,
  ...rest
}: NlFileUploadProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const [dragOver, setDragOver] = useState(false);

  const canPick = state === 'enabled' && !disabled;

  useEffect(() => {
    if (state === 'enabled' && returnFocus.current) {
      returnFocus.current = false;
      buttonRef.current?.focus();
    }
  }, [state]);

  const openPicker = () => {
    if (canPick) inputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (file) onFileSelect(file);
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button, input, a')) return;
    openPicker();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!canPick) return;
    event.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!canPick) return;
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (!file) return;
    if (matchesAccept(file, accept)) onFileSelect(file);
    else onFileReject?.(file);
  };

  const hint = [description, maxSizeLabel].filter((part) => part !== undefined && part !== null && part !== '');
  const showHint = hint.length > 0;
  const named = typeof title === 'string' ? title : 'file';
  const iconLook = disabled ? { icon: iconFor[state].icon, tone: 'disabled' as const } : iconFor[state];

  const borderKey = disabled ? 'disabled' : dragOver ? 'dragOver' : state;
  const classes = [
    styles.root,
    styles.size[size],
    styles.border[borderKey],
    styles.background[dragOver && !disabled ? 'dragOver' : 'normal'],
    canPick ? styles.pickable : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const icon = (
    <NlIconContainer icon={iconLook.icon} tone={iconLook.tone} size={size === 'large' ? 48 : 40} data-slot="icon" />
  );

  const text = (
    <div className={styles.text[size]}>
      <NlTextBlock
        type="headline-small"
        align={size === 'large' ? 'center' : 'start'}
        heading={title}
        description={
          showHint ? (
            <span id={hintId}>
              {hint.every((part) => typeof part === 'string')
                ? hint.join(' · ')
                : hint.map((part, index) => (
                    <span key={index}>
                      {index > 0 && ' · '}
                      {part}
                    </span>
                  ))}
            </span>
          ) : undefined
        }
        disabled={disabled}
      />
    </div>
  );

  const button = (() => {
    const common = { size: 'xsmall' as const, icon: 'leading' as const, ref: buttonRef };
    if (state === 'uploading')
      return (
        <NlButton
          {...common}
          variant="tertiary"
          iconName="close"
          disabled={disabled}
          onClick={() => {
            returnFocus.current = true;
            onCancel?.();
          }}
        >
          Cancel
        </NlButton>
      );
    if (state === 'complete')
      return (
        <NlButton
          {...common}
          tone="destructive"
          variant="tertiary"
          iconName="delete"
          disabled={disabled}
          onClick={() => {
            returnFocus.current = true;
            onDelete?.();
          }}
        >
          Delete
        </NlButton>
      );
    if (state === 'error')
      return (
        <NlButton {...common} variant="tertiary" iconName="refresh" disabled={disabled} onClick={onRetry}>
          Try again
        </NlButton>
      );
    return (
      <NlButton
        {...common}
        variant="tertiary"
        iconName="cloud_upload"
        disabled={disabled}
        aria-describedby={showHint ? hintId : undefined}
        onClick={openPicker}
      >
        Choose file
      </NlButton>
    );
  })();

  const bar = state === 'uploading' && (
    <div className={styles.progress}>
      <NlProgressBar value={progress} label={progressLabel ?? `Uploading ${named}`} />
    </div>
  );

  return (
    <div
      {...rest}
      className={classes}
      data-size={size}
      data-state={state}
      data-drag-over={dragOver || undefined}
      data-disabled={disabled || undefined}
      onClick={handleCardClick}
      onDragOver={handleDragOver}
      onDragLeave={() => {
        setDragOver(false);
      }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={!canPick}
        tabIndex={-1}
        aria-label={inputLabel}
        aria-describedby={showHint ? hintId : undefined}
        className={styles.hidden}
        onChange={handleChange}
      />
      {size === 'large' ? (
        <>
          {icon}
          {text}
          {bar}
          <span className={styles.button}>{button}</span>
        </>
      ) : (
        <>
          <div className={styles.row}>
            {icon}
            {text}
            <span className={styles.button}>{button}</span>
          </div>
          {bar}
        </>
      )}
      <span role="status" className={styles.hidden}>
        {state === 'complete' ? `${named} uploaded` : state === 'error' ? named : ''}
      </span>
    </div>
  );
}
