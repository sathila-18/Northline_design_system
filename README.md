# Northline design system

Northline is a public demo design system: React and TypeScript components for a desktop admin product, styled with Tailwind CSS 4, documented in Storybook, and working in plain React and the Next.js App Router. It has three fictional brands (Northline, Garnet and Voltic), each in Light and Dark.

**Storybook:** https://northline-design-system-blond.vercel.app

Start with **Foundations → Token pipeline**: pick a token and follow it from the raw palette to the rendered result, in any brand and theme.

## Packages

| Package | What it is |
|---|---|
| `@northline/tokens` | CSS variables, TypeScript constants and the Tailwind theme, built from [`tokens/design.tokens.json`](tokens/design.tokens.json) |
| `@northline/ui` | The components, and `index.css`, the one stylesheet an app imports |

```tsx
import '@northline/ui/index.css';

// Brand and theme are set on <html>:
<html data-brand="northline" data-theme="light">
```

## Working on it

Node 24 and pnpm (through Corepack). Then:

```sh
pnpm install
pnpm storybook        # Storybook at http://localhost:6006
pnpm lint             # ESLint (with the Tailwind and token rules), Stylelint, Prettier
pnpm typecheck
pnpm test             # token build tests, component tests, lint rule tests
pnpm test:a11y        # axe on every story in 3 brands × 2 themes
pnpm build            # tokens and the component library
pnpm nextjs-check     # the packed libraries in a Next.js App Router app
```

[`DESIGN.md`](DESIGN.md) is the spec: tokens, styles, components and build status. [`CLAUDE.md`](CLAUDE.md) says how work is done in this repo. [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md) records how long each step took.

Every branch gets a Vercel preview; previews are only open to the team.
