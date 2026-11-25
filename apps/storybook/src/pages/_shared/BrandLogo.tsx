import { useSyncExternalStore } from 'react';

/**
 * Story-only logo: the brand's mark and its name, Space-XXS (2px) apart (designer, 25 Nov 2026). Not part of the
 * library. The marks are artwork served by Storybook (apps/storybook/public/logos), so their gradient colours are not
 * tokens. The mark is Size-24, the wordmark's line height. It follows the Brand toolbar (data-brand on <html>).
 * The mark is decorative (alt=""): the name next to it is the text.
 */
const brands = {
  northline: { name: 'Northline', src: './logos/northline.svg' },
  garnet: { name: 'Garnet', src: './logos/garnet.svg' },
  voltic: { name: 'Voltic', src: './logos/voltic.svg' },
} as const;

type Brand = keyof typeof brands;

const isBrand = (value: string | undefined): value is Brand => value !== undefined && value in brands;

/** The current brand from <html data-brand>, updated when the toolbar changes it. */
function useBrand(): Brand {
  return useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-brand'] });
      return () => {
        observer.disconnect();
      };
    },
    () => {
      const brand = document.documentElement.dataset.brand;
      return isBrand(brand) ? brand : 'northline';
    },
    () => 'northline',
  );
}

export function BrandLogo() {
  const { name, src } = brands[useBrand()];
  return (
    <span className="nl:inline-flex nl:items-center nl:gap-xxs">
      <img src={src} alt="" className="nl:size-24 nl:shrink-0" />
      <span className="nl:text-headline-small-h6 nl:text-primary">{name}</span>
    </span>
  );
}
