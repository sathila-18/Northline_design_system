# CLAUDE.md, Northline design system

Instructions for Claude Code in this repo. Read them fully at the start of every session.

**What this repo is.** Northline, a public demo design system. React + TypeScript components for a desktop admin product, styled with Tailwind CSS 4, documented in Storybook, and working in both plain React and the Next.js App Router. Three fictional brands (Northline, Garnet, Voltic), Light and Dark.

**Who decides.** The owner is the designer. The designer decides what gets built, in what order, and when it is done.

**[`DESIGN.md`](./DESIGN.md) is the spec.** Tokens, styles, icons, components and build status. This file only says how to work.

---

## Before any task

1. Read `DESIGN.md`, at least §2 (Core rules), §7 (Component architecture) and the section for the task.
2. Check the component's row in §8. If anything it depends on isn't ✅, stop and tell the designer. Never build a dependency on your own.
3. Check that the component has a spec in §9. If it doesn't, ask for one. Never invent a component's design.
4. **Never connect to Figma from this repo**, and never write a Figma file key, node ID or URL into it. The specs in §9 are the only design input.

## How to build a component

**One component at a time.** Never build ahead. When a component is done, stop and wait for the designer.

0. **Plan first.** Read the spec in §9 and give the designer a plan with a "Spec → code" table (every spec option and the prop it becomes), the tokens you will use for every value, and your questions. Flag anything the spec doesn't cover (a missing state, keyboard behaviour, an empty or loading state, a Dark value). Wait for the go-ahead.
1. **Log the start.** Add a line to `docs/BUILD_LOG.md` (see "Build log").
2. **Never guess a measurement.** Every size, space, radius, colour and text style comes from a token named in the spec or agreed in the plan. If a value isn't covered by a token, stop and ask. Never add a token yourself.
3. **Base first.** If the component has a base (§7.2), build or extend the base. Mapped components only pass fixed props to it.
4. **Stories.** One story per variant, with controls, under `Components/<Level>/<Name>` (internal bases under `Internal/`). Check every story in all three brands and both themes.
5. **Tests.** Behaviour with Vitest and Testing Library (keyboard, disabled, ARIA), and no a11y violations in any brand and theme.
6. **Spec.** Add the "Spec → code" table, the API, the tokens used and any decisions to the component's §9 section.
7. **Status.** Set the §8 row to ✅ only after the designer approves. Add a line to §11.
8. **Summary.** Tell the designer what was built, anything that differs from the spec, and the Vercel preview link. Then wait.

## Hard rules

### Public demo
- **This repo is public.** Never write the name of a real company, client, product, bank, airline or person, except open-source projects credited in docs.
- Content is fake and generic. Members, tiers, rewards, vehicles and events are invented ("Member 0042", "Tier 2", "Reward X", "Track day voucher").
- Never copy code, text, tokens or assets from another repository unless the designer gives it to you for this repo.
- Before every push, run `pnpm scrub` (see "Scrub check"). If it finds anything, stop and tell the designer.

### Composition
- **Molecules come from atoms. Organisms come from molecules and atoms.** Never recreate a lower-level component's markup or styles inside another component. Import and use it.
- Mapped components come from their base and only pass fixed props to it.
- If a component needs a part that isn't built yet, stop and tell the designer. Never build a stand-in.

### Tokens and styling
- **No hardcoded values.** No hex or rgb colours, and no raw numbers for spacing, radius, size, font size, line height or shadows. The only exceptions are artwork and `0`.
- **Components use semantic tokens only.** Never palette (`--nl-palette-*`) or alias (`--nl-color-*`) variables. The Tailwind theme doesn't contain them.
- **Never edit generated token files.** Change `tokens/design.tokens.json` (only when the designer asks), run the audit, then rerun the token build.
- **Tailwind rules.**
  1. Each component has `Nl<Name>.styles.ts` with whole literal class strings, one export per element or part. Never build a class name from pieces.
  2. Variants are lookup objects (`size.large`, `variant.primary`) picked in the TSX. Lists never set the same property twice. Keep `data-*` attributes on the element as hooks for tests, but don't style through them.
  3. States use `enabled:hover:`, `enabled:active:`, `disabled:`, `focus-visible:`, `aria-disabled:`. A child following its parent's state uses a named group.
  4. Every class has the `nl:` prefix. Semantic utilities only. No arbitrary values (`[…]`), no `!`, no `dark:`.
  5. The focus ring is `focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focused`. Never put `outline-none` on the same element as a focus ring width. Use `focus:not-focus-visible:outline-none`.
  6. Every animation has a `motion-reduce:` counterpart.
  7. `className` is appended last, for placement only. Never style another component's internals.
  8. What utilities can't express goes into `packages/ui/src/styles/tailwind.css` as a named variant or utility, with a comment. Never per-component CSS.
  9. Any exception needs the designer's approval and a comment.
