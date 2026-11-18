'use client';

import { useEffect, useRef, useState, type ComponentPropsWithRef } from 'react';
import { NlIcon, type NlIconName } from '../../icons';
import { NlStatusDot, type NlStatusDotSize } from '../NlStatusDot';
import * as styles from './NlAvatar.styles';

export type NlAvatarSize = keyof typeof styles.size;
export type NlAvatarType = keyof typeof styles.type;

/** NlStatusDot size per avatar size (DESIGN.md §9, NlAvatar, "Sizes and layout"). */
const dotSize: Record<NlAvatarSize, NlStatusDotSize> = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'medium',
  xlarge: 'large',
  xxlarge: 'large',
  xxxlarge: 'xlarge',
};

export interface NlAvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  /** Size, from the Size-* tokens. */
  size?: NlAvatarSize;
  /** Photo URL. Gives the image type. If it fails to load, the avatar shows the initials, then the icon. */
  src?: string;
  /**
   * Accessible name. On the image type it is the `alt` text (default "", decorative). On the initials and icon
   * types it names the avatar (`role="img"`); without it they are hidden from screen readers.
   */
  alt?: string;
  /** Up to 2 letters. Trimmed, cut to 2 characters and shown in uppercase. Empty gives the icon type. */
  initials?: string;
  /** Icon when there is no photo or initials. */
  icon?: NlIconName;
  /** Shows the online dot, bottom-right. */
  online?: boolean;
  /** Accessible name of the online dot. */
  onlineLabel?: string;
}

/**
 * A round picture of a person or account: a photo, initials or a default icon, with an optional online dot
 * (DESIGN.md §9, NlAvatar). Not interactive. 'use client' for the image fallback.
 */
export function NlAvatar({
  size = 'medium',
  src,
  alt,
  initials,
  icon = 'person',
  online = false,
  onlineLabel = 'Online',
  className,
  ...rest
}: NlAvatarProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // An image can fail before hydration attaches onError (server-rendered pages), so check once it is in the page.
  useEffect(() => {
    const img = imageRef.current;
    if (src && img?.complete && img.naturalWidth === 0) setFailedSrc(src);
  }, [src]);

  const letters = Array.from(initials?.trim() ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const type: NlAvatarType = src && failedSrc !== src ? 'image' : letters ? 'text' : 'icon';

  const named = type !== 'image' && alt ? { role: 'img', 'aria-label': alt } : {};
  const classes = [styles.root, styles.size[size], className].filter(Boolean).join(' ');

  return (
    <span {...rest} className={classes} data-type={type} data-size={size}>
      <span {...named} className={[styles.circle, styles.type[type]].filter(Boolean).join(' ')}>
        {type === 'image' && (
          <img
            ref={imageRef}
            src={src}
            alt={alt ?? ''}
            className={styles.image}
            onError={() => {
              setFailedSrc(src ?? null);
            }}
          />
        )}
        {type === 'text' && (
          <span aria-hidden className={styles.initials[size]}>
            {letters}
          </span>
        )}
        {type === 'icon' && <NlIcon name={icon} size={styles.iconSize[size]} tone="inherit" />}
      </span>
      {online && <NlStatusDot size={dotSize[size]} label={onlineLabel} className={styles.dot[size]} />}
    </span>
  );
}
