// The shared blocks for every component's Overview docs page (src/overview/*.mdx). Storybook only, never in the library.
// Each page uses them in the same order: OverviewHeader, then sections that each end in a StoryWithCode,
// then Accessibility and Component API (see Button.mdx). Each page sets `<Meta of={Stories} name="Overview" />`,
// because an attached MDX file otherwise takes its file name.
import type { ComponentProps, ReactNode } from 'react';
import { Canvas, Title, Unstyled } from '@storybook/addon-docs/blocks';

/** The public GitHub repo. main.ts reads it from `git remote get-url origin` at build time (never written here). */
declare const __NL_REPO_URL__: string;
const repo = __NL_REPO_URL__;

/**
 * A link that opens in a new tab, styled like NlButton's link variant. A plain anchor, because NlButton's props
 * have no `target` or `rel`.
 */
function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="nl:text-button-m nl:text-action nl:underline-offset-4 nl:hover:underline nl:focus-visible:outline-2 nl:focus-visible:outline-offset-2 nl:focus-visible:outline-focused"
    >
      {children}
      <span className="nl:sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * Title, one-line description and links. `source` is the component's folder under packages/ui/src
 * (for example 'components/NlButton'); `spec` is its §9 heading anchor in DESIGN.md (for example 'nlbutton').
 */
export function OverviewHeader({ description, source, spec }: { description: string; source: string; spec: string }) {
  return (
    <>
      <Title />
      <Unstyled>
        <div className="nl:mb-3xl nl:flex nl:flex-col nl:gap-m">
          <p className="nl:text-body-l nl:text-secondary">{description}</p>
          {repo ? (
            <div className="nl:flex nl:gap-xl">
              <ExternalLink href={`${repo}/tree/main/packages/ui/src/${source}`}>Source code</ExternalLink>
              <ExternalLink href={`${repo}/blob/main/DESIGN.md#${spec}`}>Spec</ExternalLink>
            </div>
          ) : null}
        </div>
      </Unstyled>
    </>
  );
}

/** A live story with its code open underneath. */
export function StoryWithCode(props: ComponentProps<typeof Canvas>) {
  return <Canvas sourceState="shown" {...props} />;
}