- No runtime CSS-in-JS.

### React and Next.js
- `'use client'` on any component with state, effects, refs or event handlers.
- No browser APIs at import time or during render.
- No `Date.now()`, `Math.random()` or locale formatting during render. IDs only from `useId`.
- No router imports. Link-like components take an `as` prop.
- Brand and theme only through `data-brand` and `data-theme` on `<html>`.

### Icons
- Always through `NlIcon` and the `nlIcons` registry. Material Symbols Rounded only. Never draw or substitute an icon.

### Accessibility (WCAG 2.2 AA)
- Keyboard access and a visible focus ring on every interactive element.
- Native elements first. ARIA only when no native element exists.
- Icon-only controls have an accessible label.
- Pointer targets at least 24 × 24.
- Contrast is checked in all three brands and both themes.

### Names and text
- Components use the `Nl` prefix in PascalCase (`NlButton`, `NlTextField`).
- All text content is in sentence case.

## Token audit

Run it after any change to `tokens/design.tokens.json`, before the token build. Write the result to `docs/TOKEN_AUDIT.md` and show it to the designer. Check:

1. The rules in `DESIGN.md` §3.9.
2. Every mapping matches `DESIGN.md` §3.1 to §3.4, token by token and mode by mode.
3. Missing or empty descriptions, copied descriptions, duplicate names, duplicate hex values in one scale, spelling.
4. Contrast for every pairing that matters, in every brand and theme. At least text on its background, white text on every fill, alert text and icons on their tints, focus rings and borders on `bg-primary`. List each ratio and mark anything under the WCAG AA line.

Report problems. Never fix the JSON or the spec without the designer's approval.

## Build log

`docs/BUILD_LOG.md` records how long the rebuild takes. For every setup task, component and page, add one row when work starts and complete it when the designer approves.

| Item | Started | Approved | Notes |
|---|---|---|---|
| NlButtonBase | 2026-11-20 10:04 | 2026-11-20 10:41 | |

Use the local time from the system clock, never an estimate.

## Scrub check

`pnpm scrub` runs `scripts/scrub.mjs`, which searches every tracked file (and commit messages on the branch) for the words in `scripts/scrub-words.txt`. The designer keeps that list. It is not committed (it's in `.gitignore`), because it contains the names that must never appear. If the file is missing, stop and ask for it.

## When to stop and ask

- The spec and the token JSON disagree.
- A value, colour or icon isn't covered by a token or the registry.
- The spec doesn't show something the component needs (a state, a Dark value, keyboard behaviour, empty, loading or error states).
- A check fails and the fix would change the design.
- Anything that would take more than a few minutes of machine time (long visual runs, full catalogue checks).

## Repo layout

```
tokens/design.tokens.json      ← source of values (DTCG 2025.10)
packages/tokens/               ← @northline/tokens
  build.ts                     ← Style Dictionary config
  src/styles.css               ← hand-written shadows, motion, grid
  dist/                        ← GENERATED
packages/ui/                   ← @northline/ui
  src/styles/                  ← index.css, reset.css, fonts.css, tailwind.css
  src/icons/                   ← NlIcon, nlIcons registry
  src/components/<Name>/
    Nl<Name>.tsx
    Nl<Name>.styles.ts
    Nl<Name>.stories.tsx
    Nl<Name>.test.tsx
    index.ts
apps/storybook/                ← Storybook, brand and theme toolbar, Foundations and Pages
  src/pages/<area>/            ← pages, never in the library
apps/nextjs-check/             ← Next.js App Router app for pnpm nextjs-check
scripts/                       ← scrub, release, nextjs-check
docs/                          ← BUILD_LOG.md, TOKEN_AUDIT.md
DESIGN.md
CLAUDE.md
```

Package manager is pnpm workspaces. Ask before adding folders, packages or dependencies outside this layout.

## Tooling

| Tool | Use |
|---|---|
| Style Dictionary | JSON tokens to CSS variables, TypeScript and the Tailwind theme |
| Vite | Library build and Storybook |
| Storybook (`@storybook/react-vite`) | Catalogue, with the a11y addon and a brand and theme toolbar |
| Vitest + Testing Library | Behaviour tests |
| Tailwind CSS 4 | Component styling |
| ESLint + Stylelint | Lint, including a check that every class uses our theme and the `nl:` prefix |
| Recharts | Charts (dashboard stage) |

Before saying anything is done, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:a11y`, `pnpm build` and `pnpm build-storybook` all pass.

## Git

- `main` always builds, its tests pass and its Storybook runs.
- One short-lived branch per item (`feat/<name>`). Push the branch so Vercel builds a preview, and give the designer the link.
- Merge into `main` only after the designer approves and every check passes. Then delete the branch.
- Commit messages in the present tense, naming the component (`Add NlButtonBase`).
