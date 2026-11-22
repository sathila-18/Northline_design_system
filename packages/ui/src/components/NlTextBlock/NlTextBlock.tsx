import type { ComponentPropsWithRef, ReactNode } from 'react';
import * as styles from './NlTextBlock.styles';

export type NlTextBlockType = keyof typeof styles.description;
export type NlTextBlockHeadingType = keyof typeof styles.heading;
export type NlTextBlockAlign = keyof typeof styles.align;
export type NlTextBlockTone = 'default' | 'inverse';
export type NlTextBlockHeadingAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

interface NlTextBlockCommonProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Text alignment, and the label slot's alignment. Default start. */
  align?: NlTextBlockAlign;
  /** Optional slot above the content, usually an NlLabel (D15). */
  label?: ReactNode;
  /** Optional description under the heading. Rendered as a <p>. */
  description?: ReactNode;
  /** default, or inverse for dark surfaces such as tooltips. */
  tone?: NlTextBlockTone;
  /** Heading and description in text-disabled, for a disabled parent (OD-15). Overrides the tone. */
  disabled?: boolean;
}

/**
 * `type` sets the look only. The body types are a description with no heading, in Body L (body, OD-41) or Body M
 * (body-m, OD-238), so they take no `heading` or `headingAs`.
 */
export type NlTextBlockProps = NlTextBlockCommonProps &
  (
    | {
        /** The look. Default headline-small. */
        type?: NlTextBlockHeadingType;
        /** Optional heading text. */
        heading?: ReactNode;
        /** The heading's element, separate from its look (OD-16). Default p. */
        headingAs?: NlTextBlockHeadingAs;
      }
    | { type: 'body' | 'body-m'; heading?: never; headingAs?: never }
  );

/**
 * A heading with an optional description under it, and an optional label slot above (DESIGN.md §9, NlTextBlock).
 * DOM order is label, heading, description. Parts that aren't given aren't rendered. `className` and native
 * attributes go to the root. Presentational, so no 'use client'.
 */
export function NlTextBlock(props: NlTextBlockProps) {
  const {
    type = 'headline-small',
    align = 'start',
    label,
    heading,
    headingAs = 'p',
    description,
    tone = 'default',
    disabled = false,
    className,
    ...rest
  } = props;
  const colour = disabled ? 'disabled' : tone;
  const Heading = headingAs;
  const showHeading = type !== 'body' && type !== 'body-m' && heading !== undefined && heading !== null;
  const showDescription = description !== undefined && description !== null;

  const classes = [styles.root, styles.align[align], className].filter(Boolean).join(' ');

  return (
    <div {...rest} className={classes} data-type={type} data-align={align} data-tone={tone}>
      {label}
      {(showHeading || showDescription) && (
        <div className={[styles.content, styles.contentGap[type]].join(' ')}>
          {showHeading && (
            <Heading className={[styles.heading[type], styles.headingColour[colour]].join(' ')}>{heading}</Heading>
          )}
          {showDescription && (
            <p className={[styles.description[type], styles.descriptionColour[colour]].join(' ')}>{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
