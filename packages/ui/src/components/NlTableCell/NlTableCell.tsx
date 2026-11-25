'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ElementType,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { NlBadge, type NlBadgeTone } from '../NlBadge';
import { NlButton } from '../NlButton';
import { NlCheckboxControl } from '../NlCheckboxControl';
import * as styles from './NlTableCell.styles';

export interface NlTableCellCheckbox {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** The checkbox's name: "Select {row}" for row selection, "{row}, {column}" for a value. */
  label: string;
  disabled?: boolean;
}

interface NlTableCellCommonProps extends Omit<ComponentPropsWithRef<'td'>, 'children' | 'className' | 'scope'> {
  /** Checkbox and row-action columns: Space-XL inline padding. */
  narrow?: boolean;
  /** The row's header cell: <th scope="row">, so screen readers name the row. */
  rowHeader?: boolean;
  /** A row-select checkbox before the content. */
  select?: NlTableCellCheckbox;
  /** Stays at the end when the table scrolls sideways (OD-187). NlTable sets it on the row-actions column. */
  stickyEnd?: boolean;
  /** Placement only. */
  className?: string;
}

type NlTableCellTypeProps =
  | {
      /** What the cell holds: text (default), a badge, a link, row actions or a value checkbox. */
      type?: 'default';
      children?: ReactNode;
    }
  | {
      type: 'badge';
      /** Badge type: the badge's tone and label. */
      badge: { tone: NlBadgeTone; label: string };
      children?: never;
    }
  | {
      type: 'link';
      /** Link type: the label, and an `href` or `as` and `onClick`. */
      link: {
        label: string;
        href?: string;
        as?: ElementType;
        onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
      };
      children?: never;
    }
  | {
      type: 'row-actions';
      /** Row-actions type: the button's name, its open state and its click. */
      actions: {
        /** "Actions for {row}". */
        label: string;
        expanded?: boolean;
        onClick: (event: MouseEvent<HTMLButtonElement>) => void;
        /** The button, as the actions menu's anchor. */
        ref?: Ref<HTMLButtonElement>;
      };
      children?: never;
    }
  | {
      type: 'checkbox';
      /** Checkbox type: a value checkbox, named "{row}, {column}". */
      checkbox: NlTableCellCheckbox;
      children?: never;
    };

export type NlTableCellProps = NlTableCellCommonProps & NlTableCellTypeProps;
export type NlTableCellType = NonNullable<NlTableCellTypeProps['type']>;

/**
 * One body cell (DESIGN.md §9, NlTableCell): text (one line, `title` when cut, OD-186), a small NlBadge, a flush
 * xsmall link (OD-117), a row-actions NlButton or a value checkbox, with an optional row-select checkbox before it.
 * A <td>, or a <th scope="row"> for the row's header cell. Typed props per type (OD-188). 'use client' for measuring.
 */
export function NlTableCell(props: NlTableCellProps) {
  const { narrow = false, rowHeader = false, select, stickyEnd = false, className, ...withType } = props;
  const type: NlTableCellType = withType.type ?? 'default';
  const textRef = useRef<HTMLSpanElement>(null);
  const [fullText, setFullText] = useState<string | undefined>(undefined);

  const typeKeys = new Set(['type', 'badge', 'link', 'actions', 'checkbox', 'children']);
  const rest = Object.fromEntries(Object.entries(withType).filter(([key]) => !typeKeys.has(key)));

  const text = type === 'default' ? (withType as { children?: ReactNode }).children : undefined;

  // Measure after layout: a title with the full text only when it is cut off.
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
  }, [text]);

  const Element = rowHeader ? 'th' : 'td';
  const classes = [
    styles.root,
    styles.padding[narrow || type === 'row-actions' ? 'narrow' : 'default'],
    type === 'row-actions' ? styles.actionsWidth : undefined,
    stickyEnd ? styles.stickyEnd : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  let content: ReactNode = null;
  if (withType.type === 'badge') {
    content = (
      <NlBadge tone={withType.badge.tone} size="small">
        {withType.badge.label}
      </NlBadge>
    );
  } else if (withType.type === 'link') {
    const { label, href, as, onClick } = withType.link;
    content = (
      <NlButton
        variant="link"
        size="xsmall"
        flush
        as={as ?? (href !== undefined ? 'a' : undefined)}
        href={href}
        onClick={onClick}
      >
        {label}
      </NlButton>
    );
  } else if (withType.type === 'row-actions') {
    const { label, expanded = false, onClick, ref } = withType.actions;
    content = (
      <NlButton
        ref={ref}
        variant="tertiary"
        size="xsmall"
        contentTone="secondary"
        icon="only-icon"
        iconName="more_vert"
        aria-haspopup="menu"
        aria-expanded={expanded}
        onClick={onClick}
      >
        {label}
      </NlButton>
    );
  } else if (withType.type === 'checkbox') {
    const { checked, onChange, label, disabled } = withType.checkbox;
    content = <NlCheckboxControl aria-label={label} checked={checked} onChange={onChange} disabled={disabled} />;
  } else if (text !== undefined && text !== null) {
    content = (
      <span ref={textRef} className={styles.text} title={fullText}>
        {text}
      </span>
    );
  }

  return (
    <Element
      {...rest}
      scope={rowHeader ? 'row' : undefined}
      className={classes}
      data-type={type}
      data-sticky={stickyEnd || undefined}
    >
      <div className={styles.row}>
        {select && (
          <NlCheckboxControl
            aria-label={select.label}
            checked={select.checked}
            onChange={select.onChange}
            disabled={select.disabled}
          />
        )}
        {content}
      </div>
    </Element>
  );
}
