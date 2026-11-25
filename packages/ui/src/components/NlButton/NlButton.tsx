import type { MouseEvent } from 'react';
import { NlButtonBase, type NlButtonBaseAppearance, type NlButtonBaseProps } from '../NlButtonBase';
import { NlDestructiveButton } from '../NlDestructiveButton';
import { NlWhiteButton } from '../NlWhiteButton';
import * as styles from './NlButton.styles';

/** Omit that keeps NlButtonBase's icon union intact. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type NlButtonTone = 'normal' | 'white' | 'destructive';
export type NlButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link';
export type NlButtonContentTone = keyof typeof styles.contentTone;

/**
 * Tone, variant and content tone. Combinations the spec doesn't have are type errors, not silent changes:
 * white is primary only (OD-54), destructive has no link, content tones are tertiary and link only, link has no
 * icon-only, and only link can be flush.
 */
type NlButtonToneProps =
  | {
      /** Picks the base: normal, white (primary only) or destructive (no link). Default `normal`. */
      tone?: 'normal';
      /** Primary, secondary, tertiary or link. Default `primary`. */
      variant?: 'primary' | 'secondary';
      /** Recolours the label and icon. Tertiary and link only. Default `default`. */
      contentTone?: undefined;
      flush?: undefined;
    }
  | { tone?: 'normal'; variant: 'tertiary'; contentTone?: NlButtonContentTone; flush?: undefined }
  | {
      tone?: 'normal';
      variant: 'link';
      contentTone?: NlButtonContentTone;
      icon?: 'none' | 'leading' | 'trailing';
      flush?: boolean;
    }
  | { tone: 'white'; variant?: 'primary'; contentTone?: undefined; flush?: undefined }
  | { tone: 'destructive'; variant?: 'primary' | 'secondary' | 'tertiary'; contentTone?: undefined; flush?: undefined };

export type NlButtonProps = DistributiveOmit<NlButtonBaseProps, 'variant' | 'appearance'> & NlButtonToneProps;

/** The full colour set (with states) for a tone, variant and content tone, with motion added. */
function appearanceFor(tone: NlButtonTone, variant: NlButtonVariant, contentTone: NlButtonContentTone) {
  let look: NlButtonBaseAppearance;
  if (tone === 'white') look = styles.white;
  else if (tone === 'destructive') look = styles.destructive[variant === 'link' ? 'primary' : variant];
  else if (variant === 'tertiary') look = styles.contentTone[contentTone];
  else if (variant === 'link') look = styles.linkContentTone[contentTone];
  else look = styles.normal[variant];
  return { button: `${styles.motion} ${look.button}`, icon: `${styles.motion} ${look.icon}`, label: look.label };
}

/**
 * The only public button (DESIGN.md §9, NlButton, D12). Picks the base by `tone`, passes `variant`, `size` and
 * `icon` to it, and owns every interaction state through `appearance`. Defaults: normal, primary, medium, no icon
 * (OD-58). `aria-expanded="true"` uses the pressed look (OD-57). No loading state (OD-59).
 *
 * Disabled: a native button gets `disabled`. A link (`as`) can't be disabled natively, so it loses `href`, gets
 * `aria-disabled="true"` and ignores clicks. Presentational, so no 'use client'.
 */
export function NlButton(props: NlButtonProps) {
  const { tone = 'normal', variant = 'primary', contentTone = 'default', ...rest } = props;
  const appearance = appearanceFor(tone, variant, contentTone);
  const base = rest as DistributiveOmit<NlButtonBaseProps, 'variant'>;

  const isLink = base.as !== undefined && base.as !== 'button';
  const disabledLink = isLink && base.disabled;
  const linkOverrides = disabledLink
    ? {
        disabled: undefined,
        href: undefined,
        'aria-disabled': true as const,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
        },
      }
    : {};

  if (tone === 'white') return <NlWhiteButton {...base} {...linkOverrides} appearance={appearance} />;
  if (tone === 'destructive') {
    const destructiveVariant = variant === 'link' ? 'primary' : variant;
    return <NlDestructiveButton {...base} {...linkOverrides} variant={destructiveVariant} appearance={appearance} />;
  }
  // NlButtonProps already rule out link + icon-only; TypeScript can't follow that through the destructuring.
  const normalProps = { ...base, ...linkOverrides, variant, appearance } as NlButtonBaseProps;
  return <NlButtonBase {...normalProps} data-tone="normal" />;
}
