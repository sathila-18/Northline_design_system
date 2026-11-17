// Shared layout for the Foundations pages. Documentation only, never part of @northline/ui.
// Swatches and samples use inline styles with the token's CSS variable, because primitives and aliases have no
// Tailwind class on purpose (DESIGN.md §3.8). Everything else uses the nl: theme utilities.
import { useMemo, type ReactNode } from 'react';

export interface BrandTheme {
  brand: string;
  theme: string;
}

/** The brand and theme from Storybook's toolbar globals (untyped in Storybook). */
export function fromGlobals(globals: Record<string, unknown>): BrandTheme {
  return {
    brand: typeof globals.brand === 'string' ? globals.brand : 'northline',
    theme: typeof globals.theme === 'string' ? globals.theme : 'light',
  };
}

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
export const brandLabel = (brand: string) => capitalise(brand);
export const themeLabel = (theme: string) => capitalise(theme);

/** Each variable's computed value on <html> for the current brand and theme (var() references resolved). */
export function useCssValues(names: readonly string[], { brand, theme }: BrandTheme): Record<string, string> {
  // Read during render: the preview decorator sets data-brand and data-theme on <html> before the page renders.
  const key = names.join('|');
  return useMemo(() => {
    const style = getComputedStyle(document.documentElement);
    // Hex in upper case, as in the token JSON (the browser reports lower case).
    const read = (name: string) =>
      style
        .getPropertyValue(name)
        .trim()
        .replace(/#[0-9a-f]{3,8}\b/gi, (hex) => hex.toUpperCase());
    return Object.fromEntries(key.split('|').map((name) => [name, read(name)]));
    // brand and theme are not read here, but the values change with them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, brand, theme]);
}

export function Page({
  title,
  intro,
  context,
  children,
}: {
  title: string;
  intro: ReactNode;
  context: BrandTheme;
  children: ReactNode;
}) {
  return (
    <main className="nl:flex nl:flex-col nl:gap-4xl nl:p-4xl nl:text-primary">
      <header className="nl:flex nl:flex-col nl:gap-m">
        <p className="nl:text-caption-s nl:text-tertiary">Foundations</p>
        <h1 className="nl:text-display-small-h3">{title}</h1>
        <div className="nl:text-body-l nl:text-secondary">{intro}</div>
        <p className="nl:text-caption-l nl:text-tertiary">
          Showing {brandLabel(context.brand)}, {themeLabel(context.theme)}. Change both in the toolbar.
        </p>
      </header>
      {children}
    </main>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="nl:flex nl:flex-col nl:gap-xl">
      <div className="nl:flex nl:flex-col nl:gap-xs">
        <h2 className="nl:text-headline-medium-h5">{title}</h2>
        {description ? <p className="nl:text-body-m nl:text-secondary">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** A token's code name, for example a CSS variable or a Tailwind class. */
export function Code({ children }: { children: ReactNode }) {
  return <code className="nl:text-caption-l nl:whitespace-nowrap nl:text-primary">{children}</code>;
}

export function Value({ children }: { children: ReactNode }) {
  return <span className="nl:text-caption-m nl:text-tertiary nl:wrap-break-word">{children}</span>;
}

/** A token description from the JSON. Parts in `backticks` are token names, shown as code. */
export function Description({ text }: { text: string }) {
  return (
    <span className="nl:text-caption-m nl:text-tertiary">
      {text.split(/`([^`]+)`/).map((part, index) => (index % 2 === 1 ? <Code key={index}>{part}</Code> : part))}
    </span>
  );
}

/** A table of tokens: one row each, with the sample first. */
export function TokenTable({ headings, children }: { headings: string[]; children: ReactNode }) {
  return (
    <table className="nl:w-full nl:border-collapse nl:text-left">
      <thead>
        <tr className="nl:border-b nl:border-default">
          {headings.map((heading) => (
            <th key={heading} scope="col" className="nl:py-s nl:pr-xl nl:text-label-s nl:text-secondary">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Row({ cells }: { cells: ReactNode[] }) {
  return (
    <tr className="nl:border-b nl:border-subtle nl:align-middle">
      {cells.map((cell, index) => (
        <td key={index} className="nl:py-m nl:pr-xl nl:text-body-s">
          {cell}
        </td>
      ))}
    </tr>
  );
}
