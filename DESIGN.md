# Northline design system

> **Status.** Draft v0.1, 17 Nov 2026
> **Platform.** Web, desktop admin product. React + TypeScript components that also run in Next.js (App Router).
> **Owner.** The designer, who decides what gets built and when.

This file is the spec. It says **what** the system is (tokens, styles, icons, components and their status). [`CLAUDE.md`](./CLAUDE.md) says **how** Claude Code works in this repo.

Northline is a public demo. It rebuilds a real design-to-code process with fictional brands and placeholder content. Nothing in it belongs to a real company or client.

---

## Contents

1. [Sources of truth](#1-sources-of-truth)
2. [Core rules](#2-core-rules)
3. [Foundations, tokens](#3-foundations-tokens)
4. [Foundations, styles](#4-foundations-styles)
5. [Motion](#5-motion)
6. [Icons](#6-icons)
7. [Component architecture](#7-component-architecture)
8. [Component inventory and build status](#8-component-inventory-and-build-status)
9. [Component specs](#9-component-specs)
10. [Decisions and known issues](#10-decisions-and-known-issues)
11. [Changelog](#11-changelog)

---

## 1. Sources of truth

| What | Where |
|---|---|
| Token values | `tokens/design.tokens.json` (DTCG 2025.10, colours as hex). Built from §3 of this file |
| Token plan, mapping and component specs | This file |
| Ways of working | `CLAUDE.md` |
| Icons | [Material Symbols Rounded](https://fonts.google.com/icons), npm package `material-symbols`, self-hosted |
| Fonts | Google Fonts, Open Font License, self-hosted through `@fontsource` packages |

**There is no Figma file for this demo.** The token JSON plays the part of the Figma export, and it keeps the same shape as a TokensBrücke export (collections, modes in `$extensions.mode`, a `$description` on every token).

**Component specs come from a reference system.** Before this repo was set up, the designer's existing component library was read once, outside this repo, and turned into neutral specs (anatomy, variants, sizes, states, token names, behaviour). Those specs were reviewed, scrubbed and copied into §9. This repo never connects to that Figma file, and no file key, node ID or name from it appears here. New components (charts and pages) are specified by the designer directly in §9.

If this file and the token JSON disagree, stop and tell the designer. Never edit one to match the other without approval.

---

## 2. Core rules

1. **Tokens only.** Components never contain raw hex values, pixel numbers or font sizes. The only exceptions are artwork (logos, illustrations) and `0`.
2. **Components use semantic colours only** (layer 3, `bg-*`, `text-*`, `border-*`, `fg-*`, `alpha-*`). Primitives and aliases exist only so semantic tokens can point at them.
3. **Light, Dark and brand come from tokens.** Theme and brand are set once on `<html>` with `data-theme="light|dark"` and `data-brand="northline|garnet|voltic"`. A component never branches on theme or brand.
4. **Desktop layout.** 12-column grid, 24 gutter, 24 page margin, narrowest width 1024.
5. **React and Next.js.** Every component works in a plain React app and in the Next.js App Router (§7.4).
6. **WCAG 2.2 AA.** Text 4.5 to 1, icons, borders and focus rings 3 to 1, in every brand and both themes.
7. **Sentence case** for all text content.
8. **Fake, generic content only.** Members, tiers, rewards and numbers are invented. No real company, product, client or person names, apart from open-source projects credited in docs.

---

## 3. Foundations, tokens

### 3.0 How the layers work

```
Primitives (raw hex)  →  Alias (brand modes)  →  Colour collection (Light / Dark)  →  components
```

| Layer | Collection | Modes | Code scoping |
|---|---|---|---|
| 1. Primitives | `Primitives` | none | `:root` |
| 2. Alias colours | `Alias Colors` | one per brand, `Northline`, `Garnet`, `Voltic` | `[data-brand="…"]`, Northline also on `:root` |
| 2. Alias typography | `Alias Typography` | one per brand (only the font family differs) | font family per brand, the rest on `:root` |
| 2. Alias spacing and radius | `Alias Spacing & Radius` | none | `:root` |
| 3. Semantic colours | `Color collection` | `Light`, `Dark` | `[data-theme="light|dark"]` |

- **Brands live in the alias layer.** Each brand mode points the same alias names at its own primitives. Adding a brand means adding primitives and one alias mode. Layer 3 and the components never change.
- **Light and Dark live in layer 3.** Semantic tokens point at aliases, so every brand gets both themes automatically.
- **Brand-specific Light and Dark steps live in the alias layer**, in the `Primary light` and `Primary dark` groups (§3.2). This is what lets one layer 3 work for brands of very different lightness.
- `data-brand` goes on `<html>` only. `data-theme` may also go on an inner element (side-by-side previews).

### 3.1 Primitive colours

_Collection `Primitives`, group `Colors`. Named by colour, never by role._

| Step | royal-blue | garnet-green | pink | grey |
|---|---|---|---|---|
| 50 | #E8EAFD | #E8EFEC | #FDE8F5 | #EDEDEF |
| 100 | #D0D6FB | #D0DED9 | #FCD1EA | #DBDBDF |
| 200 | #A1ADF7 | #A1BEB2 | #F9A3D5 | #B7B7BF |
| 300 | #7384F3 | #729D8C | #F576C0 | #94949E |
| 400 | #445BEE | #437D65 | #F248AB | #70707E |
| 500 | #1532EA | #145C3F | #EF1A96 | #4C4C5E |
| 600 | #1128BB | #104A32 | #BF1578 | #3D3D4B |
| 700 | #0D1E8D | #0C3726 | #8F105A | #2E2E38 |
| 800 | #08145E | #082519 | #600A3C | #1E1E26 |
| 900 | #040A2F | #04120D | #30051E | #0F0F13 |

| Step | blue | green | yellow | red |
|---|---|---|---|---|
| 50 | #E8F3FC | #E7F6E8 | #FCF8E7 | #FDEAE8 |
| 100 | #D1E7FA | #CFEDD0 | #F9F0CF | #FAD6D1 |
| 200 | #A3CFF4 | #9EDAA1 | #F4E19F | #F5ADA4 |
| 300 | #74B8EF | #6EC872 | #EED26F | #F18476 |
| 400 | #46A0E9 | #3DB643 | #E9C33F | #EC5B49 |
| 500 | #1888E4 | #0DA314 | #E3B510 | #E7321B |
| 600 | #136DB6 | #0A8310 | #B6900C | #B92816 |
| 700 | #0E5289 | #08620C | #886C09 | #8B1E10 |
| 800 | #0A365B | #054108 | #5B4806 | #5C140B |
| 900 | #051B2E | #032104 | #2D2403 | #2E0A05 |

| Step | bronze | platinum |
|---|---|---|
| 50 | #FBF0E8 | #F0F2F7 |
| 100 | #F5DCC8 | #DFE3EE |
| 200 | #E9B994 | #C0C7DB |
| 300 | #D9945F | #9FA9C6 |
| 400 | #C27538 | #7F8BB0 |
| 500 | #A55A22 | #636F94 |
| 600 | #84461A | #4F5976 |
| 700 | #633413 | #3B4359 |
| 800 | #42230D | #282C3B |
| 900 | #211106 | #14161E |

`bronze` and `platinum` are for member tier badges only (D20).

| Step | orange | cyan | violet | magenta |
|---|---|---|---|---|
| 50 | #FFF4EC | #EDF9FD | #F7F5FE | #FFF1FF |
| 100 | #FFE5D6 | #D7F1F8 | #E5E0FF | #F9DFFC |
| 200 | #FEC7A9 | #AAE0ED | #C4B5FD | #EAB9F0 |
| 300 | #F9A87C | #79CFE3 | #B694F2 | #DA94E4 |
| 400 | #F2884A | #38BDD8 | #A872E7 | #CA6CD7 |
| 500 | #DB6F30 | #2BA4BF | #9A4DDB | #B83FC9 |
| 600 | #C4560F | #1D8CA7 | #7E3BB5 | #A21CAF |
| 700 | #963C00 | #0E7490 | #622990 | #7E0E89 |
| 800 | #6A2400 | #004C60 | #48186D | #5C0164 |
| 900 | #410E00 | #002733 | #30074C | #3C0042 |

`orange`, `cyan`, `violet` and `magenta` are for chart series only (D9). Each scale is built around the two steps the chart tokens use.

| Primitive | Hex |
|---|---|
| white | #FFFFFF |
| black | #000000 |

Token paths are `Primitives.Colors.<scale>.<scale>-<step>`, for example `Primitives.Colors.royal-blue.royal-blue-500`.

### 3.2 Alias colours (brand layer)

_Collection `Alias Colors`, group `Colors.Brand`, modes `Northline`, `Garnet`, `Voltic`._

**Role scales.** Each step maps one to one to the primitive step.

| Alias | Northline | Garnet | Voltic |
|---|---|---|---|
| `Primary-50 … -900` | royal-blue | garnet-green | pink |
| `Neutral-50 … -900` | grey | grey | grey |
| `Info-50 … -900` | blue | blue | blue |
| `Success-50 … -900` | green | green | green |
| `Warning-50 … -900` | yellow | yellow | yellow |
| `Error-50 … -900` | red | red | red |
| `White`, `Black` | white, black | white, black | white, black |

**Tier scales** (D20). Group `Colors.Tier`, the same value in every brand, so a tier looks the same in Northline, Garnet and Voltic. Only the steps the tier tokens use.

| Alias | Every brand |
|---|---|
| `Bronze-50`, `-200`, `-300`, `-800` | bronze 50, 200, 300, 800 |
| `Silver-50`, `-200`, `-300`, `-800` | grey 50, 200, 300, 800 |
| `Gold-50`, `-200`, `-300`, `-800` | yellow 50, 200, 300, 800 |
| `Platinum-50`, `-200`, `-300`, `-800` | platinum 50, 200, 300, 800 |

**Chart scales** (D9). Group `Colors.Chart`, the same value in every brand. Only the steps the chart tokens use.

| Alias | Every brand |
|---|---|
| `Orange-600`, `Orange-400` | orange 600, 400 |
| `Cyan-700`, `Cyan-400` | cyan 700, 400 |
| `Violet-500`, `Violet-200` | violet 500, 200 |
| `Magenta-600`, `Magenta-500` | magenta 600, 500 |
| `Grey-500`, `Grey-200` | grey 500, 200 |
| `Yellow-600`, `Yellow-200` | yellow 600, 200 |

**Primary light.** Brand colours the Light theme uses for actions and fills.

| Alias | Northline | Garnet | Voltic | Use |
|---|---|---|---|---|
| `Primary-light-action` | Primary-500 | Primary-500 | Primary-600 | Links, action text, icons, active borders |
| `Primary-light-hovered` | Primary-600 | Primary-600 | Primary-700 | Hover of action text, icons, borders |
| `Primary-light-pressed` | Primary-700 | Primary-700 | Primary-800 | Pressed of action text, icons, borders |
| `Primary-light-focus` | Primary-400 | Primary-400 | Primary-500 | Focus ring |
| `Primary-light-fill` | Primary-500 | Primary-500 | Primary-600 | Primary buttons and brand backgrounds |
| `Primary-light-fill-hovered` | Primary-600 | Primary-600 | Primary-700 | Hover of primary buttons |
| `Primary-light-fill-pressed` | Primary-700 | Primary-700 | Primary-800 | Pressed of primary buttons |

**Primary dark.** The same roles for the Dark theme.

| Alias | Northline | Garnet | Voltic | Use |
|---|---|---|---|---|
| `Primary-dark-action` | Primary-300 | Primary-300 | Primary-400 | Links, action text, icons, active borders |
| `Primary-dark-hovered` | Primary-200 | Primary-200 | Primary-300 | Hover of action text, icons, borders |
| `Primary-dark-pressed` | Primary-100 | Primary-100 | Primary-200 | Pressed of action text, icons, borders |
| `Primary-dark-focus` | Primary-300 | Primary-300 | Primary-400 | Focus ring |
| `Primary-dark-fill` | Primary-400 | Primary-400 | Primary-600 | Primary buttons and brand backgrounds |
| `Primary-dark-fill-hovered` | Primary-500 | Primary-500 | Primary-700 | Hover of primary buttons |
| `Primary-dark-fill-pressed` | Primary-600 | Primary-600 | Primary-800 | Pressed of primary buttons |

- Every value in both groups points at the brand's own `Primary-*` alias, never straight at a primitive.
- Text on every primary fill is white in all brands. The admin colour picker (later) rejects colours that fail with white text, so no "text on primary" token is needed.

### 3.3 Semantic colours (Light / Dark)

_Collection `Color collection`, modes `Light` and `Dark`. **Components use only these.** Values point at aliases._

#### Background

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg-primary` | White | Neutral-900 | Main background of screens, dialogs and side sheets |
| `bg-secondary` | Neutral-50 | Neutral-800 | Side nav and grey panels |
| `bg-tertiary` | Neutral-100 | Neutral-700 | Callouts and nested surfaces |
| `bg-neutral` | Neutral-100 | Neutral-700 | Neutral badge background |
| `bg-icons` | Neutral-100 | Neutral-700 | Icon and default avatar backgrounds |
| `bg-disabled` | Neutral-100 | Neutral-700 | Disabled backgrounds |
| `bg-direct` | Neutral-900 | Neutral-50 | Snackbar and tooltip backgrounds. Text on it uses `text-inverse` |
| `bg-brand` | Primary-light-fill | Primary-dark-fill | Brand backgrounds |
| `bg-active` | Primary-50 | Primary-900 | Active or selected backgrounds |
| `bg-active-hover` | Primary-100 | Primary-800 | Hover of active backgrounds |
| `bg-action-primary` | Primary-light-fill | Primary-dark-fill | Primary button |
| `bg-action-primary_hovered` | Primary-light-fill-hovered | Primary-dark-fill-hovered | Primary button, hover |
| `bg-action-primary_pressed` | Primary-light-fill-pressed | Primary-dark-fill-pressed | Primary button, pressed |
| `bg-action-secondary` | Primary-50 | Primary-900 | Secondary button |
| `bg-action-secondary_hovered` | Primary-100 | Primary-800 | Secondary button, hover |
| `bg-action-secondary_pressed` | Primary-200 | Primary-700 | Secondary button, pressed |
| `bg-action-inverse` | White | White | White call to action on brand |
| `bg-action-destructive` | Error-600 | Error-600 | Destructive button |
| `bg-action-destructive_hovered` | Error-700 | Error-700 | Destructive button, hover |
| `bg-action-destructive_pressed` | Error-800 | Error-800 | Destructive button, pressed |
| `bg-action-destructive-secondary_hovered` | Error-50 | Error-900 | Secondary destructive button, hover |
| `bg-action-destructive-secondary_pressed` | Error-100 | Error-800 | Secondary destructive button, pressed |
| `bg-info` | Info-600 | Info-600 | Solid info background, white text |
| `bg-info_secondary` | Info-100 | Info-900 | Tinted info background |
| `bg-success` | Success-600 | Success-600 | Solid success background, white text |
| `bg-success_secondary` | Success-100 | Success-900 | Tinted success background |
| `bg-warning` | Warning-500 | Warning-500 | Solid warning background, dark text (`text-dark_both`) |
| `bg-warning_secondary` | Warning-100 | Warning-900 | Tinted warning background |
| `bg-error` | Error-600 | Error-600 | Solid error background, white text |
| `bg-error_secondary` | Error-100 | Error-900 | Tinted error background |
| `bg-tier-bronze_start`, `bg-tier-bronze_end` | Bronze-50, Bronze-200 | same | Bronze tier badge gradient, start (top left) and end (bottom right) (D20) |
| `bg-tier-silver_start`, `bg-tier-silver_end` | Silver-50, Silver-200 | same | Silver tier badge gradient, start (top left) and end (bottom right) (D20) |
| `bg-tier-gold_start`, `bg-tier-gold_end` | Gold-50, Gold-200 | same | Gold tier badge gradient, start (top left) and end (bottom right) (D20) |
| `bg-tier-platinum_start`, `bg-tier-platinum_end` | Platinum-50, Platinum-200 | same | Platinum tier badge gradient, start (top left) and end (bottom right) (D20) |

#### Text

| Token | Light | Dark | Use |
|---|---|---|---|
| `text-primary` | Neutral-900 | White | Titles and headings |
| `text-secondary` | Neutral-500 | Neutral-200 | Body text and descriptions |
| `text-tertiary` | Neutral-600 | Neutral-300 | Captions, overlines, hints |
| `text-placeholder` | Neutral-400 | Neutral-300 | Input placeholder text |
| `text-disabled` | Neutral-300 | Neutral-600 | Disabled text |
| `text-disabled-on_bg` | Neutral-400 | Neutral-500 | Disabled text on a filled background |
| `text-inverse` | White | Neutral-900 | Text on `bg-direct`. Flips with the theme |
| `text-white_both` | White | White | White text in both themes (primary and destructive buttons) |
| `text-white_subtle` | Neutral-100 | Neutral-100 | Secondary text on brand backgrounds |
| `text-dark_both` | Neutral-900 | Neutral-900 | Dark text in both themes (solid warning backgrounds) |
| `text-action` | Primary-light-action | Primary-dark-action | Text links and secondary buttons |
| `text-hovered` | Primary-light-hovered | Primary-dark-hovered | Text link, hover |
| `text-pressed` | Primary-light-pressed | Primary-dark-pressed | Text link, pressed |
| `text-info` | Info-700 | Info-200 | Info text |
| `text-success` | Success-700 | Success-200 | Success text |
| `text-warning` | Warning-800 | Warning-200 | Warning text |
| `text-error` | Error-700 | Error-200 | Error text |
| `text-tier-bronze` | Bronze-800 | same | Bronze tier badge text |
| `text-tier-silver` | Silver-800 | same | Silver tier badge text |
| `text-tier-gold` | Gold-800 | same | Gold tier badge text |
| `text-tier-platinum` | Platinum-800 | same | Platinum tier badge text |

#### Border

| Token | Light | Dark | Use |
|---|---|---|---|
| `border-default` | Neutral-100 | Neutral-700 | Default border and dividers |
| `border-subtle` | Neutral-50 | Neutral-800 | Subtle border |
| `border-strong` | Neutral-400 | Neutral-300 | Checkbox, radio and other control outlines |
| `border-disabled` | Neutral-100 | Neutral-700 | Disabled borders |
| `border-inverse` | White | Neutral-900 | Borders on brand colour |
| `border-active` | Primary-light-action | Primary-dark-action | Active, selected and typing states |
| `border-hovered` | Primary-light-hovered | Primary-dark-hovered | Hover |
| `border-pressed` | Primary-light-pressed | Primary-dark-pressed | Pressed |
| `border-focused` | Primary-light-focus | Primary-dark-focus | Focus ring |
| `border-action-primary` | Primary-light-fill | Primary-dark-fill | Outline buttons |
| `border-info` | Info-500 | Info-400 | Info border |
| `border-success` | Success-500 | Success-400 | Success border |
| `border-warning` | Warning-500 | Warning-400 | Warning border |
| `border-error` | Error-500 | Error-400 | Error border |
| `border-tier-bronze` | Bronze-300 | same | Bronze tier badge inside border (decorative) |
| `border-tier-silver` | Silver-300 | same | Silver tier badge inside border (decorative) |
| `border-tier-gold` | Gold-300 | same | Gold tier badge inside border (decorative) |
| `border-tier-platinum` | Platinum-300 | same | Platinum tier badge inside border (decorative) |

`border-warning` is decorative only. It reaches about 1.9:1 on `bg-primary` in Light, so it may outline something only when text or an icon next to it carries the meaning (for example the warning `NlBadge`). It must never be a control's only outline (D17).

#### Foreground (icons)

| Token | Light | Dark | Use |
|---|---|---|---|
| `fg-primary` | Neutral-900 | White | Primary icons |
| `fg-secondary` | Neutral-500 | Neutral-200 | Secondary icons (fields, close, chevron) |
| `fg-placeholder` | Neutral-400 | Neutral-400 | Input field icons |
| `fg-disabled` | Neutral-300 | Neutral-600 | Disabled icons |
| `fg-disabled-on_bg` | Neutral-400 | Neutral-500 | Disabled icons on a filled background |
| `fg-inverse` | White | Neutral-900 | Icons on `bg-direct`. Flips with the theme |
| `fg-white_both` | White | White | White icons in both themes |
| `fg-dark_both` | Neutral-900 | Neutral-900 | Dark icons in both themes |
| `fg-brand` | Primary-light-action | Primary-dark-action | Brand icons |
| `fg-action` | Primary-light-action | Primary-dark-action | Action icons |
| `fg-hovered` | Primary-light-hovered | Primary-dark-hovered | Action icon, hover |
| `fg-pressed` | Primary-light-pressed | Primary-dark-pressed | Action icon, pressed |
| `fg-active` | Primary-light-hovered | Primary-dark-hovered | Icons in the active state |
| `fg-info` | Info-600 | Info-300 | Info icons |
| `fg-success` | Success-600 | Success-300 | Success icons |
| `fg-warning` | Warning-700 | Warning-300 | Warning icons |
| `fg-error` | Error-600 | Error-300 | Error icons |
| `fg-tier-bronze` | Bronze-800 | same | Bronze tier badge icons |
| `fg-tier-silver` | Silver-800 | same | Silver tier badge icons |
| `fg-tier-gold` | Gold-800 | same | Gold tier badge icons |
| `fg-tier-platinum` | Platinum-800 | same | Platinum tier badge icons |

#### Chart (D9)

Series 1 follows the brand through its primary aliases; series 2 to 7 point at the fixed `Chart` aliases. Recharts reads these as CSS variables; the utilities (`bg-`, `text-`, `border-`, `fill-`, `stroke-`) are for legend and tooltip markers. Contrast for every brand and theme: Foundations, Chart colours, and `docs/TOKEN_AUDIT.md`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `chart-series-1` | Primary-light-fill | Primary-dark-action | Series 1, the brand |
| `chart-series-2` | Orange-600 | Orange-400 | Series 2 |
| `chart-series-3` | Cyan-700 | Cyan-400 | Series 3 |
| `chart-series-4` | Violet-500 | Violet-200 | Series 4 |
| `chart-series-5` | Magenta-600 | Magenta-500 | Series 5 |
| `chart-series-6` | Grey-500 | Grey-200 | Series 6 |
| `chart-series-7` | Yellow-600 | Yellow-200 | Series 7 (last: 3.01:1 in Light, OD-247) |
| `chart-grid` | Neutral-100 | Neutral-700 | Gridlines (decorative) |
| `chart-axis` | Neutral-400 | Neutral-300 | Axis lines, line chart cursor |
| `chart-axis-text` | Neutral-500 | Neutral-200 | Axis and legend labels |
| `chart-tooltip-bg` | Neutral-900 | Neutral-50 | Tooltip background |
| `chart-tooltip-text` | White | Neutral-900 | Tooltip text |
| `chart-cursor` | Neutral-50 | Neutral-800 | Band behind the hovered bar group (decorative) |
| `chart-highlight` | Neutral-900 | White | Ring around the hovered or focused mark |
| `chart-good` | Success-600 | Success-300 | Status: good |
| `chart-warning` | Warning-700 | Warning-300 | Status: warning |
| `chart-critical` | Error-600 | Error-300 | Status: critical |

#### Alpha

_An alias colour plus an opacity. The value follows the brand._

In `tokens/design.tokens.json` each Alpha token's `$value` is the alias reference, and the opacity is stored per theme in `$extensions["com.northline.alpha"]`. DTCG 2025.10 can't add an opacity to a referenced colour, so the token build (S2) must apply this opacity (D17).

| Token | Light | Dark | Use |
|---|---|---|---|
| `Alpha-sm` | Neutral-900 at 16% | Neutral-900 at 16% | Small call to action inside brand cards |
| `Alpha-md` | Neutral-900 at 40% | Black at 60% | Overlay (scrim) behind dialogs and side sheets |
| `Alpha-light` | White at 12% | White at 12% | Depth on brand backgrounds |
| `Alpha-nav` | White at 75% | White at 6% | Navigation backgrounds and loading overlay |
| `Alpha-border` | Neutral-900 at 8% | White at 8% | Subtle borders on icon circles and avatars |
| `Alpha-brand` | Primary-500 at 16% | Primary-500 at 16% | Brand tint |
| `Alpha-success` | Success-500 at 16% | Success-500 at 16% | Success tint |
| `Alpha-error` | Error-500 at 16% | Error-500 at 16% | Error tint |

#### Chart colours

To be added at the dashboard stage (§10, D9). The first series will use the brand primary, the rest a fixed set tested for Light and Dark.

### 3.4 Typography

_Collection `Alias Typography`, modes `Northline`, `Garnet`, `Voltic`. Only the font family differs between brands._

| Brand | Font family (primitive `Font style/<name>`) | Fallback stack added by the token build |
|---|---|---|
| Northline | Inter | `system-ui, sans-serif` |
| Garnet | IBM Plex Sans | `system-ui, sans-serif` |
| Voltic | Space Grotesk | `system-ui, sans-serif` |

All three are self-hosted with weights 400, 500, 600 and 700, Latin and Latin Extended. Font weights are stored as numbers (`$type: fontWeight`). Line heights are in px, rounded to one decimal. Letter spacing is 0.

| Text style | Weight | Size | Line height |
|---|---|---|---|
| `Display Large-H1` | 700 | 48 | 62.4 |
| `Display Medium-H2` | 700 | 36 | 46.8 |
| `Display Small-H3` | 700 | 28 | 39.2 |
| `Headline Large-H4` | 700 | 24 | 33.6 |
| `Headline Medium-H5` | 600 | 20 | 28 |
| `Headline Small-H6` | 600 | 16 | 24 |
| `Title XL` | 600 | 32 | 41.6 |
| `Title L` | 600 | 18 | 25.2 |
| `Title M` | 600 | 16 | 24 |
| `Title S` | 600 | 14 | 21 |
| `Body L` | 400 | 16 | 24 |
| `Body M` | 400 | 14 | 21 |
| `Body S` | 400 | 12 | 18 |
| `Label L` | 500 | 16 | 24 |
| `Label M` | 500 | 14 | 21 |
| `Label S` | 500 | 12 | 18 |
| `Caption L` | 500 | 12 | 18 |
| `Caption M` | 500 | 11 | 16.5 |
| `Caption S` | 600 | 10 | 15 |
| `Button XL` | 600 | 18 | 24 |
| `Button L` | 600 | 16 | 24 |
| `Button M` | 600 | 14 | 24 |
| `Button S` | 600 | 12 | 24 |
| `Data L` | 600 | 32 | 41.6 |
| `Data M` | 600 | 24 | 31.2 |
| `Data S` | 500 | 12 | 18 |

`Button XL` is the large button's label (D12).

`Data L` and `Data M` are new, for large numbers on stat cards and dashboards. `Data S` (OD-250) is for numbers on chart axes, tooltips and legends; it takes the size and line height of `Label S` and `Body S`. All three use tabular figures (`font-variant-numeric: tabular-nums`).

**Icon weight.** `Alias Typography.Icon.Font weight` is 300 in every brand (`--nl-font-icon-weight`, from the primitive `Font Weight-300`). It is the weight of Material Symbols glyphs (§6), not a text style: it has no font shorthand or `nl:text-*` utility, and text never uses 300 (the text fonts aren't loaded at that weight).

### 3.5 Spacing

_Collection `Alias Spacing & Radius`, group `Spacing`. Values point at `Primitives.Sizes`._

| Token | Value |
|---|---|
| `Space-none` | 0 |
| `Space-XXS` | 2 |
| `Space-XS` | 4 |
| `Space-S` | 6 |
| `Space-M` | 8 |
| `Space-L` | 12 |
| `Space-XL` | 16 |
| `Space-2XL` | 20 |
| `Space-3XL` | 24 |
| `Space-4XL` | 32 |
| `Space-5XL` | 36 |
| `Space-6XL` | 40 |
| `Space-7XL` | 48 |
| `Space-8XL` | 56 |
| `Space-9XL` | 64 |
| `Space-10XL` | 80 |
| `Space-11XL` | 96 |
| `Space-12XL` | 120 |

The scale and names match the reference system, so extracted specs (§9) map one to one.

`Primitives.Sizes` holds `Size-0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 36, 40, 48, 56, 64, 80, 96, 120, 240, 320, 560, 720` and `Size-full` (9999). Component sizes (icon, avatar, control heights) use these `Size-*` tokens. `Size-240` (side nav column, added 21 Nov 2026, OD-134), `Size-320` (rich tooltip), `Size-560` (snackbar and small dialog, added 20 Nov 2026, OD-91) and `Size-720` (large dialog, added 20 Nov 2026, OD-121) are widths only, never spacing values, so there are no matching `Space-*` tokens.

### 3.6 Radius

| Token | Value |
|---|---|
| `Radius-none` | 0 |
| `Radius-XS` | 4 |
| `Radius-S` | 8 |
| `Radius-M` | 12 |
| `Radius-L` | 16 |
| `Radius-XL` | 24 |
| `Radius-Full` | `Size-full` (pill) |

### 3.7 Breakpoints

_Group `Primitives.Breakpoints`, kept apart from `Sizes` so layout widths never mix with spacing._

| Token | Value | Use |
|---|---|---|
| `Breakpoint-1024` | 1024 | Narrowest supported width. Side nav collapsed |
| `Breakpoint-1280` | 1280 | Side nav expanded from here |
| `Breakpoint-1440` | 1440 | Main design width |
| `Breakpoint-1920` | 1920 | Large desktop |

### 3.8 Token names in code

| Layer | JSON path example | CSS variable | Tailwind |
|---|---|---|---|
| Primitive | `Primitives.Colors.royal-blue.royal-blue-500` | `--nl-palette-royal-blue-500` | none |
| Alias | `Alias Colors.Colors.Brand.Primary.Primary-500` | `--nl-color-primary-500` | none |
| Semantic | `Color collection.Background.bg-primary` | `--nl-bg-primary` | `nl:bg-primary` |
| Text style | `Alias Typography.Body M` | `--nl-font-body-m` (shorthand) | `nl:text-body-m` |
| Spacing | `Space-XL` | `--nl-space-xl` | `nl:p-xl`, `nl:gap-xl` |
| Radius | `Radius-S` | `--nl-radius-s` | `nl:rounded-s` |

Names are lowercased, spaces and `_` become `-`. Components see only semantic, text style, spacing, radius, size and shadow utilities.

Tailwind utilities per group (generated by `packages/tokens/build.ts`). The group prefix is dropped and the token goes to the utility it is for:

| Group | Utilities | Example |
|---|---|---|
| `bg-*` | background | `bg-action-primary_hovered` → `nl:bg-action-primary-hovered` |
| `text-*` | text colour | `text-secondary` → `nl:text-secondary` |
| `border-*` | border, outline (focus ring), inset ring, and background with a `border-` prefix | `border-focused` → `nl:outline-focused`; `nl:bg-border-default` |
| `fg-*` (icons) | text colour, background and border with an `fg-` prefix, fill, stroke | `nl:text-fg-secondary`, `nl:bg-fg-brand`, `nl:border-fg-action`, `nl:fill-brand` |
| `Alpha-*` | background | `nl:bg-alpha-md` |
| `Space-*` | padding, margin, gap, inset, width, height | `nl:p-xl`, `nl:gap-3xl`, `nl:p-none` |
| `Size-*` | width, height, size, min and max | `nl:size-24`, `nl:h-40`, `nl:max-w-320` (`Size-full` is only for `Radius-Full`) |
| `Radius-*` | rounded | `nl:rounded-s`, `nl:rounded-full` |
| Shadows, layers (§4.1, §4.3) | shadow, z-index | `nl:shadow-menu`, `nl:z-modal` |
| Motion (§5) | transition duration and easing. Every `nl:transition-*` defaults to `--nl-duration-base` and `--nl-ease-standard` | `nl:duration-fast`, `nl:duration-base`, `nl:duration-slow`, `nl:ease-standard` |
| Text styles (§3.4) | one font shorthand | `nl:text-body-m`, `nl:text-data-l` (tabular figures) |

Alpha tokens come out as `color-mix(in srgb, <alias> <opacity>%, transparent)`, so they follow the brand (D17).

### 3.9 Token file rules

These are checked by the audit (CLAUDE.md, "Token audit") every time the JSON changes.

1. Every token has `$type`, `$value`, `$description` and `$extensions.mode`.
2. Every colour token in `Color collection` and `Alias Colors` has a written description that says where to use it. Primitives say what they are ("Royal blue, step 500").
3. Descriptions are never copied from another token and never name a real product or client.
4. Font weights are `fontWeight` numbers, not dimensions.
5. Dimensions use the DTCG object `{ "value": 16, "unit": "px" }`. No float noise (62.4, never 62.399997).
6. Alias values point at primitives. Semantic values point at aliases. Nothing skips a layer.
7. Inside `Primary light` and `Primary dark`, every mode points at a `Primary-*` alias, never at a primitive.
8. Every mode of a collection has a value for every token.
9. No two tokens in one group have the same name, and no two primitives in one scale have the same hex.

### 3.10 Brands

| Brand | `data-brand` | Primary | Font | Feel |
|---|---|---|---|---|
| Northline | `northline` (default, also `:root`) | royal-blue | Inter | Clear, precise, engineered |
| Garnet | `garnet` | garnet-green | IBM Plex Sans | Deep, heritage, calm |
| Voltic | `voltic` | pink (#EF1A96) | Space Grotesk | Loud, high energy |

Northline and Garnet are both dark primaries, so they need lighter steps in Dark. Voltic is bright, so it needs a darker step in Light. All of that sits in the alias layer (§3.2).

### 3.11 Tailwind theme

Tailwind CSS 4, with a theme generated from the tokens. Every class has the `nl:` prefix. The theme holds only this system's tokens (Tailwind's default colours, spacing and radius are removed), and `dark:` is disabled because theme and brand come from the tokens. Full rules are in `CLAUDE.md`.

---

## 4. Foundations, styles

### 4.1 Shadows

Hand-written in `packages/tokens/src/styles.css`.

| Token | Value | Use |
|---|---|---|
| `--nl-shadow-resting` | 0 1px 3px 0 black at 5% | Cards and surfaces at rest |
| `--nl-shadow-panel` | 0 2px 10px 0 black at 4% | Panels on the page |
| `--nl-shadow-menu` | 0 -2px 16px 0 black at 8% | Menus and popovers |
| `--nl-shadow-sticky` | 0 -2px 16px 0 black at 8% | Sticky bottom bars |
| `--nl-shadow-sticky-end` | -2px 0 16px 0 black at 8% | Fixed table columns (shadow falls to the left) |

### 4.2 Border widths

Borders, inset strokes and focus rings use Tailwind's built-in 1px and 2px widths (`border`, `border-2`, `inset-ring`, `inset-ring-2`, `outline-2`). These are the only allowed widths, so they don't need tokens.

### 4.3 Layers (z-index)

| Token | Value | Use |
|---|---|---|
| `--nl-z-base` | 0 | Page content |
| `--nl-z-sticky` | 10 | Sticky headers, fixed table columns, sticky bottom bars |
| `--nl-z-overlay` | 100 | Overlay (scrim) |
| `--nl-z-modal` | 110 | Dialogs and side sheets |
| `--nl-z-menu` | 200 | Menus, popovers, the calendar |
| `--nl-z-tooltip` | 300 | Tooltips |
| `--nl-z-snackbar` | 400 | Snackbars |

### 4.4 Grid and page widths

12 columns, 24 gutter (`Space-3XL`), 24 margin. Every Storybook page is checked at 1920, 1440, 1280 and 1024.

---

## 5. Motion

| Token | Value | Use |
|---|---|---|
| `--nl-duration-fast` | 120ms | Hover and press |
| `--nl-duration-base` | 200ms | Menus, tooltips |
| `--nl-duration-slow` | 300ms | Side sheets, dialogs |
| `--nl-duration-pulse` | 1600ms | Skeleton loading pulse (one full cycle) |
| `--nl-duration-snackbar` | 6000ms | How long a snackbar without an action stays (OD-92). Reading time, so not zeroed under reduced motion |
| `--nl-ease-standard` | cubic-bezier(0.2, 0, 0, 1) | Default |

Every animation has a `prefers-reduced-motion` alternative.

---

## 6. Icons

- Material Symbols Rounded, self-hosted. Outlined (`FILL 0`) by default, filled (`FILL 1`) for active and selected states.
- Weight 300, from the Icon font weight token (§3.4). Grade 0.
- Always through `NlIcon` and the `nlIcons` registry. The icon font is subset at build time to the registered icons.
- Sizes `16`, `20`, `24` (default), `36`, `48`, `64` only, mapped to the `Size-*` primitives, never to spacing tokens.
- Never draw or invent an icon. If one isn't in Material Symbols, stop and ask.

---

## 7. Component architecture

### 7.1 Levels

| Level | Meaning |
|---|---|
| Atom L0 | Contains no other component |
| Atom L1 | Contains only icons or L0 atoms |
| Molecule | Built from atoms |
| Organism | Built from molecules |
| Page | Storybook only, never shipped in the library |

**Composition rule (hard rule).** Molecules are built only from atoms. Organisms are built only from molecules and atoms. A component never recreates the markup or styles of a component below it. It uses that component. A component is built only after everything it depends on is done, and its level follows from what it contains.

**What counts toward a level.** Only the parts a component renders itself. Content passed in through a slot (menu items, table rows, dialog bodies, the app shell's nav, header and content) is chosen by whoever uses the component and doesn't raise its level.

### 7.2 Base and mapped components

A **base** holds every option as props. **Mapped** components are thin wrappers that pass fixed props to a base and never copy its markup or styles. Bases are internal (not exported) unless this file says otherwise. Bases have no interaction states. Hover, pressed and selected styling belongs to the components built on them.

### 7.3 Props

| Spec says | React |
|---|---|
| Variant (type, size, style) | String union prop, also rendered as a `data-*` attribute |
| Colour-only variant (primary, success, error…) | `tone` prop |
| Interaction state (hover, pressed, focus, typing) | Not a prop. CSS states only. `disabled` is the native attribute |
| On or off option | `boolean` prop, or an optional node |
| Text | `string` prop, or `children` for the main label |
| Slot | `ReactNode` prop |
| Icon | `NlIconName` prop |

- Disabled controls are never focusable.
- Form controls are controlled or uncontrolled like native inputs and forward `ref`.
- Every component accepts `className` and passes other native attributes to its root.

### 7.4 React and Next.js

- `'use client'` at the top of any component with state, effects, refs or event handlers. Presentational components don't get it.
- No `window`, `document` or `localStorage` at import time or during render.
- The same output on server and client. No `Date.now()`, `Math.random()` or locale formatting during render. IDs from `useId`.
- No router imports. Link-like components take an `as` prop.
- The library build keeps one file per source file, so every `'use client'` survives. `@northline/tokens` is a peer dependency of `@northline/ui`.
- `pnpm nextjs-check` installs the packed library into a small Next.js App Router app and builds it.

### 7.5 Later frameworks

The tokens package is framework neutral (CSS variables, the JSON and TypeScript constants). Vue, Angular or Svelte would reuse it and need their own component layer. A mobile app would get its own output from the same JSON through Style Dictionary. The token structure never changes.

---

## 8. Component inventory and build status

Status ⬜ Not started · 🟨 In progress · ✅ Done (built, stories, tests, checked in every brand and theme, approved)

### 8.0 Setup

| # | Task | Output | Status |
|---|---|---|---|
| S-1 | Neutral component specs extracted from the reference system, reviewed and scrubbed, copied into §8 and §9 | `DESIGN.md` §8, §9 | ✅ |
| S0 | Token JSON built from §3, plus the audit report | `tokens/design.tokens.json`, `docs/TOKEN_AUDIT.md` | ✅ |
| S1 | pnpm monorepo scaffold (`packages/tokens`, `packages/ui`, `apps/storybook`), TypeScript, Vite, ESLint, Stylelint | repo root | ✅ |
| S2 | Token build with Style Dictionary, brand and theme scoping, Tailwind theme | `packages/tokens/dist/` | ✅ |
| S3 | Hand-written styles (§4, §5) | `packages/tokens/src/styles.css` | ✅ |
| S4 | Fonts (Inter, IBM Plex Sans, Space Grotesk, Material Symbols Rounded), reset, app stylesheet | `packages/ui/src/styles/` | ✅ |
| S5 | Storybook with theme and brand toolbar and Foundations pages (colours, typography, spacing, radius, shadows) | `apps/storybook` | ✅ |
| S6 | Tests, a11y checks in every brand and theme, lint rules for tokens and Tailwind | repo root | ✅ |
| S7 | Next.js check app and `pnpm nextjs-check` | `apps/nextjs-check` | ✅ |
| S8 | Vercel deploy of Storybook | `vercel.json` | ✅ |

### 8.1 Atoms L0

_The designer adds rows here before each build._

| # | Component | Code name | Depends on | Spec | Status |
|---|---|---|---|---|---|
| 1 | Icon | `NlIcon` | – | [§9](#nlicon) | ✅ |
| 2 | Status dot | `NlStatusDot` | – | [§9](#nlstatusdot) | ✅ |
| 3 | Count badge | `NlCountBadge` | – | [§9](#nlcountbadge) | ✅ |
| 4 | Divider | `NlDivider` | – | [§9](#nldivider) | ✅ |
| 5 | Skeleton | `NlSkeleton` | – | [§9](#nlskeleton) | ✅ |
| 6 | Overlay | `NlOverlay` | – | [§9](#nloverlay) | ✅ |
| 7 | Progress bar | `NlProgressBar` | – | [§9](#nlprogressbar) | ✅ |
| 8 | Slider | `NlSlider` | – | [§9](#nlslider) | ✅ |
| 9 | Radio | `NlRadio` | – | [§9](#nlradio) | ✅ |
| 10 | Switch | `NlSwitch` | – | [§9](#nlswitch) | ✅ |
| 11 | Text block | `NlTextBlock` | – | [§9](#nltextblock) | ✅ |
| 12 | Menu | `NlMenu` | – | [§9](#nlmenu) | ✅ |
| 13 | Chip group | `NlChipGroup` | – | [§9](#nlchipgroup) | ⬜ |
| 14 | App shell | `NlAppShell` | – | [§9](#nlappshell) | ✅ |
| 15 | Calendar day (internal) | `NlCalendarDay` | – | [§9](#nlcalendarday) | ✅ |
| 16 | List caption (internal) | `NlListCaption` | – | [§9](#nllistcaption) | ✅ |
| 17 | Nav sub item (internal) | `NlNavSubItem` | – | [§9](#nlnavsubitem) | ✅ |
| 18 | Pagination item (internal) | `NlPaginationItem` | – | [§9](#nlpaginationitem) | ✅ |
| 19 | Page dot (internal) | `NlPageDot` | – | [§9](#nlpagedot) | ✅ |

### 8.2 Atoms L1

| # | Component | Code name | Depends on | Spec | Status |
|---|---|---|---|---|---|
| 20 | Icon container | `NlIconContainer` | `NlIcon` | [§9](#nliconcontainer) | ✅ |
| 21 | Avatar | `NlAvatar` | `NlIcon`, `NlStatusDot` | [§9](#nlavatar) | ✅ |
| 22 | Badge base (internal) | `NlBadgeBase` | `NlIcon` | [§9](#nlbadgebase) | ✅ |
| 23 | Badge | `NlBadge` | `NlBadgeBase` | [§9](#nlbadge) | ✅ |
| 24 | Button base (internal) | `NlButtonBase` | `NlIcon` | [§9](#nlbuttonbase) | ✅ |
| 25 | White button (internal) | `NlWhiteButton` | `NlButtonBase` | [§9](#nlwhitebutton) | ✅ |
| 26 | Destructive button (internal) | `NlDestructiveButton` | `NlButtonBase` | [§9](#nldestructivebutton) | ✅ |
| 27 | Button | `NlButton` | `NlButtonBase`, `NlWhiteButton`, `NlDestructiveButton` | [§9](#nlbutton) | ✅ |
| 28 | Checkbox control (internal) | `NlCheckboxControl` | `NlIcon` | [§9](#nlcheckboxcontrol) | ✅ |
| 29 | Spinner | `NlSpinner` | `NlIcon` | [§9](#nlspinner) | ✅ |
| 30 | Label | `NlLabel` | `NlCountBadge` | [§9](#nllabel) | ✅ |
| 31 | Chip base (internal) | `NlChipBase` | `NlIcon` | [§9](#nlchipbase) | ✅ |
| 32 | Filter chip | `NlFilterChip` | `NlChipBase` | [§9](#nlfilterchip) | ✅ |
| 33 | Assist chip | `NlAssistChip` | `NlChipBase` | [§9](#nlassistchip) | ✅ |
| 34 | Input chip | `NlInputChip` | `NlChipBase` | [§9](#nlinputchip) | ✅ |
| 35 | Segment (internal) | `NlSegment` | `NlIcon` | [§9](#nlsegment) | ✅ |
| 36 | Helper text | `NlHelperText` | `NlIcon` | [§9](#nlhelpertext) | ✅ |
| 37 | Rows per page | `NlRowsPerPage` | `NlIcon` | [§9](#nlrowsperpage) | ✅ |
| 38 | Nav icon (internal) | `NlNavIcon` | `NlIcon` | [§9](#nlnavicon) | ✅ |
| 39 | Page dots | `NlPageDots` | `NlPageDot` | [§9](#nlpagedots) | ⬜ |
| 40 | Tooltip | `NlTooltip` | `NlTextBlock` | [§9](#nltooltip) | ✅ |

### 8.3 Molecules

| # | Component | Code name | Depends on | Spec | Status |
|---|---|---|---|---|---|
| 41 | Segmented button | `NlSegmentedButton` | `NlSegment`, `NlTooltip` | [§9](#nlsegmentedbutton) | ✅ |
| 42 | Checkbox | `NlCheckbox` | `NlCheckboxControl`, `NlTextBlock` | [§9](#nlcheckbox) | ✅ |
| 43 | Notification button | `NlNotificationButton` | `NlCountBadge`, `NlIcon` | [§9](#nlnotificationbutton) | ✅ |
| 44 | Input base (internal) | `NlInputBase` | `NlHelperText`, `NlIcon` | [§9](#nlinputbase) | ✅ |
| 45 | Text field | `NlTextField` | `NlInputBase` | [§9](#nltextfield) | ✅ |
| 46 | Password field | `NlPasswordField` | `NlInputBase`, `NlButton` | [§9](#nlpasswordfield) | ✅ |
| 47 | Search field | `NlSearchField` | `NlInputBase`, `NlButton` | [§9](#nlsearchfield) | ✅ |
| 48 | Text area base (internal) | `NlTextAreaBase` | `NlHelperText` | [§9](#nltextareabase) | ✅ |
| 49 | Text area | `NlTextArea` | `NlTextAreaBase` | [§9](#nltextarea) | ✅ |
| 50 | Calendar | `NlCalendar` | `NlCalendarDay`, `NlButton`, `NlLabel` | [§9](#nlcalendar) | ✅ |
| 51 | Step (internal) | `NlStep` | `NlIcon`, `NlLabel` | [§9](#nlstep) | ⬜ |
| 52 | List item base (internal) | `NlListItemBase` | `NlLabel`, `NlTextBlock`, `NlDivider` | [§9](#nllistitembase) | ✅ |
| 53 | List item | `NlListItem` | `NlListItemBase`, `NlAvatar`, `NlListCaption`, `NlIcon` | [§9](#nllistitem) | ✅ |
| 54 | Checkbox list item | `NlCheckboxListItem` | `NlListItemBase`, `NlCheckboxControl` | [§9](#nlcheckboxlistitem) | ✅ |
| 55 | Radio list item | `NlRadioListItem` | `NlListItemBase`, `NlRadio` | [§9](#nlradiolistitem) | ✅ |
| 56 | Switch list item | `NlSwitchListItem` | `NlListItemBase`, `NlSwitch`, `NlIcon` | [§9](#nlswitchlistitem) | ✅ |
| 57 | Accordion | `NlAccordion` | `NlTextBlock`, `NlBadge`, `NlLabel`, `NlDivider`, `NlIcon` | [§9](#nlaccordion) | ⬜ |
| 58 | Banner | `NlBanner` | `NlIcon`, `NlButton` | [§9](#nlbanner) | ✅ |
| 59 | Snackbar | `NlSnackbar` | `NlIcon`, `NlButton` | [§9](#nlsnackbar) | ✅ |
| 60 | Button dock | `NlButtonDock` | `NlButton`, `NlTextBlock` | [§9](#nlbuttondock) | ✅ |
| 61 | Empty state | `NlEmptyState` | `NlIconContainer`, `NlTextBlock`, `NlButton` | [§9](#nlemptystate) | ✅ |
| 62 | Stat card | `NlStatCard` | `NlLabel` | [§9](#nlstatcard) | ✅ |
| 63 | File upload | `NlFileUpload` | `NlIconContainer`, `NlTextBlock`, `NlButton`, `NlProgressBar` | [§9](#nlfileupload) | ✅ |
| 64 | Dialog | `NlDialog` | `NlTextBlock`, `NlButton`, `NlOverlay` | [§9](#nldialog) | ✅ |
| 65 | Pagination | `NlPagination` | `NlPaginationItem`, `NlButton` | [§9](#nlpagination) | ✅ |
| 66 | Table header cell | `NlTableHeaderCell` | `NlCheckboxControl`, `NlLabel`, `NlIcon` | [§9](#nltableheadercell) | ✅ |
| 67 | Table cell | `NlTableCell` | `NlCheckboxControl`, `NlBadge`, `NlButton` | [§9](#nltablecell) | ✅ |
| 68 | Nav item | `NlNavItem` | `NlNavIcon`, `NlNavSubItem`, `NlIcon`, `NlTooltip`, `NlMenu`, `NlListItem` | [§9](#nlnavitem) | ✅ |
| 69 | Side nav user | `NlSideNavUser` | `NlListItemBase`, `NlAvatar` | [§9](#nlsidenavuser) | ✅ |
| 79 | Bulk action bar | `NlBulkActionBar` | `NlButton`, `NlMenu`, `NlListItem` | [§9](#nlbulkactionbar) | ✅ |

### 8.4 Organisms

| # | Component | Code name | Depends on | Spec | Status |
|---|---|---|---|---|---|
| 70 | Select | `NlSelect` | `NlInputBase`, `NlMenu`, `NlListItem` | [§9](#nlselect) | ✅ |
| 71 | Multi select | `NlMultiSelect` | `NlInputBase`, `NlMenu`, `NlCheckboxListItem`, `NlInputChip` | [§9](#nlmultiselect) | ✅ |
| 72 | Date field | `NlDateField` | `NlInputBase`, `NlMenu`, `NlCalendar`, `NlButton` | [§9](#nldatefield) | ✅ |
| 73 | Stepper | `NlStepper` | `NlStep` | [§9](#nlstepper) | ⬜ |
| 74 | Table column filter | `NlTableColumnFilter` | `NlMenu`, `NlCheckboxListItem`, `NlRadioListItem`, `NlSearchField`, `NlButton` | [§9](#nltablecolumnfilter) | ✅ |
| 75 | Side sheet | `NlSideSheet` | `NlTextBlock`, `NlButton`, `NlDivider`, `NlButtonDock`, `NlOverlay` | [§9](#nlsidesheet) | ✅ |
| 76 | Page header | `NlPageHeader` | `NlTextBlock`, `NlButton`, `NlNotificationButton` | [§9](#nlpageheader) | ✅ |
| 77 | Table | `NlTable` | `NlTableHeaderCell`, `NlTableCell`, `NlCheckboxControl`, `NlSearchField`, `NlButton`, `NlPagination`, `NlRowsPerPage`, `NlMenu`, `NlListItem`, `NlEmptyState`, `NlSkeleton`, `NlBulkActionBar` | [§9](#nltable) | ✅ |
| 78 | Side nav | `NlSideNav` | `NlNavItem`, `NlSideNavUser`, `NlButton` | [§9](#nlsidenav) | ✅ |

Every row in §8.1 to §8.4 was checked against the composition rule (§7.1) on 17 Nov 2026: L0 contains no component, L1 only L0 atoms and icons, molecules only atoms, organisms only molecules and atoms. Mapped components take their base's level (§7.2) and slot content doesn't count (D15). Rows are in build order: a component comes after everything it depends on. `NlTable`'s toolbar, header row, rows and footer are internal parts, not rows (D15).

### 8.5 Data visualisation

Charts use Recharts, styled only through tokens. Planned at the dashboard stage.

| # | Component | Code name | Depends on | Spec | Status |
|---|---|---|---|---|---|
| C0 | Chart marker (internal) | `NlChartMarker` | – | [§9](#nlchartmarker) | ✅ |
| C1 | Chart tooltip | `NlChartTooltip` | `NlChartMarker` | [§9](#nlcharttooltip) | ✅ |
| C2 | Chart legend | `NlChartLegend` | `NlChartMarker` | [§9](#nlchartlegend) | ✅ |
| C3 | Chart frame | `NlChartFrame` | `NlTextBlock`, `NlSegmentedButton`, `NlSkeleton`, `NlEmptyState`, `NlButton` | [§9](#nlchartframe) | ✅ |
| C4 | Line chart | `NlLineChart` | `NlChartTooltip`, `NlChartLegend` | [§9](#nllinechart) | ⬜ |
| C5 | Bar chart | `NlBarChart` | `NlChartTooltip`, `NlChartLegend` | [§9](#nlbarchart) | ⬜ |
| C6 | Donut chart | `NlDonutChart` | `NlChartTooltip`, `NlChartLegend` | [§9](#nldonutchart) | ⬜ |

Shared rules for all charts: [§9, Charts: shared rules](#charts-shared-rules). Specs decided by the designer, 24 Nov 2026 (OD-246 to OD-260).

### 8.6 Pages (Storybook only)

#### Page rules

These apply to every page.

1. **Where.** Pages live in `apps/storybook/src/pages/<area>/`, never in `packages/ui`. Shared page parts are in `pages/_shared/`, fixture data in `pages/_fixtures/`.
2. **Library only.** Pages are built only from `@northline/ui` components and tokens. No new styles, no hard-coded values and no new components inside a page folder. Layout-only utilities with tokens (`nl:flex`, `nl:grid`, `nl:grid-cols-*`, `nl:gap-*`, `nl:sticky`) are allowed to place components. If a page needs something the library doesn't have, stop and ask the designer. Never work around it.
3. **Frame.** Every page except Login sits in `NlAppShell` with the shared side nav and page header (`_shared/PageLayout`), which takes the active nav item.
4. **Stories.** Every page has Default, Loading, Empty and Error stories. Table pages also get Filtered. Pages that aren't built yet open the shared `Pages/Coming soon` stories (one per planned page, so the nav state is right).
5. **Width.** Designed at 1440 wide and checked at 1024. No mobile layout.
6. **Brands and themes.** Every page is reviewed in all three brands, Light and Dark.
7. **Data.** Fixtures only, generated from a fixed seed so every build shows the same data. Invented names, emails on `example.com`. Dates in 2026, shown as DD/MM/YYYY (the `NlDateField` format). Run `pnpm scrub` on fixtures before pushing.
8. **Links.** Side nav items and page links open other page stories through `linkTo` (`@storybook/addon-links`), mapped in `_shared/navItems.tsx`. Login's Log in opens the member list, so the prototype starts from login.

| # | Page | Area | Status |
|---|---|---|---|
| P1 | Login (`Pages/Login`): wordmark, `NlTextBlock` heading, `NlTextField`, `NlPasswordField`, `NlButton` link (small), `NlCheckbox` (small), `NlButton`; form 4 of the 12 grid columns, centred; empty required fields show errors on Log in (D18) | Login | ✅ |
| P2 | Member list (`Pages/Members/Member list`): `NlTable` with a `Size-320` search, active filters as `NlInputChip`s with Clear filters, and Add member in the toolbar; Tier and Status (list) and Join date (date range) filters in the header cells, tier tones (D20); sort on points and dates; row click and View open the member details `NlSideSheet` (a Detail / Value `NlTable`, Suspend destructive and Edit in the footer; replaces the planned Member detail page); row actions; pagination; `NlBulkActionBar` (Export, Change status, Suspend) while rows are selected (D21); Suspend from a row, the side sheet or the bar asks in an `NlDialog` (destructive), then a success `NlSnackbar` at the top end (OD-245) | Members | ✅ |
| P3 | Dashboard | Dashboard | ⬜ |
| P4 | All rewards | Rewards | ⬜ |
| P5 | Track voucher | Rewards | ⬜ |
| P6 | Tiers | Rewards | ⬜ |
| P7 | Events | Events | ⬜ |
| P8 | Messages | Messages | ⬜ |
| P9 | Help | Help | ⬜ |

---

## 9. Component specs

_One section per component. Specs for existing components come from the extraction (S-1). Specs for new components (charts, dashboard parts) are written by the designer before the build. Every spec covers anatomy, variants, sizes, states, tokens, behaviour and accessibility. Claude Code adds the "Spec → code" table, the API and any decisions after the build._

The specs below are in build order (§8). Proposals marked **needs approval**, and the open decisions listed under each spec (`OD-n`), are tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md) and decided during the build.

### NlIcon

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

Shows one Material Symbols Rounded glyph from the `nlIcons` registry at a fixed size and colour.

#### Anatomy

```
NlIcon (box, square)
└── glyph (Material Symbols Rounded, centred)
```

- The box is always square. The glyph takes about two thirds of the box, which is the font's own optical sizing.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Icon | any name in the `nlIcons` registry | `name: NlIconName` |
| Size | 16, 20, 24 (default), 36, 48, 64 | `size: 16 \| 20 \| 24 \| 36 \| 48 \| 64`, also `data-size` |
| Colour | inherit (default), primary, secondary, disabled, success, warning, error, info | `tone`, default `inherit` (uses `currentColor`) |
| Fill | outlined (default), filled | `filled: boolean` (§6: filled for active and selected states) |
| Accessible name | none (decorative) or text | `label?: string` |

#### Sizes and layout

| Size | Box (width and height) |
|---|---|
| 16 | `Size-16` |
| 20 | `Size-20` |
| 24 | `Size-24` |
| 36 | `Size-36` |
| 48 | `Size-48` |
| 64 | `Size-64` |

- Padding `Space-none`. No radius, border or shadow.
- The glyph's font size equals the box size. Optical size follows the font's `opsz` axis. No line-height effect: the box is `display: inline-flex`, centred.

#### Colours

| Tone | Glyph colour |
|---|---|
| inherit (default) | `currentColor`: the parent's colour, set by the parent through its own `fg-*` or `text-*` token |
| primary | `fg-primary` |
| secondary | `fg-secondary` |
| disabled | `fg-disabled` |
| success | `fg-success` |
| warning | `fg-warning` |
| error | `fg-error` |
| info | `fg-info` |

#### States

None. `NlIcon` is not interactive. A component that contains an icon sets the icon's tone for its own states.

#### Behaviour and accessibility

- Decorative by default: `aria-hidden="true"`, no role. A screen reader hears nothing.
- With `label`: `role="img"` and `aria-label={label}`. A screen reader hears the label, for example "Warning".
- Never focusable on its own. Icon-only controls get their name from the control (`NlButton` keeps a visually hidden label, D12), not from `NlIcon`.
- Glyphs render from the self-hosted icon font. The registry only allows names that are subset into the font (§6).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Sizes | 16, 20, 24, 36, 48, 64 | Same, `Size-*` (§6, updated) | Matches |
| Colour tones | The 7 tones above, each bound to the matching foreground token | Same layer 3 tokens | Matches |
| Default tone | The reference always sets a tone, and every instance in other components overrides it | `tone="inherit"` (uses `currentColor`) is the default, so a parent such as a button or link colours the icon through its own state classes. The 7 named tones stay as options | Approved |
| Other foreground tokens | Other components colour icons with `fg-action`, `fg-brand`, `fg-hovered`, `fg-pressed`, `fg-inverse`, `fg-white_both`, `fg-disabled-on_bg` | Covered by `tone="inherit"`. The parent sets the colour. No extra tones | Approved |
| Icon source | Icons come from a linked external icon library | Material Symbols Rounded through the `nlIcons` registry (§6) | Matches §6 |

#### Spec → code

| Spec option | Code |
|---|---|
| Icon | `name: NlIconName` (required). Renders the glyph at the name's code point from `nlIcons`, also `data-icon` |
| Size | `size?: 16 \| 20 \| 24 \| 36 \| 48 \| 64`, default `24`, also `data-size`. Box `nl:size-*`, glyph `nl:icon-*` |
| Colour | `tone?: 'inherit' \| 'primary' \| 'secondary' \| 'disabled' \| 'success' \| 'warning' \| 'error' \| 'info'`, default `inherit`, also `data-tone`. Named tones `nl:text-fg-*` |
| Fill | `filled?: boolean`, default `false`, also `data-filled`. `nl:icon-filled` |
| Accessible name | `label?: string`. Without it `aria-hidden="true"`; with it `role="img"` and `aria-label` |

#### API

```tsx
import { NlIcon, nlIcons, nlIconNames, type NlIconName } from '@northline/ui';

<NlIcon name="warning" />                                  // decorative, 24, parent's colour
<NlIcon name="warning" size={20} tone="warning" label="Warning" />
<NlIcon name="check_circle" filled />                      // active or selected
```

A `<span>`. `className` is added last; other native `<span>` attributes and `ref` go to the root. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Box | `Size-16` … `Size-64` (`nl:size-*`) |
| Glyph font size | `Size-16` … `Size-64` (`nl:icon-*`, named utility in `tailwind.css`) |
| Colour | `fg-primary`, `fg-secondary`, `fg-disabled`, `fg-success`, `fg-warning`, `fg-error`, `fg-info`; `inherit` uses `currentColor` |
| Glyph weight | `Icon font weight` (300, `--nl-font-icon-weight`, through `nl:font-icon`) |

#### Build decisions

| Decision | Detail |
|---|---|
| Glyphs by code point | `nlIcons` maps each Material Symbols name to its glyph's code point, and `NlIcon` renders that glyph. Not ligature text: subsetting by ligature would keep the letters a–z and every icon spelled with them, so nearly the whole font. TypeScript checks each name against the `material-symbols` package's own name list |
| Font subset (§6) | `pnpm icons` (`packages/ui/scripts/subset-icons.mjs`, `subset-font`) subsets Material Symbols Rounded to the registry's code points, keeping all axes (FILL, wght, GRAD, opsz). 27 icons (`notifications` added for `NlNotificationButton`): 5.3 MB → 22 KB. Runs before the build, tests and Storybook; the output is not committed |
| Named utilities | `nl:font-icon` (family, icon weight, line height 1, no text transforms), `nl:icon-*` (font size from `Size-*`), `nl:icon-filled` (`FILL` 1), in `packages/ui/src/styles/tailwind.css`. The package's own `.material-symbols-rounded` class is no longer loaded (it hardcodes `24px`) |
| Optical size | The font's `opsz` axis covers 20 to 48. At 16 and 64 it uses the nearest end; the glyph still fills the box |
| Weight and grade | Weight 300 from `Alias Typography.Icon.Font weight` (`--nl-font-icon-weight`, §3.4), the designer's choice on 18 Nov 2026. Grade 0, the font default |
| Filled forms | Only glyphs with a filled form change (10 of the first 25: `calendar_today`, `cancel`, `check_circle`, `delete`, `dock_to_right`, `error`, `info`, `visibility`, `visibility_off`, `warning`) |
| Copying text | `nl:select-none`, so the private-use glyph isn't copied with the text around it |

---

### NlStatusDot

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

A small round dot that shows presence (online). Used on `NlAvatar`.

#### Anatomy

```
NlStatusDot (circle)
└── ring (outer stroke that separates the dot from what it sits on)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | xsmall, small, medium, large, xlarge | `size: 'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge'`, also `data-size` |
| Accessible name | none (decorative) or text | `label?: string` |

#### Sizes and layout

| Size | Diameter |
|---|---|
| xsmall | `Size-6` |
| small | `Size-8` |
| medium | `Size-12` |
| large | `Size-16` |
| xlarge | `Size-24` |

- Shape: `Radius-Full`.
- Ring: 1px, drawn **outside** the dot (Tailwind's 1px width, §4.2), so the outer size is the diameter plus 2.
- No padding, no shadow.

#### Colours

| Part | Token |
|---|---|
| Dot | `fg-success` |
| Ring | `fg-inverse` |

- `fg-inverse` is white in Light and `Neutral-900` in Dark, so the ring matches `bg-primary` and the dot looks cut out of the avatar.

#### States

None. Not interactive.

#### Behaviour and accessibility

- Colour alone never carries meaning. Wherever presence matters, the dot is paired with a text status ("Online") nearby, or given a `label`.
- Decorative by default: `aria-hidden="true"`.
- With `label`: `role="img"` and `aria-label={label}`. A screen reader hears, for example, "Online".
- Contrast: `fg-success` against the ring and the avatar needs 3 to 1 as a graphic (§2.6). Check this in the token audit for all brands and both themes.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Ring width | 1px stroke, outside | Tailwind's built-in 1px width (§4.2, D16) | Matches |
| Tones | The reference only has online (success) | Only success. No `tone` prop until another status (busy, away) is specified | Matches |
| Sizes | 6, 8, 12, 16, 24 | `Size-6`, `Size-8`, `Size-12`, `Size-16`, `Size-24` | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge'`, default `medium`, also `data-size`. `nl:size-6` … `nl:size-24` |
| Accessible name | `label?: string`. Without it `aria-hidden="true"`; with it `role="img"` and `aria-label` |

#### API

```tsx
import { NlStatusDot } from '@northline/ui';

<NlStatusDot />                              // decorative, medium
<NlStatusDot size="small" label="Online" />
```

An empty `<span>`. `className` is added last; other native `<span>` attributes and `ref` go to the root. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Diameter | `Size-6`, `Size-8`, `Size-12`, `Size-16`, `Size-24` (`nl:size-*`) |
| Shape | `Radius-Full` (`nl:rounded-full`) |
| Dot | `fg-success` (`nl:bg-fg-success`) |
| Ring | `border-inverse` (`nl:border nl:border-inverse`), 1px |

#### Build decisions

| Decision | Detail |
|---|---|
| Ring colour | `border-inverse` instead of `fg-inverse`: border classes only come from `border-*` tokens, and `border-inverse` has the same value as `fg-inverse` in every brand and theme (white in Light, `#0F0F13` in Dark). The designer's choice, 18 Nov 2026 |
| Ring outside | A 1px border with `nl:box-content`, so the ring sits outside the diameter and the outer size is diameter + 2 (8, 10, 14, 18, 26), measured in the browser. A box-shadow ring isn't one of the §4.2 widths |
| Default size | `medium` (`Size-12`), the size the medium and large avatars use |
| Contrast | `fg-success` on the ring: 4.92:1 in Light and 9.26:1 in Dark, all brands (needs 3:1). The ring matches `bg-primary`, so the same on the page. Against an avatar: checked with `NlAvatar` |

---

### NlCountBadge

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none (OD-4 decided).

A small pill that shows a count (1 to 99+), or a plain dot when there is no number. Used on `NlLabel` and the notification button.

#### Anatomy

```
NlCountBadge (pill)
└── count text (optional; absent in the dot form)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | small, large | `size: 'small' \| 'large'`, also `data-size` |
| Digits | none (dot), single, double | Derived from `count`: no `count` gives the dot, 1 to 9 gives single, 10 and over gives double. Over 99 shows "99+". Also `data-digits` |
| Colour | red, yellow, green | `tone: 'error' \| 'warning' \| 'success'` (§7.3) |
| Count | number | `count?: number` |
| Maximum | 99 | `max?: number`, default 99 |

#### Sizes and layout

| Size | Digits | Width | Height | Padding (block / inline) | Text style |
|---|---|---|---|---|---|
| small | none | `Size-6` | `Size-6` | – | – |
| small | single | `Size-16` | `Size-16` | `Space-none` | `Caption S` |
| small | double | hug, at least `Size-16` | `Size-16` | – / `Space-XS` | `Caption S` |
| large | none | `Size-12` | `Size-12` | – | – |
| large | single | `Size-20` | `Size-20` | `Space-none` | `Caption L` |
| large | double | hug, at least `Size-20` | `Size-20` | – / `Space-XS` | `Caption L` |

- Shape `Radius-Full`. Content centred both ways. No border, no shadow.
- Double digits have a minimum width equal to the single-digit size, `Size-16` (small) and `Size-20` (large), so "10" is never narrower than a circle (OD-4, approved 18 Nov 2026).
- Double digits keep the single-digit height, so the pill only grows wider from 9 to 10. The reference hugged the height (19 and 22, from the line height plus `Space-XXS` block padding); the designer chose the fixed height on 18 Nov 2026.

#### Colours

| Tone | Background | Text |
|---|---|---|
| error | `fg-error` | `text-inverse` |
| warning | `fg-warning` | `text-inverse` |
| success | `fg-success` | `text-inverse` |

- The background uses `fg-*` tokens on purpose. They are the solid status colours meant for small graphics.
- Dark theme: `fg-*` becomes the light 300 step and `text-inverse` becomes `Neutral-900`, so the count reads dark on light.

#### States

None. Not interactive.

#### Behaviour and accessibility

- The visible count is short. Give the meaning in text through the parent or `label`, for example "3 unread notifications". `NlCountBadge` takes `label?: string` and renders it as visually hidden text. The visible digits are `aria-hidden`.
- Without a `label` and without a count (the dot form), the badge is decorative: `aria-hidden="true"`.
- No live region by default. A parent that updates the count and needs it announced adds its own polite live region.
- Contrast: check white text on `fg-warning` (Warning-700) in Light for every brand in the token audit. Small text needs 4.5 to 1.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Large single padding | Raw 3px inline padding | Dropped. The badge is a fixed `Size-20` square with the digit centred | Approved |
| Gap and padding tokens on the small forms | Bound to a spacing collection from another library ("8px" gap, "0px" padding) | No gap is used (one child). Padding `Space-none`, as with the large form | Follows from the decision above |
| Minimum width for double digits | Not set in the reference (hug only) | `Size-16` (small) and `Size-20` (large), the existing tokens for the single-digit squares (OD-4) | Approved |
| Double-digit height | Hugs: line height + `Space-XXS` block padding (19 small, 22 large) | Fixed `Size-16` / `Size-20`, inline padding only | Approved |
| Over 99 | Reference shows "99+" | `max` prop, default 99, shows "99+" | Matches |
| Tone names | Red, yellow, green | `error`, `warning`, `success` | Matches §7.3 |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'small' \| 'large'`, default `small`, also `data-size` |
| Digits | From `count`: none, single (1 to 9), double (10 and over, and `${max}+`). Also `data-digits` |
| Colour | `tone?: 'error' \| 'warning' \| 'success'`, default `error`, also `data-tone`. `nl:bg-fg-*` |
| Count | `count?: number`. `0` renders nothing. Negative or non-whole numbers count as no number (the dot) |
| Maximum | `max?: number`, default 99. Above it shows `${max}+` |
| Meaning | `label?: string`, visually hidden text (`nl:sr-only`) |

#### API

```tsx
import { NlCountBadge } from '@northline/ui';

<NlCountBadge count={3} label="3 unread notifications" />  // small, error
<NlCountBadge size="large" tone="success" count={120} />    // shows 99+
<NlCountBadge />                                           // the dot, decorative
```

A `<span>`. `className` is added last; other native `<span>` attributes and `ref` go to the root. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Size | `Size-6`, `Size-12` (dot); `Size-16`, `Size-20` (single, and double height and minimum width) |
| Padding | `Space-none` (single); `Space-XS` inline (double) |
| Text | `Caption S` (small), `Caption L` (large); colour `text-inverse` |
| Background | `fg-error`, `fg-warning`, `fg-success` |
| Shape | `Radius-Full` |

#### Build decisions

| Decision | Detail |
|---|---|
| Defaults | `size="small"`, `tone="error"`, the usual notification badge |
| Count 0 | Renders nothing, so a parent can pass the count straight through (designer's choice, 18 Nov 2026) |
| What screen readers hear | With a `label`: the label, and the digits are hidden. Without a label: the digits ("3"). The dot without a label is hidden |
| Contrast | Text on the badge, every brand: error 6.22 (Light) / 7.56 (Dark), warning 5.00 / 12.83, success 4.92 / 9.26. All above 4.5 (token audit §10) |

---

### NlDivider

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-5.

A horizontal line that separates content. The section form is a thick band between page sections.

#### Anatomy

```
NlDivider (full-width rule)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | divider, section | `type: 'divider' \| 'section'`, default `divider`, also `data-type` |
| Semantics | separator or decorative | `decorative?: boolean`, default `false` |

#### Sizes and layout

| Type | Height | Width |
|---|---|---|
| divider | 1px (Tailwind's 1px border width, §4.2) | Fills its container |
| section | `Size-8` | Fills its container |

- No margin of its own. The parent sets spacing with its gap.
- No radius, no shadow.

#### Colours

| Type | Fill |
|---|---|
| divider | `border-default` |
| section | `border-default` |

#### States

None. Not interactive.

#### Behaviour and accessibility

- Renders `<hr>`, which carries `role="separator"`. A screen reader may announce "separator".
- `decorative` renders a `<div aria-hidden="true">` instead, for lines that are only visual (between list rows, inside menus).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Divider thickness | 1px | A 1px top border in `border-default`, using Tailwind's built-in 1px width (§4.2, D16) | Matches |
| Section divider | 8 tall, `border-default` | `Size-8`, `border-default` | Matches |
| Vertical orientation | Not in the reference | Not specified. Horizontal only for now; look again if a page needs it (OD-5) | Open |
| Width | Drawn at a 375 mobile width | Fills its container | Matches (desktop, §2.4) |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | `type?: 'divider' \| 'section'`, default `divider`, also `data-type` |
| Semantics | `decorative?: boolean`, default `false`. `false`: `<hr>` (role `separator`). `true`: `<div aria-hidden="true">` |
| Orientation | Horizontal only (OD-5) |

#### API

```tsx
import { NlDivider } from '@northline/ui';

<NlDivider />                  // 1px separator, <hr>
<NlDivider type="section" />   // Size-8 band between page sections
<NlDivider decorative />       // between list rows or menu groups, hidden from screen readers
```

An `<hr>`, or a `<div>` when `decorative`. `className` is added last; other native attributes and `ref` go to the root. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| divider | 1px top border (Tailwind's built-in width, D16) in `border-default` |
| section | Height `Size-8`, filled with `border-default` (`nl:bg-border-default`) |
| Spacing | None. The parent sets it with its gap |

#### Build decisions

| Decision | Detail |
|---|---|
| Section fill | `nl:bg-border-default`, so the spec's token is kept. First a named utility in `tailwind.css` (designer's choice, 18 Nov 2026); since `NlSwitch` the token build maps every `border-*` token to a background as well (§3.8), and the named utility was removed |
| Orientation | Horizontal only; OD-5 stays open until a page needs a vertical rule (designer's choice, 18 Nov 2026) |
| Contrast | Not checked: the line is decorative and carries no information on its own (WCAG 1.4.11 does not apply) |

---

### NlSkeleton

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none (OD-6 decided).

A grey placeholder shown while content loads. Sized to the content it stands in for.

#### Anatomy

```
NlSkeleton (filled shape)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Shape | text, rect, circle | `shape: 'text' \| 'rect' \| 'circle'`, default `text`, also `data-shape` |
| Width | fills its container by default | `className` for placement only (width), per CLAUDE.md |

#### Sizes and layout

| Shape | Height | Width | Radius |
|---|---|---|---|
| text | `Size-12` | Fills its container | `Radius-XS` |
| rect | `Size-24` | Fills its container | `Radius-S` |
| circle | `Size-24` | `Size-24` | `Radius-Full` |

- No padding, border or shadow.
- Callers resize a skeleton to match what it replaces (an avatar circle at the avatar size, a table cell at the row height).

#### Colours

| Part | Token |
|---|---|
| Fill | `bg-neutral` |

#### States

None. Not interactive.

#### Behaviour and accessibility

- Every skeleton is `aria-hidden="true"`.
- The region that is loading sets `aria-busy="true"` while skeletons show. That is the parent's job, not the skeleton's.
- Animation: opacity pulses from 100% to 60% and back, one full cycle per `--nl-duration-pulse`, with `--nl-ease-standard`, repeating while shown.
- Reduced motion: no animation. The skeleton stays at full opacity.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Width | Bound to a size primitive of 343 (a mobile content width) that doesn't exist in Northline | Fills its container | Approved |
| Pulse animation | The reference describes a pulse from 100% to 60% opacity, 1.6 s per cycle | `--nl-duration-pulse` (§5, D16) | Approved |
| Pulse easing | Not in the reference | `--nl-ease-standard` (OD-6) | Approved |
| Reduced motion | The reference says static | Static (CLAUDE.md, motion-reduce counterpart) | Matches |
| Text and rect heights | 12 and 24 | `Size-12`, `Size-24` | Matches |
| Radius | `Radius-XS`, `Radius-S`, `Radius-Full` | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Shape | `shape?: 'text' \| 'rect' \| 'circle'`, default `text`, also `data-shape` |
| Width | text and rect set no width: as blocks they fill their container. A caller narrows them with a width class in `className` (placement only) |
| Hidden from screen readers | Always `aria-hidden="true"`, not overridable. The loading region sets `aria-busy` |
| Pulse | `nl:animate-skeleton-pulse`, with `nl:motion-reduce:animate-none` |

#### API

```tsx
import { NlSkeleton } from '@northline/ui';

<div aria-busy="true">
  <NlSkeleton shape="circle" />   // Size-24 circle
  <NlSkeleton />                  // Size-12 text line, full width
  <NlSkeleton shape="rect" />     // Size-24 block, full width
</div>
```

A `<span>` with `display: block`, so it is valid inside table cells and inline content. `className` is added last; other native `<span>` attributes and `ref` go to the root. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Height | `Size-12` (text), `Size-24` (rect); circle `Size-24` square |
| Radius | `Radius-XS` (text), `Radius-S` (rect), `Radius-Full` (circle) |
| Fill | `bg-neutral` |
| Motion | `--nl-duration-pulse`, `--nl-ease-standard`; opacity 1 → 0.6 → 1 |

#### Build decisions

| Decision | Detail |
|---|---|
| Pulse | A named utility `nl:animate-skeleton-pulse` with keyframes in `packages/ui/src/styles/tailwind.css`. The 0.6 is the spec's literal value; there is no opacity token (designer's choice, 18 Nov 2026) |
| Easing | `--nl-ease-standard`, the only easing token (OD-6, approved 18 Nov 2026) |
| Width | No width class on text and rect, so a caller's width class never competes with one of ours (two classes setting the same property resolve by CSS order, not class order) |
| Circle size | Fixed at `Size-24`. Resizing it (for example to an avatar size) would compete with `nl:size-24` the same way. To be decided when `NlAvatar` or `NlTable` needs it |

---

### NlOverlay

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

The dim layer (scrim) behind dialogs and side sheets.

#### Anatomy

```
NlOverlay (full-viewport layer)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Open | shown or hidden | `open: boolean` |
| Close on click | on or off | `onClick` passed by the parent (dialog or side sheet) |

The reference's mobile type is left out (desktop only, §2.4).

#### Sizes and layout

- Fixed to the viewport, covering it fully (inset `Space-none`).
- Layer `--nl-z-overlay` (§4.3), directly below dialogs and side sheets (`--nl-z-modal`).

#### Colours

| Part | Token |
|---|---|
| Fill | `Alpha-md` |

- `Alpha-md` is `Neutral-900` at 40% in Light and Black at 60% in Dark.

#### States

| State | Look |
|---|---|
| Hidden | Not rendered |
| Shown | `Alpha-md` at full opacity |

#### Behaviour and accessibility

- Always `aria-hidden="true"`. It is never focusable and has no name.
- The parent (dialog, side sheet) owns focus trapping, Escape to close, and making the page behind inert. The overlay only draws the scrim and passes clicks to the parent.
- Fades in and out with `--nl-duration-base` and `--nl-ease-standard`. Reduced motion: appears and disappears with no fade.
- Page scrolling behind is locked by the parent while the overlay is shown.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Fill | `Alpha-md` | `Alpha-md` | Matches |
| Size | Drawn at 1920 × 1080 | Fills the viewport | Matches |
| Fade timing | Not in the reference | `--nl-duration-base`, `--nl-ease-standard` | Approved (duration). Easing follows §5's default |
| Stacking order | Not in the reference | `--nl-z-overlay` (§4.3, D16) | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Open | `open: boolean` (required), also `data-open` |
| Close on click | `onClick`, passed to the root. The parent decides what a click does |
| Hidden from screen readers | Always `aria-hidden="true"`, not overridable. Never focusable, no name |
| Hidden | Stays in the page with `display: none` (`nl:hidden`), so it can fade out. Draws nothing and takes no clicks |
| Fade | `nl:transition nl:transition-discrete`; shown fades in from 0 (`nl:starting:opacity-0`). `nl:motion-reduce:transition-none` |

#### API

```tsx
import { NlOverlay } from '@northline/ui';

<NlOverlay open={open} onClick={() => setOpen(false)} />
```

A `<div>`. `className` is added last; other native `<div>` attributes and `ref` go to the root. `'use client'`, because it takes an event handler. No portal: the parent renders it where it needs it.

#### Tokens used

| Part | Tokens |
|---|---|
| Position | Fixed, inset `Space-none` |
| Layer | `--nl-z-overlay` |
| Fill | `Alpha-md` |
| Fade | `--nl-duration-base`, `--nl-ease-standard` (the `nl:transition` defaults, §3.8) |

#### Build decisions

| Decision | Detail |
|---|---|
| Motion utilities | First component with a transition. The token build maps the motion tokens to `nl:duration-*` and `nl:ease-standard`, and makes them the defaults for every `nl:transition-*` (§3.8). No new tokens. Tailwind's default easings are removed (designer's choice, 18 Nov 2026) |
| Hidden, not removed | "Hidden: not rendered" is met with `display: none`, so it fades out as well as in, in CSS only (`@starting-style`, `transition-behavior: allow-discrete`). Browsers without these show and hide it at once (designer's choice, 18 Nov 2026) |
| `'use client'` | It takes an `onClick` handler (CLAUDE.md, React rules), though it has no state |

---

### NlProgressBar

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-9 (OD-7 and OD-8 decided).

A horizontal bar that shows how much of a task is done.

#### Anatomy

```
NlProgressBar (track)
└── fill (from the start edge, width = value)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size: 'large' \| 'small'`, default `small`, also `data-size` |
| Value | 0 to 100 | `value: number` (percent), clamped to 0 to 100 |
| Accessible name | text | `label: string` (required, see accessibility) |
| Steps | 4 or 5 in the reference | Not a prop. See "Mapping notes" |

The "with text" version is left out (D13). A caller that needs visible text places it next to the bar.

#### Sizes and layout

| Size | Track height | Fill height |
|---|---|---|
| large | `Size-8` | `Size-8` |
| small | `Size-4` | `Size-4` |

- Track width fills its container.
- Track radius `Radius-XS`. Fill radius `Radius-XS`.
- Fill width is `value`% of the track. At 0 the fill is not drawn.
- No padding, border or shadow.

#### Colours

| Part | Token |
|---|---|
| Track | `bg-active-hover` |
| Fill | `fg-brand` |

#### States

None. Not interactive. The only change is the value.

#### Behaviour and accessibility

- Renders `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow={value}` and `aria-label={label}`, or `aria-labelledby` when the caller has a visible label.
- A screen reader hears, for example, "Upload, progress bar, 50%".
- Fill width changes animate with `--nl-duration-base` and `--nl-ease-standard`. Reduced motion: no animation, the width jumps.
- Contrast: the fill against the track is a meaningful graphic and needs 3 to 1 (§2.6). Check `fg-brand` on `bg-active-hover` in all brands and both themes in the token audit.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Steps 4 and 5 | The reference draws one continuous bar at preset percentages (25, 50, 75, 100 for 4 steps; 20, 40, 60, 80, 100 for 5). There are no visible segments | No `steps` prop. `value` takes any percent. A caller with 4 steps passes 25, 50, 75, 100 | Approved |
| Fill radius | Bound to a radius token from another library ("4px") | `Radius-XS` (4) | Approved |
| Track radius | `Radius-XS` | `Radius-XS` | Matches |
| Indeterminate | Not in the reference | Not specified. `NlSpinner` covers unknown duration (OD-9) | Open |
| Animation | Not in the reference | `--nl-duration-base`, `--nl-ease-standard`, none under reduced motion (OD-7) | Approved |
| Default size | Not set in the reference | `small` (OD-8) | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'large' \| 'small'`, default `small`, also `data-size` |
| Value | `value: number`, clamped to 0 to 100; anything that isn't a number counts as 0. Sets `aria-valuenow` and the fill width |
| Accessible name | `label` or `aria-labelledby`. The type requires exactly one |
| Role | `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"` |
| Steps | No prop. A caller with 4 steps passes 25, 50, 75, 100 |

#### API

```tsx
import { NlProgressBar } from '@northline/ui';

<NlProgressBar value={50} label="Upload" />                      // small
<NlProgressBar size="large" value={75} label="Upload" />
<NlProgressBar value={20} aria-labelledby="import-caption" />    // named by visible text
```

A track `<div>` with a fill `<div>` inside. `className` is added last; other native `<div>` attributes and `ref` go to the track. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Height | `Size-4` (small), `Size-8` (large); the fill is the track's full height |
| Radius | `Radius-XS` (track and fill); the track clips the fill |
| Track | `bg-active-hover` |
| Fill | `fg-brand` |
| Motion | `--nl-duration-base`, `--nl-ease-standard` (`nl:duration-base`, `nl:ease-standard`) |

#### Build decisions

| Decision | Detail |
|---|---|
| Fill width | The width is data, so the component sets it as one custom property, `--nl-progress-value`, on the fill. A named utility `nl:progress-fill` in `packages/ui/src/styles/tailwind.css` reads it and names `width` as the transitioned property (designer's choice, 18 Nov 2026) |
| Value 0 | The fill stays in the page at width 0, which draws nothing, so 0 to any value animates |
| Indeterminate | Not built (OD-9 open). `NlSpinner` covers unknown duration |
| Contrast | `fg-brand` on `bg-active-hover`, all above 3:1. Lowest Voltic Dark 3.92 (token audit §11) |

---

### NlSlider

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-12 (OD-10 and OD-11 decided).

Picks one value along a range by dragging a thumb or using the keyboard.

#### Anatomy

```
NlSlider
├── track (full width)
│   └── fill (from the start edge to the thumb)
└── thumb (circle, centred on the end of the fill)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Value | number between `min` and `max` | `value` / `defaultValue` (controlled or uncontrolled, §7.3) |
| Range | min, max | `min` (default 0), `max` (default 100) |
| Step | number | `step` (default 1) |
| Disabled | on or off | `disabled` (native) |
| Accessible name | text | `aria-label` or `aria-labelledby` (required) |
| Change | callback | `onChange(value)` |

The reference only shows fill levels (5%, 25%, 50%, 75%, 100%). These are values, not variants.

#### Sizes and layout

| Part | Size | Radius | Other |
|---|---|---|---|
| Track | Height `Size-8`, width fills its container | `Radius-XS` | – |
| Fill | Height `Size-8` | `Radius-XS` | Padding `Space-none` |
| Thumb | `Size-24` × `Size-24` | `Radius-Full` | 2px inset stroke (Tailwind's 2px width, §4.2), shadow `--nl-shadow-resting` |

- The thumb's centre sits on the end of the fill. At the minimum the thumb is half outside the track's start. Keep half a thumb (`Space-L`) clear on both ends in layouts.
- Pointer target: the thumb is 24 × 24, which meets the 24 × 24 minimum (CLAUDE.md). The whole track also responds to clicks.

#### Colours

| Part | Enabled (reference) | Hover (proposed) | Pressed / dragging (proposed) | Focus (proposed) | Disabled (proposed) |
|---|---|---|---|---|---|
| Track | `bg-active-hover` | `bg-active-hover` | `bg-active-hover` | `bg-active-hover` | `bg-disabled` |
| Fill | `fg-brand` | `fg-hovered` | `fg-pressed` | `fg-brand` | `fg-disabled-on_bg` |
| Thumb fill | `fg-brand` | `fg-hovered` | `fg-pressed` | `fg-brand` | `fg-disabled-on_bg` |
| Thumb border | `border-inverse` | `border-inverse` | `border-inverse` | `border-inverse` | `border-inverse` |
| Thumb shadow | `--nl-shadow-resting` | `--nl-shadow-resting` | `--nl-shadow-resting` | `--nl-shadow-resting` | none |
| Focus ring | – | – | – | `border-focused` (standard ring on the thumb) | – |

The hover, pressed, focus and disabled columns were checked by the designer in Storybook and **approved** on 18 Nov 2026 (OD-10).

#### States

| State | Source | Description |
|---|---|---|
| Enabled | Reference | As drawn |
| Hover | Proposed, approved for now (Storybook check) | Pointer over the track or thumb. Fill and thumb darken one step (`fg-hovered`), like other brand-coloured controls |
| Pressed / dragging | Proposed, approved for now (Storybook check) | While the pointer is down or the thumb is dragged. `fg-pressed` |
| Focus | Proposed, approved for now (Storybook check) | Keyboard focus. Standard Northline focus ring on the thumb (CLAUDE.md, rule 5). Colours stay as enabled |
| Disabled | Proposed, approved for now (Storybook check) | Same pairing as a disabled selected switch: `bg-disabled` track, `fg-disabled-on_bg` fill and thumb. No shadow. Not focusable (§7.3) |

#### Behaviour and accessibility

- Built on native `<input type="range">`, styled. A screen reader hears the name, "slider" and the value, for example "Points, slider, 50".
- Keyboard (native):
  - Left or Down: minus one step. Right or Up: plus one step.
  - Page Down and Page Up: minus or plus 10% of the range.
  - Home and End: minimum and maximum.
- `aria-valuetext` can be set when the number needs a unit ("50 points").
- Disabled: native `disabled`, not focusable, no pointer events.
- Value changes don't animate, so there is nothing to reduce. Hover and press colour changes use `--nl-duration-fast`, with none under reduced motion.
- Contrast: the fill and thumb against the track need 3 to 1 in every brand and theme (token audit).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Interaction states | Only enabled is drawn | Hover, pressed, focus and disabled proposed above, using existing semantic tokens only (OD-10) | Approved |
| Thumb border | 2px stroke, inside | Tailwind's 2px inset ring (§4.2, D16) | Matches |
| Thumb shadow | A shadow style called "resting cards" (0 1 3, black at 5%) | `--nl-shadow-resting`, same value | Matches |
| Fill padding | `Space-none` | `Space-none` | Matches |
| Radius | `Radius-XS` (track, fill), round thumb | `Radius-XS`, `Radius-Full` | Matches |
| Range and step | Not in the reference | `min` 0, `max` 100, `step` 1 by default (OD-11) | Approved |
| Visible value or ticks | Not in the reference | Not specified. A caller shows the value next to the slider (OD-12) | Open |

#### Spec → code

| Spec option | Code |
|---|---|
| Value | `value` (controlled) or `defaultValue` (uncontrolled, default `min`), also `data-value` on the root |
| Range | `min` (default 0), `max` (default 100) |
| Step | `step` (default 1) |
| Disabled | Native `disabled`; not focusable, no pointer events; `data-disabled` on the root |
| Accessible name | `aria-label` or `aria-labelledby`. The type requires exactly one |
| Value text | `aria-valuetext`, passed to the input |
| Change | `onChange(value: number)`. Other native input events (`onInput`, `onBlur` …) pass through |

#### API

```tsx
import { NlSlider } from '@northline/ui';

<NlSlider aria-label="Points" defaultValue={50} />                               // uncontrolled
<NlSlider aria-labelledby="points-caption" value={points} onChange={setPoints} />  // controlled
<NlSlider aria-label="Points" min={0} max={500} step={10} aria-valuetext="250 points" />
```

A root `<div>` holding a native `<input type="range">` and the drawn track, fill and thumb. `ref`, `id`, `name`, `form`, `aria-*` and other native input attributes go to the input; `className` goes to the root, for placement only. `'use client'`: it keeps state when uncontrolled and handles events.

#### Tokens used

| Part | Tokens |
|---|---|
| Root | Height `Size-24`; full width |
| Track | Height `Size-8`, `Radius-XS`; `bg-active-hover`, disabled `bg-disabled` |
| Fill | Height `Size-8`, `Radius-XS`; `fg-brand`, hover `fg-hovered`, pressed `fg-pressed`, disabled `fg-disabled-on_bg` |
| Thumb | `Size-24`, `Radius-Full`; same colours as the fill; 2px inset ring `border-inverse`; `--nl-shadow-resting`, none when disabled; focus ring `border-focused` |
| Offsets | Half a thumb, `Space-L` (thumb centring and the input's reach past each end) |
| Motion | Colour changes `--nl-duration-fast` with `--nl-ease-standard`; none under reduced motion. Value changes don't animate |

#### Build decisions

| Decision | Detail |
|---|---|
| Drawn parts over a transparent input | The native input sits on top, invisible, and takes every pointer and key event. The track, fill and thumb are its siblings and follow its state with `peer-hover`, `peer-active`, `peer-focus-visible` and `peer-disabled` (designer's choice, 18 Nov 2026) |
| Pointer accuracy | The input reaches half a thumb (`Space-L`) past each end of the track and its own thumb is `Size-24`, so its thumb travels exactly the drawn track: a click or drag lands on the value under the pointer. A named variant `nl:range-thumb:` in `tailwind.css` sizes that thumb (WebKit and Firefox rules) |
| Position | The component sets `--nl-slider-value` (percent of the range) on the root; `nl:slider-fill` and `nl:slider-thumb` in `tailwind.css` read it. From the start edge |
| `defaultValue` | Defaults to `min` when not given |
| Peer marker | The class check (`scripts/lint/validate-classes.mjs`) now accepts the `nl:group` and `nl:peer` marker classes, bare or named, which produce no CSS of their own |
| Contrast | Fill and thumb on the track, all above 3:1: `fg-brand` lowest 3.92, `fg-hovered` 5.13, `fg-pressed` 6.99 (Voltic Dark). Disabled is exempt (token audit §12) |

---

### NlRadio

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

The bare radio control: a ring with a dot when selected. It has no label of its own (D13). It is used in radio list items, and on its own with a label the caller provides.

#### Anatomy

```
NlRadio (24 × 24 box)
└── ring (circle with a border)
    └── dot (shown when selected)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Selected | unselected, selected | `checked` / `defaultChecked` (native) |
| Disabled | on or off | `disabled` (native) |
| Group | name | `name` (native) |
| Value | string | `value` (native) |
| Accessible name | text | `aria-label` or `aria-labelledby`, or a wrapping `<label>` from the caller (required) |
| Change | callback | `onChange` (native) |

Hover, pressed and focus are CSS states, not props (§7.3).

#### Sizes and layout

| Part | Size | Radius | Border |
|---|---|---|---|
| Box (hit area) | `Size-24` | – | – |
| Ring | `Size-20`, centred in the box | `Radius-Full` | 2px, inside (Tailwind's 2px width, §4.2) |
| Dot | `Size-12`, centred | `Radius-Full` | – |

- Pointer target is the 24 × 24 box (CLAUDE.md minimum).

#### Colours

| State | Ring border | Ring fill | Dot |
|---|---|---|---|
| Unselected, enabled | `border-strong` | none | – |
| Unselected, hover | `border-hovered` | `bg-active` | – |
| Unselected, pressed | `border-pressed` | `bg-active-hover` | – |
| Unselected, disabled | `fg-disabled` | none | – |
| Selected, enabled | `fg-action` | none | `fg-action` |
| Selected, hover | `fg-hovered` | none | `fg-hovered` |
| Selected, pressed | `fg-pressed` | none | `fg-pressed` |
| Selected, disabled | `fg-disabled` | none | `fg-disabled` |
| Focus (any) | as the state above, plus the standard focus ring (`border-focused`) | | |

#### States

Enabled, hover, pressed, focus (keyboard only), disabled, each unselected and selected. There is no error state in the reference.

#### Behaviour and accessibility

- Built on native `<input type="radio">`, visually replaced, with the native input kept for semantics and keyboard.
- Keyboard (native radio group):
  - Tab moves into the group, to the selected radio or the first one.
  - Arrow keys move and select within the group.
  - Space selects the focused radio.
- Focus ring (required for accessibility, WCAG 2.4.7): the standard Northline ring from CLAUDE.md (rule 5: 2px outline, offset −1, `border-focused`), shown on keyboard focus only, around the 24 × 24 box. The reference doesn't draw a focused radio.
- Disabled: native `disabled`, not focusable (§7.3).
- A screen reader hears the name, "radio button", "selected" or "not selected", and the position, for example "Tier 2, radio button, not selected, 2 of 3".
- Contrast: `border-strong` on `bg-primary` must reach 3 to 1 (token audit).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Ring border width | 2px, inside | Tailwind's 2px width (§4.2, D16) | Matches |
| Disabled ring colour | `fg-disabled` (a foreground token used as a border) | Kept as `fg-disabled`. `border-disabled` (Neutral-100) is too faint to see a ring | Approved |
| Selected colours | `fg-action`, `fg-hovered`, `fg-pressed` used as both ring and dot | Same | Matches |
| Selected hover fill | The reference has no fill on selected hover, unlike unselected hover | Kept as in the reference | Matches |
| Focus state | Not drawn | Standard focus ring from CLAUDE.md, required for accessibility | Approved |
| Label | None (D13) | None. The caller labels it | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Selected | `checked` / `defaultChecked` (native) |
| Disabled | `disabled` (native); not focusable, no pointer events on the box |
| Group, value | `name`, `value` (native) |
| Accessible name | `aria-label`, `aria-labelledby` or a wrapping `<label>`. The type can't require one (a wrapping label is valid); the a11y check covers every story |
| Change | `onChange` (native) |
| Hover, pressed, focus | CSS states only (§7.3) |

#### API

```tsx
import { NlRadio } from '@northline/ui';

<label>
  <NlRadio name="tier" value="tier-2" checked={tier === 'tier-2'} onChange={(e) => setTier(e.target.value)} />
  Tier 2
</label>
<NlRadio aria-label="Tier 2" name="tier" value="tier-2" defaultChecked />
```

A Size-24 root `<span>` holding a native `<input type="radio">` and the drawn ring and dot. `ref` and native input attributes go to the input; `className` goes to the root, for placement only. No state or handlers of its own, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Box | `Size-24` |
| Ring | `Size-20`, `Radius-Full`, 2px border. Unselected `border-strong`, hover `border-hovered` + `bg-active`, pressed `border-pressed` + `bg-active-hover`, disabled `fg-disabled`. Selected `fg-action`, hover `fg-hovered`, pressed `fg-pressed`, no fill, disabled `fg-disabled` |
| Dot | `Size-12`, `Radius-Full`; `fg-action`, hover `fg-hovered`, pressed `fg-pressed`, disabled `fg-disabled` |
| Focus | Standard ring, `border-focused`, round around the box |
| Motion | Colour changes `--nl-duration-fast`; none under reduced motion |

#### Build decisions

| Decision | Detail |
|---|---|
| Drawn parts over a transparent input | The native radio covers the box, invisible, and keeps the semantics, grouping and keyboard. The root is a named group (`nl:group/radio`); the ring and dot follow the input with `group-has-checked`, `group-hover`, `group-active` and `group-has-disabled` (rule 3) |
| `fg-*` border colours | The token build now also maps `fg-*` to border colours (`nl:border-fg-action` …, §3.8), for the ring. No new tokens (designer's choice, 18 Nov 2026) |
| Focus ring shape | Round (`Radius-Full`) around the 24 × 24 box (designer's choice, 18 Nov 2026) |
| Hover and pressed values | `fg-hovered` / `border-hovered` and `fg-pressed` / `border-pressed` resolve to the same colours in every brand and theme; the selected ring uses the `fg-*` names as specified |
| Contrast | `border-strong` on `bg-primary` 4.87 (Light) / 6.36 (Dark); selected `fg-action` at least 5.73. Disabled is exempt (token audit §13) |

---

### NlSwitch

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none (OD-13a to OD-13d decided).

The bare on/off switch: a track with a sliding handle. It has no label of its own (D13). It is used in switch list items, and on its own with a label the caller provides.

#### Anatomy

```
NlSwitch (track, pill)
└── handle (circle, at the start when off and the end when on)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Selected | off (unselected), on (selected) | `checked` / `defaultChecked` |
| Size | large, small | `size: 'large' \| 'small'`, default `large`, also `data-size` |
| Disabled | on or off | `disabled` (native) |
| Accessible name | text | `aria-label` or `aria-labelledby` (required) |
| Change | callback | `onCheckedChange(checked)` |

Focused is a CSS state, not a prop (§7.3).

#### Sizes and layout

| Size | Track (w × h) | Handle | Handle inset from the track edge |
|---|---|---|---|
| large | `Size-56` × `Size-32` | `Size-24` | `Space-XS` |
| small | `Size-40` × `Size-24` | `Size-16` | `Space-XS` |

- Track radius `Radius-Full`. Handle radius `Radius-Full`.
- No border, no shadow.
- Pointer target: the track. Both sizes meet the 24 × 24 minimum.

#### Colours

| State | Track | Handle |
|---|---|---|
| Off, enabled | `fg-placeholder` | `fg-white_both` |
| On, enabled | `fg-brand` | `fg-white_both` |
| Off, disabled | `border-disabled` | `fg-disabled` |
| On, disabled | `bg-disabled` | `fg-disabled-on_bg` |
| On, hover (proposed, **needs approval**) | `fg-hovered` | `fg-white_both` |
| On, pressed (proposed, **needs approval**) | `fg-pressed` | `fg-white_both` |
| Off, hover (proposed, **needs approval**) | `fg-placeholder` (unchanged) | `fg-white_both` |
| Off, pressed (proposed, **needs approval**) | `fg-placeholder` (unchanged) | `fg-white_both` |
| Focus (any) | as above, plus the standard focus ring (`border-focused`) | |

- The "on" hover and pressed colours follow the slider: the brand fill darkens one step with `fg-hovered`, then `fg-pressed`.
- The "off" track stays `fg-placeholder` on hover and press. No existing token darkens that grey in both themes while keeping the white handle readable. `fg-secondary`, for example, becomes `Neutral-200` in Dark, and a white handle on it would fail the 3 to 1 contrast. If off-state feedback is wanted, it needs a new token. Designer to decide.

#### States

| State | Source |
|---|---|
| Off and on, enabled | Reference |
| Off and on, disabled | Reference |
| Focused | Reference draws it. Built with the standard ring from CLAUDE.md, keyboard focus only |
| Hover, pressed | Not in the reference. Proposed above, **needs approval** |

#### Behaviour and accessibility

- A native `<button type="button" role="switch" aria-checked>`.
- Keyboard: Tab to focus; Space or Enter toggles.
- A screen reader hears the name, "switch", and "on" or "off", for example "Email updates, switch, on".
- The handle slides with `--nl-duration-fast` and `--nl-ease-standard`, and hover and press colours change with `--nl-duration-fast`. Reduced motion: no slide and no colour transition.
- Disabled: native `disabled`, not focusable (§7.3).
- Contrast: the off track (`fg-placeholder`) against `bg-primary`, and the white handle against both tracks, need 3 to 1 in every brand and theme (token audit). Check the white handle on the Light `fg-brand` track for the Voltic brand especially.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Track radius | Raw 100 | `Radius-Full` | Approved |
| Handle radius | Raw 23 | `Radius-Full` | Approved |
| Handle inset | Raw positions that give 4 on each side | `Space-XS` (OD-13a) | Approved |
| Focus ring | 2px, outside, `border-focused`, round | The standard ring from CLAUDE.md (rule 5: 2px outline, offset −1, `border-focused`). It sits 1px inside the reference's position | Approved |
| Hover and pressed | Not drawn | None, on or off (OD-13b). The proposed "on" colours put the white handle at 1.39 to 2.55 in Dark; the focus ring is the feedback | Decided: none |
| Off-state disabled track | `border-disabled` (a border token used as a fill) | Kept. Same value as `bg-disabled` today (K1) | Matches |
| Slide animation | Not in the reference | `--nl-duration-fast`, `--nl-ease-standard` (OD-13c) | Approved |
| Default size | Not set | `large` (OD-13d) | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Selected | `checked` (controlled) or `defaultChecked` (uncontrolled, default off); `aria-checked`; `data-state="on" \| "off"` |
| Size | `size?: 'large' \| 'small'`, default `large`, also `data-size` |
| Disabled | `disabled` (native); not focusable |
| Accessible name | `aria-label` or `aria-labelledby`. The type requires exactly one |
| Change | `onCheckedChange(checked)`. An `onClick` that calls `preventDefault()` stops the toggle |

#### API

```tsx
import { NlSwitch } from '@northline/ui';

<NlSwitch aria-label="Email updates" defaultChecked />                              // uncontrolled, large
<NlSwitch aria-labelledby="updates-caption" checked={on} onCheckedChange={setOn} />  // controlled
<NlSwitch aria-label="Email updates" size="small" disabled />
```

A native `<button type="button" role="switch">` (the track) with the handle inside. `ref`, `className` and native button attributes go to the button. `'use client'`: it keeps state when uncontrolled and handles clicks.

#### Tokens used

| Part | Tokens |
|---|---|
| Track | Large `Size-56` × `Size-32`, small `Size-40` × `Size-24`; `Radius-Full`; padding `Space-XS` (the handle inset). Off `fg-placeholder`, on `fg-brand`; disabled off `border-disabled`, disabled on `bg-disabled` |
| Handle | Large `Size-24`, small `Size-16`; `Radius-Full`; `fg-white_both`; disabled off `fg-disabled`, disabled on `fg-disabled-on_bg` |
| Slide | Large `Space-3XL` (56 − 24 − 2 × 4), small `Space-XL` (40 − 16 − 2 × 4); mirrored right to left |
| Focus | Standard ring, `border-focused` |
| Motion | Slide `--nl-duration-fast`, `--nl-ease-standard`; track colour `--nl-duration-fast`; none under reduced motion |

#### Build decisions

| Decision | Detail |
|---|---|
| Native button | The track is the `<button role="switch">`; the handle follows it through a named group (`nl:group/switch`, rule 3) |
| No hover or pressed colours | OD-13b: neither state changes colour. The proposed "on" colours get lighter in Dark and the white handle would fall to 1.39 to 2.55 (designer's choice, 18 Nov 2026) |
| Slide distance | `Space-3XL` and `Space-XL`, worked out from the spec's sizes (designer's choice, 18 Nov 2026) |
| `border-*` as fills | The token build now also maps `border-*` to backgrounds (`nl:bg-border-disabled`, §3.8). The divider's one-off utility was removed (designer's choice, 18 Nov 2026) |
| Same values | `border-disabled` and `bg-disabled` resolve to the same colour (K1), and in Light so do `fg-disabled-on_bg` and `fg-placeholder`; the classes still follow the spec's names |
| Contrast | Off track on `bg-primary` 4.87 / 3.92; white handle on the off track 4.87, on the on track at least 5.84 (Light) and 3.04 (Dark) (token audit §14) |

---

### NlTextBlock

**Level** Atom L0 (D15) · **Base** none · **Depends on** nothing (the label is a slot) · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-2, OD-14, OD-15, OD-16, OD-41 and OD-120 decided.

A heading with an optional description under it, and an optional label slot above. It is the text part of list items, dialogs, empty states, snackbars, tooltips and cards.

#### Anatomy

```
NlTextBlock (vertical stack)
├── label slot (optional; usually NlLabel)
└── content (vertical stack)
    ├── heading (optional)
    └── description (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | display-large, display-medium, display-small, headline-large, headline-medium, headline-small | `type`, default `headline-small`, also `data-type` |
| Extra type for list rows | label (see "Mapping notes") | `type="label"` (OD-14) |
| Body text | body (OD-41), body-m (OD-238) | `type="body"`: description only, in `Body L`. `type="body-m"`: description only, in `Body M` (small checkbox text) |
| Alignment | left, center, right | `align: 'start' \| 'center' \| 'end'`, default `start`, also `data-align` |
| Show label | on or off | `label?: ReactNode` (slot, D15). Usually `<NlLabel>` |
| Show heading | on or off | `heading?: ReactNode` (text) |
| Show description | on or off | `description?: ReactNode` (text) |
| Colour tone | default, inverse | `tone`, default `default`. Inverse is for dark surfaces such as tooltips |
| Heading element | h1 to h6, or plain text | `headingAs?: 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'p' \| 'span'`, default `p`. See "Behaviour and accessibility" |

#### Sizes and layout

| Type | Heading text style | Description text style | Gap heading → description |
|---|---|---|---|
| display-large | `Display Large-H1` | `Body L` | `Space-M` |
| display-medium | `Display Medium-H2` | `Body L` | `Space-M` |
| display-small | `Display Small-H3` | `Body M` | `Space-M` |
| headline-large | `Headline Large-H4` | `Body M` | `Space-M` |
| headline-medium | `Headline Medium-H5` | `Body M` | `Space-XS` |
| headline-small | `Headline Small-H6` | `Body M` | `Space-XS` |
| label (proposed) | `Label M` | `Body S` | `Space-none` |

- Gap label slot → content: `Space-none`.
- Padding `Space-none`. Width fills its container. Text wraps (no truncation by default).
- Alignment sets both the text alignment and the cross-axis alignment of the label slot.

#### Colours

| Part | Token |
|---|---|
| Heading | `text-primary` (`tone="inverse"`: `text-inverse`) |
| Description | `text-secondary` (`tone="inverse"`: `text-inverse`) |
| Label slot | Set by what's passed in (`NlLabel` uses `text-tertiary`) |

#### States

None. Not interactive. A parent that is disabled (a disabled list row, for example) recolours the text through its own state, not through a prop here. See "Mapping notes".

#### Behaviour and accessibility

- The visual type and the document heading level are separate. `type` only sets the look. `headingAs` sets the element, so a page can keep a correct heading outline (one `h1`, no skipped levels).
- Default element `p`: most text blocks (list rows, cards) are not document headings. Dialogs, side sheets and page headers pass the level they need.
- Description is a `p`. The label slot renders before the heading in DOM order, so a screen reader reads label, heading, description.
- No truncation by default. A parent that clamps lines must expose the full text (for example with `title` or a tooltip).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Label | A fixed label component inside the text box, shown or hidden | A slot (`label`), D15 | Approved (D15) |
| List row text styles | List items override the heading to `Label M` and the description to `Body S` (small rows), or keep `Headline Small-H6` and `Body M` (large rows), all with the label hidden | Overrides can't be done from outside (CLAUDE.md: `className` is for placement only). One extra `type="label"` with `Label M` / `Body S` and gap `Space-none`. Large rows use `headline-small` (OD-14) | Approved |
| Gap for the label type | List rows show no gap between title and description | `Space-none` (OD-14) | Approved |
| Disabled text colour | Disabled list rows recolour the text | A `disabled?: boolean` prop that switches heading and description to `text-disabled`. A parent can't restyle internals (OD-15) | Approved |
| Heading element | The reference only sets the look | `headingAs`, default `p` (OD-16) | Approved |
| Inverse colours | The rich tooltip overrides both texts to `text-inverse` | `tone="inverse"` | Approved |
| Gaps per type | `Space-M` (H1 to H4), `Space-XS` (H5, H6), `Space-none` between label and content | Same | Matches |
| Body type | A checkbox gets `Body L` from the largest display type with only the description | `type="body"`: description in `Body L`, no heading (OD-41, option b) | Approved |
| Label `Body M` pairing | The side nav user row pairs `Label M` with `Body M` | Not built. Decided with `NlSideNavUser` (OD-120) | Open |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | `type`: `display-large`, `display-medium`, `display-small`, `headline-large`, `headline-medium`, `headline-small` (default), `label`, `label-body`, `body`, `body-m`; also `data-type` |
| Alignment | `align?: 'start' \| 'center' \| 'end'`, default `start`, also `data-align` |
| Label | `label?: ReactNode` (slot) |
| Heading | `heading?: ReactNode`. Not accepted with `type="body"` or `"body-m"` |
| Description | `description?: ReactNode`, a `<p>` |
| Tone | `tone?: 'default' \| 'inverse'`, also `data-tone` |
| Heading element | `headingAs?: 'h1' … 'h6' \| 'p' \| 'span'`, default `p`. Not accepted with `type="body"` or `"body-m"` |
| Disabled | `disabled?: boolean`; overrides the tone |

#### API

```tsx
import { NlTextBlock } from '@northline/ui';

<NlTextBlock heading="Track day voucher" description="Reward X for members in Tier 2." />
<NlTextBlock type="headline-large" headingAs="h2" heading="Rewards" />
<NlTextBlock type="label" heading="Member 0042" description="Tier 2" disabled />
<NlTextBlock type="body" description="Send me offers by email." />
<NlTextBlock tone="inverse" label={<NlLabel>New</NlLabel>} heading="Tip" description="…" />
```

A root `<div>` stack: label slot, then a content stack with the heading and the description. Parts that aren't given aren't rendered. `className` and native attributes go to the root. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Heading | `Display Large-H1` … `Headline Small-H6`, `Label M` (label type) |
| Description | `Body L` (display-large, display-medium, body), `Body M` (display-small to headline-small, label-body, body-m), `Body S` (label) |
| Gaps | `Space-M` (H1 to H4), `Space-XS` (H5, H6), `Space-none` (label, label-body, body, body-m; and label slot → content) |
| Colour | Heading `text-primary`, description `text-secondary`; inverse `text-inverse`; disabled `text-disabled` |

#### Build decisions

| Decision | Detail |
|---|---|
| Body type | Option (b) of OD-41: `type="body"` says what it means. The type takes no `heading` or `headingAs`, so no heading style is invented (designer's choice, 18 Nov 2026) |
| OD-120 | `type="label-body"` (added 20 Nov 2026): Label M heading, Body M description, gap `Space-none`. Used by `NlListItemBase appearance="nav"` (`NlSideNavUser`) |
| OD-238 | `type="body-m"` (added 22 Nov 2026): a `Body M` description with no heading, gap `Space-none`. Used by `NlCheckbox size="small"` (OD-237) |
| Disabled text contrast | `text-disabled` is under 4.5:1 by design and exempt as part of an inactive control (WCAG 1.4.3). Accepted as known issue K3; the Disabled story's sample is marked for the contrast check (designer's choice, 18 Nov 2026) |
| Label slot story | `NlLabel` (#30) isn't built yet, so the stories pass plain text in the slot |

---

### NlMenu

**Level** Atom L0 (D15: rows, header and footer are slots) · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none (OD-17 to OD-21 decided).

The floating surface for every menu: action menus, select options, filters and navigation. It draws the panel, an optional sticky header and footer, and the scrolling content between them. What goes inside is passed in.

#### Anatomy

```
NlMenu (floating panel, clipped)
├── header (optional, sticky at the top)
│   └── header slot (for example NlSearchField)
├── content slot (scrolls; rows such as NlListItem, NlDivider between groups, or buttons)
└── footer (optional, sticky at the bottom)
    └── footer slot (for example two NlButtons, right aligned)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Content | rows | `children` (slot) |
| Show header | off (default) or on | `header?: ReactNode` (slot) |
| Show footer | off (default) or on | `footer?: ReactNode` (slot) |
| Kind | action, select, filter, navigation | `kind`, default `action`, also `data-kind`. Sets role and keyboard (see below) |
| Open | shown or hidden | `open: boolean`, `onOpenChange(open)` |
| Anchor | the trigger element | `anchorRef` |
| Maximum height | up to the window | `maxHeight?` as a `Size-*` token name. See "Mapping notes" |
| Accessible name | text | `aria-label` or `aria-labelledby` (usually the trigger) |

The reference has one type ("Normal"), so there is no visual variant.

#### Sizes and layout

| Part | Layout |
|---|---|
| Panel | Vertical stack, gap `Space-none`, padding `Space-none`. Radius `Radius-M`. Content clipped to the radius |
| Header | Padding `Space-L` all round. 1px bottom border (§4.2). Stays at the top while the content scrolls |
| Content | Gap `Space-none`, padding `Space-none`. Scrolls vertically when the panel reaches its maximum height |
| Footer | Padding `Space-XL` all round. Its slot is a horizontal row, gap `Space-M`, aligned to the end. 1px top border (§4.2). Stays at the bottom |

- Width: fits the content, never narrower than the trigger.
- Placement: `Space-XS` from the trigger, below it, flipping above when there isn't room. Keeps `Space-M` from the window edge.
- Height: up to the window height minus the edge gap, or `maxHeight`. The content scrolls, not the header or footer.
- Layer: `--nl-z-menu` (§4.3).
- Shadow: `--nl-shadow-menu`.

#### Colours

| Part | Token |
|---|---|
| Panel background | `bg-primary` |
| Panel border (1px, inside) | `border-subtle` |
| Header bottom border | `border-subtle` |
| Footer top border | `border-subtle` |

#### States

| State | Look |
|---|---|
| Closed | Not rendered |
| Open | As above. Opens and closes with an opacity fade, `--nl-duration-base`, `--nl-ease-standard`. Reduced motion: no fade |

Rows inside carry their own hover, selected and disabled states.

#### Behaviour and accessibility

| Kind | Role on the content | Keyboard |
|---|---|---|
| action | `role="menu"`, rows `menuitem` | Up and Down move between rows (wrapping), Home and End go to the first and last, Enter or Space activates and closes, typing a letter jumps to the next row starting with it |
| select | `role="listbox"`, rows `option` with `aria-selected` (multi-select adds `aria-multiselectable`) | As action. Enter or Space selects. Single select closes on select |
| filter | A non-modal dialog (`role="dialog"`) | Tab moves through the header, rows and footer. The menu stays open until the footer's apply or reset, Escape or a click outside |
| navigation | `role="menu"`, rows are links (`menuitem` on the link) | As action. Enter follows the link |

For all kinds:
- Escape closes and returns focus to the trigger. A click outside closes.
- On open, focus goes to the selected row (select), the first row (action, navigation), or the first field in the header (filter).
- The trigger has `aria-haspopup` (`menu`, `listbox` or `dialog`), `aria-expanded` and `aria-controls`.
- Dividers between groups are decorative (`NlDivider decorative`). Use `role="group"` with a name for labelled groups.
- Disabled rows are skipped by the arrow keys and announced as unavailable (`aria-disabled`).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Shadow | A style called "sticky" (0 −2 16, black at 8%). The reference's description says code uses a "menu" shadow with the same values | `--nl-shadow-menu` (OD-17) | Approved |
| Placement, flip, edge gap, width, height | From the reference's component description, not drawn: `Space-XS` from the trigger, flips, `Space-M` from the edge, at least the trigger's width, up to the window height | Same (OD-18) | Approved |
| Kinds and roles | The reference's description names four kinds (action, select, filter, navigation), set only in code | `kind` prop with the roles and keyboard above (OD-19) | Approved |
| Maximum height | "up to the window or a max height" | `maxHeight` takes a `Size-*` token name, so there are no raw numbers (OD-20) | Approved |
| Open and close motion | Not in the reference | Fade, `--nl-duration-base` (§5: menus) (OD-21) | Approved |
| Layer | Not in the reference | `--nl-z-menu` (§4.3) | Matches §4.3 |
| Slots | Header, content and footer are slots in the reference | Slots (D15) | Approved |
| Tab in action, select and navigation menus | Not in the reference | Tab closes the menu and focus moves on | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Content | `children` (slot): rows with `role="menuitem"` (action, navigation) or `role="option"` (select), usually `tabIndex={-1}`. The menu finds rows by role |
| Header, footer | `header?`, `footer?` (slots). The footer slot is laid out as an end-aligned row |
| Kind | `kind`: `action` (default), `select`, `filter`, `navigation`, also `data-kind`. Content role `menu`, `listbox`, `menu`; filter makes the panel a non-modal `dialog` |
| Multiple select | `multiple?: boolean` (select only): `aria-multiselectable`, selecting doesn't close |
| Open | `open`, `onOpenChange(open)`, also `data-open` |
| Anchor | `anchorRef` (the trigger). `data-placement` shows `bottom-start` or `top-start` |
| Maximum height | `maxHeight?`: `'24'` … `'320'` (Size-* names) |
| Accessible name | `aria-label` or `aria-labelledby`, on the element that carries the role. The type requires one |
| `id` | On the element that carries the role (default from `useId`), for the trigger's `aria-controls` |
| Trigger | `nlMenuTriggerProps({ kind, open, menuId })` returns `aria-haspopup`, `aria-expanded`, `aria-controls` |

#### API

```tsx
import { NlMenu, nlMenuTriggerProps } from '@northline/ui';

const anchorRef = useRef<HTMLButtonElement>(null);
<button ref={anchorRef} onClick={() => setOpen(!open)} {...nlMenuTriggerProps({ kind: 'action', open, menuId: 'member-menu' })}>
  Member actions
</button>
<NlMenu id="member-menu" aria-label="Member actions" open={open} onOpenChange={setOpen} anchorRef={anchorRef}>
  {rows}
</NlMenu>
```

A panel `<div>` (header, content, footer). Render it right after its trigger, so Tab out of the menu continues from there. `className` and other native attributes go to the panel. `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Panel | `bg-primary`, 1px `border-subtle` (inside), `Radius-M`, `--nl-shadow-menu`, `--nl-z-menu` |
| Header | Padding `Space-L`, bottom border `border-subtle` |
| Footer | Padding `Space-XL`, top border `border-subtle`; row gap `Space-M` |
| Content | Gap and padding `Space-none` |
| Placement | `Space-XS` from the trigger, `Space-M` from the window edge (read from the tokens at run time) |
| Maximum height | `maxHeight` (Size-*), and never more than the room left in the window |
| Motion | Fade with `--nl-duration-base`, `--nl-ease-standard`; none under reduced motion |

#### Build decisions

| Decision | Detail |
|---|---|
| Positioning | `@floating-ui/dom` 1.8.0, a new runtime dependency (designer's choice, 18 Nov 2026): below the trigger, flip, shift, size, and it follows scroll and resize. The measured values go to `nl:menu-position` in `tailwind.css` as custom properties. The library build keeps it as an import (not bundled), so consumers install one copy |
| Rows by role | The menu moves focus between the rows it finds by role, skipping `aria-disabled` rows. Rows don't need to know the menu; `NlListItem` will plug in later |
| Activation | Enter or Space clicks the focused row. A click on an enabled row closes the menu (action, navigation, single select) and returns focus to the trigger |
| Trigger helper | `nlMenuTriggerProps` instead of the menu changing the caller's trigger (designer's choice, 18 Nov 2026) |
| Hidden until positioned | The panel is invisible until its first position is measured, so it never flashes at the window corner. Focus moves in after that, because hidden elements can't take focus |
| Closed | Stays in the page with `display: none` (like `NlOverlay`), so it fades out as well as in |

#### Placement (added 20 Nov 2026)

`placement?: 'bottom-start' | 'top-start' | 'end-start' | 'end-end'`, default `bottom-start`. `end-start` opens the menu beside its trigger at the end (right, or left in right-to-left), aligned to its top: the minimized `NlNavItem` (OD-118). `top-start` opens it above the trigger (expanded `NlSideNavUser`); `end-end` beside it at the end, aligned to its bottom (minimized `NlSideNavUser`) (OD-193, 20 Nov 2026). Each flips to the other side when there isn't room; the window margins and the minimum width (the trigger's) work as before.

`returnFocusRef?` (added 20 Nov 2026, `NlSelect` #70): where focus goes back on close when the anchor can't take it (`NlSelect` anchors to the box and returns focus to the field inside).

`initialFocus?: 'rows' | 'header'` (added 20 Nov 2026, `NlMultiSelect` #71, OD-205): `header` puts focus in the header's first field on open (a search); Down from the header moves to the first row.

`initialFocusSelector?: string` and `matchAnchorWidth?: boolean` (added 20 Nov 2026, `NlDateField` #72, OD-207, OD-208): a selector for the element to focus on open (falls back to the usual order), and `false` to size the menu to its content instead of at least the trigger's width.

---


### NlChipGroup

**Level** Atom L0 (D15: chips are slot content) · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-22, OD-23.

Lays out a row of chips with even spacing. Used for filter chips above a table.

#### Anatomy

```
NlChipGroup (horizontal row)
└── chips slot (NlFilterChip, NlAssistChip or NlInputChip)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Chips | any chips | `children` (slot) |
| Wrap | single line (reference) or wrap | `wrap?: boolean`, default `false`. See "Mapping notes" |
| Group semantics | plain row, or a named group | `aria-label` or `aria-labelledby` (optional). When given, the row gets `role="group"` |
| Selection model | none, single, multiple | `selection?: 'none' \| 'single' \| 'multiple'`, default `none`. See "Behaviour and accessibility" |

#### Sizes and layout

- Horizontal row, gap `Space-M`, padding `Space-none`.
- Items centred on the cross axis.
- Width hugs the chips. With `wrap`, rows wrap and the gap between rows is `Space-M` too.

#### Colours

None of its own. Transparent background.

#### States

None of its own. Each chip has its own states.

#### Behaviour and accessibility

- `selection="none"`: chips are independent toggle buttons (`aria-pressed`). Tab moves through each chip.
- `selection="single"`: the group is `role="radiogroup"` and chips act as radios. Arrow keys move and select. One tab stop.
- `selection="multiple"`: chips are toggle buttons with `aria-pressed`. Tab moves through each.
- With a name, a screen reader hears it when entering the group, for example "Status filters, group".

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Gap | `Space-M` | `Space-M` | Matches |
| Wrap | Single line, no wrap | Single line by default. `wrap` is an added option for narrow tables | **Needs approval** |
| Selection model | Not in the reference (the chips only show selected or not) | `selection` prop above | **Needs approval** |
| Variant property | One meaningless "Default" variant | No variant prop | Matches |

---

### NlAppShell

**Level** Atom L0 (D15: nav, header and content are slots) · **Base** none · **Depends on** nothing · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-24, OD-25, OD-26, OD-135, OD-235 and OD-236 decided.

The page frame for every admin screen: side nav on the left, and on the right a rounded content panel holding the page header and the scrolling page content. It also provides the skip link.

#### Anatomy

```
NlAppShell (full window, horizontal)
├── skip link (hidden until focused)
├── nav slot (NlSideNav, full height)
└── panel area
    └── panel (rounded, clipped)
        ├── header slot (NlPageHeader, stays at the top)
        └── content slot (the page; the only part that scrolls)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Nav | slot | `nav: ReactNode` |
| Header | slot | `header?: ReactNode` |
| Content | slot | `children` |
| Skip link | off (default) or on | `skipLink?: boolean` |
| Skip link text | text | `skipLinkLabel?: string`, default "Skip to content" |

#### Sizes and layout

| Part | Layout |
|---|---|
| Shell | Fills the window. Horizontal, gap `Space-none`. The window itself never scrolls |
| Nav slot | Full height. Width is set by the nav (expanded or minimized), not by the shell |
| Panel area | Fills the remaining width. Padding `Space-M` top, right and bottom, `Space-none` on the left |
| Panel | Fills the panel area. Radius `Radius-L`, content clipped. Vertical stack: header slot, then content slot, with a `Space-XS` gap between them that shows the page background (OD-135, decided with `NlPageHeader` #76, 20 Nov 2026) |
| Content slot | Fills the rest of the panel and scrolls vertically. Padding `Space-3XL` all round. Page blocks are `Space-4XL` apart (the page sets that gap) |
| Skip link | Positioned at the top left above everything. Pill: padding `Space-M` (block) and `Space-XL` (inline), `Radius-Full`, text `Label M`, shadow `--nl-shadow-menu` |

- Widths (§3.7): from `Breakpoint-1280` the nav is expanded; below it the nav is minimized. The nav owns this. The shell only gives it full height.

#### Colours

| Part | Token |
|---|---|
| Page background (behind nav and panel) | `bg-secondary` |
| Panel | `bg-primary` |
| Skip link pill | `bg-primary` |
| Skip link text | `text-action` |
| Skip link focus ring | `border-focused` |
| Content focus ring (when the scrolling content takes focus) | `border-focused` |

#### States

| Part | State | Look |
|---|---|---|
| Skip link | Not focused | Visually hidden (still in the tab order) |
| Skip link | Focused | Shown as the pill, with the standard focus ring |
| Content | Focused (keyboard) | 2px ring drawn **inside** the panel, `border-focused`, because the content scrolls |

#### Behaviour and accessibility

- Landmarks: the nav slot is wrapped in `<nav>` only if the nav doesn't render its own (NlSideNav does). The header slot sits in `<header>`, the content in `<main id>`.
- Skip link: the first tab stop. Activating it moves focus to `<main>` (which has `tabIndex={-1}`).
- Only the content scrolls. The header and nav stay in place. The scrolling content is focusable by keyboard (`tabIndex={0}` with a name, or the `<main>` itself) so keyboard users can scroll it, and it shows the inside focus ring.
- No layout shift when the nav changes width. The panel area flexes.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Nav and header | Fixed side menu and page header inside the shell | Slots (D15) | Approved (D15) |
| Content padding and block gap | From the reference's component description: `Space-3XL` padding, `Space-4XL` between blocks | Same: `Space-3XL` padding; the page sets the `Space-4XL` block gap | Approved (OD-24) |
| Skip link focus ring | 2px `border-focused`, drawn 2 outside the pill (an outer frame with `Space-XS` padding) | The standard ring from CLAUDE.md (2px, offset −1), as for the switch | Approved (OD-25) |
| Content focus ring | From the description: 2px `border-focused` inside | 2px `border-focused` `outline-2` with a −2 offset: fully inside the panel and drawn on top of the content (an inset box-shadow would sit under blocks with their own fill) | Approved (OD-26) |
| Skip link position and layer | "Top left above everything" | `Space-M` from the top and start edges, `--nl-z-snackbar` | Approved (OD-235) |
| Nav landmark | Wrap in `<nav>` unless the nav renders its own | Never wrapped; the nav slot provides its `<nav>` (`NlSideNav` does) | Approved (OD-236) |
| Panel gap | `Space-XS` showing the page background (OD-135) | The panel has no fill; the header (`NlPageHeader`, `bg-primary`) and `<main>` (`bg-primary`) carry it, and the panel's clipping rounds the outer corners | Matches |
| Nav widths and breakpoint | The description gives nav widths and switches at 1280 | The nav's own spec. The shell only uses `Breakpoint-1280` as guidance | Matches §3.7 |
| Skip link text | Reference copy | "Skip to content" (generic, sentence case) | Matches |
| Shadow | A "menu" shadow | `--nl-shadow-menu` | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Shell | `h-dvh`, full width, row, gap `Space-none`, `bg-secondary`, `overflow-hidden` |
| Nav slot | `nav` in a full-height wrapper; no landmark added |
| Panel area | Fills the rest; `Space-M` top, end and bottom, none at the start; flexes with the nav |
| Panel | `Radius-L`, clipped, column, gap `Space-XS`, no fill |
| Header slot | `header` in `<header>` (doesn't scroll) |
| Content | `children` in `<main id tabIndex={0}>`: fills the rest, scrolls, `Space-3XL` padding, `bg-primary`, inside focus ring |
| Skip link | `skipLink` (off by default), `skipLinkLabel` ("Skip to content"): a fixed wrapper (`Space-M` from top and start, `--nl-z-snackbar`) → a span that is `sr-only` until focused within → the pill link (`Space-M` / `Space-XL`, `Radius-Full`, Label M `text-action`, `bg-primary`, `--nl-shadow-menu`, standard ring); activating it focuses `<main>`. `mainId` sets the target id |

#### API

```tsx
import { NlAppShell, NlPageHeader, NlSideNav } from '@northline/ui';

<NlAppShell skipLink nav={<NlSideNav items={items} currentHref={pathname} />} header={<NlPageHeader title="Rewards" />}>
  {page}
</NlAppShell>
```

Props: `nav`, `header?`, `children?`, `skipLink?`, `skipLinkLabel?`, `mainId?`, `className?`. `'use client'` (the skip link's focus move).

#### Tokens used

`Space-none`, `Space-XS`, `Space-M`, `Space-XL`, `Space-3XL`; `Radius-L`, `Radius-Full`; `bg-secondary`, `bg-primary`; `text-action`; `border-focused` (rings); Label M; `--nl-shadow-menu`; `--nl-z-snackbar`.

Checked in Chrome: axe clean in every brand and theme; the skip link is the first tab stop, shows as the pill, and moves focus to `<main>`; only the content scrolls (End scrolls it, the window stays put) with the inside ring.

---

### NlCalendarDay

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Internal** (used only by `NlCalendar`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-27 and OD-28 decided 19 Nov 2026.

One day cell in the calendar grid: a 40 × 40 button with the day number. It also draws the range band when it is part of a selected range.

#### Anatomy

```
NlCalendarDay (cell, 40 × 40; draws the range band)
└── day (button, 40 × 40, rounded)
    └── number
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Day | number | `day: number` |
| Type | default, today, outside, selected, range-start, range-middle, range-end, disabled | `type`, also `data-type` |
| Today | combines with the other types | `today?: boolean` (see "Mapping notes") |
| Date | the full date | `date: string` (ISO), passed back in `onSelect` |
| Accessible name | the full date as text | `label: string`, formatted by `NlCalendar` ("Monday 3 March") |
| Select | callback | `onSelect(date)` |

Hover and pressed are CSS states, not props (§7.3).

#### Sizes and layout

| Part | Size | Radius | Other |
|---|---|---|---|
| Cell | `Size-40` × `Size-40` | none, except range-start (`Radius-S` on the start corners) and range-end (`Radius-S` on the end corners) | Padding `Space-none` |
| Day | `Size-40` × `Size-40` | `Radius-S` | Number centred. Today: 1px inside border (§4.2) |
| Number | – | – | Text style `Body M` |

#### Colours

**Cell (range band)**

| Type | Cell background |
|---|---|
| range-start, range-middle, range-end | `bg-active` |
| all others | none |

**Day**

| Type | Enabled | Hover | Pressed | Number |
|---|---|---|---|---|
| default | none | `bg-secondary` | `bg-tertiary` | `text-primary` |
| today | none, border `border-strong` | `bg-secondary`, border `border-strong` | `bg-tertiary`, border `border-strong` | `text-primary` |
| outside (another month) | none | `bg-secondary` | `bg-tertiary` | `text-tertiary` |
| selected | `bg-action-primary` | `bg-action-primary_hovered` | `bg-action-primary_pressed` | `text-white_both` |
| range-start | `bg-action-primary` | `bg-action-primary_hovered` | `bg-action-primary_pressed` | `text-white_both` |
| range-middle | none (on the band) | `bg-active-hover` | `bg-active-hover` | `text-primary` |
| range-end | `bg-action-primary` | `bg-action-primary_hovered` | `bg-action-primary_pressed` | `text-white_both` |
| disabled | none | none | none | `text-disabled` |

**Focus (any enabled type):** the standard ring from CLAUDE.md, `border-focused`, keyboard only.

#### States

Enabled, hover, pressed and focus for every type except disabled. Disabled has only its resting look.

#### Behaviour and accessibility

- The day is a `<button>` inside a grid cell (`role="gridcell"`). `NlCalendar` owns the grid, the roving tab index and arrow-key movement.
- Accessible name: the full date, for example "Monday 3 March". Selected days add `aria-selected="true"` on the cell. Today adds `aria-current="date"`.
- Disabled: `aria-disabled="true"` and not selectable. It stays reachable by arrow keys so the grid has no holes (the calendar decides this; see `NlCalendar`).
- Range middle: announced as selected, part of the range.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Today combined with selected or in-range | The reference draws "today" only as its own type | `today` is a separate boolean, so today can also be selected or in a range. The border shows on top of any type except the filled ones (selected, range-start, range-end), where the fill is enough. On a disabled day it is `border-disabled` | Approved (OD-27) |
| Focus ring | From the description: 2px `border-focused`, 2 outside | The standard ring from CLAUDE.md (offset −1), as for the switch and app shell | Approved (OD-28) |
| One-day range | Not drawn | `NlCalendar` passes `selected` (no band) | Designer's choice, 19 Nov 2026 |

#### Spec → code

| Spec option | Code |
|---|---|
| Day | `day: number`, the visible number |
| Type | `type?: 'default' \| 'outside' \| 'selected' \| 'range-start' \| 'range-middle' \| 'range-end' \| 'disabled'`, default `default`, `data-type` on the cell |
| Today | `today?: boolean`: `aria-current="date"`, inset ring `border-strong` (not on filled types; `border-disabled` when disabled), `data-today` |
| Date | `date: string` (ISO), passed to `onSelect(date)` |
| Accessible name | `label: string` on the button (`aria-label`); it contains the visible number (WCAG 2.5.3) |
| Select | `onSelect?(date)` on click, Enter or Space; never for a disabled day |
| Roving focus | `tabIndex`, `ref`, `onKeyDown` and other button attributes go to the button, for `NlCalendar` |
| Cell | `<div role="gridcell">`, `aria-selected="true"` for selected and range types, draws the band |
| Disabled | `aria-disabled="true"` (not native `disabled`), stays focusable, no state colours |

#### API

```tsx
import { NlCalendarDay } from '../NlCalendarDay'; // internal, not exported from @northline/ui

<NlCalendarDay day={3} date="2027-03-03" label="Wednesday 3 March" onSelect={select} />
<NlCalendarDay day={4} date="2027-03-04" label="Thursday 4 March" type="range-middle" today />
```

`'use client'` (click handler).

#### Tokens used

The "Sizes and layout" and "Colours" tables, as written: `Size-40`, `Space-none`, `Radius-S` (day; band start or end corners as logical corners), Body M, `bg-active`, `bg-secondary`, `bg-tertiary`, `bg-active-hover`, `bg-action-primary` (+ hovered, pressed), `text-primary`, `text-tertiary`, `text-white-both`, `text-disabled`, `border-strong`, `border-disabled`, the standard focus ring, Duration fast.

#### Build decisions

| Decision | Detail |
|---|---|
| States | The button is never natively disabled, so enabled types use the usual `enabled:hover:` / `enabled:active:`; the disabled type has no state classes at all (no rule 9 exception needed) |
| Band corners | `rounded-s-s` / `rounded-e-s` (logical), so right-to-left works |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |

Checked in the browser: cells and days 40 × 40; the band joins start, middle and end with 8 (`Radius-S`) on the outer corners. The band (`bg-active`) against `bg-primary` is 1.16 to 1.19 in Light and 1.00 to 1.06 in Dark, so in Dark it is close to invisible: known issue K6, kept as specified (accepted 19 Nov 2026).
| Range-middle pressed | Same as hover (`bg-active-hover`) | Same | Matches |
| Size | `Size-40` | `Size-40` | Matches |
| Radius | `Radius-S` | `Radius-S` | Matches |

---

### NlListCaption

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Internal** (used only by `NlListItem`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-29 decided 19 Nov 2026.

Short trailing text in a list row, such as a date, a count or a points value.

#### Anatomy

```
NlListCaption
└── text
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | small, medium, large | `size`, default `medium`, also `data-size` |
| Weight | heavy, light | `weight: 'heavy' \| 'light'`, default `heavy` (Label styles; designer's choice, 19 Nov 2026), also `data-weight` |
| Text | text | `children` |

#### Sizes and layout

| Size | Heavy text style | Light text style |
|---|---|---|
| small | `Label S` | `Body S` |
| medium | `Label M` | `Body M` |
| large | `Label L` | `Body L` |

- Padding `Space-none`. Single line, no wrapping. Width hugs the text. Vertically centred in the row.

#### Colours

| Part | Token |
|---|---|
| Text | `text-tertiary` |

#### States

None of its own. In a disabled row, the row switches it to `text-disabled` (see `NlListItem`).

#### Behaviour and accessibility

- Plain text (`<span>`). Read after the row's title and description.
- Don't use it as the only place important information appears. It's tertiary, lower-emphasis text.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Gap | A raw 10 gap with a single child (no effect) | No gap | Matches |
| Disabled colour | Not drawn | `text-disabled` when the row is disabled, set through a `disabled` prop passed by the row | Approved (OD-29) |
| Defaults | Not given | `size="medium"`, `weight="heavy"` (Label M): captions use Label, not Body, by default | Designer's choice, 19 Nov 2026 |
| Long text | Not drawn | One line, never truncated: a long caption narrows the row's title. Captions are meant to be short | Approved, 19 Nov 2026 |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'small' \| 'medium' \| 'large'`, default `medium`, `data-size` |
| Weight | `weight?: 'heavy' \| 'light'`, default `heavy`, `data-weight` |
| Text | `children` |
| Disabled | `disabled?: boolean` (set by the row): `text-disabled`, `data-disabled` |
| Element | `<span>`; `ref` and attributes pass through; `className` (placement only) appended last |

#### API

```tsx
import { NlListCaption } from '../NlListCaption'; // internal, not exported from @northline/ui

<NlListCaption>250 pts</NlListCaption>
<NlListCaption size="small" weight="light" disabled>19 Nov</NlListCaption>
```

Presentational (no `'use client'`).

#### Tokens used

Label S / M / L (heavy), Body S / M / L (light), `text-tertiary`, `text-disabled`, `Space-none`.

#### Build decisions

| Decision | Detail |
|---|---|
| Layout | `whitespace-nowrap` and `shrink-0`: one line, keeps its width in the row |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |

Checked in the browser: heavy 12 / 14 / 16 at weight 500, light 12 / 14 / 16 regular, line heights 18 / 21 / 24.
| Text styles and colour | As in the table | Same | Matches |

---

### NlNavSubItem

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Internal** (used only by `NlNavItem`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-30a and OD-30b decided 19 Nov 2026.

A page link under an expanded section in the side nav. In the tree style, a thin line connects it to its section.

#### Anatomy

```
NlNavSubItem (link, full width, rounded)
├── tree line (optional, decorative)
└── text
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Selected | not selected, selected (current page) | `current?: boolean` |
| Tree | none, middle, last | `tree: 'none' \| 'middle' \| 'last'`, default `none`, also `data-tree` |
| Text | text | `children` |
| Link | any link component | `as` (CLAUDE.md: link-like components take an `as` prop), `href` |

Hover and pressed are CSS states (§7.3).

#### Sizes and layout

- Horizontal, items centred. Width fills the nav.
- Padding: `Space-M` top and bottom, `Space-XL` right, `Space-6XL` left (the text lines up under the section's text).
- Radius `Radius-S` (D19).
- Text style `Label M`, single line, truncated with an ellipsis if too long.
- Height comes from the padding and line height (no fixed height).
- Tree line: 1px (§4.2), one connected line (OD-239). It runs down from `Space-XS` + `Space-M` above the item (the first page's line reaches up to the section icon) to its vertical middle, then curves with `Radius-S` towards the text, ending `Space-XS` before it. "Middle" continues down to the next item from where the curve leaves the vertical, so there is no break at the curve. "Last" stops at the curve. Its horizontal position is under the centre of the section icon in `NlNavItem` (see "Mapping notes").

#### Colours

| State | Background | Text | Tree line |
|---|---|---|---|
| Default | `bg-secondary` | `text-secondary` | `border-default` |
| Hover | `bg-tertiary` | `text-secondary` | `border-default` |
| Pressed | `bg-neutral` | `text-secondary` | `border-default` |
| Selected | `bg-primary` | `text-action` | `border-default` |
| Focus (keyboard) | as the state, plus the standard focus ring from CLAUDE.md (`border-focused`) | | |

#### States

Default, hover, pressed, selected, focus. There is no disabled state in the reference.

#### Behaviour and accessibility

- A link. `aria-current="page"` when selected.
- Keyboard: Tab reaches it; Enter follows it.
- The tree line is `aria-hidden`.
- Truncated text gets a tooltip, or the full text as `title`, so it isn't lost.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Tree line horizontal position | From the reference's description: under the section icon centre, given as raw distances from the left edge | `NlNavItem`'s padding + half the icon: `Space-L` + half `Size-20` = 22 from the start, through the `nl:nav-tree-line` utility (rule 9) | Approved (OD-30a) |
| Tree line ends | `Space-XS` above, `Space-XS` before the text, `Radius-S` curve | `Space-XS` + `Space-M` above, so the line joins the section icon and runs unbroken through every page; `Space-XS` before the text; `Radius-S` curve | Changed 22 Nov 2026 (OD-239) |
| Width | Drawn 280 wide | Fills the nav | Matches |
| Selected background | `bg-primary` (a white chip on the grey nav) | Same | Matches |
| Pressed background | `bg-neutral` | Same. In Light it equals `bg-tertiary` today, so hover and pressed look the same (K1) | Known issue K1 |
| Focus | Not drawn | Standard ring from CLAUDE.md | Approved (OD-30b) |
| Cut-off text | Not drawn | The full text as `title`, only when it is cut off (measured after layout and on resize) | Approved, 19 Nov 2026 |

#### Spec → code

| Spec option | Code |
|---|---|
| Selected | `current?: boolean`: `aria-current="page"`, `bg-primary`, `text-action` (no hover change), `data-current` |
| Tree | `tree?: 'none' \| 'middle' \| 'last'`, default `none`, `data-tree`. Middle and last draw the curve leg; middle also draws the continuation. Both `aria-hidden` |
| Text | `children`: Label M, one line, ellipsis; the full text as `title` when cut off (a caller's `title` wins) |
| Link | `as?: ElementType`, default `'a'`; `href`, `ref` and other attributes go to it; `className` (placement only) appended last |

#### API

```tsx
import { NlNavSubItem } from '../NlNavSubItem'; // internal, not exported from @northline/ui

<NlNavSubItem href="/members" tree="middle">Members</NlNavSubItem>
<NlNavSubItem as={RouterLink} to="/tiers" tree="last" current>Tiers</NlNavSubItem>
```

`'use client'` (the cut-off measuring).

#### Tokens used

Padding `Space-M` block, `Space-XL` end, `Space-6XL` start; `Radius-S` (D19); Label M; `bg-secondary`, `bg-tertiary` (hover), `bg-neutral` (pressed, K1), `bg-primary` (selected); `text-secondary`, `text-action`; tree line 1px `border-default`, `Radius-S` curve, positioned from `Space-L`, `Size-20`, `Space-XS` and `Space-6XL`; the standard focus ring; Duration fast.

#### Build decisions

| Decision | Detail |
|---|---|
| Tree line utilities | `nl:nav-tree-line` (curve leg: from `Space-XS` + `Space-M` above the item to its middle, ending `Space-XS` before the text) and `nl:nav-tree-continue` (from `Radius-S` above the middle to the bottom) in `tailwind.css`, position and size only (rule 9, approved 19 Nov 2026; extended 22 Nov 2026, OD-239) |
| Connected line | `Space-XS` + `Space-M` is `NlNavItem`'s `Space-XS` gap plus the section row's `Space-M` bottom padding, so the first page's line reaches the section icon. On later pages the extra length overlaps the previous page's continuation (same opaque `border-default`, no visible change). The continuation starts `Radius-S` above the middle, where the curve leaves the vertical, so the line doesn't break at each curve (OD-239) |
| Selected hover | None: the spec gives no hover for the current page |

Checked in the browser: line at 22, curve ending at 36, text at 40; the curve meets the item's middle; middle items reach the next item's line; long text gets its full title.

---

### NlPaginationItem

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Internal** (used only by `NlPagination`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-32 to OD-35 decided 19 Nov 2026.

One page number button in the table pagination, or the "…" gap between page ranges.

#### Anatomy

```
NlPaginationItem (square button)
└── page number, or "…"
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Kind | page, ellipsis | `kind: 'page' \| 'ellipsis'`, default `page`, also `data-kind` |
| Page | number | `page: number` |
| Selected | not selected, selected (current page) | `current?: boolean` |
| Select | callback | `onSelect(page)` |

Hover is a CSS state (§7.3).

#### Sizes and layout

- `Size-32` × `Size-32`. Padding `Space-XS`. Content centred.
- Radius `Radius-S`. 1px inside border (§4.2).
- Page number: text style `Label M`. Ellipsis: text style `Label L`, no border, no fill.
- Wider page numbers (3 digits and over): see "Mapping notes".

#### Colours

| State | Background | Border | Text |
|---|---|---|---|
| Default | `bg-secondary` | `border-subtle` | `text-secondary` |
| Hover | `bg-tertiary` | `border-default` | `text-primary` |
| Selected | `bg-active` | `border-active` | `text-action` |
| Ellipsis | none | none | `text-secondary` |
| Focus (keyboard) | as the state, plus the standard focus ring from CLAUDE.md (`border-focused`) | | |

#### States

Default, hover, focus, selected. The ellipsis has no states.

#### Behaviour and accessibility

- Page: a `<button>`. Accessible name "Page 3". Selected adds `aria-current="page"`.
- Ellipsis: plain text, `aria-hidden="true"`. The pagination `<nav>` around it has the name ("Pagination").
- Keyboard: Tab through the buttons; Enter or Space selects.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Width for long numbers | Fixed 32 square | Minimum width `Size-32`, width hugs the number, so "100" and over still fit | Approved (OD-32) |
| Pressed state | Not drawn | Same as hover | Approved (OD-33) |
| Focus | Not drawn | Standard ring from CLAUDE.md | Approved (OD-34) |
| Ellipsis text | Three full stops | One ellipsis character "…" | Approved (OD-35) |
| Current page | Not drawn | Keeps its look on hover and press; pressing it does nothing (no `onSelect`); stays focusable | Approved, 19 Nov 2026 |
| Ellipsis for screen readers | `aria-hidden` | Same: the gap isn't announced | Approved, 19 Nov 2026 |
| Sizes, radius, colours | As above | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Kind | `kind?: 'page' \| 'ellipsis'`, default `page`, `data-kind` |
| Page | `page: number` (required for a page) |
| Selected | `current?: boolean`: `aria-current="page"`, `bg-active`, `border-active`, `text-action`, no state change, `data-current` |
| Select | `onSelect?(page)` on click, Enter or Space; never for the current page |
| Page element | Native `<button type="button">`, `aria-label` "Page 3", shows the number; `ref` and attributes pass through; `className` (placement only) appended last |
| Ellipsis element | `<span aria-hidden="true">` with "…", the same box, Label L `text-secondary`, no border or fill |

#### API

```tsx
import { NlPaginationItem } from '../NlPaginationItem'; // internal, not exported from @northline/ui

<NlPaginationItem page={3} onSelect={goTo} />
<NlPaginationItem page={4} current />
<NlPaginationItem kind="ellipsis" />
```

`'use client'` (click handler).

#### Tokens used

`Size-32` (height and minimum width), `Space-XS` padding, `Radius-S`, 1px inset border, Label M (page) and Label L (ellipsis); `bg-secondary`, `border-subtle`, `text-secondary` (default); `bg-tertiary`, `border-default`, `text-primary` (hover and pressed); `bg-active`, `border-active`, `text-action` (current); the standard focus ring; Duration fast.

#### Build decisions

| Decision | Detail |
|---|---|
| Union props | A page needs `page`; the ellipsis takes none. Stories use flat controls (as `NlButton`) |
| Current page | `cursor-default`, no hover or pressed classes, and the click does not call `onSelect` |

Checked in the browser: 9 and 99 are 32 square; 100 is 32 to 33 wide and 1250 is 40 to 42 wide, depending on the brand font; all 32 high.

---

### NlPageDot

**Level** Atom L0 · **Base** none · **Depends on** nothing · **Internal** (used only by `NlPageDots`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-36 to OD-39 decided 19 Nov 2026.

One dot in a page indicator. The current page shows as a longer pill.

#### Anatomy

```
NlPageDot (dot or pill)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | default, selected | `current?: boolean` |

#### Sizes and layout

| Type | Width | Height | Radius |
|---|---|---|---|
| default | `Size-6` | `Size-6` | `Radius-Full` |
| selected | `Size-24` (OD-36) | `Size-6` | `Radius-Full` |

- Width changes between the two with `--nl-duration-base`, `--nl-ease-standard`. Reduced motion: no animation.

#### Colours

| Type | Fill |
|---|---|
| default | `fg-placeholder` |
| selected | `fg-brand` |

#### States

None. Not interactive in the reference.

#### Behaviour and accessibility

- Decorative: `aria-hidden="true"`. `NlPageDots` gives the indicator its accessible text ("Page 2 of 5").
- Colour isn't the only signal: the selected dot is also longer.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Selected width | Raw 22 | No `Size-22` token: `Size-24` (closest; 2 wider) | Approved (OD-36) |
| Radius | Raw 8 on a 6-tall shape (fully round) | `Radius-Full` | Approved (OD-37) |
| Width animation | Not in the reference | Width and fill with `--nl-duration-base` and `--nl-ease-standard`, none under reduced motion | Approved (OD-38) |
| Clickable dots | Not in the reference | Not interactive. If dots must move between pages, that needs a new spec | Decided (OD-39, with OD-72): not interactive |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | `current?: boolean`: `Size-24` wide, `fg-brand`; default `Size-6`, `fg-placeholder`; `data-current` |
| Element | `<span aria-hidden="true">`, empty, not interactive; `ref` and attributes pass through; `className` (placement only) appended last |

#### API

```tsx
import { NlPageDot } from '../NlPageDot'; // internal, not exported from @northline/ui

<NlPageDot />
<NlPageDot current />
```

Presentational (no `'use client'`).

#### Tokens used

`Size-6` (height, default width), `Size-24` (current width), `Radius-Full`, `fg-placeholder`, `fg-brand` (as fills), `--nl-duration-base`, `--nl-ease-standard`.

#### Build decisions

| Decision | Detail |
|---|---|
| Animation | `transition-all` so width and fill change together; `motion-reduce:transition-none` |

Checked in the browser: dots 6 × 6, the current pill 24 × 6, fully round; moving a page eases both widths over Duration base.

---

### NlIconContainer

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-45, OD-46.

An icon centred on a round tinted background. Used in empty states, file upload and list rows.

#### Anatomy

```
NlIconContainer (circle)
└── NlIcon (centred)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | 40, 48, 64 | `size: 40 \| 48 \| 64`, default 48, also `data-size` |
| Colour | primary, secondary, disabled, success, warning, error, info | `tone`, default `primary` |
| Icon | registry name | `icon: NlIconName` |
| Accessible name | none (decorative) or text | `label?: string`, passed to `NlIcon` |

#### Sizes and layout

| Size | Container | Icon size |
|---|---|---|
| 40 | `Size-40` | 24 (`NlIcon size={24}`) |
| 48 | `Size-48` | 24 |
| 64 | `Size-64` | 36 |

- Shape `Radius-Full`. The icon is centred. No padding is needed because the container size is fixed.
- No border, no shadow.

#### Colours

| Tone | Background | Icon |
|---|---|---|
| primary | `bg-icons` | `fg-primary` |
| secondary | `bg-secondary` | `fg-secondary` |
| disabled | `bg-disabled` | `fg-disabled-on_bg` |
| success | `bg-success_secondary` | `fg-success` |
| warning | `bg-warning_secondary` | `fg-warning` |
| error | `bg-error_secondary` | `fg-error` |
| info | `bg-info_secondary` | `fg-info` |

- The icon colour is set by the container (`NlIcon` with `tone="inherit"`).

#### States

None. Not interactive.

#### Behaviour and accessibility

- Decorative by default (the text next to it carries the meaning). With `label`, the icon gets `role="img"` and the name.
- Contrast: icons on their tints need 3 to 1 in every brand and theme (D7, token audit).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Padding and gap | `Space-M` padding and a raw 10 gap on the 40 size. They have no effect on the fixed 48 and 64 sizes | Dropped. Fixed size, icon centred | Approved (OD-45) |
| Icon nesting | Some variants put the icon straight in; others wrap it in an icon-size component | One `NlIcon` in every case | Matches |
| Disabled icon | `fg-disabled-on_bg` | Same | Matches |
| Default size and tone | Not set | `48`, `primary` | Approved (OD-46) |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size`: `40`, `48` (default), `64`, also `data-size`. The icon is `24`, `24`, `36` |
| Colour | `tone`: `primary` (default), `secondary`, `disabled`, `success`, `warning`, `error`, `info`, also `data-tone` |
| Icon | `icon: NlIconName`, rendered as one `NlIcon` with `tone="inherit"` |
| Accessible name | `label?`, passed to `NlIcon` (`role="img"` and `aria-label`); without it the icon is `aria-hidden` |

#### API

```tsx
import { NlIconContainer } from '@northline/ui';

<NlIconContainer icon="search" />
<NlIconContainer icon="check_circle" size={64} tone="success" label="Upload complete" />
```

A `<span>` with the `NlIcon` inside. `className` and other native attributes go to the circle. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Circle | `Size-40`, `Size-48`, `Size-64`; `Radius-Full` |
| Icon | `NlIcon` sizes `24` and `36` |
| Colours | As in the table above. Utilities `nl:bg-icons`, `nl:bg-secondary`, `nl:bg-disabled`, `nl:bg-{tone}-secondary`; `nl:text-fg-*`, `nl:text-fg-disabled-on-bg` |

#### Build decisions

| Decision | Detail |
|---|---|
| Colour on the circle | The circle sets the text colour and the icon inherits it, so the disabled tone can use `fg-disabled-on_bg`, which `NlIcon` has no tone for |
| Contrast (icon on tint) | The same in every brand. Light / Dark: primary 13.85 / 13.43, secondary 7.18 / 8.31, success 3.91 / 8.31, warning 4.38 / 10.32, error 4.62 / 7.15, info 4.25 / 8.19. Disabled 3.53 / 1.60, exempt from 1.4.11 |
| Primary and disabled in Light | `bg-icons` and `bg-disabled` are the same grey (K1); the two differ by icon colour only. Accepted by the designer, 18 Nov 2026 |

---

### NlAvatar

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon`, `NlStatusDot` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-47, OD-48.

A round picture of a person or account: a photo, initials or a default icon, with an optional online dot.

#### Anatomy

```
NlAvatar (circle, 1px border inside)
├── content (one of: image, initials, NlIcon)
└── NlStatusDot (optional, bottom-right)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | image, text (initials), icon | Derived: `src` gives image; `initials` gives text; neither gives icon. Also `data-type` |
| Size | xsmall, small, medium, large, xlarge, xxlarge, xxxlarge | `size`, default `medium`, also `data-size` |
| Online | off, on | `online?: boolean` |
| Online label | text | `onlineLabel?: string`, default "Online" |
| Image | URL and alt text | `src?: string`, `alt?: string` |
| Initials | up to 2 characters | `initials?: string` |
| Icon | registry name | `icon?: NlIconName`, default `person` (see "Mapping notes") |

#### Sizes and layout

| Size | Avatar | Icon (`NlIcon`) | Initials text style | Status dot size |
|---|---|---|---|---|
| xsmall | `Size-24` | 16 | `Label S` | xsmall (`Size-6`) |
| small | `Size-32` | 20 | `Label M` | small (`Size-8`) |
| medium | `Size-40` | 24 | `Label L` | medium (`Size-12`) |
| large | `Size-48` | 24 | `Title L` | medium (`Size-12`) |
| xlarge | `Size-56` | 36 | `Headline Medium-H5` | large (`Size-16`) |
| xxlarge | `Size-64` | 48 | `Headline Large-H4` | large (`Size-16`) |
| xxxlarge | `Size-96` | 64 | `Display Medium-H2` | xlarge (`Size-24`) |

- Shape `Radius-Full`. 1px inside border (§4.2). Content centred. The image covers the circle (object-fit cover).
- Status dot: bottom-right. Its outer ring (1px, see `NlStatusDot`) touches the avatar's bounding box for xsmall to xlarge, and sits `Space-XXS` further in for xxlarge and xxxlarge.
- The avatar doesn't clip the status dot.

#### Colours

| Part | Token |
|---|---|
| Border (all types) | `border-subtle` |
| Background (icon and text types) | `bg-icons` |
| Initials | `text-secondary` |
| Icon | `fg-secondary` |
| Image | the photo |

#### States

None. Not interactive. An avatar inside a button or link gets its states from that parent.

#### Behaviour and accessibility

- Image: `<img alt>`. Give the person's name in `alt` when the avatar is the only place the name appears. Use `alt=""` when the name is shown next to it.
- Initials and icon: decorative by default (`aria-hidden`). Pass `alt` to name it, which renders `role="img"` with `aria-label`.
- Initials: at most 2 characters, uppercase, letters only. With no name, use the icon type rather than empty initials.
- Online: `NlStatusDot` with `onlineLabel`, so a screen reader hears, for example, "Member 0042, online". Colour isn't the only signal when presence matters: show the status in text nearby too.
- Image fails to load: fall back to initials, then to the icon.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Shape | Round in the component. The reference's documentation also mentions an octagon brand shape, which no component uses | Round | Matches |
| Largest size | 96 in the component (the documentation says 100) | `Size-96` | Matches the component |
| Status dot inset | Raw 1 (xsmall to xlarge) and 3 (xxlarge, xxxlarge) | 1 is the dot's own 1px ring. The extra 2 is `Space-XXS` | Matches |
| Default icon | A person outline from the reference's icon set | Material Symbols `person`, added to the registry | Approved (OD-47) |
| Initials text colour | `text-secondary` | Same | Matches |
| Fallback order | From the reference's documentation: photo, then initials, then icon | Same | Matches |
| Default size | Not set | `medium` | Approved (OD-48) |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | Worked out from the props, also `data-type`: `src` gives `image`; `initials` gives `text`; neither gives `icon`. A photo that fails to load gives `text` or `icon` |
| Size | `size`: `xsmall` … `xxxlarge`, default `medium`, also `data-size` |
| Online | `online?: boolean`, renders `NlStatusDot` |
| Online label | `onlineLabel?`, default `"Online"`, the dot's `label` |
| Image | `src?`, `alt?` (the `<img>` alt, default `""`) |
| Initials | `initials?`: trimmed, first 2 characters, uppercase. Blank gives the icon |
| Icon | `icon?: NlIconName`, default `person` |
| Accessible name (initials, icon) | `alt?`: the circle gets `role="img"` and `aria-label`; without it the content is `aria-hidden` |

#### API

```tsx
import { NlAvatar } from '@northline/ui';

<NlAvatar src={photoUrl} alt="Member 0042" online />
<NlAvatar initials="MX" size="large" />
<NlAvatar size="small" />
```

A `<span>` bounding box holding the circle and the dot as siblings, so the circle clips the photo and not the dot. `className` and other native attributes go to the bounding box. `'use client'` (image fallback).

#### Tokens used

| Part | Tokens |
|---|---|
| Bounding box | `Size-24`, `Size-32`, `Size-40`, `Size-48`, `Size-56`, `Size-64`, `Size-96` |
| Circle | `Radius-Full`; 1px `border-subtle` inside (border-box); `bg-icons` for initials and icon |
| Initials | `Label S`, `Label M`, `Label L`, `Title L`, `Headline Medium-H5`, `Headline Large-H4`, `Display Medium-H2`; `text-secondary` |
| Icon | `NlIcon` 16, 20, 24, 24, 36, 48, 64; `fg-secondary` (inherited) |
| Status dot | `NlStatusDot` xsmall, small, medium, medium, large, large, xlarge; inset `Space-none` up to xlarge, `Space-XXS` for xxlarge and xxxlarge |

#### Build decisions

| Decision | Detail |
|---|---|
| Image fallback | `onError` switches to initials, then the icon. After hydration the avatar also checks for a photo that already failed, because in a server-rendered page the error can fire before React attaches the handler. A new `src` is tried again |
| Initials | Trimmed, cut to 2 characters and uppercased. Callers pass letters; the component doesn't filter (designer's choice, 18 Nov 2026) |
| `person` icon | Added to the `nlIcons` registry at U+E7FD, checked against the font's own ligature. 26 icons |
| Story image | An abstract gradient SVG in `apps/storybook/public` (Storybook `staticDirs`), not a photo and not in the library (designer's choice, 18 Nov 2026) |

---

### NlBadgeBase

**Level** Atom L1 · **Base** – (this is the base) · **Depends on** `NlIcon` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-49.

The shared shape of every badge: a small rounded tag with a label and optional leading and trailing icons. It holds every option as props (§7.2). `NlBadge` maps tones onto it.

#### Anatomy

```
NlBadgeBase (rounded tag, horizontal)
├── leading NlIcon (optional)
├── label
└── trailing NlIcon (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | small, large | `size: 'small' \| 'large'`, also `data-size` |
| Label | text | `children` |
| Leading icon | off or a registry name | `leadingIcon?: NlIconName` |
| Trailing icon | off or a registry name | `trailingIcon?: NlIconName` |
| Colours | background, border, text and icon tokens | Set by `NlBadge` through a fixed lookup per tone |

#### Sizes and layout

| Size | Padding (block / inline) | Gap | Icon size | Text style | Radius |
|---|---|---|---|---|---|
| small | `Space-XS` / `Space-M` | `Space-XS` | 16 | `Label S` | `Radius-S` |
| large | `Space-XS` / `Space-M` | `Space-XS` | 20 | `Label M` | `Radius-S` |

- Height hugs the content. Width hugs the content. Items centred. Single line, no wrapping.
- Border: 1px inside (§4.2), only for the tones that have one (see `NlBadge`).

#### Colours

The base has no colours of its own. `NlBadge` sets them per tone.

#### States

None (§7.2: bases have no interaction states).

#### Behaviour and accessibility

- A `<span>`. Not interactive, not focusable.
- Icons are decorative (`NlIcon` with no label). The label carries the meaning.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Padding, gap, radius | `Space-XS`, `Space-M`, `Radius-S` | Same | Matches |
| Rendered heights | 26 (small) and 32 (large) | Small hugs the content (26). Large hugs to 29 (`Label M` line height 21 + 2 × `Space-XS`), so it has a `Size-32` minimum height to match the reference | Approved (OD-49) |
| Icon sizes | 16 and 20 | `NlIcon` 16 and 20 | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size`: `small` (default), `large`, also `data-size` |
| Label | `children` |
| Leading icon, trailing icon | `leadingIcon?`, `trailingIcon?`: a decorative `NlIcon` in a slot `<span>` (`data-slot="leading"` / `"trailing"`) |
| Colours | `appearance?: { badge, icon }`: whole class strings from the mapped component's styles file. `badge` carries background, inset ring and text colour; `icon` colours the icon slots, and `NlIcon` inherits it (`tone="inherit"`) |

#### API

```tsx
import { NlBadgeBase } from '../NlBadgeBase'; // internal, not exported from @northline/ui

<NlBadgeBase size="small" leadingIcon="check_circle" appearance={styles.tone.success}>
  Active
</NlBadgeBase>
```

A `<span>`. `className` (placement only) and other native attributes go to it. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Tag | Padding `Space-XS` / `Space-M`, gap `Space-XS`, `Radius-S` |
| small | `Label S`, `NlIcon` 16; hugs to 26 |
| large | `Label M`, `NlIcon` 20; minimum height `Size-32` |
| Border | 1px inset ring (`nl:inset-ring`) in the colour `NlBadge` passes |

#### Build decisions

| Decision | Detail |
|---|---|
| Border as an inset ring | A CSS border would make bordered tones 2px taller than borderless ones. The inset ring stays inside the shape, as the spec's "1px inside" means (designer's choice, 18 Nov 2026) |
| Colours through `appearance` | Text and icon colours differ for status tones (for example `text-success` is Success-700, `fg-success` Success-600), and `NlIcon` has no `white_both` or `disabled-on_bg` tone. So the icon colour sits on a slot `<span>` and nothing styles `NlIcon`'s internals (designer's choice, 18 Nov 2026) |
| Long labels | Stay on one line and widen the badge. To be revisited per use if a case needs truncation (designer's choice, 18 Nov 2026) |
| Stories | Under `Internal/Badge base`, with story-only colours (the neutral tone's tokens, and a success look for the inset ring) |

---

### NlBadge

**Level** Atom L1 (mapped, takes its base's level) · **Base** `NlBadgeBase` · **Depends on** – · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-51, OD-52, OD-53.

A status tag, such as "Active", "Pending" or "Tier 2", in one of eight tones.

#### Anatomy

As `NlBadgeBase`: label, with optional leading and trailing icons.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Tone | primary, secondary, success, error, info, warning, neutral, disabled; tier tones bronze, silver, gold, platinum (D20) | `tone`, default `neutral`, also `data-tone` |
| Size | small, large | `size`, default `small`. See "Mapping notes" |
| Label | text | `children` |
| Icons | optional | `leadingIcon?`, `trailingIcon?`. See "Mapping notes" |

#### Sizes and layout

As `NlBadgeBase`.

#### Colours

| Tone | Background | Border (1px, inside) | Text | Icon |
|---|---|---|---|---|
| primary | `bg-brand` | none | `text-white_both` | `fg-white_both` |
| secondary | none | `border-strong` | `text-secondary` | `fg-secondary` |
| success | `bg-success_secondary` | `border-success` | `text-success` | `fg-success` |
| error | `bg-error_secondary` | `border-error` | `text-error` | `fg-error` |
| info | `bg-info_secondary` | `border-info` | `text-info` | `fg-info` |
| warning | `bg-warning_secondary` | `border-warning` | `text-warning` | `fg-warning` |
| neutral | `bg-neutral` | none | `text-secondary` | `fg-secondary` |
| disabled | `bg-disabled` | none | `text-disabled-on_bg` | `fg-disabled-on_bg` |
| bronze | 135° gradient `bg-tier-bronze_start` → `bg-tier-bronze_end` (`nl:tier-gradient-bronze`) | `border-tier-bronze` | `text-tier-bronze` | `fg-tier-bronze` |
| silver | 135° gradient `bg-tier-silver_start` → `bg-tier-silver_end` (`nl:tier-gradient-silver`) | `border-tier-silver` | `text-tier-silver` | `fg-tier-silver` |
| gold | 135° gradient `bg-tier-gold_start` → `bg-tier-gold_end` (`nl:tier-gradient-gold`) | `border-tier-gold` | `text-tier-gold` | `fg-tier-gold` |
| platinum | 135° gradient `bg-tier-platinum_start` → `bg-tier-platinum_end` (`nl:tier-gradient-platinum`) | `border-tier-platinum` | `text-tier-platinum` | `fg-tier-platinum` |

#### States

None. Not interactive. "Disabled" is a tone (a status that is switched off), not an interaction state.

#### Behaviour and accessibility

- Plain text in a `<span>`. A screen reader reads the label.
- Colour isn't the only signal: the label must say the status.
- Contrast: text on each tint needs 4.5 to 1, and borders on `bg-primary` need 3 to 1, in every brand and theme (token audit). Check `text-white_both` on `bg-brand` for Voltic in Light.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Size | The mapped badge only exists in the small size. The base has small and large | `size` passed through to the base, default `small` | Approved (OD-51) |
| Icons | The mapped badge hides both icons and doesn't expose them | `leadingIcon` and `trailingIcon` passed through, off by default; set a name to show one. Icon colours as in the table (the matching `fg-*` token) | Approved (OD-52) |
| Icon colours | Not drawn on the mapped badge | `fg-*` matching each text token | Approved (OD-52) |
| Default tone | Not set | `neutral` | Approved (OD-53) |
| Tone names | Primary, secondary, success, error, info, warning, disabled, neutral | Same, as `tone` (§7.3) | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Tone | `tone`, default `neutral`, also `data-tone`. Picks a fixed `{ badge, icon }` from `NlBadge.styles.ts` and passes it to `NlBadgeBase` as `appearance` |
| Size | `size`: `small` (default), `large`, passed to the base |
| Label | `children` |
| Icons | `leadingIcon?`, `trailingIcon?`, passed to the base. None by default |

#### API

```tsx
import { NlBadge } from '@northline/ui';

<NlBadge tone="success">Active</NlBadge>
<NlBadge tone="warning" size="large" leadingIcon="warning">Pending</NlBadge>
```

Renders `NlBadgeBase` (a `<span>`). `className` and other native attributes go to it. Presentational, so no `'use client'`.

#### Tokens used

| Tone | Badge | Icon |
|---|---|---|
| primary | `bg-brand`, `text-white_both` | `fg-white_both` |
| secondary | inset ring `border-strong`, `text-secondary`, no fill | `fg-secondary` |
| success, error, info, warning | `bg-{tone}_secondary`, inset ring `border-{tone}`, `text-{tone}` | `fg-{tone}` |
| neutral | `bg-neutral`, `text-secondary` | `fg-secondary` |
| disabled | `bg-disabled`, `text-disabled-on_bg` | `fg-disabled-on_bg` |
| bronze | `nl:tier-gradient-bronze` (`bg-tier-bronze_start`, `bg-tier-bronze_end`), `border-tier-bronze`, `text-tier-bronze` | `fg-tier-bronze` |
| silver | `nl:tier-gradient-silver` (`bg-tier-silver_start`, `bg-tier-silver_end`), `border-tier-silver`, `text-tier-silver` | `fg-tier-silver` |
| gold | `nl:tier-gradient-gold` (`bg-tier-gold_start`, `bg-tier-gold_end`), `border-tier-gold`, `text-tier-gold` | `fg-tier-gold` |
| platinum | `nl:tier-gradient-platinum` (`bg-tier-platinum_start`, `bg-tier-platinum_end`), `border-tier-platinum`, `text-tier-platinum` | `fg-tier-platinum` |

Shape, sizes and spacing from `NlBadgeBase`.

#### Build decisions

| Decision | Detail |
|---|---|
| Contrast | Text on its tint, Light / Dark: primary 5.84–7.98 / 4.82–5.84 (Voltic Light 5.84), secondary 8.39 / 9.60, success 6.04 / 10.63, error 6.81 / 9.81, info 6.39 / 10.63, warning 7.75 / 11.81, neutral 6.08 / 6.74. Icons pass 3:1 in every tone but disabled. `border-warning` on `bg-primary` (1.93, Light) is accepted in D17 |
| Disabled tone | Text 3.53 / 1.60, under 4.5:1. Accepted as known issue K4 (designer's choice, 18 Nov 2026); the label must still say the status, for example "Inactive". Story samples are marked `data-a11y-known-issue="K4"` |
| Icons off by default | Icons are only drawn when a name is set (designer's choice, 18 Nov 2026) |

---

### NlButtonBase

**Level** Atom L1 · **Base** – (one of the three button bases, D12) · **Depends on** `NlIcon` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-1, OD-40.

The base for normal-tone buttons: primary, secondary and tertiary. It holds the shared anatomy, sizes and icon options. `NlButton` uses it when `tone="normal"`. `NlWhiteButton` and `NlDestructiveButton` share the same anatomy and sizes.

#### Anatomy

```
NlButtonBase (native button, rounded)
└── content (horizontal, centred)
    ├── leading NlIcon (optional)
    ├── label (visible, or visually hidden for icon-only)
    └── trailing NlIcon (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Variant | primary, secondary, tertiary, link | `variant`, also `data-variant` |
| Size | large, medium, small, xsmall | `size`, also `data-size` |
| Icon | none, leading, trailing, only-icon | `icon`, also `data-icon` |
| Icon name | registry name | `iconName?: NlIconName` (required unless `icon="none"`) |
| Label | text | `children` (always required, also for icon-only) |

#### Sizes and layout

| Size | Height | Padding (block / inline) | Radius | Icon size | Text style | Icon-only (square) |
|---|---|---|---|---|---|---|
| large | `Size-56` | `Space-XL` / `Space-3XL` | `Radius-S` (D19) | 24 | `Button XL` (new, see "Mapping notes") | `Size-56` |
| medium | `Size-48` | `Space-L` / `Space-3XL` | `Radius-S` (D19) | 24 | `Button L` | `Size-48` |
| small | `Size-40` | `Space-M` / `Space-XL` | `Radius-XS` (D19) | 20 | `Button M` | `Size-36` (see "Mapping notes") |
| xsmall | `Size-36` | `Space-S` / `Space-XL` | `Radius-XS` (D19) | 20 | `Button M` | `Size-32` (see "Mapping notes") |

- Content gap between icon and label: `Space-M`.
- Width hugs the content. Single-line label, no wrapping.
- Icon-only: square, padding `Space-none`, the icon centred, the label kept as visually hidden text.
- Border: secondary has a 2px inside border (§4.2). Primary, tertiary and link have none.
- Link: tertiary's sizes and padding. No icon-only form.

#### Colours (resting)

| Variant | Background | Border (2px, inside) | Label | Icon |
|---|---|---|---|---|
| primary | `bg-action-primary` | none | `text-white_both` | `fg-white_both` |
| secondary | none | `border-active` | `text-action` | `fg-action` |
| tertiary | none | none | `text-action` | `fg-action` |
| link | none | none | `text-action` | `fg-action` |

Hover, pressed, focus and disabled colours are in `NlButton` (§7.2: state styling belongs to the component built on the base).

#### States

None of its own (§7.2).

#### Behaviour and accessibility

- Renders a native `<button type="button">` by default. `NlButton` can pass `as` for a link (CLAUDE.md: link-like components take an `as` prop).
- Icons are decorative. The label is the accessible name, visible or visually hidden.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Large text style | 18/24 semibold | New text style `Button XL` (600, 18, 24). Added to DESIGN.md §3.4 and the token JSON | Approved |
| Medium, small, xsmall text styles | 16/24, 14/24, 14/24 | `Button L`, `Button M`, `Button M`. `Button S` stays unused by buttons | Approved |
| Icon-only small and xsmall | 36 and 32 square, smaller than the labelled heights (40 and 36) | Kept as in the reference: `Size-36`, `Size-32` | Approved |
| Link variant | A fourth type in the reference's button set | Included as `variant="link"` | Approved. D12 updated to list link |
| Heights | Come from padding plus the 24 line height | Fixed `Size-*` heights as well, so icon-only and labelled buttons line up | Matches |
| Spacing, radius, gap | As in the table | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Variant | `variant`: `primary` (default), `secondary`, `tertiary`, `link`, also `data-variant` |
| Size | `size`: `large`, `medium` (default), `small`, `xsmall`, also `data-size` |
| Icon | `icon`: `none` (default), `leading`, `trailing`, `only-icon`, also `data-icon`. The types forbid `only-icon` with `link` |
| Icon name | `iconName`: required by the types unless `icon` is `none` |
| Label | `children`, always required, in a `<span data-slot="label">`. Icon-only keeps it as `nl:sr-only` text, the accessible name |
| Element | `as` (default `'button'`, or `'a'`, or a component such as a router link) and `href`. A native button gets `type="button"` unless the caller passes a type |
| Colours | The variant's resting colours, or `appearance?: { button, icon, label? }` from `NlButton`, which replaces them (with states and content tones). `label` styles the label span (the link underline, added in #27) |

#### API

```tsx
import { NlButtonBase } from '../NlButtonBase'; // internal, not exported from @northline/ui

<NlButtonBase variant="secondary" size="small" icon="leading" iconName="add" appearance={styles.normal.secondary}>
  Add member
</NlButtonBase>
```

`className` (placement only) and other native attributes, including `ref` and `disabled`, go to the element. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Labelled | Heights `Size-56`, `Size-48`, `Size-40`, `Size-36`; padding as in the table; gap `Space-M` |
| Icon-only | `Size-56`, `Size-48`, `Size-36`, `Size-32` squares, padding `Space-none` |
| Radius, text | `Radius-S` / `Radius-XS` (D19); `Button XL`, `Button L`, `Button M` |
| Icon | `NlIcon` 24 (large, medium), 20 (small, xsmall) |
| Resting colours | primary `bg-action-primary`, `text-white_both`, `fg-white_both`; secondary 2px inset ring `border-active`, `text-action`, `fg-action`; tertiary and link `text-action`, `fg-action` |
| Focus | The standard ring: `outline-2`, offset −1, `border-focused`, keyboard only |

#### Build decisions

| Decision | Detail |
|---|---|
| Colours through `appearance` | `NlButton`'s content tones change resting colours too, so it passes a whole set that replaces the variant's, never adds to it. The root carries the named group `button`, so icon slots can follow hover and pressed (designer's choice, 18 Nov 2026) |
| Focus ring in the base | The same for every tone and variant, so no button can miss it (designer's choice, 18 Nov 2026) |
| Border as an inset ring | Secondary's 2px inside border is `inset-ring-2`, so it doesn't change the size |
| Icon colour | Each icon sits in a slot `<span>` with the icon colour; `NlIcon` inherits it, as in `NlBadgeBase` |
| Cursor | Pointer, default when disabled or `aria-disabled` |
| `soft` variant | Left out until OD-40 is decided (OD-1) (designer's choice, 18 Nov 2026) |

---

### NlWhiteButton

**Level** Atom L1 · **Base** – (one of the three button bases, D12; built on `NlButtonBase`) · **Depends on** `NlButtonBase` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-54.

The base for the white button that sits on brand-coloured backgrounds. Same anatomy, sizes and icon options as `NlButtonBase`. `NlButton` uses it when `tone="white"`.

#### Anatomy

As `NlButtonBase`.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, medium, small, xsmall | `size` |
| Icon | none, leading, trailing, only-icon | `icon`, `iconName` |
| Label | text | `children` |

The reference has a single look for the white button, so there is no `variant`. See "Mapping notes".

#### Sizes and layout

Identical to `NlButtonBase` (heights, padding, radius, gap, icon sizes, text styles, icon-only squares).

- Border: 1px inside (§4.2), in every size and state. See "Mapping notes".

#### Colours (resting)

| Part | Token |
|---|---|
| Background | `bg-action-inverse` |
| Border (1px, inside) | `border-subtle` |
| Label | `text-dark_both` |
| Icon | `fg-dark_both` |

Hover, pressed, focus and disabled colours are in `NlButton` (§7.2).

#### States

None of its own (§7.2).

#### Behaviour and accessibility

As `NlButtonBase`.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Variants | One look only. D12 gives `NlButton` a `variant` for every tone | `NlButton`'s types allow only `variant="primary"` (or none) with `tone="white"`, so a white secondary is a type error, not a silent change. Applied in `NlButton` (#27) | Approved (OD-54) |
| Border on small and xsmall | Present at rest, missing on hover, pressed and disabled in small and xsmall. Present in every state for large and medium | 1px `border-subtle` in every size and state (treated as a drawing slip) | Approved |
| Large text style | 18/24 | `Button XL`, as `NlButtonBase` | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size`, default `medium`, passed to `NlButtonBase` |
| Icon, icon name | `icon`, `iconName`, passed to `NlButtonBase` (icon-only included) |
| Label | `children` |
| Variant | None. Always `variant="primary"` on the base, and `data-tone="white"` |
| Colours | `appearance` from `NlWhiteButton.styles.ts`; `NlButton` can replace it to add states |
| Element | `as`, `href`, passed to `NlButtonBase` |

#### API

```tsx
import { NlWhiteButton } from '../NlWhiteButton'; // internal, not exported from @northline/ui

<NlWhiteButton size="small" icon="trailing" iconName="chevron_right">
  Join now
</NlWhiteButton>
```

Renders `NlButtonBase`. `className` and other native attributes go to it. Presentational, so no `'use client'`.

#### Tokens used

| Part | Tokens |
|---|---|
| Colours | `bg-action-inverse`; 1px inset ring `border-subtle` in every size; `text-dark_both`; icon `fg-dark_both` |
| Everything else | From `NlButtonBase` |

#### Build decisions

| Decision | Detail |
|---|---|
| Built on `NlButtonBase` | It passes a fixed white `appearance` and adds no markup or size classes, so the two can't drift apart (composition rule). The §8 dependency is `NlButtonBase` instead of `NlIcon` (designer's choice, 18 Nov 2026) |
| Contrast | Label and icon on white: 19.12 everywhere. White button against `bg-brand` and `bg-action-primary`: 4.82 (Garnet Dark) to 7.98 |
| Stories | Under `Internal/White button`, on a `bg-brand` panel. Flat controls, because Storybook's types can't infer through the icon union |

---

### NlDestructiveButton

**Level** Atom L1 · **Base** – (one of the three button bases, D12; built on `NlButtonBase`) · **Depends on** `NlButtonBase` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

The base for buttons that delete or remove something. Same anatomy, sizes and icon options as `NlButtonBase`. `NlButton` uses it when `tone="destructive"`.

#### Anatomy

As `NlButtonBase`.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Variant | primary, secondary, tertiary | `variant`. Tertiary is new (see "Mapping notes") |
| Size | large, medium, small, xsmall | `size` |
| Icon | none, leading, trailing, only-icon | `icon`, `iconName` |
| Label | text | `children` |

#### Sizes and layout

Identical to `NlButtonBase`. Secondary has a 2px inside border (§4.2).

#### Colours (resting)

| Variant | Background | Border (2px, inside) | Label | Icon |
|---|---|---|---|---|
| primary | `bg-action-destructive` | none | `text-white_both` | `fg-white_both` |
| secondary | none | `border-error` | `text-error` | `fg-error` |
| tertiary | none | none | `text-error` | `fg-error` |

Hover, pressed, focus and disabled colours are in `NlButton` (§7.2).

#### States

None of its own (§7.2).

#### Behaviour and accessibility

As `NlButtonBase`. A destructive action should name what it removes in its label ("Delete reward"). A confirmation step is the caller's job (for example `NlDialog`).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Tertiary | Not in the reference (primary and secondary only). D12 lists tertiary for every tone | Tertiary destructive = no background, no border, `text-error` / `fg-error`, with hover and pressed using the secondary destructive backgrounds | Approved |
| Large text style | 18/24 | `Button XL`, as `NlButtonBase` | Approved |
| Colours | As in the table | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Variant | `variant`: `primary` (default), `secondary`, `tertiary`, passed to `NlButtonBase` (`data-variant`). No `link`: the types reject it |
| Size, icon, icon name, label | Passed to `NlButtonBase` (icon-only included) |
| Marker | `data-tone="destructive"` |
| Colours | `appearance` per variant from `NlDestructiveButton.styles.ts`; `NlButton` can replace it to add states |
| Element | `as`, `href`, passed to `NlButtonBase` |

#### API

```tsx
import { NlDestructiveButton } from '../NlDestructiveButton'; // internal, not exported from @northline/ui

<NlDestructiveButton variant="secondary" icon="leading" iconName="delete">
  Delete reward
</NlDestructiveButton>
```

Renders `NlButtonBase`. `className` and other native attributes go to it. Presentational, so no `'use client'`.

#### Tokens used

| Variant | Button | Icon |
|---|---|---|
| primary | `bg-action-destructive`, `text-white_both` | `fg-white_both` |
| secondary | 2px inset ring `border-error`, `text-error` | `fg-error` |
| tertiary | `text-error` | `fg-error` |

Everything else from `NlButtonBase`.

#### Build decisions

| Decision | Detail |
|---|---|
| Built on `NlButtonBase` | As `NlWhiteButton`: a fixed `appearance` per variant, no markup or size classes of its own. The §8 dependency is `NlButtonBase` (designer's choice, 18 Nov 2026) |
| Contrast | The same in every brand. White on `bg-action-destructive` 6.22; `text-error` on `bg-primary` 9.17 / 10.38; `fg-error` 6.22 / 7.56; `border-error` 4.31 / 5.61 (Light / Dark) |

---

### NlButton

**Level** Atom L1 (built from its bases, takes their level) · **Base** `NlButtonBase`, `NlWhiteButton`, `NlDestructiveButton` (D12) · **Depends on** – · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-1, OD-40, OD-117. OD-55 to OD-59 decided 19 Nov 2026; OD-31 decided 19 Nov 2026 (xsmall icon-only button in fields).

The only public button. It picks the base by `tone`, passes `variant`, `size` and `icon` to it, and owns every interaction state.

#### Anatomy

As `NlButtonBase`: leading icon, label, trailing icon, or a single icon with a visually hidden label.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Tone | normal, white, destructive | `tone`, default `normal`, also `data-tone`. Picks the base |
| Variant | primary, secondary, tertiary, link | `variant`, default `primary`, also `data-variant`. Link: normal tone only, no icon-only |
| Content tone | default, inverse, primary, secondary, info, success, error, warning | `contentTone`, default `default`. Tertiary only, normal tone only. Recolours label and icon (see below) |
| Size | large, medium, small, xsmall | `size`, default `medium`, also `data-size` |
| Icon | none, leading, trailing, only-icon | `icon`, default `none`, also `data-icon` |
| Icon name | registry name | `iconName?: NlIconName` |
| Label | text | `children` (required, also for icon-only, where it is visually hidden) |
| Disabled | on or off | `disabled` (native) |
| Element | button or link | `as` (for example a router link), `href` |
| Expanded | for buttons that open something | `aria-expanded` (passed through) |

#### Sizes and layout

From the base (see `NlButtonBase`).

#### Colours by state

**tone="normal"** (`NlButtonBase`)

| Variant | State | Background | Border | Label / icon |
|---|---|---|---|---|
| primary | enabled | `bg-action-primary` | – | `text-white_both` / `fg-white_both` |
| primary | hover | `bg-action-primary_hovered` | – | same |
| primary | pressed | `bg-action-primary_pressed` | – | same |
| primary | disabled | `bg-disabled` | – | `text-disabled-on_bg` / `fg-disabled-on_bg` |
| secondary | enabled | none | `border-active` | `text-action` / `fg-action` |
| secondary | hover | `bg-action-secondary_hovered` | `border-hovered` | `text-hovered` / `fg-hovered` |
| secondary | pressed | `bg-action-secondary_pressed` | `border-pressed` | `text-pressed` / `fg-pressed` |
| secondary | disabled | none | `border-disabled` | `text-disabled` / `fg-disabled` |
| tertiary | enabled | none | – | `text-action` / `fg-action` |
| tertiary | hover | `bg-action-secondary_hovered` | – | `text-hovered` / `fg-hovered` |
| tertiary | pressed | `bg-action-secondary_pressed` | – | `text-pressed` / `fg-pressed` |
| tertiary | disabled | none | – | `text-disabled` / `fg-disabled` |
| link | enabled | none | – | `text-action` / `fg-action` |
| link | hover | none | – | `text-action`, label underlined / `fg-action` |
| link | pressed | none | – | `text-pressed`, label underlined / `fg-pressed` |
| link | disabled | none | – | `text-disabled` / `fg-disabled` |

- Link underline: on the label only, never under the icon. Thickness uses Tailwind's 1px decoration (§4.2).

**Content tones** (tertiary, normal tone only)

| `contentTone` | Label / icon (every state except disabled) | Hover background | Pressed background |
|---|---|---|---|
| default | as tertiary above | as tertiary | as tertiary |
| inverse | `text-inverse` / `fg-inverse` | `Alpha-light` | `Alpha-light` |
| primary | `text-primary` / `fg-primary` | `Alpha-sm` | `Alpha-sm` |
| secondary | `text-secondary` / `fg-secondary` | `Alpha-sm` | `Alpha-sm` |
| info | `text-info` / `fg-info` | `Alpha-sm` | `Alpha-sm` |
| success | `text-success` / `fg-success` | `Alpha-sm` | `Alpha-sm` |
| error | `text-error` / `fg-error` | `Alpha-sm` | `Alpha-sm` |
| warning | `text-warning` / `fg-warning` | `Alpha-sm` | `Alpha-sm` |

- Disabled with any content tone: `text-disabled` / `fg-disabled`, no background.
- Used by the snackbar (inverse, on `bg-direct`), banners (the matching status tone) and the side sheet close button (secondary).

**tone="white"** (`NlWhiteButton`, one look)

| State | Background | Border (1px) | Label / icon |
|---|---|---|---|
| enabled | `bg-action-inverse` | `border-subtle` | `text-dark_both` / `fg-dark_both` |
| hover | `bg-active` | `border-subtle` | `text-hovered` / `fg-hovered` |
| pressed | `bg-action-secondary_pressed` | `border-subtle` | `text-pressed` / `fg-pressed` |
| disabled | `bg-disabled` | `border-subtle` | `text-disabled-on_bg` / `fg-disabled-on_bg` |

**tone="destructive"** (`NlDestructiveButton`)

| Variant | State | Background | Border | Label / icon |
|---|---|---|---|---|
| primary | enabled | `bg-action-destructive` | – | `text-white_both` / `fg-white_both` |
| primary | hover | `bg-action-destructive_hovered` | – | same |
| primary | pressed | `bg-action-destructive_pressed` | – | same |
| primary | disabled | `bg-disabled` | – | `text-disabled-on_bg` / `fg-disabled-on_bg` |
| secondary | enabled | none | `border-error` | `text-error` / `fg-error` |
| secondary | hover | `bg-action-destructive-secondary_hovered` | `border-error` | `text-error` / `fg-error` |
| secondary | pressed | `bg-action-destructive-secondary_pressed` | `border-error` | `text-error` / `fg-error` |
| secondary | disabled | none | `border-disabled` | `text-disabled` / `fg-disabled` |
| tertiary | enabled | none | – | `text-error` / `fg-error` |
| tertiary | hover | `bg-action-destructive-secondary_hovered` | – | `text-error` / `fg-error` |
| tertiary | pressed | `bg-action-destructive-secondary_pressed` | – | `text-error` / `fg-error` |
| tertiary | disabled | none | – | `text-disabled` / `fg-disabled` |

**Focus (every tone and variant):** the standard ring from CLAUDE.md (2px, offset −1, `border-focused`), keyboard only.

#### States

Enabled, hover, pressed, focus, disabled. `aria-expanded="true"` (a button that opened a menu) uses the pressed look. See "Mapping notes".

#### Behaviour and accessibility

- Native `<button type="button">`. Enter and Space activate it. With `as`, a link: Enter activates.
- Disabled: native `disabled`, not focusable, no hover or press (§7.3). For a link, no `href` and `aria-disabled="true"`.
- Icon-only: the label stays in the DOM as visually hidden text, so the button always has a name (D12). A tooltip with the same text is recommended for sighted users.
- A screen reader hears the label and "button", for example "Add reward, button". With `aria-expanded`, it also hears "collapsed" or "expanded".
- Colour changes use `--nl-duration-fast`; none under reduced motion.
- Pointer target: every size meets 24 × 24.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Link variant | The reference's button set has a fourth type, "link": tertiary sizes, no background in any state, label underlined on hover and press, `text-pressed` when pressed, normal tone only, no icon-only | Included as in the reference | Approved. D12 updated to list link |
| Content tones on tertiary | The reference's description says code lets tertiary buttons recolour their label and icon (on snackbars, banners and side sheet close), with hover and press tinted by `Alpha-light` (on inverse) or `Alpha-sm` | `contentTone` prop, tertiary and normal tone only, values and colours as above | Approved. D12 updated |
| Separate icon tone | The reference's description also has a code-only option that recolours only the icon (secondary, for a close button) | Not added. An icon-only close button has no visible label, so `contentTone="secondary"` gives the same result | Approved (OD-55) |
| Destructive tertiary | Not in the reference | As in the table above | Approved |
| Secondary pressed (medium and xsmall) | `bg-active-hover`, while large and small use `bg-action-secondary_pressed` | `bg-action-secondary_pressed` for every size (treated as a drawing slip) | Approved |
| Pressed and hover with the same token | Content tones use the same alpha for hover and press | Kept as in the reference's description | Approved (OD-56) |
| Focus ring | 2px outside, 1 away from the edge | Standard ring from CLAUDE.md | Matches the rule |
| Expanded look | The reference's "row actions" button has an "open" state | Pressed look when `aria-expanded="true"` | Approved (OD-57) |
| Large text style | 18/24 | `Button XL` (see `NlButtonBase`) | Approved. **To be added to DESIGN.md §3.4** |
| Defaults | Not set | `tone="normal"`, `variant="primary"`, `size="medium"`, `icon="none"` | Approved (OD-58) |
| Loading state | Not in the reference | Left out for now; adding it later is not breaking | Approved (OD-59) |

#### Spec → code

| Spec option | Code |
|---|---|
| Tone | `tone`: `normal` (default), `white`, `destructive`, also `data-tone`. Picks `NlButtonBase`, `NlWhiteButton` or `NlDestructiveButton` |
| Variant | `variant`: `primary` (default), `secondary`, `tertiary`, `link`, also `data-variant`. The types allow only `primary` with `white` (OD-54) and no `link` with `destructive` |
| Content tone | `contentTone`: `default` (default), `inverse`, `primary`, `secondary`, `info`, `success`, `error`, `warning`. The types allow it only with `variant="tertiary"` and the normal tone |
| Size, icon, icon name, label | Passed to the base. The types forbid `icon="only-icon"` with `link` |
| States | Hover, pressed, expanded, disabled and focus, through `appearance` (whole class sets in `NlButton.styles.ts`) |
| Disabled | `disabled`: native on a button. On a link (`as`): no `href`, `aria-disabled="true"`, clicks ignored |
| Expanded | `aria-expanded`, passed through; `"true"` uses the pressed look (OD-57) |
| Element | `as`, `href`, passed to the base |

#### API

```tsx
import { NlButton } from '@northline/ui';

<NlButton>Save changes</NlButton>
<NlButton variant="secondary" icon="leading" iconName="add">Add reward</NlButton>
<NlButton tone="destructive" variant="tertiary">Delete reward</NlButton>
<NlButton tone="white">Join now</NlButton>
<NlButton variant="tertiary" contentTone="inverse" icon="only-icon" iconName="close">Close</NlButton>
<NlButton as="a" href="/rewards" variant="link">View details</NlButton>
```

`className` (placement only) and native attributes go to the button. Presentational, so no `'use client'`.

#### Tokens used

The tables in "Colours by state", as written. Colour changes use `--nl-duration-fast` (`nl:transition-colors nl:duration-fast`), none under reduced motion. Sizes, radius, text styles and the focus ring from `NlButtonBase`.

#### Build decisions

| Decision | Detail |
|---|---|
| State selectors | Hover, pressed and expanded use `not-disabled:not-aria-disabled:` instead of `enabled:` (CLAUDE.md Tailwind rule 3), because `:enabled` never matches a link (`as="a"`). Same result for buttons. Approved by the designer as a rule 9 exception, 19 Nov 2026 |
| Expanded over hover | Expanded sorts after hover, so an open button keeps the pressed look under the pointer |
| Link underline | On a label span added to `NlButtonBase` (`data-slot="label"`, `appearance.label`), because an underline on the button also ran under the icon. Disabled links have none |
| Icon states | The icon slot follows the button through the named group `button`; disabled sorts last, so a disabled button's icon keeps the disabled colour |

#### Link content tones and flush (added 20 Nov 2026)

For `NlBanner` (designer's choice): `variant="link"` takes `contentTone` (the tertiary set: label and icon keep the tone in every state except disabled, no background, underline on hover, press and expanded) and `flush` (link only: `labelledFlush` in `NlButtonBase`, the labelled height with `Space-none` side padding, so the label lines up with the text around it). Types: content tones are tertiary and link only; `flush` is link only.

---

### NlCheckboxControl

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon` · **Internal** (used by `NlCheckbox`, checkbox list items and table cells)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-60 decided 19 Nov 2026.

The bare checkbox: a rounded square that is empty, ticked or shows a dash (indeterminate).

#### Anatomy

```
NlCheckboxControl (24 × 24 hit area)
└── box (rounded square)
    └── NlIcon (tick or dash; selected and indeterminate only)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | unselected, selected, indeterminate | `checked` / `defaultChecked` (native), `indeterminate?: boolean` |
| Disabled | on or off | `disabled` (native) |
| Accessible name | text | `aria-label`, `aria-labelledby` or a wrapping `<label>` (required) |
| Change | callback | `onChange` (native) |

Hover, pressed and focus are CSS states (§7.3).

#### Sizes and layout

| Part | Size | Radius | Border |
|---|---|---|---|
| Hit area | `Size-24` | – | – |
| Box | `Size-20`, centred | `Radius-XS` | 2px inside (§4.2), unselected only |
| Icon | `NlIcon` 16: `check` (selected) or `remove` (indeterminate) | – | – |

#### Colours

| Type | State | Box fill | Box border | Icon |
|---|---|---|---|---|
| unselected | enabled | none | `border-strong` | – |
| unselected | hover | `bg-active-hover` | `border-hovered` | – |
| unselected | pressed | `bg-active-hover` | `border-pressed` | – |
| unselected | disabled | none | `fg-disabled` | – |
| selected / indeterminate | enabled | `bg-action-primary` | – | `fg-white_both` |
| selected / indeterminate | hover | `fg-hovered` | – | `fg-white_both` |
| selected / indeterminate | pressed | `fg-pressed` | – | `fg-white_both` |
| selected / indeterminate | disabled | `fg-disabled` | – | `fg-disabled-on_bg` |
| any | focus | as above, plus the standard focus ring from CLAUDE.md (`border-focused`) | | |

#### States

Enabled, hover, pressed, focus, disabled, for each of unselected, selected and indeterminate.

#### Behaviour and accessibility

- Native `<input type="checkbox">`, visually replaced. `indeterminate` is set on the element through a ref (it has no HTML attribute).
- Keyboard: Tab to focus, Space toggles. Indeterminate becomes checked on activation.
- A screen reader hears the name, "checkbox", and "checked", "not checked" or "mixed".
- Disabled: native, not focusable (§7.3).
- Contrast: the unselected border on `bg-primary` must reach 3 to 1 in every brand and theme (see "Mapping notes").

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Box size | Raw 18 (no `Size-18` token) | `Size-20`, the same as the radio ring, inside the `Size-24` hit area | Approved |
| Unselected border | `border-default` (Neutral-100 in Light), which is too faint for a control outline (3 to 1 needed) | `border-strong`, as used for the radio and described in §3.3 | Approved |
| Unselected pressed fill | `bg-action-primary_pressed`, a dark brand fill with no tick, which looks like a selected box with the tick missing | `bg-active-hover` (as hover) with `border-pressed` | Approved |
| Selected hover and pressed fills | `fg-hovered` and `fg-pressed` (foreground tokens used as fills) | Kept | Matches |
| Focus ring | 2px outside, `border-focused`, `Radius-XS` | Standard ring from CLAUDE.md | Matches the rule |
| Icons | `check` and `remove` from the reference's icon set | Material Symbols `check` and `remove` | Approved (OD-60) |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | `checked` / `defaultChecked` (native) and `indeterminate?: boolean`, set on the input in an effect after every render and again after each change. The box and icons follow the input through CSS (`:checked`, `:indeterminate`), so uncontrolled use works too |
| Disabled | `disabled` (native). The root gets no pointer events, so hover and press never show |
| Accessible name | `aria-label`, `aria-labelledby` or a wrapping `<label>`. Not required by the type, because a wrapping label is valid (as `NlRadio`) |
| Change | `onChange` (native) |
| Element | Native attributes and `ref` go to the input; `className` to the 24 × 24 root, for placement only |

#### API

```tsx
import { NlCheckboxControl } from '../NlCheckboxControl'; // internal, not exported from @northline/ui

<label>
  <NlCheckboxControl checked={selected} onChange={(e) => setSelected(e.target.checked)} />
  Member 0042
</label>
<NlCheckboxControl aria-label="Select all members" checked={all} indeterminate={some} onChange={toggleAll} />
```

`'use client'` (an effect sets `indeterminate`).

#### Tokens used

The table in "Colours", as written. Hit area `Size-24`, box `Size-20`, `Radius-XS` on both, 2px border (`nl:border-2`); selected and indeterminate use a transparent border so the fill covers the box. `NlIcon` 16. Colour changes use `--nl-duration-fast`, none under reduced motion.

#### Build decisions

| Decision | Detail |
|---|---|
| Focus ring | The standard ring around the 24 × 24 hit area with `Radius-XS` (designer's choice, 19 Nov 2026) |
| Unselected hover | `bg-active-hover` for hover and pressed, as in the spec (the radio uses `bg-active` for hover) (designer's choice, 19 Nov 2026) |
| Icons | Both icons are rendered; CSS shows the tick when checked and the dash when indeterminate (the dash wins if both are true) |
| Indeterminate is the caller's | Activating a mixed checkbox makes it checked; the caller clears `indeterminate` in `onChange`. While the prop stays true the dash stays |

---

### NlSpinner

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-61 to OD-64 decided 19 Nov 2026.

A round loading indicator. It can end in a success tick or an error mark. The "with text" version is left out (D13).

#### Anatomy

```
NlSpinner (48 × 48 box)
├── track (full ring)                 ─┐ loading
├── arc (part of the ring, brand)     ─┘
└── result: circle with NlIcon        ── success or error
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Status | loading, success, error | `status`, default `loading`, also `data-status` |
| Progress | none (spinning) or 0 to 100 | `value?: number`. See "Mapping notes" |
| Accessible name | text | `label: string` (required), for example "Loading rewards" |

#### Sizes and layout

| Part | Size | Other |
|---|---|---|
| Box | `Size-48` | Content centred |
| Ring (track and arc) | `Size-40` diameter | Ring thickness: see "Mapping notes" (4 in the reference) |
| Result circle | `Size-48`, `Radius-Full` | `NlIcon` 24, centred |

#### Colours

| Part | Token |
|---|---|
| Track | `bg-active-hover` |
| Arc | `fg-brand` |
| Success circle / icon | `bg-success_secondary` / `fg-success` (`check`) |
| Error circle / icon | `bg-error_secondary` / `fg-error` (`warning`) |

#### States

Loading, success, error. Not interactive.

#### Behaviour and accessibility

- Loading: `role="progressbar"`, `aria-label={label}`, and `aria-valuenow` only when `value` is set. A spinning ring has no value.
- Success and error: `role="status"`, so the change is announced politely. The accessible text is the label plus the status ("Upload complete", "Upload failed"), passed by the caller through `label`.
- Animation: the arc turns continuously, one turn per `--nl-duration-pulse`, linear. Reduced motion: no rotation, the arc stays still and the label carries the meaning.
- Contrast: the arc against the track needs 3 to 1 (token audit).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Ring thickness | Raw 4 (stroke and arc) | §4.2 allows only 1px and 2px borders. The ring is drawn as an SVG stroke, not a border. Proposed: keep 4 as the SVG `stroke-width`, treated as artwork (§2.1 exception), with a comment | Approved (OD-61) |
| 25%, 50%, 75% variants | Three arcs of different lengths. They could be animation frames or progress values | Proposed: by default an indeterminate spinner (a quarter arc that turns), plus an optional `value` that sets the arc length for a determinate ring | Approved (OD-62) |
| Rotation speed | Not in the reference | One turn per `--nl-duration-pulse` (1600ms), linear | Approved (OD-63) |
| Error icon | A warning triangle (outlined) from the reference's icon set | Material Symbols `warning` | Approved (OD-64) |
| Success icon | `check` | Material Symbols `check` | Matches |
| Sizes | Only 48 | Only 48 (`Size-48`). Add sizes only if a component needs one | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Status | `status?: 'loading' \| 'success' \| 'error'`, default `loading`, also `data-status` |
| Progress | `value?: number`, clamped to 0–100. Without it, a quarter arc turns; with it, the arc length is the value (`--nl-spinner-value` on a `pathLength` of 100) and the ring doesn't turn |
| Accessible name | `label: string`, required. While loading: the progressbar's `aria-label`. Success or error: the text of the status region |
| Element | `<span>` root; native attributes and `ref` go to it, `className` (placement only) last |

#### API

```tsx
import { NlSpinner } from '@northline/ui';

<NlSpinner label="Loading rewards" />
<NlSpinner label="Uploading file" value={40} />
<NlSpinner status="success" label="Upload complete" />
<NlSpinner status="error" label="Upload failed" />
```

Presentational, so no `'use client'`.

#### Tokens used

| Part | Token |
|---|---|
| Box / ring / result | `Size-48` / `Size-40` / `Size-48` with `Radius-Full` |
| Track / arc | `bg-active-hover` / `fg-brand` (through `nl:spinner-track` and `nl:spinner-arc`) |
| Success | `bg-success_secondary`, `fg-success`, `NlIcon` 24 `check` |
| Error | `bg-error_secondary`, `fg-error`, `NlIcon` 24 `warning` |
| Turning | `--nl-duration-pulse`, linear (`nl:animate-spinner-turn`); `nl:motion-reduce:animate-none` |

Arc on track contrast: 3.92 to 5.75 in every brand and theme (`docs/TOKEN_AUDIT.md`).

#### Build decisions

| Decision | Detail |
|---|---|
| Utilities | `nl:spinner-track`, `nl:spinner-arc`, `nl:spinner-value` and `nl:animate-spinner-turn` in `tailwind.css`: the theme has no stroke colours, the arc length is data, and Tailwind's spin is fixed at 1s. Approved by the designer, 19 Nov 2026 (rule 9) |
| Ring artwork | SVG `viewBox` 40, radius 18, `stroke-width` 4, round ends, starting at the top (OD-61) |
| Announcing the result | A visually hidden `role="status"` region is always rendered: empty while loading, the label on success or error, so the change is announced (designer's choice, 19 Nov 2026). The result circle is `aria-hidden` |
| Value 0 | With round ends, `value={0}` shows a dot at the top |

---

### NlLabel

**Level** Atom L1 · **Base** none · **Depends on** `NlCountBadge` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-50, OD-65 and OD-66 decided 19 Nov 2026.

A small, low-emphasis label, optionally followed by a dot badge. Used above headings (in the `NlTextBlock` label slot), in list rows, the calendar header, steps and table headers.

#### Anatomy

```
NlLabel (horizontal)
├── text
└── NlCountBadge (optional; dot form)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | medium, small | `size`, default `medium`, also `data-size` |
| Text | text | `children` |
| Show badge | off (default) or on | `badge?: boolean` |
| Badge tone | error (reference), warning, success | `badgeTone?`, default `error` |
| Badge meaning | text for screen readers | `badgeLabel?: string` (required when `badge` is on) |
| Element | span or a form label | `as?: 'span' \| 'label'`, with `htmlFor` when it is a label |

#### Sizes and layout

| Size | Text style | Badge |
|---|---|---|
| medium | `Label M` | `NlCountBadge` small, dot form |
| small | `Label S` | `NlCountBadge` small, dot form |

- Horizontal, gap `Space-M`, padding `Space-none`, items centred vertically, aligned to the start.
- Width hugs the content.

#### Colours

| Part | Token |
|---|---|
| Text | `text-tertiary` |
| Badge | from `NlCountBadge` (`badgeTone`) |

#### States

None. Not interactive.

#### Behaviour and accessibility

- A `<span>` by default. As a form label (`as="label"`), it names its control.
- The dot badge has no text of its own. `badgeLabel` gives it hidden text (for example "New"), read after the label.
- Colour isn't the only signal: when the dot means something, the meaning is in `badgeLabel`.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Badge form | Always the small dot, red, hidden by default | `NlCountBadge` small dot, `tone="error"` by default | Matches |
| Badge tone option | Only red in the reference | `badgeTone` added for warning and success | Approved (OD-65) |
| Gap | `Space-M` | Same | Matches |
| `as="label"` | Not in the reference | Added so the label can name form controls | Approved (OD-66) |
| Tone | Fixed `text-tertiary`. `NlStep` and `NlCalendar` need other colours | `tone`: tertiary (default), primary, secondary, action | Approved (OD-50) |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'medium' \| 'small'`, default `medium`, also `data-size`. `nl:text-label-m` / `nl:text-label-s` |
| Tone | `tone?: 'tertiary' \| 'primary' \| 'secondary' \| 'action'`, default `tertiary`, also `data-tone` (OD-50) |
| Text | `children` |
| Show badge | `badge?: boolean`, default off. `NlCountBadge` small, dot form, after the text |
| Badge tone | `badgeTone?: 'error' \| 'warning' \| 'success'`, default `error` (OD-65) |
| Badge meaning | `badgeLabel: string`, required by the types when `badge` is on; `NlCountBadge`'s hidden `label` |
| Element | `as?: 'span' \| 'label'`, default `span`; `htmlFor` with `label` (OD-66). Native attributes and `ref` go to the element, `className` (placement only) last |

#### API

```tsx
import { NlLabel } from '@northline/ui';

<NlLabel>Tier 2</NlLabel>
<NlLabel size="small" tone="secondary">Mon</NlLabel>
<NlLabel badge badgeLabel="New">Rewards</NlLabel>
<NlLabel as="label" htmlFor="member-id">Member ID</NlLabel>
```

Presentational, so no `'use client'`.

#### Tokens used

| Part | Token |
|---|---|
| Layout | `Space-M` gap, `Space-none` padding |
| Text style | `Label M`, `Label S` |
| Text colour | `text-tertiary` (default), `text-primary`, `text-secondary`, `text-action` |
| Badge | `NlCountBadge` small dot, `badgeTone` |

#### Build decisions

| Decision | Detail |
|---|---|
| Tertiary and secondary | Light: Neutral-600 and Neutral-500; Dark: Neutral-300 and Neutral-200. Close, so they look alike in some brands (token values, not changed here) |

---

### NlChipBase

**Level** Atom L1 · **Base** – (this is the base) · **Depends on** `NlIcon` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

The shared shape of every chip: a compact rounded control with an optional leading item, a label and an optional trailing icon. It holds every option as props (§7.2). `NlFilterChip`, `NlAssistChip` and `NlInputChip` map onto it.

#### Anatomy

```
NlChipBase (rounded, horizontal)
└── content
    ├── leading slot (optional; usually NlIcon)
    ├── label
    └── trailing NlIcon (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Look | unselected, unselected-bordered, selected | `look`, also `data-look` |
| Size | xsmall, small, large | `size`, also `data-size` |
| Label | text | `children` |
| Leading | off, or a slot | `leading?: ReactNode` |
| Trailing icon | off, or a registry name | `trailingIcon?: NlIconName` |
| Trailing slot | off, or a slot (for `NlInputChip`'s remove button) | `trailing?: ReactNode`, instead of `trailingIcon` (designer's choice, 19 Nov 2026) |

#### Sizes and layout

| Size | Padding (block / inline) | Gap | Icon size | Text style | Rendered height |
|---|---|---|---|---|---|
| xsmall | `Space-XS` / `Space-M` | `Space-XS` | 16 | `Label S` | 26 (hugs) |
| small | `Space-S` / `Space-L` | `Space-M` | 16 | `Label M` | 33 (hugs) |
| large | `Space-M` / `Space-L` | `Space-M` | 20 | `Label L` | 40 (hugs) |

- Radius `Radius-XS` (D19). 1px inside border (§4.2).
- Height and width hug the content. Single line.

#### Colours (resting)

| Look | Background | Border (1px) | Shadow | Leading icon | Label | Trailing icon |
|---|---|---|---|---|---|---|
| unselected | `bg-primary` | `border-subtle` | none | `fg-secondary` | `text-primary` | `fg-secondary` |
| unselected-bordered | `bg-primary` | `border-default` | `--nl-shadow-resting` | `fg-secondary` | `text-primary` | `fg-secondary` |
| selected | `bg-active` | `border-active` | none | `fg-brand` | `text-action` | `fg-secondary` |

Hover, pressed, disabled and focus belong to the mapped chips (§7.2).

#### States

None of its own (§7.2).

#### Behaviour and accessibility

The element and role come from the mapped chip: a toggle button (filter), a button (assist) or a group with a remove button (input).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Heights | 26, 33 and 40 from padding plus line height. 26 and 33 aren't `Size-*` tokens | Hug the content, no fixed height | Approved |
| Leading slot gap | A raw 10 gap in one size's leading slot, with a single child | No gap | Matches |
| Shadow | A "resting cards" shadow (0 1 3, black at 5%) | `--nl-shadow-resting` | Matches |
| Padding, gaps, radius, text styles | As in the table | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Look | `look?: 'unselected' \| 'unselected-bordered' \| 'selected'`, default `unselected`, also `data-look` |
| Size | `size?: 'xsmall' \| 'small' \| 'large'`, default `small` (designer's choice, 19 Nov 2026), also `data-size` |
| Label | `children`, in `<span data-slot="label">` |
| Leading | `leading?: ReactNode` in a slot that carries the leading colour; an `NlIcon` with `tone="inherit"` follows it |
| Trailing | `trailingIcon?: NlIconName` (decorative `NlIcon` at the size's icon size) or `trailing?: ReactNode` (a slot); the types allow one or the other |
| Colours | The look's resting colours, or `appearance?: { chip, leading, trailing }` from the mapped chip, which replaces them (with states). The root carries the named group `chip` |
| Element | `as` (default `span`; a button for filter and assist chips). Button props in the types, as `NlButtonBase`. Native attributes and `ref` go to the element, `className` (placement only) last |

#### API

```tsx
import { NlChipBase } from '../NlChipBase'; // internal, not exported from @northline/ui

<NlChipBase look="selected" leading={<NlIcon name="check" size={16} tone="inherit" />} trailingIcon="keyboard_arrow_down">
  This week
</NlChipBase>
```

Presentational, so no `'use client'`.

#### Tokens used

| Part | Token |
|---|---|
| Padding / gap / text | xsmall `Space-XS` / `Space-M`, `Space-XS`, `Label S`; small `Space-S` / `Space-L`, `Space-M`, `Label M`; large `Space-M` / `Space-L`, `Space-M`, `Label L` |
| Icons | 16, 16, 20 |
| Shape | `Radius-XS` (D19), 1px inset ring |
| Colours | The "Colours (resting)" table, as written; `--nl-shadow-resting` (`nl:shadow-resting`) on unselected-bordered |

Rendered heights measured in the browser: 26, 33 and 40, as in the reference.

---

### NlFilterChip

**Level** Atom L1 (mapped) · **Base** `NlChipBase` · **Depends on** – · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

An on/off filter, for example above a table. Several can be on at once.

#### Anatomy

As `NlChipBase`. The label only by default. A leading icon is optional.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Selected | off, on | `selected` / `defaultSelected`, `onSelectedChange(selected)` |
| Size | xsmall, small, large | `size`, default `small` |
| Disabled | on or off | `disabled` (native) |
| Label | text | `children` |
| Leading icon | optional | `leadingIcon?: NlIconName` |

Hover and pressed are CSS states (§7.3).

#### Sizes and layout

As `NlChipBase`. Base look: `unselected` when off, `selected` when on.

#### Colours by state

| Selected | State | Background | Border (1px) | Label |
|---|---|---|---|---|
| off | enabled | `bg-primary` | `border-subtle` | `text-primary` |
| off | hover | `bg-active-hover` | none | `text-primary` |
| off | pressed | `bg-action-primary_pressed` | none | `text-white_both` |
| off | disabled | `bg-disabled` | none | `text-disabled-on_bg` |
| on | enabled | `bg-active` | `border-active` | `text-action` |
| on | hover | `bg-active-hover` | `border-active` | `text-action` |
| on | pressed | `bg-action-primary_pressed` | `border-pressed` | `text-white_both` |
| on | disabled | `bg-disabled` | `border-disabled` | `text-disabled-on_bg` |
| any | focus | as above, plus the standard focus ring from CLAUDE.md (`border-focused`) | | |

A leading icon follows the label colour (`fg-primary` off, `fg-white_both` pressed, `fg-disabled-on_bg` disabled), except when on and enabled or hovered, where it uses `fg-brand` (designer's choice, 19 Nov 2026: `fg-primary` off, not the base's `fg-secondary`).

#### States

Enabled, hover, pressed, focus, disabled, each off and on.

#### Behaviour and accessibility

- A native `<button type="button" aria-pressed>`. Space or Enter toggles.
- A screen reader hears the label, "toggle button", and "pressed" or "not pressed", for example "Active members, toggle button, pressed".
- In an `NlChipGroup` with `selection="single"`, the group turns the chips into radios (see `NlChipGroup`).
- Disabled: native, not focusable (§7.3).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Pressed label colour | `text-inverse` on `bg-action-primary_pressed`. In Dark, `text-inverse` is `Neutral-900`, which puts dark text on a mid-brand fill | `text-white_both` (icon `fg-white_both`), white on the pressed brand fill in both themes, like a primary button | Approved |
| Off-state hover border | The border disappears on hover | Kept as in the reference | Matches |
| Focus | Not drawn | Standard ring from CLAUDE.md | Matches the rule |
| Default size | Not set | `small` | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Selected | `selected` (controlled) or `defaultSelected` (uncontrolled, default off), `onSelectedChange(selected)`. `aria-pressed`, `data-selected`. An `onClick` that calls `preventDefault()` stops the toggle |
| Size | `size?: 'xsmall' \| 'small' \| 'large'`, default `small` |
| Disabled | `disabled` (native) |
| Label | `children`, the accessible name |
| Leading icon | `leadingIcon?: NlIconName`, `NlIcon` 16 / 16 / 20, decorative |
| Base | `NlChipBase` with `as="button"`, `type="button"`, `look` `unselected` (off) or `selected` (on), and the state colours as `appearance` |

#### API

```tsx
import { NlFilterChip } from '@northline/ui';

<NlFilterChip>Active members</NlFilterChip>
<NlFilterChip selected={on} onSelectedChange={setOn} leadingIcon="check">Tier 2</NlFilterChip>
```

`'use client'` (uncontrolled state). `ref`, `className` (placement only) and native button attributes go to the button.

#### Tokens used

The "Colours by state" table, as written. "No border" is the 1px inset ring at width 0. Focus: the standard ring, following `Radius-XS` (D19). Colour changes use `--nl-duration-fast`, none under reduced motion. Sizes from `NlChipBase`.

---

### NlAssistChip

**Level** Atom L1 (mapped) · **Base** `NlChipBase` · **Depends on** – · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

A chip that runs an action or opens a menu or picker, for example a date range or a "more filters" menu.

#### Anatomy

As `NlChipBase`: optional leading icon, label, and a dropdown arrow when it opens something.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Dropdown | off, on | `dropdown?: boolean`. On adds the arrow and `aria-haspopup` |
| Open | closed, open (dropdown only) | `open?: boolean`, controlled by the menu it opens |
| Size | xsmall, small, large | `size`, default `small` |
| Disabled | on or off | `disabled` (native) |
| Label | text | `children` |
| Leading icon | optional | `leadingIcon?: NlIconName` |
| Click | callback | `onClick` |

#### Sizes and layout

As `NlChipBase`. Base look: `unselected-bordered` (closed) or `selected` (open). Arrow: `keyboard_arrow_down` when closed, `keyboard_arrow_up` when open.

#### Colours by state

| State | Background | Border | Shadow | Leading icon | Label | Arrow |
|---|---|---|---|---|---|---|
| enabled | `bg-primary` | `border-default` | `--nl-shadow-resting` | `fg-secondary` | `text-primary` | `fg-secondary` |
| hover | `bg-active-hover` | none | none | `fg-secondary` | `text-primary` | `fg-secondary` |
| pressed | `bg-action-primary_pressed` | none | none | `fg-white_both` | `text-white_both` | `fg-white_both` |
| open | `bg-active` | `border-active` | none | `fg-brand` | `text-action` | `fg-secondary` |
| disabled | `bg-disabled` | none | none | `fg-disabled-on_bg` | `text-disabled-on_bg` | `fg-disabled-on_bg` |
| focus | as the state, plus the standard focus ring from CLAUDE.md | | | | | |

Pressed uses `text-white_both` and `fg-white_both` instead of the reference's inverse tokens, as for `NlFilterChip`.

#### States

Enabled, hover, pressed, focus, disabled, and open for dropdown chips.

#### Behaviour and accessibility

- A native `<button type="button">`. Enter or Space activates.
- With `dropdown`: `aria-haspopup` (`menu`, `listbox` or `dialog`, matching what it opens), `aria-expanded`, `aria-controls`. Down arrow also opens the menu. Escape in the menu returns focus to the chip.
- A screen reader hears, for example, "Date range, button, collapsed, has popup".

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Pressed text and icon colour | `text-inverse` and `fg-inverse` (dark in Dark) on the pressed brand fill | `text-white_both` and `fg-white_both`, as for `NlFilterChip` | Approved |
| Hover drops border and shadow | As in the reference's description | Same | Matches |
| Open look | Selected look with the up arrow | Same | Matches |
| Arrow icons | From the reference's icon set | Material Symbols `keyboard_arrow_down` and `keyboard_arrow_up` | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Dropdown | `dropdown?: boolean`. On: trailing `keyboard_arrow_down` (closed) or `keyboard_arrow_up` (open), `aria-haspopup`, `aria-expanded`, `data-open` |
| Popup type | `popup?: 'menu' \| 'listbox' \| 'dialog'`, default `menu`, for `aria-haspopup` (dropdown only) |
| Open | `open?: boolean`, set by the parent and kept in sync with the menu (dropdown only; the types enforce it) |
| Open request | `onOpenChange?(open)`: a click asks for the opposite, Down arrow asks to open. Same signature as `NlMenu`'s. An `onClick` or `onKeyDown` that calls `preventDefault()` stops it |
| Size | `size?: 'xsmall' \| 'small' \| 'large'`, default `small` |
| Disabled, Click | `disabled`, `onClick` (native) |
| Label | `children`, the accessible name |
| Leading icon | `leadingIcon?: NlIconName`, `NlIcon` 16 / 16 / 20, decorative |
| Base | `NlChipBase` with `as="button"`, `type="button"`, `look` `unselected-bordered` (closed) or `selected` (open), and the state colours as `appearance`. `aria-controls`, `ref` and native attributes pass through |

#### API

```tsx
import { NlAssistChip, NlMenu } from '@northline/ui';

<NlAssistChip onClick={exportList}>Export</NlAssistChip>

<NlAssistChip ref={anchorRef} dropdown open={open} onOpenChange={setOpen} aria-controls="date-menu" leadingIcon="calendar_today">
  Date range
</NlAssistChip>
<NlMenu id="date-menu" aria-label="Date range" open={open} onOpenChange={setOpen} anchorRef={anchorRef}>…</NlMenu>
```

`'use client'` (event handlers). Escape and returning focus to the chip are `NlMenu`'s job.

#### Tokens used

The "Colours by state" table, as written. "No border" is the 1px inset ring at width 0, "no shadow" is `nl:shadow-none`. Focus: the standard ring, following `Radius-XS` (D19). Colour changes use `--nl-duration-fast`, none under reduced motion. Sizes from `NlChipBase`.

#### Build decisions

| Decision | Detail |
|---|---|
| Open under the pointer | Hovering an open chip keeps the open look; pressing still shows the pressed look (designer's choice, 19 Nov 2026, as `NlButton` expanded) |
| With `NlMenu` | Checked in the browser: a click opens and closes, Down arrow opens and focuses the first row, Escape closes and returns focus to the chip |

---

### NlInputChip

**Level** Atom L1 (mapped) · **Base** `NlChipBase` · **Depends on** – · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

A chosen value shown as a chip, with a remove button. Used in `NlMultiSelect`.

#### Anatomy

```
NlInputChip (NlChipBase, bordered look)
├── leading slot (optional, off by default)
├── label
└── remove button (NlIcon close)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | xsmall, small, large | `size`, default `small` |
| Disabled | on or off | `disabled?: boolean` |
| Label | text | `children` |
| Leading | optional | `leading?: ReactNode` |
| Remove | callback | `onRemove()` |
| Remove name | text | `removeLabel?: string`, default "Remove {label}" |

#### Sizes and layout

As `NlChipBase`, `unselected-bordered` look. The remove icon is `close` at 16 (xsmall, small) or 20 (large).

#### Colours by state

| State | Background | Border | Shadow | Label | Remove icon |
|---|---|---|---|---|---|
| enabled | `bg-primary` | `border-default` | `--nl-shadow-resting` | `text-primary` | `fg-secondary` |
| disabled | `bg-disabled` | none | none | `text-disabled-on_bg` | `fg-disabled-on_bg` |
| remove button hover and press | unchanged | | | | `fg-primary` |
| remove button focus | standard focus ring from CLAUDE.md, around the remove button | | | | |

#### States

Enabled and disabled for the chip. The remove button has focus, and see "Mapping notes" for hover and press.

#### Behaviour and accessibility

- The chip itself isn't interactive. It's a `<span>` holding the label and a `<button type="button">` for remove.
- The remove button's name is "Remove {label}", for example "Remove Tier 2". Enter or Space removes.
- Backspace or Delete on the focused remove button also removes. After removal, focus moves to the next chip's remove button, or to the field input if none is left (`NlMultiSelect` handles this).
- Disabled: no remove button.
- Pointer target: the remove icon is 16. Its button is padded to at least 24 × 24 (CLAUDE.md minimum) without changing the chip's look. See "Mapping notes".

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Remove button hover and press | None drawn (cursor only, per the reference's description) | The icon turns `fg-primary` on hover and press | Approved |
| Remove button target size | 16 icon with no padding | A 24 × 24 hit area (`Size-24`) centred on the icon, using negative margin so the chip's size doesn't change | Approved |
| Disabled | No stroke, no shadow, no remove action | Same | Matches |
| Leading slot | Off by default | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'xsmall' \| 'small' \| 'large'`, default `small` |
| Disabled | `disabled?: boolean`: disabled colours, no remove button, `data-disabled` |
| Label | `children`, in a span whose id names the remove button |
| Leading | `leading?: ReactNode`, off by default (inherits `fg-secondary`) |
| Remove | `onRemove()`: click, Enter, Space, and Backspace or Delete on the focused remove button |
| Remove name | `removeLabel?: string`. Default: a hidden "Remove" plus the label (`aria-labelledby`), so any label content works |
| Base | `NlChipBase`, `look="unselected-bordered"`, colours as `appearance`, the remove button in the `trailing` slot. The chip is a `<span>`; `ref`, native attributes and `className` (placement only) go to it |

#### API

```tsx
import { NlInputChip } from '@northline/ui';

<NlInputChip onRemove={() => remove('tier-2')}>Tier 2</NlInputChip>
<NlInputChip disabled>Tier 2</NlInputChip>
```

`'use client'` (`useId`, event handlers). Moving focus after a removal is the caller's job (`NlMultiSelect`).

#### Tokens used

| Part | Token |
|---|---|
| Chip | Enabled `bg-primary`, 1px inset ring `border-default`, `--nl-shadow-resting`, `text-primary`. Disabled `bg-disabled`, `text-disabled-on_bg`, no border or shadow |
| Remove icon | `NlIcon` `close` 16 / 16 / 20, `fg-secondary`, `fg-primary` on hover and press |
| Remove target | `Size-24`, negative margin `Space-XS` (16 icon) or `Space-XXS` (20 icon); focus ring `Radius-XS` |
| Motion | `--nl-duration-fast`, none under reduced motion |

Rendered heights measured in the browser: 26, 33 and 40, the same as `NlChipBase`.

#### Build decisions

| Decision | Detail |
|---|---|
| Remove button | A native button with `NlIcon`, not `NlButton`: `NlButton`'s smallest icon-only size (32) would make the chip taller (designer's choice, 19 Nov 2026) |
| Focus ring | Around the 24 × 24 target, `Radius-XS` (designer's choice, 19 Nov 2026) |
| Disabled contrast | Under 4.5:1 by design; known issue K5 (accepted by the designer, 19 Nov 2026) |

#### Not removable (added 20 Nov 2026, with `NlMultiSelect` #71, OD-136)

`removable?: boolean`, default `true`. `false` leaves out the remove button, for `NlMultiSelect`'s "+N" chip (same look, no remove button).

---

### NlSegment

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon` · **Internal** (used only by `NlSegmentedButton`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-67 and OD-68 decided 19 Nov 2026.

One option in a segmented button: a label with an optional leading icon, or an icon on its own.

#### Anatomy

```
NlSegment (rounded, horizontal)
└── content
    ├── leading NlIcon (optional)
    └── label (visible, or visually hidden for icon-only)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Selected | unselected, selected | `selected: boolean` (set by the group) |
| Size | medium, small, xsmall | `size` (set by the group) |
| Icon only | off, on | `iconOnly?: boolean` (set by the group) |
| Icon | optional | `icon?: NlIconName` |
| Label | text | `children` (always required; hidden when icon-only) |
| Disabled | on or off | `disabled` |

#### Sizes and layout

| Size | Height | Padding (block / inline) | Gap | Radius | Icon | Text style | Icon-only square (padding) |
|---|---|---|---|---|---|---|---|
| medium | `Size-40` | `Space-M` / `Space-3XL` | `Space-M` | `Radius-XS` (D19) | 20 | `Button M` | `Size-36` (`Space-M`) |
| small | `Size-32` | `Space-XS` / `Space-L` | `Space-XS` | `Radius-XS` (D19) | 20 | `Button S` | see "Mapping notes" (`Space-XS`) |
| xsmall | `Size-24` | `Space-none` / `Space-M` | `Space-XS` | `Radius-S` | 16 | `Button S` | `Size-24` (`Space-XS`) |

- Width: the group decides (equal widths filling the group, or hugging for icon-only).

#### Colours

| Selected | State | Background | Label | Icon |
|---|---|---|---|---|
| selected | enabled | `bg-primary` | `text-primary` | `fg-secondary`, filled |
| selected | hover | `bg-secondary` | `text-primary` | `fg-secondary`, filled |
| selected | pressed | `bg-tertiary` | `text-primary` | `fg-secondary`, filled |
| selected | disabled | `bg-disabled` | `text-disabled-on_bg` | `fg-disabled-on_bg` |
| unselected | enabled | none | `text-secondary` | `fg-secondary` |
| unselected | hover | none | `text-tertiary` | `fg-secondary` |
| unselected | pressed | none | `text-primary` | `fg-secondary` |
| unselected | disabled | none | `text-disabled` | `fg-disabled` |
| any | focus | as above, plus the standard focus ring from CLAUDE.md | | |

- Selected icons use the filled glyph (`NlIcon filled`, §6).

#### States

Enabled, hover, pressed, focus, disabled, each selected and unselected.

#### Behaviour and accessibility

- Each segment is a radio in the group's radio group (see `NlSegmentedButton`): `role="radio"` with `aria-checked`, or a native radio input, visually replaced.
- Icon-only: the label stays as visually hidden text. A tooltip with the same text is recommended.
- Disabled: not focusable and skipped by the arrow keys.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Text styles | A 14/24 style (medium) and a 12/24 style (small, xsmall) | `Button M` and `Button S` | Matches |
| Small icon-only square | 28 (20 icon + `Space-XS` all round). No `Size-28` token | Proposed: keep `Space-XS` padding around a 20 icon, so the size comes from padding (no fixed size token) | Approved (OD-67) |
| Unselected hover label | `text-tertiary`, which is darker than `text-secondary` in Light but lighter in Dark | Kept as in the reference | Approved (OD-68) |
| Filled icon when selected | Code only, per the reference's description | `NlIcon filled` | Matches §6 |
| Leading slot gap | A raw 10 gap with a single child | No gap | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Selected | `selected: boolean` (set by the group): `checked` on the native radio, `data-selected`. Colours picked per `selected` |
| Size | `size?: 'medium' \| 'small' \| 'xsmall'`, default `medium`, also `data-size` |
| Icon only | `iconOnly?: boolean`; the types require `icon` with it. The label stays as `nl:sr-only` text |
| Icon | `icon?: NlIconName`, `NlIcon` 20 / 20 / 16, `filled` when selected |
| Label | `children`, always required |
| Disabled | `disabled` (native on the radio); the root gets no pointer events |
| Element | `<label>` root with a transparent native `<input type="radio">` covering it. `name`, `value`, `onChange`, `ref` and native attributes go to the input; `className` (placement and width, from the group) to the root |

#### API

```tsx
import { NlSegment } from '../NlSegment'; // internal, not exported from @northline/ui

<div role="radiogroup" aria-label="Period">
  <NlSegment name="period" value="week" selected={value === 'week'} onChange={(e) => setValue(e.target.value)}>
    Week
  </NlSegment>
</div>
```

Presentational, so no `'use client'`. The browser's radio group gives arrow keys (wrapping) and skips disabled segments.

#### Tokens used

The "Sizes and layout" and "Colours" tables, as written. Small icon-only: `Space-XS` around the 20 icon (28, OD-67). Focus: the standard ring on the root. Colour changes use `--nl-duration-fast`, none under reduced motion.

Rendered sizes measured in the browser: labelled heights 40, 32 and 24; icon-only 36, 28 and 24.

#### Build decisions

| Decision | Detail |
|---|---|
| Native radio | A visually replaced `<input type="radio">`, not `role="radio"` (designer's choice, 19 Nov 2026): grouping and arrow keys come from the browser |
| Story surface | Stories sit on a `bg-tertiary` surface as a stand-in for the track. `NlSegmentedButton` sets the real track; in Dark, `bg-disabled` (disabled selected) is close to `bg-tertiary` |

---

### NlHelperText

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-43, OD-69 and OD-70 decided 19 Nov 2026.

A short line under a form field: a hint, or a success, warning or error message, with an optional leading icon.

#### Anatomy

```
NlHelperText (horizontal)
├── leading NlIcon (optional)
└── text
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| State | default, success, warning, error, disabled | `tone`, default `default`, also `data-tone` |
| Show leading icon | on (default) or off | `showIcon?: boolean`, default `true` |
| Text | text | `children` |
| Id | for the field to point at | `id` (the field uses it in `aria-describedby`) |

#### Sizes and layout

- Horizontal, gap `Space-M`, items centred vertically. Padding `Space-none`.
- Icon: `NlIcon` 20.
- Text style `Body S`. Wraps to more lines when needed; the icon stays aligned to the first line.
- Width fills the field.

#### Colours

| Tone | Icon | Icon glyph | Text |
|---|---|---|---|
| default | `fg-secondary` | `info` | `text-tertiary` (OD-43, as the fields use it) |
| success | `fg-success` | `check_circle` | `text-success` |
| warning | `fg-warning` | `warning` | `text-warning` |
| error | `fg-error` | `error` (OD-69) | `text-error` |
| disabled | `fg-disabled` | `info` | `text-disabled` |

#### States

The five tones above. Not interactive.

#### Behaviour and accessibility

- The field references it with `aria-describedby`, so a screen reader reads it after the field's name.
- Error tone: the field also sets `aria-invalid="true"`. When the error first appears it is announced through a polite live region in the field (owned by `NlInputBase`), not by this component.
- Colour isn't the only signal: the icon shape and the text differ by tone.
- The icon is decorative.

#### Mapping notes

| Item | Reference | Note | Status |
|---|---|---|---|
| Gap | `Space-M` | Same | Matches |
| Icon glyphs | Default and disabled use an info icon, success a check-circle, warning and error a warning icon | Material Symbols `info`, `check_circle`, `warning`. Error uses `error` (a circle with "!") so it differs from warning in shape | Approved (OD-69) |
| Multi-line alignment | Not drawn (single line only) | Icon centred on the first line | Approved (OD-70) |

#### Spec → code

| Spec option | Code |
|---|---|
| State | `tone?: 'default' \| 'success' \| 'warning' \| 'error' \| 'disabled'`, default `default`, also `data-tone` |
| Show leading icon | `showIcon?: boolean`, default `true`. Decorative `NlIcon` 20 |
| Text | `children` |
| Id | `id`, for the field's `aria-describedby`. Native attributes and `ref` go to the root `<div>`, `className` (placement only) last |

#### API

```tsx
import { NlHelperText } from '@northline/ui';

<input aria-describedby="member-help" aria-invalid="true" />
<NlHelperText id="member-help" tone="error">Enter a member number.</NlHelperText>
```

Presentational, so no `'use client'`. Not a live region: `NlInputBase` announces errors.

#### Tokens used

The "Colours" table, as written. Gap `Space-M`, padding `Space-none`, `Body S`, `NlIcon` 20.

#### Build decisions

| Decision | Detail |
|---|---|
| First-line alignment | Items start at the top; the icon sits in a slot one line of `Body S` high (`nl:h-lh`, 18) and is centred in it, so it is centred on the first line, wrapped or not. Measured in the browser: icon and first line share the same centre |
| Disabled contrast | `text-disabled` on `bg-primary`: known issue K3; story samples are marked |

---

### NlRowsPerPage

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon` · **Public** (used in the `NlTable` footer)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

The table footer control that shows and changes how many rows a page holds, for example "Rows per page: 10".

#### Anatomy

```
NlRowsPerPage (pill button)
├── label ("Rows per page")
├── value ("10")
└── NlIcon (keyboard_arrow_down)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Value | number | `value: number`, `onValueChange(value)` |
| Options | list of numbers | `options: number[]`, default `[10, 25, 50, 100]` |
| Label | text | `label?: string`, default "Rows per page" |
| Disabled | on or off | `disabled` |

#### Sizes and layout

- Horizontal, gap `Space-M`, padding `Space-XS` (block) / `Space-L` (inline). Items centred.
- Radius `Radius-Full`. 1px inside border (§4.2).
- Label text `Body S`. Value text `Label S`. Icon `NlIcon` 24.
- Height hugs (32 in the reference: 24 icon + padding).

#### Colours

| State | Background | Border | Label | Value | Icon |
|---|---|---|---|---|---|
| enabled | `bg-secondary` | `border-subtle` | `text-tertiary` | `text-primary` | `fg-secondary` |
| hover | `bg-tertiary` | `border-subtle` | `text-tertiary` | `text-primary` | `fg-secondary` |
| pressed / open | `bg-tertiary` | `border-subtle` | `text-tertiary` | `text-primary` | `fg-secondary` (arrow up when open) |
| disabled | `bg-disabled` | none | `text-disabled-on_bg` | `text-disabled-on_bg` | `fg-disabled-on_bg` |
| focus | as the state, plus the standard focus ring from CLAUDE.md | | | | |

#### States

Enabled, hover, pressed / open, focus, disabled. Pressed, open and disabled are added (not in the reference).

#### Behaviour and accessibility

- The trigger only. It doesn't render the options menu. `NlTable` opens an `NlMenu` (`kind="select"`) under it, with one `NlListItem` per option, so the menu is built from the list component.
- `aria-haspopup="listbox"`, `aria-expanded`. Its name includes the current value: "Rows per page, 10".
- Choosing an option closes the menu, updates the value and returns focus to the trigger.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| What it opens | Only the trigger is drawn | `NlRowsPerPage` stays the L1 trigger. `NlTable` renders `NlMenu` with `NlListItem` options under it, so `NlTable` contains only molecules and atoms (§7.1) | Approved |
| Arrow icons | Two 24 icons in the reference (one may be hidden in use) | One `keyboard_arrow_down`, `keyboard_arrow_up` when open | Approved |
| Pressed and open | Not drawn | `bg-tertiary`, as hover, with the arrow turned up when open | Approved |
| Disabled | Not drawn | `bg-disabled`, `text-disabled-on_bg`, `fg-disabled-on_bg`, no border | Approved |
| Variant property name | A generic "Property 1" | Not used | Matches |
| Label contrast in Dark | Not checked | `text-tertiary` on `bg-tertiary` (hover, pressed, open) is 4.47:1 in Dark, every brand, under 4.5:1. Kept as specified: known issue K7 | Accepted (K7, 20 Nov 2026) |

#### Spec → code

| Spec option | Code |
|---|---|
| Value | `value: number`, shown in Label S |
| Options, `onValueChange` | Not on the trigger: `NlTable` owns the options and the `NlMenu` (`kind="select"`) under it, and passes the chosen `value` back (see "What it opens") |
| Label | `label?: string`, default "Rows per page" |
| Open | `open?: boolean` (set by the parent, kept in sync with the menu), `onOpenChange?(open)`: a click asks for the opposite, Down arrow asks to open (as `NlMenu`). `data-open` |
| Disabled | Native `disabled` |
| Element | Native `<button type="button" aria-haspopup="listbox" aria-expanded>`; name is its visible text ("Rows per page 10"); pass `aria-controls` with the menu's id. `ref`, `className` and button attributes go to it. An `onClick` or `onKeyDown` that calls `preventDefault()` stops the request |

#### API

```tsx
import { NlRowsPerPage } from '@northline/ui';

<NlRowsPerPage value={10} open={open} onOpenChange={setOpen} aria-controls="rows-menu" ref={anchorRef} />
```

`'use client'` (event handlers).

#### Tokens used

The "Sizes and layout" and "Colours" tables, as written: `Space-M` gap, `Space-XS` / `Space-L` padding, `Radius-Full`, 1px inset ring `border-subtle`, Body S label, Label S value, `NlIcon` 24 (`keyboard_arrow_down`, `keyboard_arrow_up` when open), `bg-secondary`, `bg-tertiary` (hover, pressed, open), `bg-disabled`, `text-tertiary`, `text-primary`, `fg-secondary`, `text-disabled-on_bg`, `fg-disabled-on_bg`, the standard focus ring, Duration fast.

#### Build decisions

| Decision | Detail |
|---|---|
| Trigger only | Options and the menu live in `NlTable`; the stories pair it with `NlMenu` to show the flow |
| Label contrast | Known issue K7 (designer's choice, 20 Nov 2026): open samples are marked `data-a11y-known-issue="K7"`. The other options were `text-secondary` always (6.08 and over) or only on hover and open |

Checked in the browser: 32 high in every state; open shows the arrow up and `bg-tertiary`.

---

### NlNavIcon

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon` · **Internal** (used only by `NlNavItem`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-71 decided 19 Nov 2026.

The icon of a side nav section, which changes colour (and fill) when its section is current.

#### Anatomy

```
NlNavIcon
└── NlIcon (20)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Selected | unselected, selected | `selected: boolean` (set by `NlNavItem`) |
| Icon | registry name | `name: NlIconName` |

#### Sizes and layout

- `Size-20`. `NlIcon` at 20. No padding.

#### Colours

| Selected | Icon | Fill |
|---|---|---|
| unselected | `fg-secondary` | outlined |
| selected | `fg-active` | filled (§6) |

#### States

Unselected and selected. Hover and pressed come from `NlNavItem`, which may change the icon's colour through `tone="inherit"`. See `NlNavItem`.

#### Behaviour and accessibility

- Decorative (`aria-hidden`). The nav item's text names the link.
- In the minimized nav, the item shows only this icon. The item keeps its name as visually hidden text and shows a tooltip (see `NlNavItem`).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Selected fill | Colour change only in the drawing | Filled glyph when selected, as §6 asks for active states | Approved (OD-71) |
| Colours | `fg-secondary`, `fg-active` | Same | Matches |
| Size | 20 | `Size-20` | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Selected | `selected: boolean` (set by `NlNavItem`), also `data-selected`. `fg-active` and `NlIcon filled` when on |
| Icon | `name: NlIconName`, `NlIcon` 20 |
| Element | `<span aria-hidden="true">`, `Size-20`, no padding. Native attributes and `ref` go to it, `className` (placement only) last |

#### API

```tsx
import { NlNavIcon } from '../NlNavIcon'; // internal, not exported from @northline/ui

<NlNavIcon name="person" selected={isCurrent} />
```

Presentational, so no `'use client'`.

#### Tokens used

`fg-secondary` (unselected), `fg-active` (selected), `Size-20`. Colour changes use `--nl-duration-fast`, none under reduced motion.

#### Build decisions

| Decision | Detail |
|---|---|
| No states of its own | `NlNavItem` keeps the icon `fg-secondary` on hover and pressed, so only `selected` changes it |
| Glyphs without a fill | Some glyphs (for example `search`) look the same filled; for those only the colour changes |

---

### NlPageDots

**Level** Atom L1 · **Base** none · **Depends on** `NlPageDot` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-72 decided 19 Nov 2026 (not interactive, with OD-39).

A row of 3 to 5 dots showing which page or step of a short sequence is current, for example in an onboarding panel or a card carousel.

#### Anatomy

```
NlPageDots (horizontal row)
└── NlPageDot × count (one is current)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Count | 3, 4, 5 | `count: 3 \| 4 \| 5` |
| Current | 1 to count | `current: number` (1-based) |
| Size | small | No prop: the reference has one size |
| Accessible text | template | `label?: string`, default "Page {current} of {count}" |

#### Sizes and layout

- Horizontal, gap `Space-XS`, padding `Space-none`, items centred.
- Width hugs: dots plus gaps (the current dot is wider, see `NlPageDot`).

#### Colours

From `NlPageDot`: `fg-brand` (current), `fg-placeholder` (others).

#### States

None. Not interactive.

#### Behaviour and accessibility

- The row has `role="img"` and `aria-label` from `label`, for example "Page 2 of 5". The dots inside are `aria-hidden`.
- When `current` changes, the change isn't announced on its own. The surrounding content (the new page) is what changes for the user.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Gap | `Space-XS` | Same | Matches |
| Size property | Only "Small" exists | No size prop | Matches |
| Interactive dots | Not in the reference | Not interactive. A carousel that needs clickable dots needs a new spec | Decided (OD-72, with OD-39): not interactive |
| Count limit | 3 to 5 | Same | Matches |

---

### NlTooltip

**Level** Atom L1 (D15: `NlTextBlock` is L0) · **Base** none · **Depends on** `NlTextBlock` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-73 and OD-74 decided 19 Nov 2026.

A short dark label that appears next to an element on hover or focus. The rich form adds a heading and a description.

#### Anatomy

```
NlTooltip (dark rounded box, floating)
├── single line: text
└── rich: NlTextBlock (heading + description, inverse colours)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | single line, rich | Derived: `content` only gives single line; `heading` gives rich. Also `data-type` |
| Content | text | `content: string` (single line), or `description` (rich) |
| Heading | text | `heading?: string` (rich only) |
| Trigger | the element it describes | `children` (one focusable element) |
| Placement | top (default), bottom, start, end | `placement`, flips when there isn't room |
| Look | dark only | No prop: the reference has one look |

#### Sizes and layout

| Type | Padding (block / inline) | Content |
|---|---|---|
| single line | `Space-M` / `Space-XL` | Text `Caption L`, one line, no wrapping |
| rich | `Space-L` / `Space-XL` | `NlTextBlock type="headline-small"`: heading `Headline Small-H6`, description `Body M`, gap `Space-XS` |

- Radius `Radius-S`. No border. No shadow.
- Rich width: hugs the content up to a maximum of `Size-320` (new token, see "Mapping notes"); text wraps inside.
- Distance from the trigger: `Space-XS`. Keeps `Space-M` from the window edge.
- Layer: `--nl-z-tooltip` (§4.3).

#### Colours

| Part | Token |
|---|---|
| Background | `bg-direct` |
| Single-line text | `text-inverse` |
| Rich heading and description | `text-inverse` (see "Mapping notes") |

#### States

Hidden, shown. Not interactive itself.

#### Behaviour and accessibility

- Appears on pointer hover (after a short delay) and on keyboard focus of the trigger. Disappears on pointer leave, blur, or Escape (WCAG 1.4.13: dismissible without moving focus).
- Hovering the tooltip itself keeps it open (1.4.13: hoverable).
- Single line: `role="tooltip"`, and the trigger gets `aria-describedby`. For icon-only buttons, the tooltip repeats the button's hidden label, so it stays a description and the name comes from the button.
- Rich: the same, with the heading and description both in the described text. Rich tooltips hold no interactive content.
- Fade in and out with `--nl-duration-base` (§5: tooltips). Reduced motion: no fade.
- Touch: no hover, so the information must also be available another way.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Rich text colour | The text block's heading and description are overridden to `text-inverse` | `NlTextBlock tone="inverse"` | Approved |
| Rich width | Drawn at 375 (a mobile width) | Maximum width from a new primitive `Size-320` (320). Added to DESIGN.md §3.5 and the token JSON | Approved |
| Show delay | Not in the reference | `--nl-duration-base` before showing on hover, none on focus | Approved (OD-73) |
| Placement and offsets | Not in the reference | `Space-XS` from the trigger, `Space-M` from the window edge, the same as `NlMenu` | Approved (OD-74) |
| Arrow | None in the reference | None | Matches |
| Look | One look ("black") | No `look` prop | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | From the props: `content` (single line) or `heading` with an optional `description` (rich); the types allow one or the other. `data-type` |
| Content | `content: string`, or `heading: string` and `description?: string` |
| Trigger | `children`: one element that takes a ref and focus. The tooltip adds its ref, `aria-describedby` (kept with the trigger's own) and its pointer and focus handlers (kept with the trigger's own) |
| Placement | `placement?: 'top' \| 'bottom' \| 'start' \| 'end'`, default `top`; flips and shifts with `@floating-ui/dom`; start and end follow the text direction |
| Element | `role="tooltip"` with its own id, always in the page (display none when hidden), `data-shown` |

#### API

```tsx
import { NlButton, NlTooltip } from '@northline/ui';

<NlTooltip content="Add reward">
  <NlButton variant="tertiary" icon="only-icon" iconName="add">Add reward</NlButton>
</NlTooltip>

<NlTooltip heading="Tier 2" description="Members with 1,000 points or more.">
  <NlButton variant="secondary">Tier 2</NlButton>
</NlTooltip>
```

`'use client'` (state, effects, timers).

#### Tokens used

| Part | Token |
|---|---|
| Box | `bg-direct`, `Radius-S`, layer `--nl-z-tooltip` |
| Single line | `Space-M` / `Space-XL`, `Caption L`, `text-inverse` |
| Rich | `Space-L` / `Space-XL`, `NlTextBlock type="headline-small" tone="inverse"`, max `Size-320` |
| Distance | `Space-XS` (the frame's padding), `Space-M` from the window edge |
| Motion | Show delay and fade `--nl-duration-base`; no fade under reduced motion |

#### Build decisions

| Decision | Detail |
|---|---|
| Position utility | `nl:tooltip-position` in `tailwind.css` reads the measured position (`--nl-tooltip-x`, `--nl-tooltip-y`). Approved by the designer, 19 Nov 2026 (rule 9) |
| Crossing into the tooltip | A transparent `Space-XS` frame around the box touches the trigger, so the pointer never leaves trigger or tooltip on the way (WCAG 1.4.13). Chosen over a hide delay, which would be 0 under reduced motion |
| Keyboard | Shows on keyboard focus only (`:focus-visible`), not on a mouse click's focus. Escape hides it and keeps focus |
| Touch | Doesn't show on touch hover; the information must be available another way |
| Disabled triggers | A disabled control gets no hover or focus, so its tooltip can't show (designer's choice, 19 Nov 2026) |
| Dark theme | `bg-direct` is light in Dark, so the tooltip is a light box with dark `text-inverse` there. Accepted by the designer, 19 Nov 2026 |

Checked in the browser: shows after the delay on hover and at once on Tab, stays while the pointer moves into it, hides on leave and Escape, 4 (`Space-XS`) from the trigger, flips below at the window's top edge.

---

### NlSegmentedButton

**Level** Molecule (contains `NlSegment`, an L1 atom) · **Base** none · **Depends on** `NlSegment`, `NlTooltip` (icon only) · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): menu use (`menuitemradio`) not built yet. OD-75 decided 19 Nov 2026.

A row of 2 or 3 options where exactly one is selected, for example a view switch (list or grid) or a theme switch (system, light, dark).

#### Anatomy

```
NlSegmentedButton (track)
└── NlSegment × 2 or 3 (one selected)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Options | 2 or 3 | `options: { value, label, icon? }[]` (2 or 3 items) |
| Value | the selected option | `value` / `defaultValue`, `onValueChange(value)` |
| Size | medium, small, xsmall | `size`, default `medium`, also `data-size` |
| Icon only | off, on | `iconOnly?: boolean` (every option then needs an `icon`) |
| Disabled | the whole group | `disabled?: boolean` |
| Accessible name | text | `aria-label` or `aria-labelledby` (required) |

#### Sizes and layout

| Size | Track padding | Gap between segments | Track radius | Track height |
|---|---|---|---|---|
| medium | `Space-XS` | `Space-L` | `Radius-S` (D19) | `Size-48` |
| small | `Space-XS` | `Space-XS` | `Radius-S` (D19) | `Size-40` |
| xsmall | `Space-none` | `Space-none` | `Radius-S` | `Size-24` |

- Labelled: the track fills its container and the segments share the width equally.
- Icon only: the track hugs its segments.
- Segment sizes, radius and colours: see `NlSegment`.

#### Colours

| Part | Token |
|---|---|
| Track | `bg-tertiary` |
| Segments | see `NlSegment` |

#### States

The group can be disabled as a whole (every segment uses its disabled look). Other states belong to the segments.

#### Behaviour and accessibility

- `role="radiogroup"` with a name. Each segment is a radio.
- Keyboard: one tab stop (the selected segment). Arrow keys move and select, wrapping at the ends. Home and End go to the first and last.
- Icon only: each segment keeps its label as a hidden name, and shows a tooltip with it.
- Inside a menu (for example a theme row), the segments act as `menuitemradio` instead, following `NlMenu`'s keyboard.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Show button 1, 2, 3 | Three booleans that hide segments | An `options` array of 2 or 3 | Approved (OD-75) |
| Track colour | `bg-tertiary` | Same | Matches |
| Sizes, padding, gaps, radius | From the reference's description and drawing | Same | Matches |
| Tooltips and menu behaviour | Code only, per the reference's description | As above | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Options | `options`: a tuple of 2 or 3 `{ value: string, label: string, icon?: NlIconName }` (OD-75) |
| Value | `value` (controlled) or `defaultValue` (uncontrolled, default the first option), `onValueChange(value)` |
| Size | `size?: 'medium' \| 'small' \| 'xsmall'`, default `medium`, also `data-size`; passed to every `NlSegment` |
| Icon only | `iconOnly?: boolean`; the types then require `icon` on every option. Each segment is wrapped in `NlTooltip` with its label |
| Disabled | `disabled?: boolean`: every segment disabled, `aria-disabled` on the group |
| Accessible name | `aria-label` or `aria-labelledby`, one required by the types |
| Element | `<div role="radiogroup">`; segments share a generated `name`. Native attributes and `ref` go to it, `className` (placement only) last |

#### API

```tsx
import { NlSegmentedButton } from '@northline/ui';

<NlSegmentedButton
  aria-label="Theme"
  value={theme}
  onValueChange={setTheme}
  options={[
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ]}
/>
```

`'use client'` (uncontrolled state).

#### Tokens used

The "Sizes and layout" table, as written; track `bg-tertiary`. Labelled tracks fill their container (`nl:w-full`) and segments share it (`nl:flex-1`); icon-only tracks hug (`nl:w-fit`). Measured in the browser: track heights 48, 40 and 24.

#### Build decisions

| Decision | Detail |
|---|---|
| Keyboard | The native radio group gives one tab stop and wrapping arrow keys; Home and End are added on the group |
| Menu use | `menuitemradio` inside a menu is not built; added when a menu needs it (designer's choice, 19 Nov 2026) |
| Disabled selected | `bg-disabled` is the same colour as the `bg-tertiary` track in every brand and theme, so a disabled group shows its selected option only by the label's weight and colour (see K1) |

---

### NlCheckbox

**Level** Molecule (contains `NlCheckboxControl`, L1) · **Base** none · **Depends on** `NlCheckboxControl`, `NlTextBlock` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-15 and OD-41 were decided with `NlTextBlock`.

A checkbox with its text, for single options in forms, such as "Send a welcome email".

#### Anatomy

```
NlCheckbox (horizontal, top-aligned)
├── NlCheckboxControl
└── NlTextBlock (description only; or visually hidden)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | unselected, selected, indeterminate | `checked` / `defaultChecked`, `indeterminate?` (passed to the control) |
| Disabled | on or off | `disabled` |
| Text | text | `children` |
| Size | medium (default) or small | `size?: 'medium' \| 'small'`. Small is not in the reference; added for the login page (OD-237) |
| Show text | on (default) or off | `hideLabel?: boolean`. Off hides the text visually but keeps it as the checkbox's name |
| Change | callback | `onChange` |
| Form | name, value | `name`, `value` (native) |

#### Sizes and layout

- Horizontal, gap `Space-L`, padding `Space-none`.
- Medium: text in `Body L` (24 line, the same as the control's 24 hit area), items aligned to the top.
- Small: text in `Body M` (21 line), items centred, so the text sits on the box's centre line (OD-237). Wrapped text centres as a block.
- Text: `NlTextBlock` with only a description (see "Mapping notes" for which type gives it).
- Width fills its container. The text wraps.

#### Colours

| State | Text |
|---|---|
| Enabled | `text-secondary` |
| Disabled | `text-disabled` (through `NlTextBlock disabled`) |

The control's colours are in `NlCheckboxControl`.

#### States

Enabled, hover, pressed, focus and disabled for each type. Hover and pressed are the control's. The focus ring is the control's own ring, not one around the whole row.

#### Behaviour and accessibility

- The control is a native checkbox. The whole row is a `<label>`, so clicking the text toggles it.
- The text names the checkbox. With `hideLabel`, the text is visually hidden but stays the name.
- Keyboard: Tab to the control, Space toggles.
- A screen reader hears the text, "checkbox" and its state.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Text style | A text block set to its largest display type with only the description shown, which is a roundabout way to get `Body L` | Options: (a) do the same, `NlTextBlock type="display-large"` with only a description; (b) add `type="body"` to `NlTextBlock`: no heading style, description in `Body L`. I recommend (b), because the code then says what it means | (b), approved with `NlTextBlock` (OD-41) |
| Disabled text | `text-disabled` | `NlTextBlock disabled` | Approved with `NlTextBlock` (OD-15) |
| Focus ring | Around the control only | Same | Matches |
| Checkbox position | Always on the left | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | `checked` / `defaultChecked`, `indeterminate`, passed to `NlCheckboxControl` |
| Disabled | `disabled`: passed to the control and to `NlTextBlock disabled` (`text-disabled`); the row's cursor is default |
| Text | `children`, as `NlTextBlock type="body"`'s description (`Body L`, `text-secondary`) |
| Size | `size` lookup: medium `nl:items-start` + `NlTextBlock type="body"`; small `nl:items-center` + `NlTextBlock type="body-m"` (`Body M`). `data-size` on the row |
| Show text | `hideLabel?: boolean`: the text is `nl:sr-only` and stays the name |
| Change, Form | `onChange`, `name`, `value`, `ref` and native input attributes go to the control's input; `className` (placement only) to the row |

#### API

```tsx
import { NlCheckbox } from '@northline/ui';

<NlCheckbox name="welcome" defaultChecked>Send a welcome email</NlCheckbox>
<NlCheckbox hideLabel checked={selected} onChange={(e) => setSelected(e.target.checked)}>Select member 0042</NlCheckbox>
<NlCheckbox size="small" name="remember">Remember me</NlCheckbox>
```

`'use client'` (through `NlCheckboxControl`).

#### Tokens used

Gap `Space-L`, padding `Space-none`; text and control tokens from `NlTextBlock` and `NlCheckboxControl`. Measured in the browser: the box and the first text line share the same centre.

#### Build decisions

| Decision | Detail |
|---|---|
| Label contents | The row is a `<label>` holding `NlTextBlock` (a `<div>` and `<p>`). Not strictly valid HTML (a label takes phrasing content), but clicking, naming and accessibility work in every browser and axe passes (designer's choice, 19 Nov 2026) |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |
| Small size | Added 22 Nov 2026 for the login page (OD-237): `Body M`, centred on the control. `NlRadio` and `NlSwitch` get a small size only when a page needs it |

---

### NlNotificationButton

**Level** Atom L1 · **Base** none · **Depends on** `NlIcon`, `NlCountBadge` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-40 decided 19 Nov 2026: (a).

The bell button in the page header, with a dot or a number when there are unread notifications.

#### Anatomy

```
NlNotificationButton (40 circle button)
├── NlIcon (notifications, 20, centred)
└── NlCountBadge (optional; dot or number)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Notification | none, dot, number | Derived: `count` of 0 gives none; `count` with `showCount={false}` gives the dot; otherwise the number |
| Count | number | `count?: number` (shows "99+" over 99) |
| Disabled | on or off | `disabled` (native) |
| Label | text | `label?: string`, default "Notifications" |
| Expanded | when it opens a panel | `aria-expanded` |

#### Sizes and layout

- `Size-40` circle, `Radius-Full`, padding `Space-M`, icon `NlIcon` 20 centred.
- Dot: `NlCountBadge` small dot, its top edge `Space-M` below the button's top and its right edge `Space-M` in from the right.
- Number: `NlCountBadge` small double, starting at the button's vertical centre line and growing to the right. Its top edge sits `Space-XS` above the button's top.
- The badge isn't clipped by the circle.

#### Colours

| State | Circle | Icon |
|---|---|---|
| Default | `bg-action-secondary` | `fg-action` |
| Hover | `bg-action-secondary_hovered` | `fg-hovered` |
| Pressed | `bg-action-secondary_pressed` | `fg-pressed` |
| Disabled | `bg-disabled` | `fg-disabled-on_bg` (no badge) |
| Focus | standard focus ring from CLAUDE.md | |

Badge: `NlCountBadge tone="error"`.

#### States

Default, hover, pressed, focus, disabled. A disabled button shows no badge.

#### Behaviour and accessibility

- A native button. Its name includes the count: "Notifications, 3 unread" (or "Notifications, new" for the dot). The badge itself is `aria-hidden`.
- When the count changes while the page is open, the page header announces it politely (not this component).
- Enter or Space opens what it controls.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Built from `NlButton` | The inventory planned it on `NlButton` (D12: one public button). But its look, a filled light-brand circle (`bg-action-secondary`), matches no `NlButton` variant: secondary has a 2px border and no fill, tertiary has no fill | Options: (a) its own native button (L1: `NlIcon` + `NlCountBadge`), an exception to D12 for this one component; (b) a new `NlButton` look, for example `variant="soft"` (filled `bg-action-secondary`, no border), and build this on it (molecule). (a) chosen: `NlButton` also has no 40 size and no circle, so (b) would add a look, a size and a shape to the only public button for one component. Soft can still come later as OD-1 | Approved (OD-40, option a) |
| Badge positions | From the reference's description: dot 8 from the top and right; number from the centre line, 4 above the top | `Space-M` and `Space-XS`, as above | Matches |
| Disabled hides the badge | As in the reference | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Notification | `count?: number` (default 0) and `showCount?: boolean` (default `true`): 0 or none shows nothing; `showCount={false}` the dot; otherwise the number from `NlCountBadge` ("99+" over 99) |
| Label | `label?: string`, default "Notifications". The button's `aria-label` is "{label}, {shown} unread" or "{label}, new"; `{shown}` is what the badge shows ("99+" over 99), so the visible text is part of the name (WCAG 2.5.3) |
| Disabled | `disabled` (native): no badge, the plain label as the name |
| Expanded | `aria-expanded` passed through; uses the pressed look |
| Element | Native `<button type="button">`. `ref` and native attributes go to it, `className` (placement only) last |

#### API

```tsx
import { NlNotificationButton } from '@northline/ui';

<NlNotificationButton count={3} aria-expanded={open} onClick={togglePanel} />
<NlNotificationButton count={unread} showCount={false} />
```

Presentational, so no `'use client'`.

#### Tokens used

The "Colours" table, as written; `Size-40`, `Radius-Full`, padding `Space-M`, `NlIcon` `notifications` 20 (added to the registry at U+E7F4, checked against the font's own ligature). Badge placement: dot `Space-M` from the top and the end; number from the centre line, `Space-XS` above the top. Measured in the browser: as specified, the badge unclipped.

#### Build decisions

| Decision | Detail |
|---|---|
| Own button | Not built on `NlButton` (OD-40, option a); a D12 exception for this one component |
| Badge hidden | The badge sits in an `aria-hidden` wrapper that also holds its placement (`NlCountBadge` sets its own `aria-hidden` when it has digits) |

---

### NlInputBase

**Level** Molecule (contains `NlHelperText`, L1) · **Base** – (this is the base) · **Depends on** `NlHelperText`, `NlIcon` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. `type="select"` added with `NlSelect` (#70, 20 Nov 2026). OD-42, OD-43, OD-44, OD-76, OD-77 and OD-78 decided 19 Nov 2026.

The shared field: an outlined box with a floating label, optional leading and trailing items, and a helper line below. `NlTextField`, `NlPasswordField`, `NlSearchField`, `NlSelect`, `NlMultiSelect` and `NlDateField` map onto it.

#### Anatomy

```
NlInputBase (vertical)
├── field box (outlined, rounded)
│   ├── floating label (sits on the top border when the field is focused or filled)
│   └── content (horizontal)
│       ├── leading slot (optional; icon, prefix)
│       ├── value area (input, or chips, or a selected value)
│       └── trailing slot (optional; icon, button, suffix)
└── NlHelperText (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size`, default `large`, also `data-size` |
| Type | default, select | `type` (select makes the whole box a trigger with a chevron). Payment and mobile-number types are left out |
| Error | off, on | `error?: boolean` (the reference's "destructive") |
| Label | text | `label: string` (required) |
| Placeholder | removed | No hint text (designer's choice, 19 Nov 2026): the box stays empty while focused. Only a field with a hidden label (`hideLabel`, NlSearchField) shows placeholder text |
| Hidden label | on or off | `hideLabel?: boolean`: the label is never drawn and stays the accessible name; `placeholder` is drawn instead |
| Prefix, suffix | short text | `prefix?`, `suffix?` |
| Leading, trailing | slots | `leading?: ReactNode`, `trailing?: ReactNode` |
| Helper text | text | `helperText?: string` |
| Disabled | on or off | `disabled` |
| Required | on or off | `required` |

#### Sizes and layout

| Size | Box height | Content padding (block / inline) | Gap | Icon size |
|---|---|---|---|---|
| large | `Size-48` | `Space-L` / `Space-XL` | `Space-M` | 24 |
| small | `Size-40` | `Space-M` / `Space-XL` | `Space-M` | 20 |

- Box: radius `Radius-XS` (D19), 1px inside border (§4.2).
- Value and placeholder text: `Body L`.
- Floating label: `Label S`, on a `bg-primary` patch with `Space-XS` inline padding, centred on the top border, starting at the content's inline padding.
- Gap box → helper: `Space-M`. Helper text indented by `Space-XL` to line up with the value.
- Width fills its container.

#### Colours

| State | Box fill | Border | Label | Value / placeholder |
|---|---|---|---|---|
| Enabled (empty) | none | `border-default` | in the value position, as placeholder | `text-placeholder` |
| Hover | `bg-secondary` | `border-default` | as above | as above |
| Focused / typing | none | `border-default`, plus the focus ring (`border-focused`) | floating, `text-tertiary` | `text-primary` |
| Complete (filled, not focused) | none | `border-strong` | floating, `text-tertiary` | `text-primary` |
| Error (any state) | as the state | `border-error`; the standard focus ring (OD-44) | as the state | as the state |
| Disabled | none | `border-disabled` | `text-disabled` | `text-disabled` |

- Icons in the slots: `fg-secondary`; disabled `fg-disabled`.
- Helper text: `NlHelperText`, tone `error` when `error` is on, `disabled` when disabled.

#### States

Enabled, hover, focused, typing, complete, disabled, each with and without error.

#### Behaviour and accessibility

- A native `<input>` with a real `<label>` (the floating label), so the name never depends on the placeholder.
- `aria-describedby` points to the helper text. `aria-invalid="true"` with an error. `required` adds `aria-required` and a visible marker in the label (see "Mapping notes").
- Error text appearing is announced through a polite live region in the helper area.
- The focus ring shows whenever the input has focus (`:focus`, not only keyboard focus), as is usual for text inputs.
- The label floats with `--nl-duration-fast`. Reduced motion: it jumps.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Label at rest | At rest the box shows only placeholder text; the label appears on the border when focused or filled | A real label is always present: at rest it sits in the value position styled as placeholder, and floats up on focus or when filled. No hint text: focused and empty, the box shows only the floating label (designer's choice, 19 Nov 2026) | Approved (OD-42), hint removed 19 Nov 2026 |
| Focus ring | A 2px ring outside, inset 1 (equivalent to the standard ring) | Standard ring from CLAUDE.md, shown on any focus | Matches |
| Error focus ring | `border-error` | The standard `border-focused` ring; the error shows in the border, helper text and icon | Decided (OD-44, OD-3): standard ring |
| Helper text colour in fields | `text-tertiary`, while `NlHelperText`'s default tone is `text-secondary` | `NlHelperText` default tone uses `text-tertiary` everywhere | Approved (OD-43, 19 Nov 2026) |
| Helper icon | Hidden for default, shown for error in text areas but not in single-line fields | Hidden for default, shown for success, warning and error everywhere | Approved (OD-76) |
| Floating label colour | `text-tertiary` in fields, `text-primary` in text areas | `text-tertiary` everywhere | Approved (OD-77) |
| Required marker | Not in the reference | Native `required` only (announced); no visible marker | Decided (OD-78, 19 Nov 2026): no marker |
| Types left out | Payment and mobile number | Left out | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'large' \| 'small'`, default `large`, also `data-size` |
| Type | Default (text input) now; `type="select"` comes with `NlSelect` (#70). The native `type` attribute (`text`, `email`, `password` …) passes to the input |
| Error | `error?: boolean`: `aria-invalid`, border `border-error`, helper tone `error` with its icon, `data-error` |
| Label | `label: string`, a real `<label for>` |
| Placeholder | None. No hint text: the box stays empty while focused, with only the floating label (designer's choice, 19 Nov 2026, replacing OD-42's hint). The native placeholder is a single space, only so "placeholder shown" means empty |
| Prefix, suffix | `prefix?`, `suffix?`: Body L, `text-placeholder` |
| Leading, trailing | `leading?`, `trailing?` slots, `fg-secondary` (disabled `fg-disabled`) |
| Helper text | `helperText?`: `NlHelperText` (`Space-M` below, indented `Space-XL`), id in the input's `aria-describedby`, inside an always-present `aria-live="polite"` region. Icon only for error (OD-76) |
| Disabled, Required | Native on the input; disabled helper tone `disabled` |
| Element | Native `<input>`: `value` / `defaultValue`, `onChange`, `name`, `ref` and native attributes go to it; `className` (placement only) to the root |

#### API

```tsx
import { NlInputBase } from '../NlInputBase'; // internal, not exported from @northline/ui

<NlInputBase label="Member number" helperText="On the member card." />
<NlInputBase label="Member number" error helperText="Enter a member number." />
```

`'use client'` (`useId`).

#### Tokens used

The "Sizes and layout" and "Colours" tables, as written, with the standard focus ring for errors too (OD-44). The label's position eases with `--nl-duration-fast` and its text style switches (a smooth size change would need a raw scale); no movement under reduced motion.

#### Build decisions

| Decision | Detail |
|---|---|
| Floating label in CSS | The label floats on `:focus` or when the input no longer shows its placeholder (has a value), through `peer-*` variants, so controlled and uncontrolled both work |
| Focus ring timing | The ring shows whenever the box's own input has focus (`nl:input-focus:`, a named variant in `tailwind.css` for `:has(input:focus)`), as the spec draws it for text inputs; the input's own outline is hidden (`nl:focus:outline-hidden`) |
| Focus ring and trailing buttons | A focused trailing button (for example the password show/hide) shows only its own ring, not the box's. `has-focus` matched the button too and drew two rings, so the box uses `nl:input-focus:` instead (rule 9, approved 19 Nov 2026 with `NlPasswordField` #46). Hover fill and the filled border use `not-input-focus` the same way |
| Label with a leading item | The label sits in the value area, so with a leading icon it starts after the icon, at rest and floating |
| Required | Native `required` only, no visible marker (OD-78, designer's choice, 19 Nov 2026) |
| Hidden label (#47) | `hideLabel` makes the label `nl:sr-only` (still the `<label for>` name) and draws `placeholder` in Body L `text-placeholder` (`nl:placeholder:`, disabled `text-disabled`), shown while empty, focused too. Without `hideLabel`, `placeholder` is ignored (designer's choice, 19 Nov 2026) |
| Browser clear button | `nl:search-cancel-none` (`tailwind.css`) on the input hides the WebKit and Blink clear button for `type="search"`; no effect on other types (rule 9, approved 19 Nov 2026 with NlSearchField #47) |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |

Checked in the browser: the floating label is centred on the top border and lines up with the value; a filled field turns `border-strong` on blur.

#### Select type (added 20 Nov 2026, with `NlSelect` #70)

| Part | Detail |
|---|---|
| `type="select"` | The input becomes a read-only `role="combobox"` text field showing the chosen option's label; `NlSelect` adds `aria-haspopup`, `aria-expanded`, `aria-controls` and the keys. Pointer cursor, no caret, no text selection (`inputSelect`) |
| Open look | While the input is `aria-expanded`, the box keeps the focused look (focus ring, `border` as focused) and the label floats (`peer-aria-expanded/input:`), because focus moves into the menu (OD-197). `nl:input-focus` in `tailwind.css` now also matches an expanded input (rule 9, approved 20 Nov 2026) |
| Box click | A click anywhere on the box (the chevron too) focuses and clicks the input (OD-200) |
| `boxRef` | A ref to the box, so a menu anchors to the box and not the helper line (OD-200) |
| Hover contrast | The resting label (`text-placeholder`) on the hover fill (`bg-secondary`) is 4.17:1 in Light: known issue K9, every field |

#### Value overlay (added 20 Nov 2026, with `NlMultiSelect` #71, OD-203)

`valueOverlay` (select type only): content drawn over the value area (`NlMultiSelect`'s chips), one row, gap `Space-XS`, clipped sideways only (`overflow-x: clip`): an xsmall chip with its border (26) is taller than the Body L line (24), so it spills into the box's block padding rather than losing its top and bottom border. The input keeps its value (the chosen labels) for assistive tech and the floating label, with its text `text-transparent` (`inputColour.underOverlay`; the input's text colour moved into the `inputColour` lookup so no list sets it twice). A click on a button inside the box (a chip's remove button) doesn't open the menu.

#### Format hint (added 20 Nov 2026, with `NlDateField` #72, OD-209)

`formatHint` (a pattern such as "DD/MM/YYYY", with a controlled string `value`): a layer over the value area, Body L `text-placeholder` on one line, shown only while the input has focus (`peer-focus/input:visible`). It draws the typed text unseen (for its width), then the rest of the pattern ("01/0" + "M/YYYY"). Hidden from assistive tech; clicks pass through. At rest the label sits in the value position as usual (OD-42).

---

### NlTextField

**Level** Molecule (mapped, takes its base's level) · **Base** `NlInputBase` · **Depends on** – · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-79 decided 19 Nov 2026.

A single-line text input, for names, codes, amounts and search terms that need a label.

#### Anatomy

As `NlInputBase`, with `type="default"`.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size`, default `large` |
| Trailing icon | off, on | `trailingIcon?: NlIconName` (decorative) |
| Error | off, on | `error?: boolean` |
| Input type | text, email, number, tel, url | `inputType`, default `text` |
| Value | text | `value` / `defaultValue`, `onChange` |
| Everything else | as `NlInputBase` | `label`, `helperText`, `prefix`, `suffix`, `disabled`, `required`, `ref` (no placeholder, as `NlInputBase`) |

#### Sizes, layout, colours and states

As `NlInputBase`. The trailing icon, when shown, is `fg-secondary` (`fg-disabled` when disabled).

#### Behaviour and accessibility

As `NlInputBase`. A decorative trailing icon is `aria-hidden`. If an icon needs to do something, it is an `NlButton` in the trailing slot, not an icon.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Types | Default, mobile number, payment | Default only (D13 leaves out the others) | Matches |
| Trailing icon | An info icon in the reference | Any registry icon, decorative | Approved (OD-79) |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'large' \| 'small'`, default `large`, passed to `NlInputBase` |
| Trailing icon | `trailingIcon?: NlIconName`: a decorative `NlIcon` (24 large, 20 small) in the base's trailing slot (OD-79) |
| Error | `error?: boolean`, passed to the base |
| Input type | `inputType?: 'text' \| 'email' \| 'number' \| 'tel' \| 'url'`, default `text`: the native `type` |
| Value | `value` / `defaultValue`, `onChange` |
| Everything else | `label`, `helperText`, `prefix`, `suffix`, `disabled`, `required`, `name`, `ref` and native attributes, passed to the base. No `leading` or `trailing` slots |

#### API

```tsx
import { NlTextField } from '@northline/ui';

<NlTextField label="Email" inputType="email" />
<NlTextField label="Member number" trailingIcon="info" helperText="On the member card." />
```

No `'use client'` of its own (`NlInputBase` has it).

#### Tokens used

None of its own: everything from `NlInputBase`; the trailing icon is `fg-secondary` through the base's slot.

---

### NlPasswordField

**Level** Molecule (mapped; also contains `NlButton`, L1) · **Base** `NlInputBase` · **Depends on** `NlButton` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-31, OD-80 and OD-81 decided 19 Nov 2026.

A password input with a show/hide toggle.

#### Anatomy

As `NlInputBase`, with a show/hide `NlButton` in the trailing slot.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size`, default `large` |
| Show password | off (default), on | `showPassword` / `defaultShowPassword`, `onShowPasswordChange` |
| Error | off, on | `error?: boolean` |
| Everything else | as `NlInputBase` | `label`, `helperText`, `disabled`, `required`, `autoComplete`, `ref` |

#### Sizes and layout

As `NlInputBase`. Toggle: `NlButton variant="tertiary" icon="only-icon" contentTone="secondary"`, icon `visibility_off` (hidden) or `visibility` (shown). See "Mapping notes" for its size.

#### Colours and states

As `NlInputBase`. The toggle has the button's own states. Disabled field: the toggle is disabled too.

#### Behaviour and accessibility

- The input switches between `type="password"` and `type="text"`. The caret position and value stay.
- The toggle's name is always "Show password", and `aria-pressed` carries the state (designer's choice, 19 Nov 2026: a name that changes as well as `aria-pressed` reads as "Hide password, pressed"). It is a separate tab stop after the input.
- `autoComplete` defaults to `current-password`. Pass `new-password` when creating one.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Toggle | A bare eye icon (24 on large, 20 on small) | An `NlButton` icon-only, tertiary, `contentTone="secondary"`, size `xsmall` (32 square, 20 icon) in both field sizes, so the large field's eye is 20, not 24. Only the 48 icon-only button has a 24 icon, and it would fill the large box top to bottom | Approved (OD-80, OD-31) |
| Icons | Eye and crossed eye from the reference's icon set | Material Symbols `visibility`, `visibility_off` | Approved (OD-81) |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'large' \| 'small'`, default `large`, passed to `NlInputBase` |
| Show password | `showPassword?` (controlled), `defaultShowPassword?` (default `false`), `onShowPasswordChange?(next)`; `data-show-password` on the input when shown |
| Input type | `type="password"` while hidden, `type="text"` while shown; not a prop |
| Error | `error?: boolean`, passed to the base |
| Label, helper text, disabled, required, value, `ref` | Passed to `NlInputBase` and its native input |
| `autoComplete` | Default `current-password`; pass `new-password` when creating one |
| Toggle | `NlButton type="button" variant="tertiary" contentTone="secondary" size="xsmall" icon="only-icon"`, name "Show password", `aria-pressed`, disabled with the field, in the base's trailing slot |
| Value and caret | The value stays; the caret or selection is saved before the switch and put back after |
| Left out | `prefix`, `suffix`, `leading`, `trailing` (the trailing slot holds the toggle) |

#### API

```tsx
import { NlPasswordField } from '@northline/ui';

<NlPasswordField label="Password" />
<NlPasswordField label="New password" autoComplete="new-password" helperText="Use at least 12 characters." />
<NlPasswordField label="Password" showPassword={shown} onShowPasswordChange={setShown} />
```

`'use client'` (state and refs).

#### Tokens used

None of its own: the field's are `NlInputBase`'s and the toggle's are `NlButton`'s (tertiary, `contentTone="secondary"`, xsmall).

#### Build decisions

| Decision | Detail |
|---|---|
| Focus ring | Focusing the toggle shows only the button's ring; the box ring follows the input (`NlInputBase`, `nl:input-focus:`, approved 19 Nov 2026) |
| Toggle name | Fixed "Show password" with `aria-pressed` (designer's choice) |
| Caret | Some browsers reset the caret when the type changes, so it is put back in a layout effect |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |

Checked in the browser: box 48 (large) and 40 (small), toggle 32 square in both, 16 from the box's end; focusing the toggle draws one ring.

---

### NlSearchField

**Level** Molecule (mapped; also contains `NlButton`, L1) · **Base** `NlInputBase` · **Depends on** `NlButton` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-31, OD-82, OD-83 and OD-84 decided 19 Nov 2026.

A search input with a search icon and a clear button. Used in table toolbars and menu headers.

#### Anatomy

As `NlInputBase`: a leading search icon, the value, and a clear `NlButton` in the trailing slot once there is text. No floating label and no helper text.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size`, default `large` |
| Value | text | `value` / `defaultValue`, `onChange` |
| Submit | callback | `onSearch(value)` (Enter) |
| Clear | callback | `onClear()` |
| Accessible name | text | `label`, default "Search": a hidden `<label>` (never drawn), so no `aria-label` is needed |
| Placeholder | text | `placeholder`, default "Search", shown while empty, focused too |

#### Sizes and layout

As `NlInputBase`. Leading icon `search` (24 large, 20 small) in `fg-secondary`. Clear button: `NlButton` tertiary icon-only, `contentTone="secondary"`, icon `cancel`.

#### Colours by state

| State | Border | Value | Clear button |
|---|---|---|---|
| Enabled (empty) | `border-default` | placeholder `text-placeholder` | hidden |
| Focus (empty) | `border-default` + focus ring | – | hidden |
| Typing | `border-default` + focus ring | `text-primary` | shown |
| Complete (filled, not focused) | `border-strong` | `text-primary` | shown |

#### States

Enabled, focus, typing, complete. See "Mapping notes" for hover and disabled.

#### Behaviour and accessibility

- `<input type="search">` (role `searchbox`). The field adds no landmark: the page or toolbar wraps it in `<search>` (or `role="search"`) when it searches the page or a table; a menu header doesn't (designer's choice, 19 Nov 2026).
- Enter calls `onSearch`. Escape clears the text (and calls `onClear`) when there is text, and stops there so a surrounding menu stays open; when empty, Escape passes on.
- The clear button's name is "Clear search". After clearing, focus returns to the input.
- Results that update while typing are announced by the results region ("12 results"), not by this field.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Hover and disabled | Not drawn for search | As `NlInputBase` (hover `bg-secondary`; disabled colours); disabled with text, the clear button is disabled too | Approved (OD-82) |
| Clear button | A bare cancel icon | `NlButton` icon-only, tertiary, `contentTone="secondary"`, xsmall (32, 20 icon) in both sizes | Approved (OD-83, OD-31) |
| No visible label | As in the reference | A hidden `<label>` (`label`, default "Search") names the input; placeholder text shows instead, focused too | Designer's choice, 19 Nov 2026 |
| Icons | Search and cancel from the reference's icon set | Material Symbols `search`, `cancel` | Approved (OD-84) |
| Browser clear button | Not in the reference | WebKit and Blink draw their own × in a search input; hidden (`nl:search-cancel-none`) so only the `NlButton` shows | Approved (rule 9) |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size?: 'large' \| 'small'`, default `large`, passed to the base |
| Value | `value` / `defaultValue` (strings), `onChange`; tracked inside when uncontrolled, to show the clear button |
| Submit | `onSearch?(value)` on Enter |
| Clear | `onClear?()` from the button or Escape; controlled parents reset `value` to `''` there. Focus returns to the input |
| Accessible name | `label?`, default "Search", through `NlInputBase hideLabel` |
| Placeholder | `placeholder?`, default "Search" |
| Leading icon | `NlIcon search` (24 large, 20 small), decorative, in the base's leading slot (`fg-secondary`, disabled `fg-disabled`) |
| Clear button | `NlButton type="button" variant="tertiary" contentTone="secondary" size="xsmall" icon="only-icon" iconName="cancel"`, "Clear search", only while there is text; disabled with the field |
| Left out | Helper text, error, prefix, suffix, required, floating label |

#### API

```tsx
import { NlSearchField } from '@northline/ui';

<NlSearchField onSearch={runSearch} />
<search>
  <NlSearchField label="Search members" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} />
</search>
```

`'use client'` (state and refs).

#### Tokens used

None of its own: the field's are `NlInputBase`'s (placeholder `text-placeholder` in Body L, disabled `text-disabled`), the clear button's are `NlButton`'s (tertiary, `contentTone="secondary"`, xsmall), the icon's `fg-secondary` / `fg-disabled`.

#### Build decisions

| Decision | Detail |
|---|---|
| Hidden label | New `hideLabel` and `placeholder` on `NlInputBase` (designer's choice: placeholder text shows while focused, because the label is always hidden) |
| Escape | Clears and stops when there is text; passes on when empty. The browser's own Escape clear is prevented so both paths run `onClear` |
| Landmark | None built in; the caller adds `<search>` |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |

Checked in the browser: box 48 (large), clear button 32 square, placeholder visible while focused, no second browser ×.

---

### NlTextAreaBase

**Level** Molecule (contains `NlHelperText`, L1) · **Base** – (this is the base) · **Depends on** `NlHelperText` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-42 and OD-43 (decided with `NlInputBase`), OD-85, OD-86 and OD-87 decided 19 Nov 2026.

The multi-line version of the field box. `NlTextArea` maps onto it.

#### Anatomy

```
NlTextAreaBase (vertical)
├── field box (outlined, rounded)
│   ├── floating label
│   └── content (the text area)
└── NlHelperText (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Error | off, on | `error?: boolean` (the reference's "destructive") |
| Label | text | `label` (required) |
| Placeholder | removed | No hint text (designer's choice, 19 Nov 2026): the box stays empty while focused, as `NlInputBase` |
| Helper text | text | `helperText?` |
| Rows | number | `rows`, default 4 |
| Character count | with `maxLength` | A count at the end of the helper line (OD-89, added with `NlTextArea` #49) |

#### Sizes and layout

- Box: radius `Radius-XS` (D19), 1px inside border (§4.2), padding `Space-XL` all round.
- Height: `rows` lines of `Body L` plus padding. Four rows give the reference's 128.
- Floating label, helper gap and helper indent: as `NlInputBase`.
- Width fills its container.

#### Colours

As `NlInputBase` (enabled, hover, focused/typing, complete, error, disabled).

#### States

As `NlInputBase`.

#### Behaviour and accessibility

- A native `<textarea>` with a real `<label>`, `aria-describedby` to the helper, `aria-invalid` with an error.
- Resizable vertically only (see "Mapping notes").

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Height | Fixed 128 (no `Size-128` token) | From `rows` (default 4): 4 × Body L line height 24 + 2 × `Space-XL` = 128 | Approved (OD-85) |
| Resize | Not in the reference | Vertical resize allowed, no horizontal, none when disabled. The browser lets it shrink below `rows` (a minimum height would need a token) | Approved (OD-86) |
| Floating label colour | `text-primary` here, `text-tertiary` in single-line fields | `text-tertiary`, as `NlInputBase` | Approved (OD-87, covered by OD-77) |
| Placeholder | Placeholder text in the box | None: no hint text, empty while focused | Designer's choice, 19 Nov 2026 |

#### Spec → code

| Spec option | Code |
|---|---|
| Error | `error?: boolean`: `aria-invalid`, border `border-error`, helper tone `error` with its icon, `data-error` |
| Label | `label: string`, a real `<label for>`; at rest on the first line, floating when focused or filled (OD-42) |
| Placeholder | None (not in the props). The native placeholder is a single space, only so "placeholder shown" means empty |
| Helper text | `helperText?`: `NlHelperText` (`Space-M` below, indented `Space-XL`), id in `aria-describedby`, inside an always-present `aria-live="polite"` region. Icon only for error (OD-76) |
| Rows | `rows?: number`, default 4, on the native `<textarea>` |
| Character count (#49) | `maxLength?`: native limit (typing stops). Count "120 / 500" at the end of the helper line (helper text takes the rest of the row, `Space-M` apart), `Space-M` below the box, Body S `text-tertiary` (also with an error), disabled `text-disabled`, `aria-hidden`. A hidden "Up to 500 characters." is in `aria-describedby`; a hidden polite live region says "N characters left" / "Character limit reached" only when typing crosses 20, 10, 5 and 0 left. Length tracked inside when uncontrolled |
| Disabled, Required | Native on the textarea; disabled helper tone `disabled`, no resize. No required marker (OD-78) |
| Element | Native `<textarea>`: `value` / `defaultValue`, `onChange`, `name`, `maxLength`, `ref` and native attributes go to it; `className` (placement only) to the root |

#### API

```tsx
import { NlTextAreaBase } from '../NlTextAreaBase'; // internal, not exported from @northline/ui

<NlTextAreaBase label="Notes" helperText="Visible to admins only." />
<NlTextAreaBase label="Notes" rows={6} error helperText="Add a note before saving." />
```

`'use client'` (`useId`).

#### Tokens used

Box `Radius-XS` (D19) with a 1px inset border; `Space-XL` padding on the textarea; Body L `text-primary`; borders `border-default`, `border-strong` (filled, not focused), `border-error`, `border-disabled`; hover `bg-secondary`; the standard `border-focused` ring; label at rest Body L `text-placeholder`, floating Label S `text-tertiary` on `bg-primary` with `Space-XS` inline padding; disabled `text-disabled`; helper as `NlInputBase`. Motion `--nl-duration-fast`, none under reduced motion.

#### Build decisions

| Decision | Detail |
|---|---|
| Own styles | `NlTextAreaBase.styles.ts` with the same tokens as `NlInputBase` (rule 1: one styles file per component); no shared classes |
| Padding on the textarea | `Space-XL` sits on the textarea, not the box, so the resize handle is in the box corner and text scrolls inside the border |
| Focus ring | `has-focus` on the box: it holds nothing else focusable, so no `input-focus`-style variant is needed |
| Floating label | At rest `Space-XL` in from the top and start (on the first line); floating at the top border, centred with a half translate. CSS only, through `peer-*` variants |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |

Checked in the browser: 2, 4 and 6 rows give 80, 128 and 176; the floating label is centred on the top border and its text lines up with the value; focus draws one ring.
| Type name | "Distructive" (spelling) | `error` | Matches |

---

### NlTextArea

**Level** Molecule (mapped) · **Base** `NlTextAreaBase` · **Depends on** – · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-88 and OD-89 decided 19 Nov 2026.

A multi-line text input, for notes, descriptions and messages.

#### Anatomy

As `NlTextAreaBase`.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Error | off, on | `error?: boolean` |
| Rows | number | `rows`, default 4 |
| Maximum length | number | `maxLength?` (see "Mapping notes") |
| Value | text | `value` / `defaultValue`, `onChange` |
| Everything else | as `NlTextAreaBase` | `label`, `helperText`, `disabled`, `required`, `ref`. No placeholder (designer's choice, 19 Nov 2026) |

#### Sizes, layout, colours and states

As `NlTextAreaBase`. States: default, hover, focused, typing, complete, disabled, each with and without error.

#### Behaviour and accessibility

As `NlTextAreaBase`. Enter adds a new line, it never submits a form.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Complete state value colour | `text-placeholder` (a drawing slip: the entered text looks like a placeholder) | `text-primary` | Approved (OD-88) |
| Character count | Not in the reference | With `maxLength`, a count ("120 / 500") at the end of the helper line, `Body S` `text-tertiary`, announced politely when typing crosses 20, 10, 5 and 0 left. A hard limit: native `maxLength` stops typing, so there is no over-limit error. Built into `NlTextAreaBase` (the helper line is the base's) | Approved (OD-89) |
| Placeholder | Placeholder text | None, as `NlTextAreaBase` | Designer's choice, 19 Nov 2026 |

#### Spec → code

| Spec option | Code |
|---|---|
| Error | `error?: boolean`, passed to the base |
| Rows | `rows?: number`, default 4 |
| Maximum length | `maxLength?: number`: native limit, count, limit description and near-limit announcements (the base's) |
| Value | `value` / `defaultValue`, `onChange`; the count follows both |
| Everything else | `label`, `helperText`, `disabled`, `required`, `ref` and native attributes, passed to the base |
| Enter | A new line (native); a textarea never submits a form |

#### API

```tsx
import { NlTextArea } from '@northline/ui';

<NlTextArea label="Notes" />
<NlTextArea label="Description" maxLength={200} helperText="Shown on the reward page." />
```

Presentational (the base has `'use client'`).

#### Tokens used

`NlTextAreaBase`'s. The count: Body S, `text-tertiary`, disabled `text-disabled`, `Space-M` below the box and from the helper text.

#### Build decisions

| Decision | Detail |
|---|---|
| Mapped with nothing fixed | `NlTextArea` passes every prop to `NlTextAreaBase`; the count lives in the base because the helper line is the base's |
| Count position | At the very end of the line, flush with the box's end edge (the helper text keeps its `Space-XL` start indent) |
| Announcements | Only on typing (through `onChange`); a value set by the parent updates the count silently |
| Disabled contrast | `text-disabled`: known issue K3; story samples are marked |

Checked in the browser: the count sits `Space-M` (8) below the box, flush with its end edge, `text-tertiary` in Light and Dark.

---

### NlCalendar

**Level** Molecule (contains `NlCalendarDay` L0, `NlButton` L1, `NlLabel` L1) · **Base** none · **Depends on** `NlCalendarDay`, `NlButton`, `NlLabel` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-50 (`NlLabel` tone) and OD-90 decided.

A month grid for picking one date or a date range. Used inside `NlDateField`'s menu and on its own.

#### Anatomy

```
NlCalendar (horizontal; one month, or two for a range)
└── month (vertical)
    ├── header: previous NlButton · month and year · next NlButton
    ├── weekday row: NlLabel × 7
    └── weeks: 6 rows × 7 NlCalendarDay
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | single, range | `mode: 'single' \| 'range'`, also `data-mode` |
| Value | a date, or a start and end | `value` / `defaultValue`, `onValueChange` |
| Month shown | a month | `month` / `defaultMonth`, `onMonthChange` |
| Limits | earliest and latest dates | `minDate?`, `maxDate?` |
| Disabled dates | a test | `isDateDisabled?(date)` |
| Week start | Monday | `weekStartsOn`, default Monday (1) |
| Names | month and weekday names | `names?`, default English (replaces `locale`: no locale formatting during render; designer's choice, 20 Nov 2026) |
| Today | a date | `today?` (ISO); without it, read in the browser after hydration |

#### Sizes and layout

- Padding `Space-L`. Range: two months side by side, `Space-2XL` apart.
- Month: vertical, gap `Space-S` between header, weekday row and weeks.
- Header: height `Size-40`. Month and year centred in `Title S`. Previous and next: `NlButton variant="tertiary" size="small" icon="only-icon" contentTone="secondary"` with `chevron_left` and `chevron_right`. In a range, the left month has only "previous" and the right month only "next". A same-size empty space keeps the title centred.
- Weekday row: 7 cells of `Size-40`, each an `NlLabel size="small"` with the short day name, centred.
- Weeks: always 6 rows of 7 `NlCalendarDay` (`Size-40` each). Single: days of other months show as "outside". Range: days of other months are left empty.

#### Colours

| Part | Token |
|---|---|
| Background | `bg-primary` |
| Month title | `text-primary` |
| Weekday names | `text-secondary` (`NlLabel tone="secondary"`, OD-50) |
| Days | see `NlCalendarDay` |

#### States

From the parts. While choosing the end of a range, hovering a day previews the range (range-middle look up to the hovered day).

#### Behaviour and accessibility

- The days form a `role="grid"` labelled with the month and year, with weekday column headers (`columnheader`, full day names as their accessible text).
- Keyboard (one tab stop in the grid, roving focus):
  - Arrow keys move by a day or a week, crossing into the next or previous month.
  - Home and End go to the start and end of the week.
  - Page Up and Page Down go to the previous and next month. With Shift, the previous and next year.
  - Enter or Space selects. In range mode the first choice sets the start, the second the end.
- Previous and next buttons: named "Previous month" and "Next month".
- The month and year title is a polite live region, so changing month is announced.
- Disabled dates are announced as unavailable and can't be selected, but stay reachable by arrow keys.
- No locale formatting during render (CLAUDE.md, §7.4): dates are formatted with a stable, injected formatter so server and client output match.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Background | Raw white fills on the month, header and rows | `bg-primary` | Approved (OD-90) |
| Weekday names colour | `text-secondary` per the reference's description | `NlLabel size="small" tone="secondary"` | Decided (OD-50) |
| Previous and next icon colour | Icon secondary (from the description) | `contentTone="secondary"` | Matches |
| Keyboard and range preview | From the reference's description (code only) | As above | Matches |
| Six weeks per month | As in the reference | Same, so the height doesn't jump between months | Matches |
| Gaps and padding | `Space-L`, `Space-2XL`, `Space-S` | Same | Matches |
| Names | `locale` | `names` (months, weekdays, two-letter short weekdays "Mo"–"Su"), English by default | Designer's choice, 20 Nov 2026 |
| Range rules | Not drawn | A day before the start restarts the range; the same day twice is one `selected` day; the preview follows hover and keyboard focus | Approved, 20 Nov 2026 |
| Limits | Not drawn | Previous and next are disabled when the next month would be wholly outside `minDate` / `maxDate` | Approved, 20 Nov 2026 |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | `mode?: 'single' \| 'range'`, default `single`, `data-mode` |
| Value | single: `value` / `defaultValue: string \| null` (ISO), `onValueChange(date)`. Range: `{ start, end }` (`end` null while choosing), `onValueChange(range)` |
| Month shown | `month` / `defaultMonth` (`'YYYY-MM'`, the first month in a range), `onMonthChange(month)`. Default: the value's month, else today's |
| Limits | `minDate?`, `maxDate?` (ISO): days outside are `disabled` |
| Disabled dates | `isDateDisabled?(date)` |
| Week start | `weekStartsOn?: 0–6`, default 1 (Monday) |
| Today | `today?` (ISO); without it, `useSyncExternalStore` reads it in the browser (server snapshot null), so server and hydration output match |
| Names | `names?: { months, weekdays, weekdaysShort }`, default English |
| Header | `NlButton` tertiary small icon-only `contentTone="secondary"`, `chevron_left` / `chevron_right`, "Previous month" / "Next month"; a `Size-36` spacer where a range leaves one out. Title Title S `text-primary`, `aria-live="polite"` |
| Grid | `role="grid"` per month, `aria-labelledby` the title; weekday `columnheader`s with `NlLabel` (hidden) and the full name (screen readers); 6 `row`s of 7 `NlCalendarDay`; in a range, other months' days are empty `gridcell`s |
| Day names | "Wednesday 17 March 2027", plus ", unavailable" when disabled |
| Focus | One tab stop (roving `tabIndex`): the focused date if shown, else the selection, today, or the first shown day. Focus follows keyboard moves across months |

#### API

```tsx
import { NlCalendar } from '@northline/ui';

<NlCalendar defaultValue="2027-03-09" onValueChange={setDate} />
<NlCalendar mode="range" value={range} onValueChange={setRange} minDate="2027-03-01" />
```

`'use client'` (state, refs, effects).

#### Tokens used

`bg-primary`, `Space-L` (padding), `Space-2XL` (between months), `Space-S` (month gap and above the weeks), `Size-40` (header height, weekday cells), Title S `text-primary`, `Size-36` (spacer); the parts' own tokens (`NlButton`, `NlLabel`, `NlCalendarDay`).

#### Build decisions

| Decision | Detail |
|---|---|
| Dates as ISO strings | `dates.ts` holds plain helpers in UTC (no date library, no `Intl`), so a time zone can't shift a day |
| Today | `useSyncExternalStore` with a null server snapshot, not an effect, so there is no extra render and no hydration mismatch. Without a value, a `defaultMonth` or `today`, the grid appears once hydrated |
| Range drawing | Start alone is `selected`; with an end (or a preview) start and end take `range-start` / `range-end`, days between `range-middle`; the preview end shows as `range-middle` |
| Disabled contrast | `text-disabled` day numbers: known issue K3; the Limits story is marked |

Checked in the browser: one month 304 × 356 (grid 280 × 286), range 604 wide with the two months 20 apart; header 40 high; Tab lands on today, arrows and Page Down move focus and the month.

---

### NlStep

**Level** Molecule (contains `NlLabel`, L1) · **Base** none · **Depends on** `NlIcon`, `NlLabel` · **Internal** (used only by `NlStepper`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-50, OD-94, OD-95, OD-96.

One step in a stepper: a numbered box, a label under it, and a line to the next step.

#### Anatomy

```
NlStep (vertical, centred, fixed column)
├── box (number, or a tick when done)
├── NlLabel (step name)
└── line (to the next step; off for the last step)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| State | done, current, upcoming | `state`, also `data-state` |
| Number | number | `number: number` |
| Label | text | `children` |
| Line | on, off (last step) | `last?: boolean` |
| Go back | done steps can be buttons | `onSelect?()` (done steps only) |

#### Sizes and layout

- Column width `Space-10XL` (80). Vertical, items centred, gap `Space-M` between box and label.
- Box: `Size-36`, `Radius-S`, 2px inside border (§4.2). Content centred: number in `Title M`, or `NlIcon check` 20.
- Label: `NlLabel size="medium"`, centred, wrapping inside the column.
- Line: 2px (§4.2), from the box's right edge to the next box's left edge, vertically centred on the box. Its length comes from the stepper's spacing (see `NlStepper`).

#### Colours

| State | Box fill | Box border | Number / tick | Label | Line |
|---|---|---|---|---|---|
| done | `bg-success_secondary` | `border-success` | tick `fg-success` | `text-primary` | `border-success` |
| current | `bg-active` | `border-active` | `text-action` | `text-action` | `border-active` |
| upcoming | `bg-secondary` | `border-default` | `text-secondary` | `text-secondary` | `border-default` |

- Focus (done steps that are buttons): the standard ring from CLAUDE.md around the box.

#### States

Done, current, upcoming. Done steps that go back also have hover and focus (see "Mapping notes").

#### Behaviour and accessibility

- Steps are list items in an ordered list (`NlStepper`). Current has `aria-current="step"`.
- Each step's accessible text includes its state: "Step 2 of 4, Details, current" / "completed" / "not started".
- Done steps with `onSelect` are buttons ("Go back to step 1, Basics"). Others aren't focusable.
- The line is decorative.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Label colour per state | `NlLabel` with its colour overridden (primary, action, secondary). `NlLabel` is fixed to `text-tertiary` and can't be restyled from outside | Proposed: add a `tone` prop to `NlLabel` (tertiary default, primary, secondary, action). The calendar's weekday names need the same (OD-50) | **Needs approval** |
| Column width | `Space-10XL` used as a width | Same token. It's a spacing token used for a size; no `Size-80` exists | **Needs approval** |
| Line length | Raw 124 for steps 80 apart | Set by the stepper's layout, not a number (see `NlStepper`) | **Needs approval** |
| Hover on done steps | Not drawn | Proposed: box fill `bg-success_secondary` stays; label underlined | **Needs approval** |
| Box, number, colours | As in the table | Same | Matches |

---

### NlListItemBase

**Level** Molecule (contains `NlLabel`, L1) · **Base** – (this is the base) · **Depends on** `NlLabel`, `NlTextBlock`, `NlDivider` · **Internal**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-14, OD-15, OD-97, OD-119 and OD-148 to OD-151 decided.

The shared list row: leading item, title and description, trailing item, and a divider (plain) or a card (filled). Every list item maps onto it.

#### Anatomy

```
NlListItemBase (vertical)
├── content (horizontal)
│   ├── leading slot (optional: icon, avatar, checkbox, radio)
│   ├── text column (vertical)
│   │   ├── top label (optional, NlLabel)
│   │   ├── title row: NlTextBlock heading + extra icon slot (optional)
│   │   └── body slot (optional; default NlTextBlock description)
│   └── trailing slot (optional: caption, chevron, switch, checkbox, radio)
└── NlDivider (plain appearance only, optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Appearance | plain (rows with dividers), filled (separate cards) | `appearance`, default `plain`, also `data-appearance` |
| Size | large, small | `size`, default `large` |
| Density | default, compact | `density`, default `default` |
| Title, description | text | `title`, `description?` |
| Top label | optional, hidden by default | `topLabel?: string`, `NlLabel size="small"` (OD-149) |
| Leading, trailing accessory, extra icon, body | slots (accessories hold any component) | `leading?`, `trailing?`, `extraIcon?`, `body?` |
| Divider | on (default) or off (plain only) | `divider?: boolean` |
| Selected, disabled | set by the mapped item | `selected?`, `disabled?` |

#### Sizes and layout

| Part | Plain | Filled |
|---|---|---|
| Padding (default density) | `Space-XL` top and sides; bottom `Space-none` with a divider, `Space-XL` without | `Space-XL` all round |
| Padding (compact) | `Space-M` top and sides; bottom as above with `Space-M` | `Space-M` all round |
| Gap content → divider | `Space-XL` (compact `Space-M`) | – |
| Card | – | `Radius-L`, 1px inside border (§4.2); cards `Space-L` apart (set by the list) |

- Content: horizontal, gap `Space-L`, items centred vertically. `accessoryAlign="title"` puts the accessories on the title's first line instead (control rows, designer's choice 20 Nov 2026).
- Text column: gap `Space-XS`. Title row: gap `Space-M` (8) between the title text and the extra icon (OD-150).
- Trailing slot: gap `Space-S`.
- Text styles: large = `NlTextBlock type="headline-small"` (title `Headline Small-H6`, description `Body M`); small = `type="label"` (title `Label M`, description `Body S`) (OD-14).
- Leading avatars are 40, icons 24. Trailing icons 24.

#### Colours

| State | Plain row fill | Filled card fill | Filled card border |
|---|---|---|---|
| default | none | `bg-primary` | `border-subtle` |
| hover | `bg-secondary` | `bg-secondary` | `border-subtle` |
| selected | `bg-active` | `bg-primary` | `border-active` |
| selected + hover | `bg-active-hover` | `bg-secondary` | `border-active` |
| disabled | none | `bg-primary` | `border-disabled` |

| Part | Enabled | Disabled |
|---|---|---|
| Title | `text-primary` | see "Mapping notes" |
| Description | `text-secondary` | `text-disabled` |
| Leading and trailing icons | `fg-primary` (leading), `fg-secondary` (trailing) | `fg-disabled` |
| Divider | `border-default` | `border-default` (OD-148) |

- Focus: the standard ring from CLAUDE.md around the whole row (or card, following its corners).

#### States

Default, hover, selected, selected + hover, focus, disabled. The mapped items decide which apply.

#### Behaviour and accessibility

The role comes from the mapped item (link, button, option, checkbox, radio, switch). The base renders the layout only.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Plain and filled | Two separate bases | One base with `appearance` | Matches inventory |
| Disabled title | `text-disabled-on_bg`, while the description is `text-disabled` | Both `text-disabled` through `NlTextBlock disabled` (OD-15) | Approved |
| Small-row text | Overrides on the text block | `NlTextBlock type="label"` (OD-14) | Approved |
| Pressed | Not drawn | Same as hover (OD-97) | Approved |
| Focus ring | Code only: around the row, following card corners | Same | Matches |
| Card gap | `Space-L`, from the reference's description | Set by the parent list, not the item | Matches |
| Disabled divider | `border-disabled` | `border-default`, unchanged when disabled (OD-148) | Approved |
| Top label | Optional label above the title | `NlLabel size="small"` (tertiary), not shown unless given (OD-149) | Approved |
| Extra icon | Icon after the title | Inside the title row, `Space-M` (8) from the text, hidden from assistive tech, takes the title colour (OD-150) | Approved |
| Hover and pressed | On every row | Only on rows the mapped item makes actionable (`actionable`, OD-151) | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Appearance | `appearance?: 'plain' \| 'filled'`, default `plain`, `data-appearance` |
| Size | `size?: 'large' \| 'small'`, default `large`: `NlTextBlock type="headline-small"` or `type="label"`, heading as a `span` |
| Density | `density?: 'default' \| 'compact'`, default `default`, `data-density` |
| Title, description | `title`, `description?` into one `NlTextBlock` (keeps its heading → description gap) |
| Top label | `topLabel?: string` → `NlLabel size="small"`; nothing rendered when empty |
| Leading, trailing accessory | `leading?`, `trailing?`: any component, in a slot that sets `currentColor` (`fg-primary` / `fg-secondary`, `fg-disabled` when disabled) |
| Extra icon | `extraIcon?`, `aria-hidden`, `Space-M` after the title |
| Body | `body?` replaces the description, below the text block (`Space-XS`) |
| Divider | `divider?: boolean`, default on, plain only: decorative `NlDivider` |
| Selected, disabled | `selected?`, `disabled?`: look only, `data-selected` / `data-disabled`. The mapped item sets ARIA and native disabled |
| Actionable | `actionable?: boolean`, default off: adds the hover and pressed fills |
| Element | `as?` (default `div`; `li`, `label`, `button`, `a`, a router link), with `type`, `href`, `htmlFor` and native props passed through |

#### API

```tsx
import { NlListItemBase } from '../NlListItemBase'; // internal, not exported from @northline/ui

<NlListItemBase as="button" type="button" actionable title="Member 0042" description="Tier 2"
  leading={<NlIcon name="person" tone="inherit" />} trailing={<NlIcon name="chevron_right" tone="inherit" />} />
```

Presentational, no `'use client'`.

#### Tokens used

`Space-XL`, `Space-M`, `Space-none` (padding, divider gap), `Space-L` (content gap), `Space-XS` (text column), `Space-M` (title row), `Space-S` (trailing gap), `Radius-L`, 1px `inset-ring`; `bg-primary`, `bg-secondary`, `bg-active`, `bg-active-hover`; `border-subtle`, `border-active`, `border-disabled` (card ring); `fg-primary`, `fg-secondary`, `fg-disabled`; the standard focus ring; `Duration fast` colour transition (none under reduced motion); the parts' own tokens (`NlTextBlock`, `NlLabel`, `NlDivider`).

#### Build decisions

| Decision | Detail |
|---|---|
| States | Hover and pressed classes are picked in the TSX only when `actionable` and not disabled, so plain `hover:` / `active:` work on any root element (as in `NlNavSubItem`) |
| Disabled wins | Disabled drops the selected and hover looks |
| Inner parts | `span`s with flex, so a `button` or `a` root stays valid where possible (`NlTextBlock` still renders a `div`) |
| Focus ring | On the root. Mapped items whose focus sits on an inner control (checkbox, radio, switch) decide their own ring |
| Disabled contrast | `text-disabled` title and description: known issue K3; disabled samples are marked |

#### Nav appearance (added 20 Nov 2026, OD-119)

`appearance="nav"`, for `NlSideNavUser` only (the list items' `NlListItemBaseAppearance` stays `plain | filled`). Small type only; no divider; density has no effect.

| Part | Value |
|---|---|
| Padding | Actionable: `Space-L` block, `Space-XL` inline. Not actionable: `Space-L` block, no inline. Text hidden: `Space-L` all round (OD-195) |
| Radius | `Radius-S`, like the side nav rows (D19) |
| Fill | none; hover `bg-tertiary`; pressed `bg-neutral`; selected (an open menu) `bg-tertiary` |
| Text | `NlTextBlock type="label-body"`: Label M title, Body M description (OD-120) |

`hideText?: boolean` keeps the text column for assistive tech only (`sr-only`, out of the layout), so the row shows only its accessories (the minimized side nav).

---

### NlListItem

**Level** Molecule (mapped) · **Base** `NlListItemBase` · **Depends on** `NlAvatar`, `NlListCaption`, `NlIcon` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-98, OD-99 and OD-152 to OD-155 decided.

The standard list row: something to open, choose or read, such as a member, a reward or a menu option.

#### Anatomy

As `NlListItemBase`, with these slots filled:
- leading: none, an `NlIcon` (24), or an `NlAvatar` (medium, 40)
- trailing: an optional `NlListCaption` and an optional chevron (`chevron_right`, 24)

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Appearance | plain, filled | `appearance`, default `plain` |
| Size | large, small | `size`, default `large` |
| Density | default, compact | `density` |
| Leading | none, icon, avatar | `icon?: NlIconName` or `avatar?: NlAvatarProps` |
| Description | on or off | `description?` |
| Caption | on or off | `caption?: string` (`NlListCaption size="small" weight="heavy"`) |
| Chevron | on or off | `chevron?: boolean`. Always on for filled. A chevron makes the whole row actionable |
| Selected | on or off | `selected?` |
| Disabled | on or off | `disabled?` (OD-153) |
| Divider | on (default) or off | `divider?: boolean` (OD-154) |
| Body | optional, in place of the description | `body?` (OD-155) |
| Element | link, button, option, or static | `as`, `href`, `onClick`; inside `NlMenu`, the menu sets the role |

#### Sizes, layout and colours

As `NlListItemBase`. The leading icon is `fg-primary`; the chevron is `fg-secondary`; the caption is `text-tertiary` (disabled: see `NlListCaption`).

#### States

Default, hover, selected, selected + hover, focus, disabled.

#### Behaviour and accessibility

- As a link or button: the whole row is the control. Its name is the row's text: the title, then the description and caption (WCAG 2.5.3, see Build decisions).
- Inside `NlMenu`: `role="menuitem"` (action menus) or `role="option"` with `aria-selected` (select menus).
- Selected (outside menus): the page sets `aria-current` (OD-152); `selected` is the look only.
- A static row (no action, no chevron) has no hover and no focus (OD-98). With a chevron the whole row is clickable.
- The chevron and leading icon are decorative.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Leading accessories | None, icon, flag, payment, avatar | None, icon, avatar (flag and payment left out) | Matches |
| Trailing accessories | None or caption, plus chevron | Same | Matches |
| Chevron on filled rows | Always shown, per the reference's description | Same | Matches |
| Static rows | Not described | No hover or focus when there's no action and no chevron | Approved (OD-98) |
| Chevron icon | From the reference's icon set | Material Symbols `chevron_right` | Approved (OD-99) |
| Current item | `aria-current` | Set by the page (`aria-current` passes through) | Approved (OD-152) |
| Disabled | Not described | Button: native `disabled`. Link: no `href`, `aria-disabled`. Menu row: `aria-disabled`, clicks ignored. Avatar keeps its look | Approved (OD-153) |
| Divider | From the base | `divider?`, on by default | Approved (OD-154) |
| Base slots | Top label, extra icon, body | Only `body` exposed; top label and extra icon hidden | Approved (OD-155) |

#### Spec → code

| Spec option | Code |
|---|---|
| Appearance, size, density | `appearance`, `size`, `density` straight to `NlListItemBase` |
| Leading | `icon?: NlIconName` → `NlIcon` 24, `tone="inherit"` (slot gives `fg-primary`); `avatar?` → `NlAvatar size="medium"` (wins over `icon`) |
| Caption | `caption?` → `NlListCaption size="small" weight="heavy"` with `disabled` |
| Chevron | `chevron?` (forced on for filled) → `NlIcon chevron_right` 24, decorative, slot gives `fg-secondary` |
| Element | `role` → `div` with the role and `tabIndex` -1; `href` or `as` → link; `onClick` or a chevron → `button type="button"`; none → static `div`, `actionable` off. `data-kind` |
| Name | From the row's text in order: title, description (or body), caption. No `aria-labelledby` (see Build decisions) |
| Selected | Base look; `aria-selected` for `role="option"` |

#### API

```tsx
import { NlListItem } from '@northline/ui';

<NlListItem title="Member 0042" description="Tier 2" icon="person" chevron onClick={open} />
<NlListItem title="Rewards" href="/rewards" selected aria-current="page" caption="3" />
<NlListItem role="option" title="Tier 2" selected size="small" density="compact" divider={false} />
```

`'use client'` (event handlers).

#### Tokens used

The base's tokens (`NlListItemBase`), plus `NlIcon`, `NlAvatar` and `NlListCaption`'s own.

#### Build decisions

| Decision | Detail |
|---|---|
| Native disabled | `NlListItemBase` now sets native `disabled` when its root is a `<button>` |
| Name from content (WCAG 2.5.3) | The spec names the row by the title with the rest as a description. axe flags that (`label-content-name-mismatch`): the visible description and caption must be part of the name. The name is the row's text: title, then description or body, then caption |
| Chevron without `onClick` | Still a focusable button; the page adds the handler |
| Disabled contrast | `text-disabled` text: known issue K3; disabled samples are marked |

#### Menu links (added 20 Nov 2026)

With `role` and `href`, the row is an `<a role="menuitem">` (or `as`), for navigation menus (`NlNavItem` minimized). Without `href` it stays a `<div>`.

---


### NlCheckboxListItem

**Level** Molecule (mapped) · **Base** `NlListItemBase` · **Depends on** `NlCheckboxControl` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-100, OD-102 and OD-156 to OD-159 decided (OD-101 belongs to `NlRadioListItem`).

A list row with a checkbox, for picking several items from a list (for example in a multi-select menu or a filter).

#### Anatomy

As `NlListItemBase`, with `NlCheckboxControl` in the leading slot (default) or the trailing slot.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Checked | unchecked, checked | `checked` / `defaultChecked`, `onCheckedChange`. No indeterminate (OD-156): that is for the table components |
| Checkbox side | leading (default), trailing | `controlSide` |
| Appearance, size, density | as `NlListItemBase` | `appearance`, `size`, `density` |
| Description | on or off | `description?` |
| Body | optional, in place of the description | `body?` (OD-158) |
| Show body | on (default) or off: hides the description or body | `showBody?: boolean` (designer's choice, 20 Nov 2026) |
| Divider | on (default) or off | `divider?` |
| Disabled | on or off | `disabled?` |
| Value | for forms and menus | `value` |

#### Sizes, layout and colours

As `NlListItemBase`. Checked rows use the "selected" row colours (`bg-active`, or the card's `border-active` when filled). The checkbox has its own colours.

#### States

Default, hover, checked, checked + hover, focus, disabled. The checkbox follows the row: hovering the row shows the checkbox's hover look.

#### Behaviour and accessibility

- The whole row toggles. It is a `<label>` around a native checkbox. No menu mode (OD-157).
- Keyboard: Space toggles. The focus ring goes around the row, not the box.
- A group of these takes a group label (`role="group"` with a name), for example "Tiers". The page provides the wrapper (OD-159).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Types | Default, country, payment | Default only | Matches |
| Indeterminate | Code only (select all), per the reference's description | Left out; table components handle select all (OD-156) | Approved |
| Focus ring on the row | Code only, per the reference's description | Same | Matches |
| Checkbox hover follows the row | Not drawn | `NlCheckboxControl inRow` follows the row's named group `list-item` (OD-100) | Approved |
| Menu rows | `role="option"` in a multi-select listbox | Left out (OD-157) | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Row | `NlListItemBase as="label"`, `actionable`, `controlRow`; `selected` = checked; `data-checked`, `data-control-side` |
| Checkbox | `NlCheckboxControl inRow` in the `controlSide` slot (`leading` default, `trailing`) |
| Checked | Native `checked` / `defaultChecked`; internal state for uncontrolled use so the row colour follows; `onCheckedChange(checked)` and native `onChange` |
| Name | The label's text: title, then description or body |
| Disabled | Native `disabled` on the input; the row drops the hover group |
| Value, name, ref and other input attributes | Go to the input |

#### API

```tsx
import { NlCheckboxListItem } from '@northline/ui';

<div role="group" aria-labelledby="tiers-label">
  <NlCheckboxListItem name="tiers" value="tier-2" title="Tier 2" description="1,200 members" defaultChecked />
</div>
```

`'use client'` (checked state).

#### Tokens used

The base's tokens (`NlListItemBase`) and `NlCheckboxControl`'s own; the row ring is the standard focus ring through `has-focus-visible`.

#### Build decisions

| Decision | Detail |
|---|---|
| Ring round the row (OD-102) | `NlListItemBase controlRow` adds the standard ring with `has-focus-visible:`; `NlCheckboxControl inRow` drops its own ring |
| Hover follows the row (OD-100) | The row is the named group `list-item` while enabled; `inRow` swaps the box's `group-hover/checkbox` and `group-active/checkbox` for `group-hover/list-item` and `group-active/list-item` |
| Pointer | The row shows the pointer cursor while enabled, like the checkbox |
| Checkbox lines up with the title | Designer's choice, 20 Nov 2026: `NlListItemBase accessoryAlign="title"`: content aligned to the top, the accessory slots one title line high (`h-lh` in the title's text style), the box centred in it. Other list items keep `center` |
| Disabled contrast | Known issue K3; disabled samples are marked |

#### Option mode (added 20 Nov 2026, with `NlMultiSelect` #71, OD-202)

`role="option"`: a row inside a listbox (`NlMultiSelect`'s `NlMenu`). Replaces OD-157's "left out". The row is a `div` with `role="option"`, `aria-selected` (checked), `aria-disabled`, `tabIndex -1`; a click (or `NlMenu`'s Enter and Space) toggles it and calls `onCheckedChange`. The checkbox is drawn by the same `NlCheckboxControl` but `inert` (no focus, hidden from assistive tech), so there's no control nested in the option and the checked, hover and disabled looks are unchanged. The name comes from the row's text.

---

### NlRadioListItem

**Level** Molecule (mapped) · **Base** `NlListItemBase` · **Depends on** `NlRadio` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-100, OD-101, OD-102 and OD-160 to OD-162 decided.

A list row with a radio, for picking exactly one item from a short list.

#### Anatomy

As `NlListItemBase`, with `NlRadio` in the leading slot (default) or the trailing slot.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Selected | set by the group | `value`; `NlRadioListGroup` holds the selected value |
| Radio side | leading (default), trailing | `controlSide` |
| Appearance, size, density | as `NlListItemBase` | `appearance`, `size`, `density` |
| Description | on or off | `description?` |
| Body | optional, in place of the description | `body?` |
| Show body | on (default) or off: hides the description or body | `showBody?: boolean` (designer's choice, 20 Nov 2026) |
| Divider | on (default) or off | `divider?` |
| Disabled | on or off | `disabled?` |

#### Sizes, layout and colours

As `NlListItemBase`. The selected row uses the "selected" row colours. The radio has its own colours.

#### States

Default, hover, selected, selected + hover, focus, disabled.

#### Behaviour and accessibility

- Rows sit in a radio group (`role="radiogroup"` with a name) that owns the value.
- Keyboard: one tab stop; arrow keys move and select (native radio behaviour). Focus ring around the row.
- No menu mode (OD-161): single-select menus use `NlListItem role="option"`.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Types | Default, country, payment | Default only | Matches |
| Group wrapper | Not a separate component in the reference | `NlRadioListGroup`, a separate export (a `.Group` property breaks across the Next.js client boundary) | Approved (OD-101) |
| Group layout | Not described | The group passes `appearance` to its rows; plain rows touch, filled cards `Space-L` apart | Approved (OD-160) |
| Group label | Not described | The page's; the group needs `aria-label` or `aria-labelledby` | Approved (OD-162) |

#### Spec → code

| Spec option | Code |
|---|---|
| Group | `NlRadioListGroup`: `role="radiogroup"`, `value` / `defaultValue` / `onValueChange`, `name` (default from `useId`), `disabled` (all rows, `aria-disabled`), `appearance`; flex column, gap `Space-none` (plain) or `Space-L` (filled) |
| Row | `NlListItemBase as="label"`, `actionable`, `controlRow`, `accessoryAlign="title"`; `selected` when its `value` matches the group's; `data-checked`, `data-control-side` |
| Radio | `NlRadio inRow` (controlled from the group) in the `controlSide` slot |
| Name | The label's text: title, then description or body |
| Keyboard | Native radios: one Tab stop, arrows move and select, disabled rows skipped |
| Outside a group | Throws |

#### API

```tsx
import { NlRadioListGroup, NlRadioListItem } from '@northline/ui';

<NlRadioListGroup aria-label="Tier" defaultValue="tier-2" onValueChange={setTier}>
  <NlRadioListItem value="tier-1" title="Tier 1" description="3,400 members" />
  <NlRadioListItem value="tier-2" title="Tier 2" description="1,200 members" />
</NlRadioListGroup>
```

`'use client'` (group state and context).

#### Tokens used

The base's tokens (`NlListItemBase`) and `NlRadio`'s own; `Space-none` and `Space-L` (group gap).

#### Build decisions

| Decision | Detail |
|---|---|
| Ring and hover (OD-100, OD-102) | As `NlCheckboxListItem`: `NlRadio inRow` drops its own ring and follows the row's `list-item` group |
| Title alignment | The radio sits on the title's first line, as the checkbox rows |
| Disabled contrast | Known issue K3; disabled samples are marked |

| Focus ring on the row | As for checkbox rows | Same | Matches |

---

### NlSwitchListItem

**Level** Molecule (mapped) · **Base** `NlListItemBase` · **Depends on** `NlSwitch`, `NlIcon` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-102, OD-163 and OD-164 decided (OD-100 and OD-101 don't apply: the switch has no hover colours and no group).

A settings row with a switch at the end, such as "Email updates".

#### Anatomy

As `NlListItemBase`: optional leading `NlIcon` (24), title, description, and `NlSwitch size="small"` in the trailing slot.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| On | off, on | `checked` / `defaultChecked`, `onCheckedChange` |
| Leading | none, icon | `icon?: NlIconName` |
| Appearance, size, density | as `NlListItemBase` | `appearance`, `size`, `density` |
| Description | on or off | `description?` |
| Body | optional, in place of the description | `body?` (OD-164) |
| Show body | on (default) or off: hides the description or body | `showBody?: boolean` (OD-164) |
| Divider | on (default) or off | `divider?` (OD-164) |
| Disabled | on or off | `disabled?` |

#### Sizes and layout

As `NlListItemBase`. The switch is the small size.

#### Colours

| State | Row fill (plain) |
|---|---|
| off or on, default | none |
| off or on, hover | `bg-secondary` |
| disabled | none |

Unlike checkbox and radio rows, an "on" row isn't highlighted: the switch shows the state. Text and icon colours are as `NlListItemBase`.

#### States

Default, hover, focus, disabled, each off and on.

#### Behaviour and accessibility

- The whole row toggles. The row is the switch's label: one control, `role="switch"`, named by the title, described by the description.
- Keyboard: Space toggles. Focus ring around the row.
- A screen reader hears "Email updates, switch, on".

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| No highlight when on | As in the reference | Same | Matches |
| Switch size | Small | Same | Matches |
| Focus on the row | Not drawn | Standard ring around the row, as for checkbox rows | Approved (OD-102) |
| Switch position | Not described | On the title's first line, as the checkbox and radio rows | Approved (OD-163) |

#### Spec → code

| Spec option | Code |
|---|---|
| Row | `NlListItemBase as="label"`, `actionable`, `controlRow`, `accessoryAlign="title"`; never `selected` |
| Switch | `NlSwitch size="small" inRow` in the trailing slot; `checked` / `defaultChecked` / `onCheckedChange`, `disabled`, `ref` and native button attributes go to it |
| Leading | `icon?` → `NlIcon` 24, `tone="inherit"` (slot gives `fg-primary`) |
| Name | `aria-labelledby` the title; `aria-describedby` the description or body (`useId`). The switch shows no text of its own, so WCAG 2.5.3 isn't affected |
| Toggle | Clicking the label presses the switch button (native label activation); Space or Enter on the switch |

#### API

```tsx
import { NlSwitchListItem } from '@northline/ui';

<NlSwitchListItem icon="notifications" title="Email updates" description="News about rewards" checked={on} onCheckedChange={setOn} />
```

`'use client'` (`useId`, state).

#### Tokens used

The base's tokens (`NlListItemBase`) and `NlSwitch`'s own.

#### Build decisions

| Decision | Detail |
|---|---|
| Ring round the row (OD-102) | `NlSwitch inRow` drops its own ring (`focus-visible:outline-none` so the browser's default doesn't show); the row draws it with `controlRow` |
| No hover follow | `NlSwitch` has no hover colours (OD-13b), so only the row's fill changes |
| Disabled contrast | Known issue K3; disabled samples are marked |


---

### NlAccordion

**Level** Molecule (contains `NlLabel`, `NlBadge`, L1) · **Base** `NlAccordionBase` (internal, holds both appearances) · **Depends on** `NlTextBlock`, `NlBadge`, `NlLabel`, `NlDivider`, `NlIcon` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-14, OD-103a, OD-103b, OD-103c, OD-103d, OD-103e.

A section with a header that shows or hides its content, for FAQs, settings groups and long forms.

#### Anatomy

```
NlAccordion (vertical)
├── header (button, horizontal)
│   ├── leading slot (optional; icon)
│   ├── title (+ optional help icon, optional NlBadge)
│   └── trailing chevron
├── body slot (shown when open; default NlTextBlock description)
└── NlDivider (bare appearance only)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Appearance | frame (card), bare (divider below) | `appearance`, default `frame`, also `data-appearance` |
| Size | large, small | `size`, default `large` |
| Open | closed, open | `open` / `defaultOpen`, `onOpenChange` |
| Title | text | `title` |
| Leading | optional | `icon?: NlIconName` |
| Help icon | optional | `help?: ReactNode` (shows an info icon with a tooltip) |
| Badge | optional | `badge?: ReactNode` (`NlBadge`) |
| Body | slot | `children` |
| Heading level | for the title | `headingAs`, default `h3` |

#### Sizes and layout

| Part | Frame | Bare |
|---|---|---|
| Container | Padding `Space-XL` all round; `Radius-L`; 1px inside border (§4.2) | Padding `Space-XL` top and sides, `Space-none` bottom; divider below, `Space-XL` after the content |
| Header → body gap | `Space-L` | `Space-L` |

- Header: horizontal, gap `Space-L`, items centred. Leading and trailing icons 24. Title row gap `Space-M`.
- Title: large = `NlTextBlock type="headline-small"`; small = see "Mapping notes".
- Body: `NlTextBlock` description (`Body M`) by default, or any content.

#### Colours

| Part | Token |
|---|---|
| Frame fill / border | `bg-primary` / `border-subtle` |
| Title | `text-primary` |
| Body text | `text-secondary` |
| Leading and chevron icons | `fg-secondary` |
| Divider (bare) | `border-default` |

#### States

Closed, open, header hover, header focus, disabled (see "Mapping notes" for hover and disabled).

#### Behaviour and accessibility

- The header is a `<button aria-expanded aria-controls>` inside a heading element (`headingAs`). The body is a region labelled by the header.
- Enter or Space toggles. The chevron turns (down when closed, up when open) with `--nl-duration-fast`; none under reduced motion.
- The body opens and closes with a height transition, `--nl-duration-base`; none under reduced motion.
- Several accordions in a group act independently. An "only one open" group isn't in the reference.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Open and closed | Not drawn as states; the body is shown or hidden with a boolean | `open` prop with the behaviour above | **Needs approval** |
| Small title | `NlLabel` (medium) recoloured to `text-primary` | Proposed: `NlTextBlock type="label"` (OD-14), whose title is `Label M` `text-primary`, so nothing is overridden | **Needs approval** |
| Header hover and focus | Not drawn | Proposed: header text and icons unchanged, frame fill `bg-secondary` on hover; standard focus ring around the header | **Needs approval** |
| Disabled | Not drawn | Not specified | Open |
| Chevron | `keyboard_arrow_down` | Material Symbols `keyboard_arrow_down` / `keyboard_arrow_up` | **Needs approval** |
| Two bases | Frame and bare are separate bases | One base with `appearance` | Matches inventory |

---

### NlBanner

**Level** Molecule (contains `NlButton`, L1) · **Base** none · **Depends on** `NlIcon`, `NlButton` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-93 and OD-106 to OD-109, OD-165 decided.

An inline message in the page about something the user should know, such as a sync warning or a successful import, with an optional action and close.

#### Anatomy

```
NlBanner (rounded, tinted, horizontal)
├── leading NlIcon (optional)
├── text column
│   ├── title (optional)
│   ├── description (optional)
│   └── action NlButton (optional)
└── close NlButton (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | info, success, error, warning, neutral | `tone`, default `info`, also `data-tone` |
| Title | optional | `title?` |
| Description | optional | `children` |
| Leading icon | on (default) or off | `showIcon?` |
| Action | optional | `action?: { label, onClick }` |
| Close | optional | `onClose?()` (shows the close button) |
| Announced | off (default) or on | `live?: boolean` (OD-109) |

#### Sizes and layout

- Padding `Space-XL` all round, `Radius-M`. Width fills its container.
- Content: horizontal, gap `Space-M`, aligned to the top.
- Leading icon 20, centred on the first text line (title, or description without one) (OD-165). Close button: `NlButton` icon-only, tertiary, xsmall (32), `contentTone` matching the tone, icon `close` (OD-107).
- Text column: gap `Space-XS`. Title `Headline Small-H6`, description `Body M`, then the action button.

#### Colours

| Tone | Background | Icon | Title | Description | Action and close (`contentTone`) |
|---|---|---|---|---|---|
| info | `bg-info_secondary` | `fg-info` (`info`) | `text-info` | `text-info` | info |
| success | `bg-success_secondary` | `fg-success` (`check_circle`) | `text-success` | `text-success` | success |
| error | `bg-error_secondary` | `fg-error` (`error`) | `text-error` | `text-error` | error |
| warning | `bg-warning_secondary` | `fg-warning` (`warning`) | `text-warning` | `text-warning` | warning |
| neutral | `bg-neutral` | `fg-secondary` (`info`) | `text-primary` | `text-secondary` | primary (close: secondary) |

#### States

None of its own. The buttons have theirs.

#### Behaviour and accessibility

- Static banners present on load: no role, just content in the page.
- Banners added after load: `role="status"` (info, success, neutral) or `role="alert"` (error, warning), so they are announced.
- The close button's name is "Dismiss" (or "Dismiss {title}"). After closing, focus moves to a sensible place set by the caller.
- Colour isn't the only signal: the icon and the text carry the meaning.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Title and description | Plain text inside the banner, coloured by tone | Plain text in the banner, not `NlTextBlock` (whose colours are fixed). A short title and paragraph aren't a reuse of the text block's layout | Approved (OD-93) |
| Action button size | A small tertiary button squeezed to 24 tall (no padding) | No `NlButton` is 24 tall, and `variant="link"` is normal tone only, so it can't take the banner's colour. `NlButton variant="link" size="xsmall" flush contentTone`: a link in the tone's colour, label lined up with the text, 36 tall | Approved (OD-106, changed to a toned flush link by the designer, 20 Nov 2026) |
| Close icon | A bare 24 icon | `NlButton` icon-only, tertiary, xsmall (32), `contentTone`, so it's a real button | Approved (OD-107) |
| Error icon | The warning triangle, the same as warning | `error` (a circle with "!"), so error and warning differ in shape | Approved (OD-108) |
| Live announcement | Not in the reference | Roles as above, opt-in with `live` | Approved (OD-109) |
| Icon alignment | Not described | Centred on the first text line; the 32 close button stays top-aligned, 4 above the title line | Approved (OD-165) |

#### Spec → code

| Spec option | Code |
|---|---|
| Type | `tone`, default `info`, `data-tone`; lookups for background, icon colour, title and description colour |
| Title | `title?` → `<p>` Headline Small-H6 |
| Description | `children` → `<div>` Body M |
| Leading icon | `showIcon?` (default on) → `NlIcon` 20 in a `1lh` slot of the first line's text style |
| Action | `action?: { label, onClick }` → `NlButton variant="link" size="xsmall" flush contentTone` (tone colour; `primary` for neutral) |
| Close | `onClose?` → `NlButton` icon-only `close`, xsmall, named "Dismiss {title}" (or "Dismiss") |
| Live | `live?` → `role="status"` (info, success, neutral) or `role="alert"` (error, warning) |

#### API

```tsx
import { NlBanner } from '@northline/ui';

<NlBanner tone="warning" title="Sync delayed" action={{ label: 'View details', onClick: open }} onClose={hide}>
  Rewards may show old balances until the next sync.
</NlBanner>
```

`'use client'` (button handlers).

#### Tokens used

`Space-XL` (padding), `Radius-M`, `Space-M` (content gap), `Space-XS` (text column); `bg-info_secondary`, `bg-success_secondary`, `bg-error_secondary`, `bg-warning_secondary`, `bg-neutral`; `fg-info`, `fg-success`, `fg-error`, `fg-warning`, `fg-secondary`; `text-info`, `text-success`, `text-error`, `text-warning`, `text-primary`, `text-secondary`; Headline Small-H6, Body M; `NlButton`'s own.

#### Build decisions

| Decision | Detail |
|---|---|
| Title element | A `<p>`, not a heading: the banner can't know the page's heading level |
| Description element | A `<div>`, so it can hold a link or more than one line |
| Close name | "Dismiss {title}" when the title is a string, else "Dismiss" |
| Link in the tone colour | The plain link (`text-action`) failed AA on some tints (neutral in Dark 4.02 to 4.42; Voltic Light neutral 4.23, error 4.34). `NlButton` link gained content tones and `flush` (see `NlButton`) |


---

### NlSnackbar

**Level** Molecule (contains `NlButton`, L1) · **Base** none · **Depends on** `NlIcon`, `NlButton` (`NlTextBlock` dropped, OD-93) · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-91 to OD-93, OD-104, OD-105, OD-110, OD-111 and OD-166 to OD-168 decided.

A short message that appears at the edge of the screen after an action ("Reward saved"), with an optional action ("Undo") and close.

#### Anatomy

```
NlSnackbar (rounded)
├── leading NlIcon (optional)
├── message
└── trailing: action NlButton (optional) + close NlButton (optional)
```

Two-line layout: icon and message on top, the buttons on a row of their own below, aligned to the end.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| State | neutral, success, warning, error | `tone`, default `neutral`, also `data-tone` |
| Lines | single, two lines | `layout?: 'single' \| 'stacked'`, default single (OD-167) |
| Message | text | `children` |
| Leading icon | on (default) or off | `showIcon?` |
| Action | optional | `action?: { label, onClick }` |
| Close | on (default) or off | `showClose?` (OD-168), `onClose?()` |
| Duration | auto-dismiss time | `--nl-duration-snackbar` (6s, OD-92); none with an action |

#### Sizes and layout

- `Radius-M`. Single line: height `Size-48`, horizontal, gap `Space-M`, items centred.
  - Leading part: padding `Space-XL` at the start, icon 24, gap `Space-M`, message.
  - Trailing part: action `NlButton variant="tertiary" size="small"`, close `NlButton variant="tertiary" size="medium" icon="only-icon"` (`close`), padding `Space-XS` at the end.
- Two lines: vertical, gap `Space-M`. Top row padding `Space-XL` (top and sides). Button row aligned to the end, padding `Space-XS` (end and bottom).
- Message text `Body M`.
- Position: see "Mapping notes". Layer `--nl-z-snackbar` (§4.3).

#### Colours

| Tone | Background | Icon | Message | Buttons (`contentTone`) |
|---|---|---|---|---|
| neutral | `bg-direct` | `fg-inverse` (`info`) | `text-inverse` | inverse |
| success | `bg-success_secondary` | `fg-success` (`check_circle`) | `text-primary` | primary |
| warning | `bg-warning_secondary` | `fg-warning` (`warning`) | `text-primary` | primary |
| error | `bg-error_secondary` | `fg-error` (`error`) | `text-primary` | primary |

#### States

Hidden, entering, shown, leaving. The buttons have their own states.

#### Behaviour and accessibility

- Rendered into a live region that exists from page load: `role="status"` (polite) for neutral and success; `role="alert"` for warning and error.
- Doesn't take focus. The action is reachable by keyboard: a shortcut (F6) or the next Tab moves into the snackbar region (see "Mapping notes").
- Snackbars with an action don't auto-dismiss (WCAG 2.2.1); they stay until closed or acted on. Without an action they dismiss after the duration, pausing while hovered or focused.
- Enters and leaves with a fade and slide, `--nl-duration-base`; reduced motion: fade only.
- One at a time. A new one replaces the old.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Message colour on status tints | `text-primary` (the text block's description recoloured from `text-secondary`) | `NlTextBlock`'s description is fixed to `text-secondary` (or `text-inverse` with `tone="inverse"`). The message is plain text in the snackbar, not `NlTextBlock`, so the inventory dependency on `NlTextBlock` goes | Approved (OD-93) |
| Status snackbars on light tints | Success, warning and error use the light tinted backgrounds, not dark ones | Kept as in the reference | Matches |
| Position and width | Not in the reference (drawn at a 343 mobile width) | Proposed: bottom-centre of the content panel, `Space-3XL` from the bottom. Width hugs the content. `Size-320` is too narrow for a message plus two buttons on one line, so the maximum width is a new token `Size-560` | Approved (OD-91, OD-104) |
| Auto-dismiss duration | Not in the reference | `--nl-duration-snackbar`, 6000ms (§5) | Approved (OD-92, OD-105) |
| Keyboard access to the action | Not in the reference | F6 moves focus into the snackbar while one shows | Approved (OD-110) |
| Error icon | The warning triangle | `error`, as `NlBanner` | Approved (OD-111) |
| How pages show it | Not in the reference | `NlSnackbarProvider` (region and live regions) and `useNlSnackbar()` (`show`, `hide`) | Approved (OD-166) |

#### Spec → code

| Spec option | Code |
|---|---|
| Look | `NlSnackbar`: `tone`, `children`, `layout`, `showIcon`, `action`, `showClose`, `onClose`; `data-tone`, `data-layout` |
| Single line | `Size-48` tall, `w-fit` up to `Size-560`, `Radius-M`, gap `Space-M`; `Space-XL` start; end `Space-XS` with buttons, `Space-XL` without; message one line with an ellipsis |
| Stacked | Column, gap `Space-M`; top row `Space-XL` top and sides, icon on the message's first line; button row at the end, `Space-XS` end and bottom; message wraps |
| Buttons | Action `NlButton` tertiary small; close tertiary medium icon-only `close` "Dismiss"; content tone `inverse` (neutral) or `primary` |
| Host | `NlSnackbarProvider` renders the page then a fixed region at the bottom centre (`Space-3XL` up, `--nl-z-snackbar`), with a `role="status"` and a `role="alert"` region present from load. `placement="top-end"` (OD-245): `Space-3XL` from the top and end, the snackbar comes down from `Space-M` above; `data-placement` on the region |
| Show | `useNlSnackbar().show({ message, tone, layout, showIcon, action, showClose, onClose })`; `hide()` |
| Timing | Without an action: `--nl-duration-snackbar`, read in the browser; restarts after hover or focus leaves. With an action: stays; the action runs then closes it |
| Motion | Fade and slide up `Space-M`, `--nl-duration-base`, standard ease; reduced motion: no slide (durations are zero) |
| Keyboard | Never takes focus; F6 focuses its first button |

#### API

```tsx
import { NlSnackbarProvider, useNlSnackbar } from '@northline/ui';

<NlSnackbarProvider>{page}</NlSnackbarProvider>

const { show } = useNlSnackbar();
show({ message: 'Reward deleted', action: { label: 'Undo', onClick: restore } });
```

`'use client'` (state, effects, context).

#### Tokens used

`Size-48`, `Size-560` (new), `Radius-M`, `Space-M`, `Space-XL`, `Space-XS`, `Space-3XL`; `bg-direct`, `bg-success_secondary`, `bg-warning_secondary`, `bg-error_secondary`; `fg-inverse`, `fg-success`, `fg-warning`, `fg-error`; `text-inverse`, `text-primary`; Body M; `--nl-z-snackbar`, `--nl-duration-base`, `--nl-duration-snackbar` (new), `--nl-ease-standard`; `NlButton`'s own.

#### Build decisions

| Decision | Detail |
|---|---|
| Two live regions | Switching one region's role isn't announced reliably, so status and alert are separate and both exist from load |
| Replacing | A new snackbar replaces the old at once (its `onClose` runs); the leaving one isn't animated out |
| Region placement | Fixed to the window by default; `className` on the provider places it (for example in the content panel) |
| Reading time token | `--nl-duration-snackbar` lives in `styles.css` with the other durations, but isn't zeroed under reduced motion |


---

### NlButtonDock

**Level** Molecule (contains `NlButton`, L1) · **Base** none · **Depends on** `NlButton`, `NlTextBlock` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none.

The row of actions at the bottom of a form, dialog or side sheet: an optional note above, a tertiary button at the start, and secondary and primary buttons at the end.

#### Anatomy

```
NlButtonDock (vertical)
├── accessory slot (optional; default NlTextBlock description)
└── button row (horizontal, space between)
    ├── tertiary NlButton (optional, start)
    └── end group: secondary NlButton (optional) + primary NlButton (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Sticky | off, on | `sticky?: boolean` (look only; the container pins it) |
| Primary | optional | `primary?: NlButtonProps` |
| Secondary | optional | `secondary?: NlButtonProps`, `tone?: 'normal' \| 'destructive'` (OD-244) |
| Tertiary | optional | `tertiary?: NlButtonProps`, `tone?: 'normal' \| 'destructive'` (OD-244) |
| Accessory | optional | `accessory?: ReactNode` |

#### Sizes and layout

- Padding: `Space-XL` top, `Space-3XL` sides, `Space-6XL` bottom. Gap accessory → buttons `Space-3XL`.
- Button row: horizontal, tertiary at the start, the end group at the end. Gap between buttons `Space-XL`.
- All buttons `size="small"`, each as wide as its label.
- Width fills its container.

#### Colours

| Part | Token |
|---|---|
| Background | `bg-primary` |
| Accessory text | `text-secondary` (`NlTextBlock` description) |
| Sticky shadow | `--nl-shadow-sticky` |

#### States

Sticky or not. The buttons have their own states.

#### Behaviour and accessibility

- DOM order matches visual order: tertiary, secondary, primary. Tab follows it.
- When sticky, the scrolling content above has bottom padding so nothing is hidden behind the dock.
- Primary is the form's submit button when used in a form (`type="submit"`).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Accessory text type | A text block set to a heading type with only the description shown (`Body M`) | `NlTextBlock` description at `headline-large`/`headline-small` gives `Body M`; any type with `Body M` works | Matches |
| Sticky shadow | A "sticky" shadow style | `--nl-shadow-sticky` | Matches |
| Bottom padding | `Space-6XL` (40) | Same | Matches |
| Button sizes | Small, sized to their labels | Same | Matches |
| Destructive primary | Not in the reference | Left out (normal tone only) | Approved (OD-169) |
| Narrow containers | Not described | The end group wraps and stays at the end, `Space-XL` gaps | Approved (OD-170) |
| Nothing to show | Not described | No accessory and no buttons renders nothing | Approved (OD-171) |

#### Spec → code

| Spec option | Code |
|---|---|
| Buttons | `primary?`, `secondary?`, `tertiary?`: `NlButton` props without `variant`, `size`, `tone`, `contentTone` (`NlButtonDockButtonProps`); the dock sets the variant and `size="small"`. Secondary and tertiary also take `tone: 'destructive'` (`NlButtonDockToneButtonProps`, OD-244), for example Suspend in a details side sheet; the primary stays normal (OD-169) |
| Accessory | `accessory?`: a string → `NlTextBlock type="headline-small"` description (Body M, `text-secondary`); any other node as is |
| Sticky | `sticky?` → `shadow-sticky` (else `shadow-none`), `data-sticky` |
| Layout | Column, gap `Space-3XL`; button row `justify-between`, wraps, gap `Space-XL`; end group `ms-auto`, wraps, `justify-end` |

#### API

```tsx
import { NlButtonDock } from '@northline/ui';

<NlButtonDock
  accessory="Changes apply to every member in Tier 2."
  tertiary={{ children: 'Reset', onClick: reset }}
  secondary={{ children: 'Cancel', onClick: close }}
  primary={{ children: 'Save', type: 'submit' }}
/>
```

Presentational, no `'use client'`.

#### Tokens used

`Space-XL`, `Space-3XL`, `Space-6XL`; `bg-primary`; `--nl-shadow-sticky`; `NlButton` and `NlTextBlock`'s own.


---

### NlEmptyState

**Level** Molecule (contains `NlIconContainer`, `NlButton`, L1) · **Base** none · **Depends on** `NlIconContainer`, `NlTextBlock`, `NlButton` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-112 and OD-172 to OD-174 decided.

What a list, table or page shows when there is nothing in it yet, with an optional action ("Add reward").

#### Anatomy

```
NlEmptyState (vertical, centred)
├── top group (vertical, centred)
│   ├── icon slot (default NlIconContainer)
│   └── NlTextBlock (heading + description, centred)
└── action (optional NlButton, or a group of buttons)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | small, medium | `size`, default `medium`, also `data-size` |
| Icon | registry name, or a custom slot | `icon?: NlIconName` or `iconSlot?: ReactNode` |
| Heading | text | `heading` |
| Description | text | `description?` |
| Action | optional | `action?: ReactNode` (usually one `NlButton variant="primary" size="small"`) |
| Heading level | h2 (default) to h6, p, span | `headingAs` (OD-172) |
| Announced | off (default) or on | `live?: boolean` → `role="status"` (OD-174) |

#### Sizes and layout

| Size | Icon | Text type |
|---|---|---|
| small | `NlIconContainer size={48}` | `NlTextBlock type="headline-small" align="center"` |
| medium | `NlIconContainer size={64}` | `NlTextBlock type="headline-medium" align="center"` |

- Vertical, items centred, gap `Space-3XL` between the top group and the action.
- Top group: gap `Space-XL` between icon and text.
- Width fills its container; text centred.

#### Colours

| Part | Token |
|---|---|
| Icon container | `tone="primary"` (`bg-icons`, `fg-primary`) |
| Heading / description | `text-primary` / `text-secondary` (from `NlTextBlock`) |

#### States

None of its own.

#### Behaviour and accessibility

- The heading uses `headingAs` matching the page outline (usually `h2` or `h3`).
- The icon is decorative.
- When an empty state replaces content after a filter or search, the result region announces it ("No results").

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Show button group | A boolean | `action` slot (absent = no button) | Matches |
| Icon slot | A slot holding a 48 or 64 icon container | `icon` (container built in) or `iconSlot` for anything else | Approved (OD-112) |
| Default heading level | Not described | `h2` (OD-172) | Approved |
| No icon | Not described | Neither `icon` nor `iconSlot`: no icon (OD-173) | Approved |
| "No results" announcement | The result region announces it | Opt-in `live` (`role="status"`), as `NlBanner` (OD-174) | Approved |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size`, `data-size`: small → `NlIconContainer size={48}`, `NlTextBlock type="headline-small"`; medium → 64, `headline-medium` |
| Icon | `icon` → `NlIconContainer tone="primary"` (decorative); `iconSlot` wins over it |
| Text | `NlTextBlock align="center"`, `heading`, `headingAs` (default `h2`), `description` |
| Action | `action` slot, centred |
| Layout | Column, items centred, text centred, gap `Space-3XL`; top group gap `Space-XL` |

#### API

```tsx
import { NlEmptyState } from '@northline/ui';

<NlEmptyState icon="add" heading="No rewards yet" description="Rewards you add show here."
  action={<NlButton variant="primary" size="small">Add reward</NlButton>} />
```

Presentational, no `'use client'`.

#### Tokens used

`Space-3XL`, `Space-XL`; `NlIconContainer` (48, 64, `bg-icons`, `fg-primary`), `NlTextBlock` (Headline Small-H6, Headline Medium-H5, `text-primary`, `text-secondary`).

| Gaps and sizes | `Space-3XL`, `Space-XL`, 48 / 64 | Same | Matches |

---

### NlStatCard

**Level** Molecule (contains `NlLabel`, L1) · **Base** none · **Depends on** `NlLabel` (see "Mapping notes") · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-50, OD-113, OD-175 and OD-176 decided.

A summary number with its label, for dashboards and report headers ("Total points: 806,400").

#### Anatomy

```
NlStatCard (rounded tinted card)
├── NlLabel (what the number is)
└── value (the number)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Label | text | `label` |
| Value | a formatted string | `value: string` (the page formats it, so output matches on server and client) |
| Element | for grouping | `as`, default `div` |
| In a list | off (default) or on | `inList?: boolean`: label `<dt>`, value `<dd>`, inside the page's `<dl>` (OD-175) |

#### Sizes and layout

- Padding `Space-2XL` all round, `Radius-S` (D19). Vertical, gap `Space-none` between label and value. Content centred vertically.
- Label: `NlLabel size="medium"`.
- Value: text style `Data M` (tabular figures, §3.4). See "Mapping notes".
- Width fills its grid column. Cards in a row sit `Space-4XL` apart (set by the page).

#### Colours

| Part | Token |
|---|---|
| Card | `bg-active` |
| Label | `text-secondary` (see "Mapping notes") |
| Value | `text-primary` |

#### States

None. Not interactive.

#### Behaviour and accessibility

- The label and value are read together ("Total points, 806,400"). Use a description list (`<dl>`) when several cards form a group.
- No live announcement when values change; dashboards that refresh announce through their own region.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Value text style | `Headline Large-H4` (24) inside a text block | `Data M` (24, tabular figures), the style §3.4 made for stat cards. The card renders the value itself, so it no longer depends on `NlTextBlock` | Approved (OD-113) |
| Label colour | `NlLabel` recoloured to `text-secondary` (the reference's own note: the default label is too light on `bg-active` in Dark) | `NlLabel tone="secondary"` (OD-50) | Approved |
| Long values | Not described | Wrap, never cut off (OD-176) | Approved |
| Description list | "Use a `<dl>`" | Opt-in `inList`; the page provides the `<dl>` (OD-175) | Approved |
| Card gap and width | From the reference's description | Set by the page | Matches |
| Card colour, padding, radius | As in the table | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Label | `label` → `NlLabel size="medium" tone="secondary"`, in a `<div>` (or `<dt>` with `inList`) |
| Value | `value` → `<p>` (or `<dd>`), Data M with tabular figures, `text-primary`, wraps |
| Card | `as` (default `div`); `bg-active`, `Radius-S` (D19), padding `Space-2XL`, column, gap `Space-none`, centred vertically, full width |

#### API

```tsx
import { NlStatCard } from '@northline/ui';

<dl className="grid">
  <NlStatCard inList label="Total points" value={formattedPoints} />
</dl>
```

Presentational, no `'use client'`.

#### Tokens used

`bg-active`, `Radius-S` (D19), `Space-2XL`, `Space-none`; Data M, `text-primary`; `NlLabel`'s own (Label M, `text-secondary`).

---


### NlFileUpload

**Level** Molecule (contains `NlIconContainer`, `NlButton`, L1) · **Base** none · **Depends on** `NlIconContainer`, `NlTextBlock`, `NlButton`, `NlProgressBar` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-114, OD-122 to OD-124, OD-177 and OD-178 decided.

A drop zone for one file, which also shows the upload's progress, success or error.

#### Anatomy

```
NlFileUpload (dashed card)
├── NlIconContainer
├── NlTextBlock (file name or prompt + details)
├── NlProgressBar (uploading only)
└── NlButton (choose, cancel, delete or retry)
```

Large: everything stacked and centred. Small: icon, text and button in a row, with the progress bar below while uploading.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size`, default `large`, also `data-size` |
| State | enabled (empty), uploading, complete, error | `state`, also `data-state` |
| Progress | 0 to 100 | `progress?: number` (uploading) |
| Accept | file types | `accept?: string` |
| Max size | for the hint text | `maxSizeLabel?: string` |
| Text | prompt, file name, error | `title`, `description` |
| Events | choose, cancel, delete, retry, reject | `onFileSelect(file)`, `onCancel()`, `onDelete()`, `onRetry()`, `onFileReject?(file)` (OD-178) |
| Disabled | on or off | `disabled?` |

#### Sizes and layout

- Card: padding `Space-XL`, `Radius-L`, 1px **dashed** inside border (§4.2), gap `Space-XL`.
- Large: vertical, centred. Icon `NlIconContainer size={48}`. Text `NlTextBlock type="headline-small" align="center"`. Progress bar fills the width.
- Small: horizontal, items centred. Icon `NlIconContainer size={40}`, text `align="start"` filling the space, button at the end. While uploading, the progress bar sits below the row.
- Button: `NlButton variant="tertiary" size="xsmall" icon="leading"`.

#### Colours by state

| State | Border | Icon container | Button |
|---|---|---|---|
| enabled | `border-default` | `tone="info"`, `cloud_upload` | normal tone: "Choose file" |
| uploading | `border-active` | `tone="info"`, `cloud_upload` | normal tone: "Cancel" |
| complete | `border-strong` | `tone="success"`, `check` | `tone="destructive"`: "Delete" (`delete`) |
| error | `border-error` | `tone="error"`, `error` | normal tone: "Try again" |

Card background `bg-primary`. Title `text-primary`, description `text-secondary`.

#### States

Enabled, uploading, complete, error. Drag-over and disabled: see "Mapping notes".

#### Behaviour and accessibility

- A native `<input type="file">`, visually hidden, triggered by the button and by clicking the card. The card is also a drop target.
- The input has a label ("Upload a file") and `aria-describedby` pointing at the hint (types, size).
- Uploading: the progress bar has a name ("Uploading reward-image.png"). Completion and errors are announced through a polite live region in the component.
- After delete or cancel, focus returns to the choose button.
- One file at a time.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Dashed border | 1px dashed with raw 4/4 dashes | Tailwind's `border-dashed` with the 1px width (§4.2). The browser draws the dash length, so it won't be exactly 4/4 | Approved (OD-114) |
| Delete button | Tertiary with the label and icon in error colour | `NlButton tone="destructive" variant="tertiary"` (approved destructive tertiary) | Matches |
| Drag-over look | Code only, not drawn | Border `border-active`, card `bg-active` | Approved (OD-122) |
| Disabled | Code only, not drawn | Border `border-disabled`, icon `tone="disabled"`, button and input disabled, no drop | Approved (OD-123) |
| Icons | Upload, check, delete, warning from the reference's icon set | Material Symbols `cloud_upload`, `check`, `delete`, `error` (`cloud_upload` added to the registry) | Approved (OD-124) |
| Button labels | Reference copy | Generic labels as above | Matches |
| Button icons | Not named except delete | Choose `cloud_upload`, Cancel `close`, Try again `refresh` (`refresh` added to the registry) | Approved (OD-177) |
| Dropped file of the wrong type | Not described | Ignored; `onFileReject(file)` (the picker already filters by `accept`) | Approved (OD-178) |

#### Spec → code

| Spec option | Code |
|---|---|
| Size | `size`, `data-size`: large column centred, 48 icon, text centred; small row (40 icon, text `flex-1` start, button) with the progress bar below |
| State | `state` from the page, `data-state`; border, icon and button per the table; `disabled` and drag-over override the border |
| Input | Hidden native `<input type="file">` (`sr-only`, `tabIndex` -1), `aria-label` "Upload a file", `aria-describedby` the hint; opened by Choose file or a click on the empty card |
| Hint | `description` and `maxSizeLabel` joined with " · " under the title; Choose file is described by it |
| Drop | `dragover` → drag-over look; drop checks `accept` → `onFileSelect` or `onFileReject` |
| Progress | `NlProgressBar` named `progressLabel` (default "Uploading {title}") |
| Announcements | A polite `role="status"` region: "{title} uploaded" on complete, the title on error |
| Focus | After Cancel or Delete, focus returns to Choose file when the page sets `enabled` |

#### API

```tsx
import { NlFileUpload } from '@northline/ui';

<NlFileUpload state={state} progress={progress} accept="image/png,image/jpeg" maxSizeLabel="Up to 5 MB"
  title={title} description={details} onFileSelect={upload} onFileReject={showTypeError}
  onCancel={cancel} onDelete={remove} onRetry={reset} />
```

`'use client'` (state, refs, events).

#### Tokens used

`bg-primary`, `bg-active`; `border-default`, `border-active`, `border-strong`, `border-error`, `border-disabled`; `Radius-L`, `Space-XL`; `--nl-duration-fast`; `NlIconContainer`, `NlTextBlock`, `NlButton`, `NlProgressBar`'s own.

#### Build decisions

| Decision | Detail |
|---|---|
| The page uploads | The component reports the file and shows the state it's given; it never sends anything |
| Size limit | Checked by the page (only `accept` is checked on drop) |
| Disabled contrast | Known issue K3; disabled samples are marked |


---

### NlDialog

**Level** Molecule (all parts are atoms) · **Base** none · **Depends on** `NlTextBlock`, `NlButton`, `NlOverlay` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-16, OD-41, OD-115, OD-121, OD-125 and OD-179 to OD-181 decided.

A modal window for a short task or a confirmation ("Delete this reward?").

#### Anatomy

```
NlOverlay
└── NlDialog (rounded panel, centred)
    ├── header: NlTextBlock title + close NlButton
    ├── body slot (default NlTextBlock description)
    └── footer: optional start NlButton · end group (secondary + primary NlButton)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Open | closed, open | `open`, `onOpenChange` |
| Title | text | `title` |
| Body | slot | `children` |
| Close button | on (default) or off | `hideClose?` |
| Buttons | optional | `primaryAction?`, `secondaryAction?`, `startAction?` (each `NlButtonProps`) |
| Destructive | confirmation of a destructive action | Pass `tone="destructive"` on the primary action |
| Width | small (default), large | `size?`: `Size-560` or `Size-720` (OD-115, OD-121) |
| Overlay closes it | on (default) or off | `dismissible?` |

#### Sizes and layout

- Panel: `Radius-L`, `bg-primary`. Padding `Space-XL` top, `Space-3XL` sides.
- Header: horizontal, gap `Space-3XL`; title `NlTextBlock type="headline-large"` filling the space; close button `NlButton variant="tertiary" size="medium" icon="only-icon" contentTone="secondary"` (`close`).
- Header → body gap `Space-XL`. Body → footer gap `Space-3XL`.
- Body: `NlTextBlock` description in `Body L` (see `NlCheckbox` and OD-41 for the type that gives `Body L`), or any content.
- Footer: padding `Space-3XL` sides and bottom. Horizontal: start action, then the end group (gap `Space-L`). Buttons `size="medium"`.
- Centred in the viewport, layer `--nl-z-modal` (§4.3), above `NlOverlay`.

#### Colours

| Part | Token |
|---|---|
| Panel | `bg-primary` |
| Title / body | `text-primary` / `text-secondary` |

#### States

Closed, open. The buttons have their own states.

#### Behaviour and accessibility

- `role="dialog"` with `aria-modal="true"`, labelled by the title (`aria-labelledby`) and described by the body text (`aria-describedby`).
- On open, focus goes to the first focusable element in the body, or to the primary action for confirmations (to the secondary/cancel action when the primary is destructive). Focus is trapped inside. On close, focus returns to the element that opened it.
- Escape and the close button close it. A click on the overlay closes it unless the dialog is a required confirmation (`dismissible={false}`).
- The page behind is inert and doesn't scroll.
- Opens with a fade and slight scale, `--nl-duration-slow` (§5: dialogs); reduced motion: fade only.
- For a destructive confirmation, use `role="alertdialog"`.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Width | Raw 696 | Two widths: small `Size-560` (existing), large `Size-720` (new, §3.5) | Approved (OD-115, OD-121) |
| Footer | A row of medium buttons, not the button dock | A plain row of `NlButton`s in the dialog, not `NlButtonDock` (which has small buttons and different padding) | Matches |
| Shadow | None in the reference | None (the overlay separates it) | Matches |
| Start action | A hidden "leading button" option | `startAction` | Matches |
| Heading level | Not in the reference | Title as `h2` (`headingAs`) | Approved (OD-179) |
| Open motion | Not in the reference | Fade and scale from 95%, `--nl-duration-slow`; reduced motion: no scale | Approved (OD-125) |
| Alert dialog | "Use `role=\"alertdialog\"`" | Set automatically when the primary is destructive | Approved (OD-180) |
| Long content | Not described | Panel stays `Space-3XL` from the window edges; the body scrolls (and takes focus when it does) | Approved (OD-181) |

#### Spec → code

| Spec option | Code |
|---|---|
| Modal | Native `<dialog>` with `showModal()`: focus kept inside, page inert, Escape (`cancel` → `onOpenChange(false)`), focus back to the opener. The dialog locks page scroll |
| Overlay | `NlOverlay` inside the dialog, behind the centred panel; a click on it (or around the panel) closes it when `dismissible` |
| Panel | `Radius-L`, `bg-primary`, `max-w-560` / `max-w-720`, column no taller than the frame, `--nl-z-modal` above the overlay |
| Header | `NlTextBlock type="headline-large"` title (`headingAs`, default `h2`) + ghost close button (`NlButton` tertiary medium icon-only `close`, `contentTone="secondary"`, "Close"), pulled up `Space-L` and out `Space-2XL` so the icon sits 16 from the top and 16 from the side, and the 48 hit area stays |
| Body | String → `NlTextBlock type="body"` (Body L, `text-secondary`) and `aria-describedby`; other content as is |
| Footer | `startAction` (tertiary) · end group `secondaryAction` (secondary) + `primaryAction` (primary, `tone` normal or destructive), all medium, gap `Space-L`, padding `Space-3XL` |
| First focus | First focusable in the body; else the primary (the secondary when the primary is destructive); else the close button |
| Motion | Panel `starting:` 95% and transparent → 100%; closing back to 95% before `close()` after `--nl-duration-slow`; overlay fades |

#### API

```tsx
import { NlDialog } from '@northline/ui';

<NlDialog open={open} onOpenChange={setOpen} title="Delete Reward X?"
  primaryAction={{ children: 'Delete', tone: 'destructive', onClick: remove }}
  secondaryAction={{ children: 'Cancel', onClick: () => setOpen(false) }}>
  Members who saved it lose it. This can't be undone.
</NlDialog>
```

`'use client'` (state, refs, effects).

#### Tokens used

`Size-560`, `Size-720` (new); `Radius-L`; `Space-XL`, `Space-3XL`, `Space-L`; `bg-primary`; `--nl-z-modal`, `--nl-duration-slow`, `--nl-ease-standard`; `NlOverlay`, `NlTextBlock`, `NlButton`'s own.

#### Build decisions

| Decision | Detail |
|---|---|
| Native dialog | The browser's modal handling instead of a hand-made focus trap; it renders in the top layer, so `--nl-z-modal` only orders the panel above the overlay inside it |
| Scale value | `scale-95` is Tailwind's built-in 95% (no token covers it; approved, OD-125) |
| Escape | Always closes, also when not `dismissible` (as the spec says) |
| Close button alignment | Designer's choice, 20 Nov 2026: the icon sits 16 from the top and 16 from the side, not inset by the button's own space (`-mt-l -me-2xl`) |
| No `max-*-none` | In this theme `none` is the `Space-none` token (0), so `max-h-none` collapses the dialog; it uses `max-*-full` |

Checked open in Chrome: every story in all three brands and both themes with axe (no violations); small 560 and large 720 wide; long content 752 tall, `Space-3XL` (24) from the window edges; first focus as above; Escape closes and returns focus to the opener.


---

### NlPagination

**Level** Molecule (contains `NlButton`, L1) · **Base** none · **Depends on** `NlPaginationItem`, `NlButton` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-126 to OD-128, OD-182 and OD-183 decided.

Page numbers with previous and next buttons, used in the table footer.

#### Anatomy

```
NlPagination (nav, horizontal)
├── previous NlButton (icon only)
├── pages: NlPaginationItem × n (with "…" gaps)
└── next NlButton (icon only)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Page | current page (1-based) | `page`, `onPageChange(page)` |
| Page count | number | `pageCount` |
| Visible pages | how many numbers before "…" is used | `siblingCount?`, default 1 (see "Mapping notes") |
| Accessible name | text | `aria-label`, default "Pagination" |

The reference's three variants (limited, more than limit, only one) are results of `pageCount`, not props.

#### Sizes and layout

- Horizontal, gap `Space-M`, items centred.
- Previous and next: `NlButton variant="secondary" size="xsmall" icon="only-icon"` (`Size-32` square), icons `chevron_left` and `chevron_right`.
- Pages: `NlPaginationItem`, gap `Space-M`.
- Ellipsis rule: always show the first and last page, the current page and `siblingCount` pages either side; replace any other run with one "…" item. A run of one page shows that page instead, and every page shows when there are no more than `siblingCount × 2 + 5` (OD-182).

#### Colours

From the parts. Previous is disabled on page 1, next on the last page (`NlButton` disabled look).

#### States

From the parts.

#### Behaviour and accessibility

- A `<nav aria-label="Pagination">` containing a list.
- Previous and next are named "Previous page" and "Next page". Disabled at the ends (native `disabled`, not focusable).
- The current page has `aria-current="page"`. Changing page moves focus to the new current page button, or keeps it on previous/next if that was used.
- With one page, previous and next are both disabled and one page item shows.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Disabled previous at page 1 | Drawn as an enabled button with a grey icon | The real disabled state | Approved (OD-126) |
| Number of visible pages | Four numbers, or three with "…" | `siblingCount` 1 (first, last, current ±1) | Approved (OD-127) |
| Previous and next style | Secondary xsmall icon-only | Same | Matches |
| Chevron icons | From the reference's icon set | Material Symbols `chevron_left`, `chevron_right` | Approved (OD-128) |
| Gaps that save nothing | Not described | No "…" for a single page, and none when every page fits in the gapped layout's slots | Approved (OD-182) |
| Out-of-range page | Not described | Clamped to 1…`pageCount` for display | Approved (OD-183) |

#### Spec → code

| Spec option | Code |
|---|---|
| Page | `page` (1-based, clamped), `onPageChange(page)`; controlled |
| Page count | `pageCount` (at least 1) |
| Visible pages | `siblingCount` (default 1) → `paginationEntries()` (`pages.ts`) |
| Structure | `<nav aria-label>` (default "Pagination") → `<ul>`: previous, `NlPaginationItem` pages and `kind="ellipsis"` gaps (their `<li>` hidden), next |
| Previous, next | `NlButton variant="secondary" size="xsmall" icon="only-icon"`, `chevron_left` / `chevron_right`, "Previous page" / "Next page", native `disabled` at the ends |
| Focus | Picking a page focuses the new current page; previous or next keep focus unless that end is now disabled, then the current page |
| Layout | Row, gap `Space-M`, items centred |

#### API

```tsx
import { NlPagination } from '@northline/ui';

<NlPagination page={page} pageCount={pageCount} onPageChange={setPage} />
```

`'use client'` (refs, effects).

#### Tokens used

`Space-M`; `NlButton` and `NlPaginationItem`'s own.


---

### NlTableHeaderCell

**Level** Molecule (contains `NlCheckboxControl`, `NlLabel`, L1) · **Base** none · **Depends on** `NlCheckboxControl`, `NlLabel`, `NlIcon` · **Public** (used by `NlTable`; exported for custom tables)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-116, OD-129, OD-184 and OD-185 decided.

A column header: the column name, with optional sort and filter controls, or a "select all" checkbox.

#### Anatomy

```
NlTableHeaderCell (th, horizontal)
├── NlCheckboxControl (optional; select all)
├── title button (or plain title)
│   ├── NlLabel (column name)
│   └── sort NlIcon (optional)
└── filter button with NlIcon (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Background | white, grey | `appearance: 'plain' \| 'grey'`, default `plain` |
| Sort | none, unsorted, ascending, descending | `sort?: 'none' \| 'ascending' \| 'descending'`, `sortable?`, `onSortChange` |
| Filter | none, default, open, applied | `filter?: 'available' \| 'open' \| 'applied'`, `onFilterClick` |
| Narrow | off, on | `narrow?: boolean` (checkbox and row-action columns) |
| Select all | optional | `selectAll?: { checked, indeterminate, onChange }` |
| Title | text | `children` |
| Show title | on (default) or off | `hideTitle?` (visually hidden, still the column's name) |

#### Sizes and layout

- Height `Size-40`. Padding `Space-3XL` inline (narrow: `Space-XL`), `Space-none` block. Gap `Space-L`. Items centred.
- Title: `NlLabel size="medium"`. Sort icon 20, `Space-XS` after the title; title and sort icon are one button.
- Filter icon 24 (`keyboard_arrow_down`, `keyboard_arrow_up` when open), its own button.

#### Colours

| Part | State | Token |
|---|---|---|
| Cell | plain / grey | none / `bg-tertiary` |
| Title | – | `text-tertiary` (`NlLabel`) |
| Sort icon | unsorted (`unfold_more`) | `fg-secondary` |
| Sort icon | ascending (`arrow_upward`), descending (`arrow_downward`) | `fg-action` |
| Filter icon | available | `fg-secondary` |
| Filter icon | open, applied | `fg-action` |
| Sort and filter icons | hover / pressed | `fg-hovered` / `fg-pressed` |
| Buttons | focus | standard ring from CLAUDE.md |

#### States

Sort none, unsorted, ascending, descending; filter available, open, applied; icon hover, pressed and focus. The cell itself has no hover.

#### Behaviour and accessibility

- A `<th scope="col">` with `aria-sort` (`ascending`, `descending`, or `none` when sortable).
- The sort button's name is the column name; clicking cycles none → ascending → descending → none. The table announces the new order politely ("Sorted by points, ascending"); the cell doesn't (OD-184).
- The filter button's name is "Filter {column}" ("Filter {column}, applied" when a filter is applied, OD-185), with `aria-haspopup="dialog"` and `aria-expanded`. It opens `NlTableColumnFilter` (an `NlMenu kind="filter"`).
- Select all: the checkbox is named "Select all rows" and shows indeterminate when some rows are selected.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Sort and filter buttons | Bare icons (and title) that act as buttons, no button chrome | Native buttons styled as plain text and icon, inside the cell. They aren't `NlButton` because they have no button look. Treated as part of the cell, not a separate button (D12 is about button components) | Approved (OD-116) |
| Hover and pressed on icons | Code only, per the reference's description | `fg-hovered` / `fg-pressed` | Matches |
| Background names | White and grey | `plain` and `grey` | Matches |
| Icons | From the reference's icon set | Material Symbols `unfold_more`, `arrow_upward`, `arrow_downward`, `keyboard_arrow_down`, `keyboard_arrow_up` | Approved (OD-129) |
| Sort announcement | "Announced politely" | Left to `NlTable` | Approved (OD-184) |
| Applied filter | Colour only | Also in the filter button's name (WCAG 1.4.1) | Approved (OD-185) |

#### Spec → code

| Spec option | Code |
|---|---|
| Cell | `<th scope="col">`, `aria-sort` when `sortable`; `Size-40` high, `Space-3XL` inline (`narrow`: `Space-XL`), `Space-none` block; `appearance` `plain` (no fill) or `grey` (`bg-tertiary`) |
| Title | `children: string` → `NlLabel size="medium"` (`text-tertiary`); `hideTitle` wraps it in `sr-only`; always on one line (`whitespace-nowrap` on the cell's row, OD-240), so a narrow table scrolls sideways instead of wrapping titles |
| Sort | `sortable`, `sort`, `onSortChange(next)`; native button (title + 20 icon, gap `Space-XS`, at least `Size-24` high), `unfold_more` `fg-secondary` / `arrow_upward`, `arrow_downward` `fg-action`; icon hover `fg-hovered`, pressed `fg-pressed` through the named group `sort` |
| Filter | `filter`, `onFilterClick`, `filterRef` (anchor for the column filter); native 24 button, `keyboard_arrow_down` / `_up` when open; `fg-secondary` or `fg-action`, hover and pressed as sort |
| Select all | `selectAll: { checked, indeterminate, onChange }` → `NlCheckboxControl` "Select all rows" |
| Focus | Standard ring on each button, `Radius-XS` |

#### API

```tsx
import { NlTableHeaderCell } from '@northline/ui';

<NlTableHeaderCell sortable sort={order} onSortChange={setOrder} filter="available" onFilterClick={open} filterRef={anchor}>
  Points
</NlTableHeaderCell>
```

`'use client'` (handlers).

#### Tokens used

`Size-40`, `Size-24`, `Space-3XL`, `Space-XL`, `Space-L`, `Space-XS`, `Space-none`, `Radius-XS`; `bg-tertiary`; `fg-secondary`, `fg-action`, `fg-hovered`, `fg-pressed`; `NlLabel`, `NlIcon`, `NlCheckboxControl`'s own.

#### Build decisions

| Decision | Detail |
|---|---|
| Sort button height | At least `Size-24` so the pointer target meets WCAG 2.5.8 (the Label M line alone is 21) |
| Focus ring radius | `Radius-XS`, as `NlCheckboxControl` |
| Grey header contrast | Title on `bg-tertiary` in Dark is 4.46:1: known issue K8 (accepted); grey samples are marked |

#### Sticky end (added 21 Nov 2026, with `NlTable` #77, OD-223)

`stickyEnd?: boolean`: `sticky`, end edge, `--nl-z-sticky`, `--nl-shadow-sticky-end`, fill from the appearance. `NlTable` sets it on the empty row-actions header so it stays with its column when the table scrolls sideways.

---

### NlTableCell

**Level** Molecule (contains `NlCheckboxControl`, `NlBadge`, `NlButton`, L1) · **Base** none · **Depends on** `NlCheckboxControl`, `NlBadge`, `NlButton` · **Public** (used by `NlTable`; exported for custom tables)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-117 and OD-186 to OD-188 decided.

One body cell: text, a badge, a link, a row-actions button, or a checkbox.

#### Anatomy

```
NlTableCell (td, horizontal)
├── leading slot (optional; NlCheckboxControl for row selection)
└── content (text, NlBadge, link NlButton, or row-actions NlButton)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | default (text), badge, link, row actions, checkbox | `type`, default `default`, also `data-type` |
| Narrow | off, on | `narrow?: boolean` |
| Content | text, or a typed prop per type (OD-188) | `children` (text); `badge`, `link`, `actions`, `checkbox` |
| Row header | off, on | `rowHeader?` (`<th scope="row">`) |
| Sticky at the end | off, on | `stickyEnd?` (OD-187) |
| Leading checkbox | optional | `select?: { checked, onChange, label }` |
| Row actions | for `type="row-actions"` | `onActionsClick`, `actionsExpanded` |

#### Sizes and layout

- Height `Size-40`. Padding `Space-3XL` inline (narrow: `Space-XL`), `Space-none` block. Gap `Space-M`. Items centred.
- Default: text `Body M`, single line, truncated with an ellipsis (full text in a tooltip).
- Badge: `NlBadge size="small"`.
- Link: `NlButton variant="link" size="xsmall"` with no inline padding (see "Mapping notes").
- Row actions: `NlButton variant="tertiary" size="xsmall" icon="only-icon" contentTone="secondary"` (`more_vert`, `Size-32`), in a narrow column `Size-64` wide.
- Checkbox: only an `NlCheckboxControl` (a per-row value, for example a permission).

#### Colours

| Part | Token |
|---|---|
| Text | `text-secondary` |
| Cell background | none (the row sets hover and selected colours) |

#### States

From the parts. Row hover and selected belong to the row (`NlTable`).

#### Behaviour and accessibility

- A `<td>`. The first meaningful cell in a row can be a row header (`<th scope="row">`) so screen readers name the row.
- Row-select checkbox: named "Select {row name}". Value checkbox: named "{row}, {column}".
- Row actions: named "Actions for {row name}", `aria-haspopup="menu"`, `aria-expanded`. Its column stays fixed when the table scrolls sideways (shadow `--nl-shadow-sticky-end`, layer `--nl-z-sticky`).
- Truncated text keeps its full text available (tooltip or `title`).

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Link padding | A tertiary xsmall button with its side padding set to 0, so the text lines up with the header | `NlButton variant="link"` with no inline padding. Uses `flush` (added to the link variant for `NlBanner`) | Approved (OD-117) |
| Dedicated row-actions button | A dedicated "row actions" button (enabled, hovered, pressed, open) | `NlButton` icon-only (D12), open = pressed look (OD-57) | Matches D12 |
| Row-actions column width | 64 (32 + 16 either side) | `Size-64` | Matches |
| Sticky row-actions column | Code only; the shadow isn't drawn | `--nl-shadow-sticky-end`, `--nl-z-sticky` | Matches §4.1, §4.3 |
| Checkbox type | Unselected, selected, disabled (no indeterminate) | Same | Matches |
| Text colour | `text-secondary` | Same | Matches |
| Full text when cut | "A tooltip" | `title` when the text is actually cut (measured after layout), as `NlNavSubItem`; a text cell isn't focusable, so `NlTooltip` can't hang on it | Approved (OD-186) |
| Sticky column | Code only | `stickyEnd`: `sticky`, `end-none`, `--nl-z-sticky`, `--nl-shadow-sticky-end`, fill inherited from the row | Approved (OD-187) |

#### Spec → code

| Spec option | Code |
|---|---|
| Cell | `<td>` (or `<th scope="row">` with `rowHeader`), `Size-40`, `Space-3XL` inline (`narrow` or row actions: `Space-XL`), `Space-none` block, Body M `text-secondary`, `data-type` |
| Default | `children` in a one-line span, `truncate`, `title` when cut |
| Badge | `badge: { tone, label }` → `NlBadge size="small"` |
| Link | `link: { label, href?, as?, onClick? }` → `NlButton variant="link" size="xsmall" flush` (an `<a>` with `href`) |
| Row actions | `actions: { label, expanded?, onClick, ref? }` → `NlButton` tertiary xsmall icon-only `more_vert`, `contentTone="secondary"`, `aria-haspopup="menu"`, `aria-expanded`; column `w-64` |
| Checkbox | `checkbox: { checked, onChange, label, disabled? }` → `NlCheckboxControl` |
| Select | `select: { checked, onChange, label, disabled? }` → leading `NlCheckboxControl`, gap `Space-M` |

#### API

```tsx
import { NlTableCell } from '@northline/ui';

<NlTableCell rowHeader select={{ checked, onChange, label: 'Select Member 0042' }}>Member 0042</NlTableCell>
<NlTableCell type="badge" badge={{ tone: 'success', label: 'Tier 2' }} />
<NlTableCell type="row-actions" stickyEnd actions={{ label: 'Actions for Member 0042', expanded, onClick, ref }} />
```

`'use client'` (measuring).

#### Tokens used

`Size-40`, `Size-64`, `Space-3XL`, `Space-XL`, `Space-M`, `Space-none`; Body M, `text-secondary`; `--nl-z-sticky`, `--nl-shadow-sticky-end`; `NlBadge`, `NlButton`, `NlCheckboxControl`'s own.


---

### NlNavItem

**Level** Molecule (contains `NlNavIcon`, L1) · **Base** none · **Depends on** `NlNavIcon`, `NlNavSubItem`, `NlIcon`, `NlTooltip`, `NlMenu`, `NlListItem` (minimized) · **Public** (used by `NlSideNav`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-118, OD-130, OD-131 and OD-189 to OD-191 decided.

A section in the side nav: an icon and name, which either links to a page or expands to show its pages.

#### Anatomy

```
NlNavItem (vertical)
├── row (link or button, rounded)
│   ├── NlNavIcon
│   ├── label (full nav only)
│   └── chevron NlIcon (when the section has pages; full nav only)
└── pages slot (when expanded): NlNavSubItem × n
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | full, minimized | `minimized?: boolean` (set by `NlSideNav`) |
| State | default, selected (this section's page is open), current (the section itself is the current page) | `current?: 'section' \| 'page'` |
| Expanded | closed, open (sections with pages) | `expanded` / `defaultExpanded`, `onExpandedChange` |
| Icon | registry name | `icon: NlIconName` |
| Label | text | `children` |
| Pages | optional | `pages?: { label, href, current? }[]` |
| Link | for sections without pages | `as`, `href` |

#### Sizes and layout

- Row: padding `Space-M` block, `Space-L` inline; `Radius-S` (D19); gap `Space-L`; items centred; width fills the nav.
- Icon `NlNavIcon` (20). Label `Label M`, single line, truncated. Chevron 20 (`keyboard_arrow_down`, `keyboard_arrow_up` when expanded).
- Minimized: only the icon, the row is a square-ish button (padding as above).
- Pages: below the row, `Space-XS` apart and `Space-XS` below the row.
- Tree line position for `NlNavSubItem`: the icon's centre, `Space-L` + half of `Size-20` from the row's start (resolves OD-30a).

#### Colours

| State | Row fill | Label | Icon and chevron |
|---|---|---|---|
| default | `bg-secondary` | `text-secondary` | `fg-secondary` |
| hover | `bg-tertiary` | `text-secondary` | `fg-secondary` |
| pressed | `bg-neutral` | `text-secondary` | `fg-secondary` |
| current = page (this row is the open page) | `bg-primary` | `text-action` | `fg-active` (icon filled) |
| current = section (a page inside is open) | `bg-secondary` | `text-action` | `fg-active` (icon filled) |
| focus | standard ring from CLAUDE.md | | |

#### States

Default, hover, pressed, focus, current (page or section), expanded.

#### Behaviour and accessibility

- Without pages: a link with `aria-current="page"` when current.
- With pages: a `<button aria-expanded aria-controls>` that shows the pages, which are links. A section containing the current page opens by default.
- Minimized: the label stays as visually hidden text and shows in a tooltip; a section with pages opens its pages in a menu to the right (see "Mapping notes").
- Keyboard: Tab through rows and open pages; Enter or Space toggles a section.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| State names | "Selected - BG" (white row) and "Selected" (grey row) | `current="page"` and `current="section"` | Approved (OD-130) |
| Pages gap | `Space-XS` in one variant, `Space-M` in another | `Space-XS` (as the reference's description says) | Approved (OD-131) |
| Minimized with pages | Not drawn | Pages in an `NlMenu` (`kind="navigation"`, new `placement="end-start"`) beside the row; rows are `NlListItem role="menuitem"` links | Approved (OD-118) |
| Tree line position | Raw 21–22 from the start | `Space-L` + half `Size-20` = the icon centre | Resolves OD-30a |
| Pressed `bg-neutral` | Same as `bg-tertiary` in Light today | Kept; hover and pressed look the same in Light (K1) | Known issue K1 |
| Minimized label | "Shows in a tooltip" | `NlTooltip placement="end"`; it describes the row, so a screen reader hears the name twice | Approved (OD-189) |
| Current section from pages | Not described | A current page makes the row `current="section"` and opens it, unless `current` or `expanded` is passed | Approved (OD-190) |
| Long labels | Not described | One line, ellipsis, `title` when cut (as `NlNavSubItem`) | Approved (OD-191) |

#### Spec → code

| Spec option | Code |
|---|---|
| Row | Without pages: link (`href`, `as`), `aria-current="page"` when current. With pages: `<button aria-expanded aria-controls>`; minimized: a menu trigger (`aria-haspopup="menu"`) |
| Layout | `Space-M` block, `Space-L` inline, `Radius-S` (D19), gap `Space-L`, full width; `NlNavIcon` 20 (filled when current), Label M label, 20 chevron |
| Colours | `state.default` / `page` / `section` lookups per the table; chevron `fg-secondary` or `fg-active` |
| Pages | `<ul>` `Space-XS` below and apart; `NlNavSubItem` with `tree` `middle` and `last` |
| Expanded | `expanded` / `defaultExpanded` (default: a page is current) / `onExpandedChange` |
| Minimized | Icon only (44 × 36), name in `sr-only` and an `NlTooltip` to the end; pages in `NlMenu kind="navigation" placement="end-start"` with `NlListItem role="menuitem" href` rows (small, compact, no divider) |

#### API

```tsx
import { NlNavItem } from '@northline/ui';

<NlNavItem icon="person" href="/members" current="page">Members</NlNavItem>
<NlNavItem icon="check_circle" pages={[{ label: 'All rewards', href: '/rewards', current: true }]}>Rewards</NlNavItem>
```

`'use client'` (state, refs, effects).

#### Tokens used

`Space-M`, `Space-L`, `Space-XS`, `Radius-S` (D19), `Size-20`; `bg-secondary`, `bg-tertiary`, `bg-neutral`, `bg-primary`; `text-secondary`, `text-action`; `fg-secondary`, `fg-active`; Label M; `--nl-duration-fast`; the parts' own.

Checked in Chrome: minimized tooltip on focus, the pages menu opening beside its row with focus on the first page; axe clean with the menu open in every brand and theme.

#### Tree lines (added 21 Nov 2026, with `NlSideNav` #78, OD-231)

`tree?: boolean`, default `true`: the pages' tree lines (`NlNavSubItem tree`). `false` draws the pages without lines (`tree="none"`); `NlSideNav` passes it for its default style.

---

### NlSideNavUser

**Level** Molecule (mapped) · **Base** `NlListItemBase` · **Depends on** `NlAvatar` · **Public** (used by `NlSideNav`)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-119, OD-120, OD-132 and OD-192 to OD-196 decided.

The signed-in user at the bottom of the side nav, which opens the account menu.

#### Anatomy

As `NlListItemBase` (small): `NlAvatar` (40), name, email, and a chevron. Minimized: the avatar only.

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | expanded, minimized | `minimized?: boolean` (set by `NlSideNav`) |
| Open | closed, open | `open`, set by the menu it opens |
| Name, email | text | `name`, `email` |
| Avatar | as `NlAvatar` | `avatar` |
| Menu | the account menu | `menu: ReactNode`: the menu's rows; the component renders the `NlMenu` (OD-192). Or `onClick` |

#### Sizes and layout

- Expanded: width fills the nav column. Padding `Space-L` block, `Space-XL` inline; `Radius-S` (D19). Avatar 40, gap `Space-L`. Name `Label M`, email `Body M`. Chevron 24 (`keyboard_arrow_down`, `keyboard_arrow_up` while open).
- Minimized: the avatar alone, padding `Space-L` block.
- The account menu opens above it (expanded), as wide as the user area, `Space-XS` away; or to the right of the nav, along its bottom (minimized).

#### Colours

| State | Fill |
|---|---|
| default | none |
| hover, open | `bg-tertiary` |
| pressed | `bg-neutral` |
| focus | standard ring from CLAUDE.md |

Name `text-primary`, email `text-secondary`, chevron `fg-secondary`.

#### States

Default, hover, pressed, open, focus. A user row with no menu has no hover and no side padding.

#### Behaviour and accessibility

- A `<button aria-haspopup="menu" aria-expanded>`, named from its text: "{name} {email} {menu label}" (OD-194).
- Minimized: the avatar is the button; the name is a visually hidden label and a tooltip.
- Escape in the menu closes it and returns focus here.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Padding | `Space-L` block, `Space-XL` inline, and `Radius-S` (D19; was `Radius-M`), unlike list rows | `NlListItemBase appearance="nav"`: this padding and radius, and the nav fills (`bg-tertiary`, `bg-neutral`), which differ from list rows too | Approved (OD-119) |
| Email text style | `Body M`, while small list rows use `Body S` (OD-14) | New `NlTextBlock type="label-body"` (Label M + Body M) | Approved (OD-120) |
| Avatar size | Set to the xsmall variant but drawn 40 | `NlAvatar size="medium"` (40) | Approved (OD-132) |
| Standalone | Placed into the side nav where needed (reference decision) | Same: `NlSideNav` takes it in a slot or prop | Matches |
| Menu prop | "An `NlMenu`" | `menu` takes the rows; the component owns the `NlMenu` (anchor, open state, id), as `NlNavItem` does | Approved (OD-192) |
| Menu placement | Above (expanded); to the right of the nav, along its bottom (minimized) | New `NlMenu` placements `top-start` and `end-end`. Minimized, the menu sits `Space-XS` from the avatar button, not the nav's edge; `NlSideNav` (#78) can adjust | Approved (OD-193) |
| Accessible name | "{name}, account menu" | Named from its text plus the menu label as hidden text: "{name} {email} Account menu". An `aria-label` without the visible email fails WCAG 2.5.3 (axe `label-content-name-mismatch`) | Approved (OD-194) |
| Minimized padding | `Space-L` block only | `Space-L` all round (a 72 × 72 target) | Approved (OD-195) |
| Long name or email | Not described | One line each, ellipsis, `title` when cut (as OD-191) | Approved (OD-196) |

#### Spec → code

| Spec option | Code |
|---|---|
| Row | `NlListItemBase appearance="nav" size="small"`, `as="button"` with `menu` or `onClick`, else a `div` (not actionable: no hover, no inline padding, no chevron) |
| Avatar | `avatar` (NlAvatar props without `size`), drawn at `size="medium"` (40) in the leading slot |
| Name, email | `name`, `email`: title and description, one line each, `title` when cut |
| Chevron | `NlIcon` 24 in the trailing slot, `keyboard_arrow_down` / `keyboard_arrow_up` while open, `fg-secondary` (the base's trailing colour) |
| Open | Internal state, or `open` / `onOpenChange`; the base's `selected` gives the `bg-tertiary` fill |
| Menu | `NlMenu` (action) with `nlMenuTriggerProps`, `aria-label={menuLabel}` (default "Account menu"), `placement` `top-start`, or `end-end` when minimized. Escape closes it and returns focus (from `NlMenu`) |
| Minimized | `hideText` on the base (avatar only, `Space-L` all round), no chevron, the name in an `NlTooltip` to the end |

#### API

```tsx
import { NlListItem, NlSideNavUser } from '@northline/ui';

<NlSideNavUser
  name="Member 0042"
  email="m0042@example.test"
  avatar={{ initials: 'M4' }}
  menu={<NlListItem role="menuitem" title="Sign out" size="small" density="compact" divider={false} />}
/>
```

Props: `name`, `email`, `avatar?`, `menu?`, `menuLabel?`, `open?`, `onOpenChange?`, `onClick?`, `minimized?`, `className?`. `'use client'` (state, refs, effects).

#### Tokens used

`Space-L`, `Space-XL`, `Space-XS` (menu gap, from `NlMenu`), `Radius-S` (D19), `Size-40` (avatar), `Size-24` (chevron); `bg-tertiary`, `bg-neutral`; `text-primary`, `text-secondary`, `fg-secondary`; Label M, Body M; `--nl-duration-fast`; the parts' own.

Checked in Chrome: axe clean (WCAG 2.2 AA and the experimental name rule) in every brand and theme, closed, hovered (email `text-secondary` on `bg-tertiary`) and with the menu open, expanded and minimized; Escape returns focus to the row.

---

### NlSelect

**Level** Organism (contains `NlListItem`, a molecule) · **Base** `NlInputBase` (`type="select"`) · **Depends on** `NlInputBase`, `NlMenu`, `NlListItem` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-42, OD-43, OD-139, OD-140 and OD-197 to OD-201 decided.

A field that opens a list of options and shows the chosen one, such as "Tier" or "Status".

#### Anatomy

```
NlSelect
├── NlInputBase (type select): floating label, selected value, chevron, helper text
└── NlMenu (kind select), under the field
    └── NlListItem × n (one per option, small)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size`, default `large` |
| Options | list | `options: { value, label, description?, disabled? }[]` |
| Value | one option | `value` / `defaultValue`, `onValueChange` |
| Error | off, on | `error?` |
| Everything else | as `NlInputBase` | `label`, `helperText`, `disabled`, `required`, `name` (no `placeholder`: floating-label fields have no hint text, designer's choice 19 Nov 2026) |

#### Sizes and layout

- Field: as `NlInputBase`. Trailing chevron `keyboard_arrow_down` (24 large, 20 small) in `fg-secondary`; `keyboard_arrow_up` while open.
- Menu: `NlMenu kind="select"`, `Space-XS` below the field, at least as wide as the field. Options are `NlListItem size="small"` (plain), the selected one in the "selected" look.

#### Colours and states

As `NlInputBase`: enabled, hover, focused, complete, disabled, each with and without error. "Open" uses the focused look. The chevron is `fg-disabled` when disabled.

#### Behaviour and accessibility

- The field is a button-like combobox: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, named by the label. The value text is its current value.
- Keyboard: Enter, Space or Down opens; arrows move; Enter selects and closes; Escape closes without changing; typing a letter jumps to the next option starting with it (on the closed field too).
- A native `<select>` is not used, so the menu can match the design. The value is submitted through a hidden input with `name`.
- The selected option has `aria-selected="true"`. Disabled options are skipped.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Typing state | Drawn (value text in the field while focused) | Means type-ahead on the focused field, no free text | Approved (OD-139) |
| Helper text colour | `text-secondary` here, `text-tertiary` in other fields | Follows OD-43: `text-tertiary` | Decided (OD-43) |
| Option rows | Not drawn for select (only the menu's standard rows) | `NlListItem size="small" density="compact"`, no divider, as the other menus | Approved (OD-140) |
| States | As in the table | Same | Matches |
| Focus while open | Combobox (focus stays on the field, `aria-activedescendant`) | The field stays a `combobox`; focus moves into the list while open, reusing `NlMenu`'s keys and row focus ring (as Radix Select does). No active-row look to design | Approved (OD-197) |
| Required | Native `required` | `aria-required` only (read-only fields skip browser validation); no visible marker (OD-78); the page validates with `error` + `helperText` | Approved (OD-198) |
| Long lists | Not described | `NlMenu maxHeight="320"` (`Size-320`), then scrolls | Approved (OD-199) |
| Box click | Not described | A click anywhere on the box opens it; the menu anchors to the box (`NlInputBase` `boxRef`) | Approved (OD-200) |
| No options | Not described | The field shows; the menu doesn't open | Approved (OD-201) |
| Hover contrast | Label `text-placeholder` on `bg-secondary` | 4.17:1 in Light (every field) | Known issue K9 |

#### Spec → code

| Spec option | Code |
|---|---|
| Field | `NlInputBase type="select"`: read-only `<input role="combobox">` with `nlMenuTriggerProps({ kind: 'select' })` (`aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`), named by its `<label>`; value text = the chosen option's label |
| Size | `size` (`large` / `small`) to the base; chevron 24 / 20 |
| Chevron | `NlIcon` in the trailing slot, `keyboard_arrow_down` / `keyboard_arrow_up` while open; `fg-secondary`, `fg-disabled` when disabled (the slot's colour) |
| Open | The box's focused look while expanded; `NlMenu kind="select"` anchored to the box (`Space-XS` below, at least its width, `maxHeight="320"`), focus back to the field on close (`returnFocusRef`) |
| Options | `NlListItem role="option" size="small" density="compact" divider={false}`, `selected` → `aria-selected` and the selected look, `disabled` → `aria-disabled` and skipped |
| Value | `value` / `defaultValue` / `onValueChange`; a hidden `<input name>` carries the value |
| Keys | Closed: Enter, Space, Down, Up open; a letter picks the next enabled option starting with it. Open: `NlMenu` (arrows, Home, End, letter jump, Enter or Space chooses and closes, Escape closes unchanged, Tab closes) |
| Error, disabled, helper, required | As `NlInputBase`; `required` → `aria-required` |

#### API

```tsx
import { NlSelect } from '@northline/ui';

<NlSelect
  label="Tier"
  name="tier"
  options={[
    { value: 'tier-1', label: 'Tier 1' },
    { value: 'tier-2', label: 'Tier 2', description: 'Earns double points' },
  ]}
  defaultValue="tier-1"
  onValueChange={(value) => {}}
/>
```

Props: `label`, `options`, `value?`, `defaultValue?`, `onValueChange?`, `size?`, `error?`, `helperText?`, `disabled?`, `required?`, `name?`, `id?`, `ref?` (the field), `onFocus?`, `onBlur?`, `className?`. `'use client'` (state, refs).

#### Tokens used

The parts' own: `NlInputBase` (`Size-48` / `Size-40`, `Space-L`, `Space-M`, `Space-XL`, `Radius-XS`, borders, `bg-secondary` hover, the focus ring, Body L, Label S), `NlMenu` (`Space-XS`, `Size-320` max height), `NlListItem` small compact (`Space-M`, Label M, Body S, `bg-active`); `fg-secondary`, `fg-disabled` (chevron); `--nl-duration-fast`.

Checked in Chrome: axe clean in every brand and theme, closed and with the menu open (all stories), except K9 on hover; Escape and choosing return focus to the field; the long list opens scrolled to the chosen option.

---

### NlMultiSelect

**Level** Organism (contains `NlCheckboxListItem`, a molecule) · **Base** `NlInputBase` (`type="select"`) · **Depends on** `NlInputBase`, `NlMenu`, `NlCheckboxListItem`, `NlInputChip` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-42, OD-43, OD-136 and OD-202 to OD-206 decided.

A field for choosing several options, shown as chips in the field.

#### Anatomy

```
NlMultiSelect
├── NlInputBase (type select)
│   └── value area: NlInputChip (xsmall) × visible, then a "+N" chip
└── NlMenu (kind select, multiple)
    ├── header (optional): NlSearchField
    └── NlCheckboxListItem × n (small)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Size | large, small | `size`, default `large` |
| Options | list | `options` |
| Value | several options | `value` / `defaultValue` (array), `onValueChange` |
| Search | off, on (for long lists) | `searchable?` |
| Error | off, on | `error?` |
| Everything else | as `NlInputBase` | `label`, `helperText`, `disabled`, `required`, `name` (no `placeholder`, as `NlSelect`) |

#### Sizes and layout

- Field: as `NlInputBase`, with chevron as in `NlSelect`.
- Chips: `NlInputChip size="xsmall"` in a single row, gap `Space-XS`. Chips that don't fit are replaced by one "+N" chip (same look, no remove button). Chips stay xsmall in both field sizes.
- Menu: as `NlSelect`, with `NlCheckboxListItem size="small"` rows and an optional search header.

#### Colours and states

As `NlInputBase`. Complete shows the chips.

#### Behaviour and accessibility

- The field is a combobox (`aria-haspopup="listbox"`, `aria-expanded`); the menu is a listbox with `aria-multiselectable="true"`.
- Space toggles the focused option; the menu stays open while choosing. Escape or Tab closes it.
- Each chip's remove button is reachable by Tab after the field ("Remove Tier 2"). Backspace in an empty search removes the last chip.
- The "+N" chip is announced as "and N more"; activating it opens the menu.
- Searching filters the rows; "No results" is announced politely.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Typing state | Drawn in the field, but the reference's description says code uses a button and puts search in the menu | Search in the menu header (`searchable`) | Matches the description |
| "+N" overflow chip | Code only, per the reference's description | `NlInputChip removable={false}`, decorative (`aria-hidden`): the field's value already reads every chosen option, so "and N more" isn't announced; a click on it opens the menu (box click) | Approved (OD-136) |
| Chip gap | Not given | `Space-XS` | Approved (OD-136) |
| Helper text colour | `text-secondary` | Follows OD-43: `text-tertiary` | Decided (OD-43) |
| Rows in a listbox | `NlCheckboxListItem` (a label around a checkbox) | `NlCheckboxListItem role="option"`: the row is the option, the checkbox inert | Approved (OD-202) |
| Chips in the field | Drawn in the value area | `NlInputBase` `valueOverlay`; the field's value is the chosen labels (unseen) | Approved (OD-203) |
| Search | `NlSearchField` header | Small, hidden label "Search {label}", placeholder "Search"; matches anywhere in the label, ignoring case; "No results" as a small static `NlListItem` in a polite `role="status"` | Approved (OD-204) |
| Focus with search | Not described | Focus starts in the search; Down moves into the rows (`NlMenu initialFocus="header"`) | Approved (OD-205) |
| After removing a chip | Not described | Focus to the next chip's remove button, else the previous, else the field | Approved (OD-206) |
| Long lists, no options, disabled | As `NlSelect` | `maxHeight="320"`; no options: no menu; disabled chips have no remove button (K5 contrast) | As OD-199, OD-201 |
| Hover contrast | As `NlInputBase` | Known issue K9 | Known issue K9 |

#### Spec → code

| Spec option | Code |
|---|---|
| Field | `NlInputBase type="select"` combobox (`aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`), value = the chosen labels joined with ", " (unseen under the chips), chevron as `NlSelect` |
| Chips | `valueOverlay`: `NlInputChip size="xsmall"` per chosen option in option order, gap `Space-XS`, remove buttons "Remove {label}" after the field in Tab order |
| "+N" | An unseen measuring row holds every chip and a "+N" chip at natural width; the visible row shows as many as fit plus `NlInputChip removable={false} aria-hidden` "+N". Re-measured on resize |
| Menu | `NlMenu kind="select" multiple` (listbox, `aria-multiselectable`), anchored to the box, `maxHeight="320"`, `returnFocusRef` the field; stays open while choosing; Escape or Tab closes |
| Rows | `NlCheckboxListItem role="option" size="small" density="compact" divider={false}` |
| Search | `searchable`: `NlSearchField size="small"` in the header, `initialFocus="header"`; filter, "No results" status; Backspace in an empty search removes the last chip |
| Value | `value` / `defaultValue` (`string[]`) / `onValueChange`; a hidden `<input name>` per chosen value |
| Error, disabled, helper, required | As `NlSelect` |

#### API

```tsx
import { NlMultiSelect } from '@northline/ui';

<NlMultiSelect
  label="Tiers"
  name="tiers"
  options={[
    { value: 'tier-1', label: 'Tier 1' },
    { value: 'tier-2', label: 'Tier 2' },
  ]}
  defaultValue={['tier-1']}
  searchable
  onValueChange={(values) => {}}
/>
```

Props: `label`, `options`, `value?`, `defaultValue?`, `onValueChange?`, `searchable?`, `size?`, `error?`, `helperText?`, `disabled?`, `required?`, `name?`, `id?`, `ref?` (the field), `onFocus?`, `onBlur?`, `className?`. `'use client'` (state, refs, effects).

#### Tokens used

`Space-XS` (chip gap); the parts' own: `NlInputBase` (sizes, borders, focus ring, Body L, Label S), `NlInputChip` xsmall (`Space-XS`, `Space-M`, Label S, `Radius-XS`), `NlMenu` (`Size-320` max height), `NlCheckboxListItem` small compact, `NlSearchField` small, `NlListItem` small compact; `fg-secondary`, `fg-disabled` (chevron).

Checked in Chrome: axe clean in every brand and theme, closed, hovered and open (all stories), and with "No results", except K9 on hover and K5 on the marked disabled chips; Backspace in an empty search removes the last chip; the "+N" chip appears when chips don't fit.

---

### NlDateField

**Level** Organism (contains `NlCalendar`, a molecule) · **Base** `NlInputBase` · **Depends on** `NlInputBase`, `NlMenu`, `NlCalendar`, `NlButton` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-31 (xsmall calendar button), OD-43, OD-137, OD-141 and OD-207 to OD-211 decided.

A date input that accepts typing and opens a calendar.

#### Anatomy

```
NlDateField
├── NlInputBase: floating label, masked date input, calendar NlButton, helper text
└── NlMenu (under the field)
    └── NlCalendar (single)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Value | a date | `value` / `defaultValue` (ISO string), `onValueChange` |
| Format | display pattern | `format?`, default `DD/MM/YYYY` (see "Mapping notes") |
| Limits | earliest and latest | `minDate?`, `maxDate?` |
| Error | off, on | `error?` |
| Everything else | as `NlInputBase` | `label`, `helperText`, `disabled`, `required`, `name` |

The reference has one size (large).

#### Sizes and layout

- Field: as `NlInputBase` (large). Trailing calendar button: `NlButton variant="tertiary" icon="only-icon" contentTone="secondary"`, icon `calendar_today`, size `xsmall` (OD-31).
- Placeholder: the format pattern ("DD/MM/YYYY") in `text-placeholder`. It stays visible while focused (unlike other fields), and while typing, the rest of the pattern shows after the typed digits ("01/0" + "M/YYYY").
- Menu: `NlMenu`, `Space-XS` below the field, as wide as the calendar, holding `NlCalendar mode="single"` opened on the typed date or today.

#### Colours and states

As `NlInputBase`: enabled, hover, focused, typing, complete, disabled, each with and without error.

#### Behaviour and accessibility

- A text input with a digit mask; slashes are inserted automatically. Invalid or out-of-range dates show an error ("Enter a date as DD/MM/YYYY", "Choose a date from {min}", "Choose a date until {max}").
- The calendar button's name is "Choose date" (or "Change date, {current}"), `aria-haspopup="dialog"`, `aria-expanded`. The calendar menu is a dialog; choosing a date fills the field, closes it and returns focus to the input. Escape closes it.
- `aria-describedby` includes the format hint, so screen reader users know the pattern.
- Dates outside the limits are disabled in the calendar.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Date format | Day/month/year with slashes | `format` prop, default `DD/MM/YYYY`: `DD`, `MM`, `YYYY` once each in any order, one separator. Locale-aware formats are left for later; no locale formatting during render (§7.4) | Approved (OD-137) |
| Placeholder visible while focused | As in the reference | Same | Matches |
| Mask, caret, keyboard, limits | Code only, per the reference's description | As above | Matches |
| Calendar in a menu | From the reference's description | `NlMenu` holding `NlCalendar` | Matches |
| Helper text colour | `text-tertiary` here | Follows OD-43: `text-tertiary` | Decided (OD-43) |
| Small size | Not in the reference | Left out: large only, no `size` prop | Approved (OD-141) |
| Menu width | As wide as the calendar | `NlMenu matchAnchorWidth={false}` | Approved (OD-207) |
| Focus on open | Not described | The calendar's tab-stop day (the chosen date, else today), through `NlMenu initialFocusSelector` | Approved (OD-208) |
| Pattern while focused | Visible while focused, unlike other fields (hint text was removed from the other fields 19 Nov 2026) | Kept: `NlInputBase formatHint`, only while focused; the label sits in the field at rest | Approved (OD-209) |
| Escape | Not described | Closes and returns focus to the input, as choosing does | Approved (OD-210) |
| Value reported, form value | Not described | `onValueChange` gets the ISO date when complete and real, else `''`; a hidden input with `name` submits the ISO date | Approved (OD-211) |
| Hover contrast | As `NlInputBase` | Known issue K9 | Known issue K9 |

#### Spec → code

| Spec option | Code |
|---|---|
| Field | `NlInputBase` (large), `<input type="text" inputMode="numeric" autoComplete="off">` with a digit mask: separators added once the next part starts ("010" → "01/0"), at most 8 digits, the caret kept after the same digits (`dateFormat.ts`) |
| Format | `format` (default `DD/MM/YYYY`), parsed by `parsePattern`; a hidden "Format: {pattern}" joins `aria-describedby` |
| Pattern hint | `formatHint={pattern}` on the base: shown while focused, after the typed text |
| Value | `value` / `defaultValue` (ISO) / `onValueChange`; a hidden `<input name>` with the ISO date |
| Errors | "Enter a date as {pattern}", "Choose a date from {min}", "Choose a date until {max}" (dates in the pattern); shown once the date is complete, or after blur; they replace `helperText` and set `error` |
| Calendar button | `NlButton variant="tertiary" icon="only-icon" contentTone="secondary" size="xsmall" iconName="calendar_today"` in the trailing slot; "Choose date" / "Change date, {date}"; `nlMenuTriggerProps({ kind: 'filter' })` (`aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`) |
| Menu | `NlMenu kind="filter"` (dialog) "Choose date", anchored to the box, `matchAnchorWidth={false}`, focus on the calendar's tab-stop day, focus back to the input |
| Calendar | `NlCalendar mode="single"`, value = the typed date, `minDate` / `maxDate`; remounted on each open so it shows the typed date's month (or today's) |
| Disabled, required | As `NlInputBase`; the button is disabled too; `required` is native |

#### API

```tsx
import { NlDateField } from '@northline/ui';

<NlDateField
  label="Start date"
  name="start"
  defaultValue="2026-11-21"
  minDate="2026-11-10"
  maxDate="2026-12-15"
  onValueChange={(iso) => {}}
/>
```

Props: `label`, `value?`, `defaultValue?`, `onValueChange?`, `format?`, `minDate?`, `maxDate?`, `error?`, `helperText?`, `disabled?`, `required?`, `name?`, `id?`, `ref?` (the input), `onFocus?`, `onBlur?`, `className?`. `'use client'` (state, refs).

#### Tokens used

The parts' own: `NlInputBase` (large: `Size-48`, `Space-L`, `Space-XL`, `Radius-XS`, borders, focus ring, Body L, Label S, `text-placeholder` for the hint), `NlButton` xsmall tertiary, `NlMenu` (`Space-XS`), `NlCalendar`.

Checked in Chrome: axe clean in every brand and theme, closed, hovered, typing (hint shown) and with the calendar open, except K9 on hover; focus starts on the chosen day; Escape returns focus to the input.

---

### NlStepper

**Level** Organism (contains `NlStep`, a molecule) · **Base** none · **Depends on** `NlStep` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): OD-142.

The progress row of a multi-step form: 3 to 5 steps, the current one highlighted.

#### Anatomy

```
NlStepper (ordered list, horizontal)
└── NlStep × 3 to 5 (done before the current, upcoming after)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Steps | 3, 4, 5 | `steps: { label }[]` |
| Current | 1 to the number of steps | `current: number` (1-based) |
| Width | fixed spacing, or fill the container | `fill?: boolean` |
| Go back | done steps as buttons | `onStepSelect?(index)` |
| Accessible name | text | `aria-label`, default "Progress" |

#### Sizes and layout

- Horizontal. Each step is `Space-10XL` wide; steps are `Space-10XL` apart, so box centres are 160 apart.
- `fill`: the stepper fills its container and the space between steps grows; only the connecting lines get longer.
- Lines: drawn by each step to the next (see `NlStep`); the last step has none.

#### Colours

From `NlStep`.

#### States

From `NlStep`: done, current, upcoming.

#### Behaviour and accessibility

- An `<ol>` with a name. The current step has `aria-current="step"`.
- With `onStepSelect`, done steps are buttons; upcoming steps are never interactive.
- When `current` changes, the form announces the new step (for example by moving focus to the step's heading), not the stepper.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Spacing | Steps 80 wide and 80 apart (`Space-10XL`) | Same | Matches |
| Fill mode | Code only, per the reference's description | `fill` | Matches |
| Clickable done steps | Code only | `onStepSelect` | Matches |
| More than 5 steps | Not in the reference | Not supported | Open |

---

### NlTableColumnFilter

**Level** Organism (contains list items and `NlSearchField`, molecules) · **Base** none · **Depends on** `NlMenu`, `NlCheckboxListItem`, `NlRadioListItem`, `NlSearchField`, `NlButton` · **Internal to tables** (exported for custom tables)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-212 to OD-215 decided.

The menu that opens from a column header's filter button, to filter the table by that column's values.

#### Anatomy

```
NlMenu (kind filter)
├── header (optional): NlSearchField ("Search {column}")
├── content: NlCheckboxListItem × n, or NlRadioListItem × n ("All" first)
└── footer (checkbox only): Reset (tertiary) + Apply (primary)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | checkbox (multiple), radio (single) | `multiple?: boolean`, default `true` |
| Search | off, on | Shown automatically when the column has more than 8 values; `searchable?` to force |
| Column | name | `column: string` |
| Values | list | `options: { value, label }[]` |
| Applied | the current filter | `value`, `onApply(value)` |

#### Sizes and layout

- `NlMenu`, opening `Space-XS` below the header cell's filter button.
- Rows: `NlCheckboxListItem` / `NlRadioListItem`, `size="small"`, no description, dividers between rows; the last row has no divider and `Space-XL` bottom padding.
- Header (search): as `NlMenu`'s header (padding `Space-L`).
- Footer (checkbox): as `NlMenu`'s footer (padding `Space-XL`, gap `Space-M`, aligned to the end); buttons `size="small"`.

#### Colours

From the parts.

#### States

From the parts. Opening always starts from the applied values with an empty search.

#### Behaviour and accessibility

- A non-modal dialog named "Filter {column}" (`NlMenu kind="filter"`).
- Checkbox: changes apply only with Apply. Reset clears the choice. Escape or a click outside closes without applying.
- Radio: "All" first (clears the filter; chosen when no filter is applied). Choosing applies and closes. Arrow keys between radios apply and keep it open.
- While searching, "All" is hidden. "No results" is announced politely.
- On close, focus returns to the filter button.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Behaviour (apply, reset, radio applies at once, search threshold 8) | From the reference's description (code only) | As above | Matches |
| Width | Drawn at 377 | `NlMenu` sizing (fits the content, at least the trigger) | Matches |
| Button labels | Reset and Apply | Same | Matches |
| Focus on open | Not described | The search when shown; else the first checkbox, or the checked radio ("All" with no filter) | Approved (OD-212) |
| Empty Apply | Not described | Applies `[]` (no filter), so Reset then Apply clears the column's filter | Approved (OD-213) |
| Search match | Not described | Anywhere in the label, ignoring case (as OD-204) | Approved (OD-214) |
| Radio: choose vs arrow | "Choosing applies and closes; arrow keys apply and keep it open" | A click or Space applies and closes; a change that follows an arrow key applies and stays open | Approved (OD-215) |

#### Spec → code

| Spec option | Code |
|---|---|
| Panel | `NlMenu kind="filter"` (non-modal dialog) "Filter {column}"; `open`, `onOpenChange`, `anchorRef` (the header cell's `filterRef`), `id` from the caller; focus back to the anchor on close |
| Type | `multiple` (default `true`): `value: string[]`, `onApply(string[])`; `multiple={false}`: `value: string` (`''` = "All"), `onApply(string)`; `type="date-range"`: `value: { start, end }` (ISO or `null`), `onApply(range)`, optional `minDate`, `maxDate` (OD-241) |
| Date range | `NlCalendar mode="range"` (two months) as the menu content, sized to its content; focus starts on the calendar's focusable day; a draft from the applied range on each open; footer Reset (clears the draft) and Apply (applies and closes), as the checkbox footer |
| Search | `NlSearchField size="small"` "Search {column}" in the header when `options.length > 8`, or as `searchable` says; "All" hidden while searching; "No results" as a small static `NlListItem` in a polite `role="status"` |
| Checkbox rows | `NlCheckboxListItem size="small"`, divider on every row but the last (whose plain padding gives `Space-XL` at the bottom); a draft from the applied values on each open |
| Footer | Checkbox only: `NlButton variant="tertiary" size="small"` Reset (clears the draft), `variant="primary" size="small"` Apply (applies in option order and closes) |
| Radio rows | `NlRadioListGroup` "Filter {column}" of `NlRadioListItem size="small"`, "All" first, dividers as above; a change applies, and closes unless it came from an arrow key |

#### API

```tsx
import { NlTableColumnFilter, NlTableHeaderCell } from '@northline/ui';

<NlTableHeaderCell filter={open ? 'open' : applied ? 'applied' : 'available'} filterRef={filterRef} onFilterClick={() => setOpen(!open)}>
  Tier
</NlTableHeaderCell>
<NlTableColumnFilter open={open} onOpenChange={setOpen} anchorRef={filterRef} column="Tier" options={tiers} value={tiersApplied} onApply={setTiersApplied} />
```

Props: `open`, `onOpenChange`, `anchorRef`, `column`, `options`, `multiple?`, `value`, `onApply`, `searchable?`, `id?`. `'use client'` (state, refs).

#### Tokens used

The parts' own: `NlMenu` (`Space-XS` gap, header `Space-L`, footer `Space-XL` and `Space-M`), `NlCheckboxListItem` and `NlRadioListItem` small (`Space-XL`, dividers), `NlSearchField` small, `NlButton` small, `NlListItem` small.

Checked in Chrome: axe clean in every brand and theme, closed, open and with "No results"; Escape returns focus to the filter button.

---

### NlSideSheet

**Level** Organism (contains `NlButtonDock`, a molecule) · **Base** none · **Depends on** `NlTextBlock`, `NlButton`, `NlDivider`, `NlButtonDock`, `NlOverlay` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-16, OD-133, OD-143 and OD-216 to OD-218 decided.

A full-height panel that slides in from the right, for creating or editing something without leaving the page ("Edit reward").

#### Anatomy

```
NlOverlay
└── NlSideSheet (full-height panel, right edge)
    ├── header: back NlButton (optional) · title slot · close NlButton (optional)
    ├── NlDivider (optional)
    ├── body slot (scrolls)
    └── NlButtonDock (optional, sticky at the bottom)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Open | closed, open | `open`, `onOpenChange` |
| Title | text or slot | `title` (default `NlTextBlock type="headline-large"`), or a slot |
| Back button | optional | `onBack?()` |
| Close button | on (default) or off | `hideClose?` |
| Divider under the header | off (default) or on | `divider?` |
| Body | slot | `children` |
| Footer | optional | `footer?: NlButtonDockProps` |
| Width | see "Mapping notes" | `size?` |

#### Sizes and layout

- Fixed to the right edge, full viewport height, `bg-primary`, layer `--nl-z-modal` above `NlOverlay`.
- Vertical, gap `Space-3XL`.
- Header: padding `Space-4XL` top, `Space-3XL` sides. Row: back button, title (fills), close button; gap `Space-XS` between back button and title. Buttons: `NlButton variant="tertiary" size="medium" icon="only-icon" contentTone="secondary"` (`arrow_back`, `close`).
- Body: padding `Space-3XL` sides, gap `Space-3XL` between blocks; scrolls when long.
- Footer: `NlButtonDock` with `sticky` when the body scrolls.

#### Colours

| Part | Token |
|---|---|
| Panel | `bg-primary` |
| Title | `text-primary` |

#### States

Closed, open.

#### Behaviour and accessibility

- `role="dialog"`, `aria-modal="true"`, labelled by the title. Focus moves into the sheet on open (first field, or the close button), is trapped, and returns to the trigger on close.
- Escape and the close button close it; a click on the overlay closes it unless there are unsaved changes (the caller confirms).
- The back button returns to the previous step inside the sheet; it doesn't close it.
- Slides in from the right with `--nl-duration-slow`, `--nl-ease-standard` (§5: side sheets); reduced motion: fade only.
- The page behind is inert and doesn't scroll.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Width | Raw 600 | `size`: small `Size-560` (default) or large `Size-720`, the dialog widths; no new token | Approved (OD-133) |
| Gap between back button and title | `Space-XS` | Same | Matches |
| Title as a slot | The reference has a title slot | Default `NlTextBlock`, or any slot content | Matches |
| Shadow | None | None (the overlay separates it) | Matches |
| Motion | Not in the reference | Slides in from the end edge (`translate-x-full` → none), Duration slow, standard ease; reduced motion: fade only | Approved (OD-143) |
| Title → close gap | Not given (back → title is `Space-XS`) | `Space-XS` on both sides of the title | Approved (OD-216) |
| Body bottom without a footer | Not given | `Space-3XL` | Approved (OD-217) |
| Divider | Not described | Edge to edge across the panel | Approved (OD-218) |
| Gaps and scrolling | Panel gap `Space-3XL` | The header → body and body → footer gaps are the body's own `Space-3XL` padding, inside its scroll area, so a focused field's floating label at the top isn't cut off (found in Chrome) | Same look |

#### Spec → code

| Spec option | Code |
|---|---|
| Sheet | Native `<dialog>` with `showModal()` (aria-modal, focus kept inside, page inert, Escape, focus back to the opener), labelled by the title; page scroll locked while open; closes after sliding out (as `NlDialog`) |
| Overlay | `NlOverlay`; a click requests close unless `dismissible={false}` |
| Panel | Fixed to the end edge, `h-dvh`, `bg-primary`, `--nl-z-modal`; `size` small `Size-560` / large `Size-720`; motion as above |
| Header | `Space-4XL` top, `Space-3XL` sides, gap `Space-XS`: back `NlButton` (`onBack`, "Back", `arrow_back`), title (text → `NlTextBlock type="headline-large"`, `headingAs` default `h2`; or a slot), close `NlButton` ("Close", `close`, hidden with `hideClose`); buttons tertiary, medium, icon-only, `contentTone="secondary"` |
| Divider | `divider`: decorative `NlDivider`, `Space-3XL` under the header, edge to edge |
| Body | `children`; `Space-3XL` padding all round and between blocks, scrolls (focusable while it scrolls) |
| Footer | `footer` (`NlButtonDockProps`): `NlButtonDock` at the bottom, `sticky` while the body scrolls |
| First focus | The body's first field, else close, back, then the panel |

#### API

```tsx
import { NlSideSheet, NlTextField } from '@northline/ui';

<NlSideSheet
  open={open}
  onOpenChange={setOpen}
  title="Edit reward"
  footer={{ primary: { children: 'Save', onClick: save }, secondary: { children: 'Cancel', onClick: () => setOpen(false) } }}
>
  <NlTextField label="Reward name" />
</NlSideSheet>
```

Props: `open`, `onOpenChange`, `title`, `headingAs?`, `onBack?`, `hideClose?`, `divider?`, `dismissible?`, `size?`, `children?`, `footer?`, `className?`. `'use client'` (state, refs, effects).

#### Tokens used

`Space-XS`, `Space-3XL`, `Space-4XL`, `Size-560`, `Size-720`; `bg-primary`; `--nl-z-modal`; `--nl-duration-slow`, `--nl-ease-standard`; the parts' own (`NlOverlay`, `NlButton`, `NlTextBlock`, `NlDivider`, `NlButtonDock` with `--nl-shadow-sticky`).

Checked in Chrome: axe clean with the sheet open in every brand and theme (all stories); first focus on the first field (the panel when there's nothing to focus); Escape closes and returns focus to the trigger.

---

### NlPageHeader

**Level** Organism (contains `NlNotificationButton`, a molecule) · **Base** none · **Depends on** `NlTextBlock`, `NlButton`, `NlNotificationButton` · **Public** (goes in `NlAppShell`'s header slot)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-16, OD-135, OD-144, OD-219 and OD-220 decided.

The bar at the top of the content panel: optional back button, page title with an optional line under it, and the notification button.

#### Anatomy

```
NlPageHeader (horizontal)
├── start group
│   ├── back NlButton (optional)
│   └── text column: NlTextBlock title + body slot (optional)
└── NlNotificationButton (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Title | text | `title` |
| Body | optional slot | `children` (default `NlTextBlock` description in `Body M`) |
| Back button | optional | `onBack?()` or `backHref?` |
| Notifications | optional | `notifications?: NlNotificationButtonProps` |
| Heading level | for the title | `headingAs`, default `h1` |

#### Sizes and layout

- Padding `Space-L` block, `Space-3XL` inline; gap `Space-XL`; items centred. Width fills the panel.
- Start group: gap `Space-L`. Back button `NlButton variant="tertiary" size="xsmall" icon="only-icon"` (`arrow_back`, 20).
- Text column: gap `Space-XS`. Title `NlTextBlock type="headline-small"`, one line, truncated with an ellipsis. Body in `Body M` below.
- Bottom edge: see "Mapping notes".

#### Colours

| Part | Token |
|---|---|
| Background | `bg-primary` |
| Bottom edge | None on the header: `NlAppShell` leaves a `Space-XS` gap under it, showing the page background (OD-135) |
| Title / body | `text-primary` / `text-secondary` |

#### States

None of its own.

#### Behaviour and accessibility

- A `<header>` (the app shell provides it). The title is the page's `h1`.
- The back button is named "Back" (or "Back to {page}"). It is a link when `backHref` is given.
- A truncated title has its full text available (tooltip or `title`).
- New notifications are announced politely from here ("3 new notifications").

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Bottom edge | A 4px bottom stroke in `bg-secondary` (the page background showing as a gap) | §4.2 allows only 1px and 2px borders. No edge on the header; `NlAppShell` leaves a `Space-XS` gap under it, so the page background shows through (the reference's look, from spacing) | Approved (OD-135, option a; no comparison stories) |
| Title truncation | One line with "…", per the reference's description | Same | Matches |
| Title heading level | Not in the reference | `h1` (`headingAs` changes it) | Approved (OD-144) |
| Root element | "A `<header>` (the app shell provides it)" | A `div`; `NlAppShell`'s header slot is the `<header>`, so there's one banner landmark | Approved (OD-219) |
| Announcement | "3 new notifications" | The total unread count when it rises ("1 new notification" singular); nothing on the first render or a fall; a polite `role="status"` | Approved (OD-220) |
| Back button size | XSmall, icon 20 | Same | Matches |

#### Spec → code

| Spec option | Code |
|---|---|
| Root | `div`, row, `Space-L` block and `Space-3XL` inline padding, gap `Space-XL`, items centred, `bg-primary`, full width; native attributes pass through |
| Start group | Gap `Space-L`: back button, then the text column (gap `Space-XS`) |
| Back | `onBack` → `NlButton` button, or `backHref` (+ `backAs`) → link; `variant="tertiary" size="xsmall" icon="only-icon" iconName="arrow_back"`; named `backLabel` (default "Back") |
| Title | `title` in `NlTextBlock type="headline-small"`, `headingAs` (default `h1`); one line with an ellipsis, `title` tooltip only when cut |
| Body | Text `children` → the same `NlTextBlock`'s description (Body M, `text-secondary`, `Space-XS` under the title); other content as a slot under the title |
| Notifications | `notifications` → `NlNotificationButton` at the end; rises announced in a hidden polite status |

#### API

```tsx
import { NlPageHeader } from '@northline/ui';

<NlPageHeader
  title="Track day voucher"
  backHref="/rewards"
  backLabel="Back to rewards"
  notifications={{ count: 3, onClick: openNotifications }}
>
  Reward X · Tier 2 and up
</NlPageHeader>
```

Props: `title`, `headingAs?`, `children?`, `onBack?`, `backHref?`, `backAs?`, `backLabel?`, `notifications?`, `className?`, native `div` attributes. `'use client'` (state, refs, effects).

#### Tokens used

`Space-XS`, `Space-L`, `Space-XL`, `Space-3XL`; `bg-primary`; `text-primary`, `text-secondary` (through `NlTextBlock`); Headline Small-H6, Body M; the parts' own (`NlButton` xsmall tertiary, `NlNotificationButton`).

Checked in Chrome: axe clean in every brand and theme (all stories); the cut title has its tooltip; a rising count is announced.

---

### NlTable

**Level** Organism · **Base** none · **Depends on** `NlTableHeaderCell`, `NlTableCell`, `NlCheckboxControl`, `NlSearchField`, `NlButton`, `NlPagination`, `NlRowsPerPage`, `NlMenu`, `NlListItem`, `NlEmptyState`, `NlSkeleton` · **Public**

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-138, OD-145 and OD-221 to OD-230 decided.

A data table with an optional toolbar (search, filters, main action), selectable rows, sorting, filtering and a footer with pagination. The toolbar, header row, body rows and footer are internal parts (D15).

#### Anatomy

```
NlTable (vertical)
├── toolbar (optional, internal): NlSearchField · filter slot (NlChipGroup) · primary NlButton
├── table frame
│   ├── header row (internal): select-all NlTableHeaderCell · NlTableHeaderCell × columns · row-actions header
│   └── body rows (internal): select NlTableCell · NlTableCell × columns · row-actions NlTableCell
└── footer (optional, internal): summary text · NlRowsPerPage (+ NlMenu of NlListItem) · NlPagination
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Style | default (no outer border), bordered | `variant`, default `default`, also `data-variant` |
| Columns | definitions | `columns: { key, header, width?, sortable?, filter?, render? }[]` |
| Rows | data | `rows`, `getRowId` |
| Selection | off, on | `selectable?`, `selectedIds`, `onSelectionChange` (kept across pages) |
| Row actions | off, on | `rowActions?: (row) => menu items` |
| Toolbar | on (default), off | `toolbar?: { search?, filters?: ReactNode, action?: NlButtonProps }` or `false` |
| Footer | on (default), off | `pagination?: { page, pageCount, pageSize, pageSizes, total }` or `false` |
| Sort | current sort | `sort`, `onSortChange` |
| Loading | on or off | `loading?` |
| Empty | content when there are no rows | `empty?: NlEmptyStateProps` |
| Caption | accessible name | `caption` (visually hidden by default) |

#### Sizes and layout

- Vertical: toolbar, table, footer, each `Space-XL` apart.
- Toolbar: horizontal, space between: `NlSearchField` (fills the free space), then the filter slot and the primary button (`size="small"`), `Space-L` apart.
- Header row: `NlTableHeaderCell appearance="grey"`; the select column is narrow and `Size-56` wide; the row-actions column is narrow, `Size-64` wide, empty header.
- Body rows: `NlTableCell`s, height `Size-40`; 1px bottom border (§4.2) on every row except the last.
- Bordered: 1px border around the header and rows (not the toolbar or footer), `Radius-S`, clipped.
- Footer: horizontal, space between: summary text ("Showing 1–10 of 120") and `NlRowsPerPage` together on the left, `NlPagination` on the right, `Space-L` apart (OD-242). Footer height `Size-32`.
- Width fills its container. Columns can be fixed, flexible or have a minimum width; wide tables scroll sideways with the row-actions column fixed (`--nl-shadow-sticky-end`, `--nl-z-sticky`).

#### Colours

| Part | State | Token |
|---|---|---|
| Body row | default | none |
| Body row | hover | `bg-secondary` |
| Body row | selected | `bg-active` |
| Body row | selected + hover | `bg-active-hover` |
| Row divider | – | `border-default` |
| Bordered frame | – | `border-subtle` |
| Footer summary | – | `text-tertiary` (`Body S`) |

#### States

Default, loading (skeleton rows, no footer), empty (`NlEmptyState` replaces the rows and footer), and the row states above.

#### Behaviour and accessibility

- A real `<table>` with `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`. The first data column can be a row header.
- Sorting and filtering from the header cells (see `NlTableHeaderCell`, `NlTableColumnFilter`). Results changes are announced politely ("Showing 12 results").
- Selection: select-all reflects the current page (indeterminate when some rows are selected); the selected count is announced and shown in the toolbar or footer.
- Rows-per-page opens `NlMenu kind="select"` with `NlListItem` options under `NlRowsPerPage` (approved approach).
- Loading: `aria-busy="true"` on the table; skeleton rows match the column layout.
- Row click (if used) is never the only way to act on a row; the row-actions button is always available.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Toolbar, header row, rows, footer as parts | Separate components in the reference | Internal parts of `NlTable` (D15) | Approved |
| Empty and loading | Code only, per the reference's description | `NlEmptyState` in one full-width row, `Space-4XL` above and below (OD-229); `NlSkeleton` text bars, `Size-80` wide, in each data column (OD-228) | Approved (OD-138) |
| Toolbar spacing | The search fills the space between (the reference's raw 80 gap is a "space between" layout) | Space between; filter slot and action `Space-L` apart | Matches |
| Select column width | 56 | `Size-56` | Matches |
| Row-actions column | 64, fixed when scrolling sideways | `Size-64`, sticky | Matches |
| Footer summary text | Reference copy | "Showing {from}–{to} of {total}" | Matches |
| Column widths and sideways scrolling | Code only | `width` / `minWidth` as `Size-*` token names (`80`, `96`, `120`, `320`) through a `<colgroup>`; no width is flexible (OD-222); the frame scrolls sideways and the row-actions column (header too: `NlTableHeaderCell stickyEnd`, added, OD-223) stays at the end | Approved (OD-138) |
| Column filters | OD-145 | The table renders `NlTableColumnFilter` from `column.filter` | Approved (OD-145) |
| Row actions | "menu items" | `rowActions(row) → { label, onSelect, disabled? }[]` in an `NlMenu` (action) of `NlListItem` menu items, anchored to the row's button | Approved (OD-221) |
| Row names | Not described | `getRowLabel`, else the row-header column's text, else the first column's ("Select Member 0042", "Actions for Member 0042") | Approved (OD-224) |
| Selected count | "In the toolbar or footer" | Leads the footer summary: "3 selected · Showing 1–10 of 120"; announced | Approved (OD-225) |
| Caption | "Visually hidden by default" | Always visually hidden (no visible caption style in the spec) | Approved (OD-226) |
| Row fill at rest | None | `bg-primary`, so the sticky row-actions cell (which takes the row's fill) covers cells scrolled under it; looks the same on the `bg-primary` panel | Approved (OD-227) |
| Row click | "If used" | `onRowClick(row)` (OD-243, replaces OD-230): a mouse click on a row (not on its checkbox, links or buttons) calls it; the row gets a pointer. Every row keeps its actions button, the keyboard way to act on a row | Approved (OD-243) |
| Header contrast | – | The grey header's titles are 4.46:1 in Dark: known issue K8; the stories are marked | Known issue K8 |

#### Spec → code

| Spec option | Code |
|---|---|
| Root | Toolbar, frame, footer, `Space-XL` apart; `data-variant` |
| Toolbar | `toolbar: { search?, filters?, action? }` or `false`: `NlSearchField size="small"` filling the space; filters slot and `NlButton size="small"` (primary by default) `Space-L` apart |
| Frame | Scrolls sideways; `variant="bordered"`: 1px `border-subtle`, `Radius-S`, clipped |
| Table | `<table aria-busy>` with a visually hidden `<caption>`, `<colgroup>` (select `Size-56`, row actions `Size-64`, column widths), `<thead>` of `NlTableHeaderCell appearance="grey"` (select-all; sort; filter; an empty "Actions" header, `stickyEnd`), `<tbody>` |
| Rows | `NlTableCell`s (`Size-40`); select cell (`narrow`, "Select {row}"); data cells from `column.cell(row)` (text, badge or link; `rowHeader` → `<th scope="row">`); row-actions cell (`stickyEnd`, "Actions for {row}"). Divider `border-default` but the last row; fills `bg-primary` / hover `bg-secondary` / selected `bg-active` / selected + hover `bg-active-hover` |
| Selection | `selectable`, `selectedIds` (kept across pages), `onSelectionChange`; select-all for the page, indeterminate when some |
| Sort | `sort` / `onSortChange`: `{ key, direction }` or `null` |
| Filters | `column.filter` → the header's filter button and an `NlTableColumnFilter` |
| Footer | `pagination` or `false`: space between, `Size-32` high: summary (Body S `text-tertiary`) and `NlRowsPerPage` (+ `NlMenu kind="select"` of `NlListItem` options) at the start, `NlPagination` at the end, `Space-L` apart (OD-242) |
| Row click | `onRowClick?(row)`: `cursor-pointer` on rows; clicks inside `a`, `button`, `input` or `label` are left to them (OD-243) |
| Loading | `loading`: skeleton rows (`pageSize`, or 5), no footer |
| Empty | `empty` (default heading "No results"): `NlEmptyState` across every column; no footer |
| Announcements | Hidden polite status: "Showing {n} results" when the total changes, "{n} selected" when the selection changes |

#### API

```tsx
import { NlTable } from '@northline/ui';

<NlTable
  caption="Members"
  columns={[
    { key: 'name', header: 'Name', rowHeader: true, sortable: true },
    { key: 'status', header: 'Status', width: '120', cell: (m) => ({ type: 'badge', badge: { tone: 'success', label: m.status } }) },
  ]}
  rows={pageRows}
  getRowId={(m) => m.id}
  selectable
  selectedIds={selected}
  onSelectionChange={setSelected}
  rowActions={(m) => [{ label: 'Edit', onSelect: () => edit(m) }]}
  toolbar={{ search: { label: 'Search members', value: query, onChange: onQuery }, action: { children: 'Add member' } }}
  pagination={{ page, pageCount, pageSize, pageSizes: [10, 20], total, onPageChange: setPage, onPageSizeChange: setPageSize }}
  sort={sort}
  onSortChange={setSort}
/>
```

Props: `caption`, `variant?`, `columns`, `rows`, `getRowId`, `getRowLabel?`, `selectable?`, `selectedIds?`, `onSelectionChange?`, `rowActions?`, `toolbar?`, `pagination?`, `sort?`, `onSortChange?`, `loading?`, `empty?`, `onRowClick?`, `bulkActions?`, `className?`. `column.filter` takes `type: 'date-range'` (OD-241). `bulkActions(selectedIds)` returns `NlBulkAction`s: while rows are selected, an `NlBulkActionBar` sits after the footer, sticky `Space-3XL` above the bottom of the scrolling panel (`--nl-z-sticky`), centred; its Clear selection empties the selection and focuses select all (D21). Generic over the row type. `'use client'` (state, refs).

#### Tokens used

`Space-L`, `Space-XL`, `Space-4XL`; `Size-32`, `Size-40`, `Size-56`, `Size-64`, `Size-80`, `Size-96`, `Size-120`, `Size-320`; `Radius-S`; `border-default`, `border-subtle`; `bg-primary`, `bg-secondary`, `bg-active`, `bg-active-hover`; `text-tertiary`, Body S; `--nl-shadow-sticky-end`, `--nl-z-sticky`; `--nl-duration-fast`; the parts' own.

Checked in Chrome: axe in every brand and theme, at rest, hovered, with a row selected, with the row-actions menu, the rows-per-page menu and a column filter open, and scrolled sideways: only K8 (the grey header in Dark) and K9.

---

### NlSideNav

**Level** Organism (contains `NlNavItem`, `NlSideNavUser`, molecules) · **Base** none · **Depends on** `NlNavItem`, `NlSideNavUser`, `NlButton` · **Public** (goes in `NlAppShell`'s nav slot)

**Open items** (tracked in [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)): none. OD-134, OD-146, OD-147 and OD-231 to OD-233 decided.

The app's main navigation: a logo and collapse button at the top, the sections, and the signed-in user at the bottom.

#### Anatomy

```
NlSideNav (nav, full height, vertical, space between)
├── top group
│   ├── header row: logo slot · collapse NlButton
│   └── sections: NlNavItem × n
└── NlSideNavUser (optional)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Type | expanded, minimized | `minimized` / `defaultMinimized`, `onMinimizedChange` |
| Style | default, tree | `variant`, default `default`, also `data-variant` (tree draws lines from an open section to its pages) |
| Sections | data | `items: { icon, label, href?, pages? }[]` |
| Current | the current page | `currentHref` (marks the section and page as current) |
| Logo | slot | `logo: ReactNode` (hidden when minimized) |
| User | optional | `user?: NlSideNavUserProps` |
| Accessible name | text | `aria-label`, default "Main" |

#### Sizes and layout

| Part | Expanded | Minimized |
|---|---|---|
| Nav width | content column + `Space-XL` either side (see "Mapping notes") | `Size-80` |
| Padding | `Space-3XL` top and bottom, `Space-XL` sides | same |
| Header row | logo slot (fills) + collapse button at the end | collapse button only, centred |
| Sections | full rows, `Space-XS` apart | icon-only rows, centred, `Space-XS` apart |

- Top group: header row, then the sections, `Space-L` apart.
- The user sits at the bottom (the nav is a space-between column).
- Collapse button: `NlButton variant="tertiary" size="medium" icon="only-icon" contentTone="secondary"` (`dock_to_right`).
- Background `bg-secondary`.
- Width changes animate with `--nl-duration-slow`; none under reduced motion.

#### Colours

| Part | Token |
|---|---|
| Background | `bg-secondary` |
| Items, user | see `NlNavItem`, `NlSideNavUser` |

#### States

Expanded, minimized; default or tree style.

#### Behaviour and accessibility

- A `<nav aria-label="Main">` with a list of sections.
- Collapse button: "Collapse navigation" / "Expand navigation". No `aria-expanded`: the name says what it does, and `NlButton` would draw it pressed (OD-233).
- From `Breakpoint-1280` the nav is expanded; below it, minimized. The user can toggle it until the window crosses 1280 again (from the reference's app shell description).
- Minimized: section names are tooltips and visually hidden labels; sections with pages open them in a menu (OD-118). Tree lines show only when expanded.
- The section holding the current page opens by default.

#### Mapping notes

| Item | Reference | Northline | Status |
|---|---|---|---|
| Expanded width | 272 (a 240 content column + 16 either side) | `Size-240` added to §3.5 (token audit addendum, 21 Nov 2026): a 240 content column + `Space-XL` either side (272) | Approved (OD-134) |
| Minimized width | 80 | `Size-80` | Matches |
| Menu variants | Eight variants named after the reference product's sections | Left out; sections come from `items` data | Matches inventory |
| Logo | A linked logo component with placeholder text | Generic `logo` slot | Matches inventory |
| Header row gap | A raw 62 gap (space between) | Space between: logo fills, button at the end | Matches |
| Collapse icon | `dock_to_right` | Material Symbols `dock_to_right` | Approved (OD-146) |
| Width animation | Not in the reference | `--nl-duration-slow`, standard ease; none under reduced motion | Approved (OD-147) |
| Default vs tree style | Tree draws lines | `NlNavItem` gained `tree` (default `true`); the nav passes `variant === 'tree'` | Approved (OD-231) |
| Breakpoint | Expanded from 1280, minimized below; the user toggles until the window crosses 1280 again | Uncontrolled and without `defaultMinimized`, it follows `matchMedia` on `--nl-breakpoint-1280` (read in the browser only) | Approved (OD-232) |
| Collapse button state | `aria-expanded` | Left out (OD-233) | Approved (OD-233) |

#### Spec → code

| Spec option | Code |
|---|---|
| Nav | `<nav aria-label>` (default "Main"), full height, `bg-secondary`; `content-box` with `Space-XL` either side, so the width is the content column: expanded `Size-240` (272), minimized `Size-48` (`Size-80`); the width eases over `--nl-duration-slow` with the standard ease, none under reduced motion |
| Column | `Space-3XL` top and bottom; top group (header row, then sections, `Space-L` apart) at the top, the user at the bottom |
| Header row | `logo` (fills; hidden when minimized) + collapse `NlButton variant="tertiary" size="medium" icon="only-icon" contentTone="secondary" iconName="dock_to_right"`; minimized: the button alone, centred |
| Sections | `items: { icon, label, href?, as?, pages? }[]` → `<ul>` of `NlNavItem` (`Space-XS` apart), `minimized` and `tree={variant === 'tree'}` passed down |
| Current | `currentHref`: a matching page gets `current` (its section opens and is `current="section"`), a matching section link is `current="page"` |
| Type | `minimized` / `defaultMinimized` / `onMinimizedChange`; without either, follows `Breakpoint-1280` |
| User | `user` → `NlSideNavUser` with `minimized` |

#### API

```tsx
import { NlSideNav } from '@northline/ui';

<NlSideNav
  logo={<Logo />}
  items={[
    { icon: 'person', label: 'Members', href: '/members' },
    { icon: 'check_circle', label: 'Rewards', pages: [{ label: 'All rewards', href: '/rewards' }] },
  ]}
  currentHref={pathname}
  user={{ name: 'Member 0042', email: 'm0042@example.test', menu: accountRows }}
/>
```

Props: `items`, `currentHref?`, `variant?`, `logo?`, `user?`, `minimized?`, `defaultMinimized?`, `onMinimizedChange?`, `aria-label?`, `className?`, native `nav` attributes. `'use client'` (state, effects).

#### Tokens used

`Size-240` (new), `Size-48`, `Size-80`; `Space-XS`, `Space-L`, `Space-XL`, `Space-3XL`; `bg-secondary`; `Breakpoint-1280`; `--nl-duration-slow`, `--nl-ease-standard`; the parts' own (`NlNavItem`, `NlSideNavUser`, `NlButton`).

Checked in Chrome: axe clean in every brand and theme, at rest, with the user menu open and (minimized) with a section's pages menu open; 272 wide at 1440 and 80 at 1100 (breakpoint).

### NlBulkActionBar

**Level** Molecule (contains `NlButton`, L1; `NlMenu`, L0; menu rows `NlListItem` are slot content, D15) · **Base** none · **Depends on** `NlButton`, `NlMenu`, `NlListItem` · **Public** (also placed by `NlTable` through `bulkActions`)

Specified by the designer, 24 Nov 2026 (D21). A floating pill for acting on the selected items at once.

#### Anatomy

```
NlBulkActionBar (region "Bulk actions", horizontal)
├── Clear selection: NlButton tertiary, inverse, icon only (close)
├── count: "{n} selected"
├── actions: NlButton × up to 7, each with a leading icon (normal first, destructive last)
└── More actions: NlButton tertiary, inverse, icon only (more_vert) → NlMenu (action) of NlListItem, with icons
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Count | number | `count` (the selected items on the page; no "select all matching") |
| Clear | callback | `onClear` |
| Actions | list | `actions: { label, icon, onSelect, tone?: 'normal' \| 'destructive', disabled? }[]` |
| Name | text | `aria-label`, default "Bulk actions" |

#### Sizes and layout

- The pill: `Size-48` high, `Radius-M` (12, designer's choice), padding `Space-XS`, parts `Space-M` apart, actions `Space-XS` apart. Hugs its content, never wider than its container.
- Buttons are `size="small"` with a leading icon.
- Up to 7 actions show, fewer when they don't fit the container (measured, and again on resize); the rest go into the More actions menu. Destructive actions always show, after the others, and never go into the menu.
- Placement is the container's: `NlTable` puts it after its footer, sticky `Space-3XL` above the bottom of the scrolling panel, centred. It floats over the rows and never moves the page; at rest it sits below the footer.

#### Colours

| Part | Token |
|---|---|
| Pill | `bg-direct`, `--nl-shadow-menu` |
| Count | `text-inverse`, `Label M` |
| Clear, normal actions, More | `NlButton variant="tertiary" contentTone="inverse"` |
| Destructive actions | `NlButton tone="destructive" variant="primary"`: solid `bg-action-destructive`, white text (6.22:1). A tertiary destructive button is under 3.1:1 on `bg-direct` in both themes, so it isn't used |

#### States

Shown while `count > 0` (the container decides). Appears with a slide up by `Space-XL` and a fade over `--nl-duration-base`, standard ease; fade only under reduced motion. Disabled actions as `NlButton`.

#### Behaviour and accessibility

- A `role="region"` named "Bulk actions". It never takes focus by itself; it comes after the table in the tab order.
- The count isn't announced by the bar: `NlTable` already announces "{n} selected".
- Clear selection: "Clear selection". In `NlTable` it empties the selection and focus moves to the select-all checkbox.
- More actions: `aria-haspopup="menu"`, `aria-expanded`, opens `NlMenu kind="action"` above the button (`top-start`); choosing a row closes it and runs the action.
- The measuring row (every button at its natural width) is `aria-hidden`, `inert` and invisible.

#### Spec → code

| Spec option | Code |
|---|---|
| Pill | `<div role="region">`: `nl:h-48 nl:rounded-m nl:bg-direct nl:p-xs nl:gap-m nl:shadow-menu`, `nl:animate-bulk-bar-in` / `nl:motion-reduce:animate-bulk-bar-fade` (named utilities in `tailwind.css`) |
| Count | `<p>` `nl:text-label-m nl:text-inverse`, one line |
| Actions | Normal: `NlButton variant="tertiary" contentTone="inverse" size="small" icon="leading"`; destructive: `tone="destructive" variant="primary"` |
| Fitting | `MAX_VISIBLE = 7` minus the destructive ones; a layout effect and `ResizeObserver` on the container fit as many as the width allows; first render shows the maximum |
| More | `NlButton` `more_vert` + `NlMenu kind="action" placement="top-start"` of `NlListItem role="menuitem" icon size="small" density="compact"` |

#### API

```tsx
import { NlBulkActionBar } from '@northline/ui';

<NlBulkActionBar
  count={3}
  onClear={clear}
  actions={[
    { label: 'Export', icon: 'download', onSelect: exportRows },
    { label: 'Suspend', icon: 'block', tone: 'destructive', onSelect: suspend },
  ]}
/>
```

Props: `count`, `onClear`, `actions`, `aria-label?`, `className?`, native `div` attributes. `'use client'` (state, refs, measuring).

#### Tokens used

`Size-48`; `Radius-M`; `Space-XS`, `Space-M`, `Space-XL` (slide), `Space-3XL` (placement in `NlTable`); `bg-direct`, `text-inverse`; `--nl-shadow-menu`, `--nl-z-sticky`; `--nl-duration-base`, `--nl-ease-standard`; the parts' own (`NlButton`, `NlMenu`, `NlListItem`).

### Charts: shared rules

_Drafted by Claude Code and decided by the designer, 24 Nov 2026 (OD-246 to OD-260; no reference library for charts). Applies to `NlChartTooltip`, `NlChartLegend`, `NlChartFrame`, `NlLineChart`, `NlBarChart` and `NlDonutChart`._

- **Entry point.** `@northline/ui/charts`; `recharts` (pinned at 3.10.1, OD-249) and `react-is` are optional peer dependencies. Every chart file is `'use client'`.
- **Colours.** Only the `chart-*` tokens (§3.3, D9). Series take `chart-series-1` (the brand) to `chart-series-7` in order: brand, orange, cyan, violet, magenta, grey, yellow (yellow last, as it is just over 3:1 in Light, OD-247). Recharts gets `var(--nl-chart-…)` strings only; a test fails any other colour.
- **Numbers.** Formatted by the page or by the chart's `formatValue(value) => string` (default: whole numbers with a comma every three digits, "12,480"; no locale formatting during render, §7.4). Full dates use `DD/MM/YYYY` (`dateFormat.ts`). Months (OD-252): the time axis shows short month names ("Mar"), with the year on the first tick and on every January ("Jan 2027"); the tooltip and the table show "Mar 2026". Month names come from an English names list, as `NlCalendar`'s. Large single numbers (the donut total) use `Data L` or `Data M`; axis, tooltip and legend numbers use `Data S` (12/18, weight 500, tabular figures, OD-250).
- **Axis labels.** One line, never rotated. Category labels longer than their slot are cut with an ellipsis; the full text is in the tooltip and the table view. Horizontal bars: category labels in a `Size-120` column, cut with an ellipsis. Value axis: 5 ticks on round numbers, starting at 0. Time and category axes: as many ticks as fit with at least `Space-XL` between labels, first and last always shown (OD-251).
- **Never colour alone.** Every chart has a legend (except a single series, where the title names it), and lines carry markers in a different shape per series (circle, square, triangle, diamond, then repeating with a hollow fill, OD-256). The tooltip and table view name every value.
- **Accessible name.** `title` is required. The plot is `role="group"` with `aria-roledescription="chart"`, named by the title; an optional `description` adds a one-line summary (`aria-describedby`). The table view is the full screen reader route (OD-254).
- **Keyboard.** The plot is one tab stop. Left and Right (donut: also Up and Down) move between points, categories or slices; the tooltip shows for the focused item and its text is announced politely; Home and End go to the first and last; Escape hides the tooltip. Recharts' accessibility layer for line and bar charts, our own handling for the donut and for Home, End and Escape (OD-253).
- **View as table.** Every chart can show the same data as an `NlTable` (through `NlChartFrame`, OD-246): one row per category or date, one column per series, values formatted as in the chart.
- **Motion.** Lines draw in, bars grow and slices sweep over `--nl-duration-slow` with Recharts' named easing `ease-out`, the nearest to `--nl-ease-standard` (Recharts takes named easings only, OD-255). Off under `prefers-reduced-motion`.
- **States.** Through `NlChartFrame`: loading (a skeleton the size of the chart), empty ("No data for this period") and error (with Try again).
- **Responsive.** The chart fills its container's width and keeps its height (`height`: `Size-240` or `Size-320`, default `Size-320`).
- **Highlight.** The hovered or focused mark: line points get a `chart-highlight` ring (2px, with a 2px gap in the background colour); bars and slices get the same ring; a time or category gets a `chart-cursor` band behind it (bars) or a 1px `chart-axis` line (lines).

### NlChartMarker

**Level** Atom L0 · **Base** none · **Depends on** – · **Internal** (used by `NlChartTooltip`, `NlChartLegend` and line points; designer, 24 Nov 2026)

A series marker: one SVG shape in the series' chart colour, so series differ by shape as well as colour (OD-256).

| Option | Values | Prop |
|---|---|---|
| Series | 1 to 7 | `series` (picks the colour, and the shape unless `shape` is given), also `data-series` |
| Shape | the series' own: circle, square, triangle, diamond, then the same hollow for series 5 to 7; or forced | `shape?: 'circle' \| 'square' \| 'triangle' \| 'diamond'` (bars and slices: `square`, always filled), also `data-shape` |
| Size | `Size-8` (tooltip, line points), `Size-12` (legend) | `size`, default `'8'` |

- Filled: `fill-chart-series-n`. Hollow: no fill, a 1.5 outline in `stroke-chart-series-n`, inside the box. Square corners round slightly (artwork, a 12 × 12 viewBox).
- Always `aria-hidden` and never focusable; the name next to it carries the meaning. Presentational, no `'use client'`.

### NlChartTooltip

**Level** Atom L1 (`NlChartMarker` and text) · **Base** none · **Depends on** `NlChartMarker` · **Public** (in `@northline/ui/charts`)

**Open items**: none. OD-250 and OD-253 decided.

The box that shows the values at the hovered or focused point.

#### Anatomy

```
NlChartTooltip
├── heading: the category or date
├── row × series: marker · series name · value
└── total row (stacked bars only), set apart by `Space-XS` more space (no divider, designer, 24 Nov 2026)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Heading | text | `heading` |
| Rows | data | `items: { name, value (formatted), series (1 to 7), shape? }[]` |
| Total | optional | `total?: string`, `totalLabel?` (default "Total") |

#### Sizes and layout

- Padding `Space-M` top and bottom, `Space-L` sides; rows `Space-XS` apart; `Radius-S`; at most `Size-240` wide, names cut with an ellipsis, values never cut.
- Row: `NlChartMarker` (`Size-8`) · name (`Body S`, `Space-S` after the marker) · value (end-aligned, `Data S`, at least `Space-XL` from the name).
- Heading `Label S`. Total row: "Total" (or `totalLabel`) and the value (`Data S`), `Space-XS` more space above it, no divider (designer, 24 Nov 2026).
- Placed by Recharts next to the point, kept inside the chart area; `--nl-z-tooltip`; `--nl-shadow-menu`.

#### Colours

| Part | Token |
|---|---|
| Box | `chart-tooltip-bg` |
| Heading, names, values | `chart-tooltip-text` |
| Markers | the series' `chart-series-n` |

#### States

Hidden; shown for the hovered or keyboard-focused item. Fades in over `--nl-duration-base`; none under reduced motion.

#### Behaviour and accessibility

- Never focusable and never the only place a value lives (the table view has every value).
- Its text is also put in the chart's polite live region when the item changes by keyboard, so it is announced ("03/2026: Members 1,204, New members 96").

### NlChartLegend

**Level** Atom L1 (`NlChartMarker` and text) · **Base** none · **Depends on** `NlChartMarker` · **Public** (in `@northline/ui/charts`)

**Open items**: none. OD-257 decided (no click to hide a series in v1).

#### Anatomy

```
NlChartLegend (list)
└── item × series: marker · label · value (optional, donut)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Items | data | `items: { label, series (1 to 7), value? }[]` |
| Kind | line, block | `kind`, default `line`, also `data-kind` (line charts: a line with the shape; bars and slices: a square) |
| Position | below (default), end | `position`, also `data-position` (end: a column beside a donut) |
| Interactive | off in v1 (OD-257) | – |

#### Sizes and layout

- Below: a wrapping row, items `Space-XL` apart, rows `Space-S` apart, `Space-L` under the plot. End: a column, items `Space-M` apart.
- Item, `Space-S` apart (designer, 24 Nov 2026): marker (line charts: a `Size-16` line, 2px (`Size-2`) thick and rounded, with the series' `Size-8` `NlChartMarker` on top; bars and slices: a `Size-12` square `NlChartMarker`) · label (`Body S`, cut with an ellipsis at `Size-240`) · value (donut: value and share, "312 · 26%", `Data S`).

#### Colours

| Part | Token |
|---|---|
| Markers | `chart-series-n` |
| Labels | `chart-axis-text` |
| Values | `text-primary` |

#### Behaviour and accessibility

- A `<ul>` named "Legend" (`aria-label`); each item reads its label (and value). Markers are decorative (`aria-hidden`). The chart places it `Space-L` under the plot or beside it. Presentational, no `'use client'`.

### NlChartFrame

**Level** Organism (contains `NlEmptyState`, molecule; `NlSkeleton`, `NlButton`, `NlSegmentedButton`, `NlTextBlock`) · **Base** none · **Depends on** `NlTextBlock`, `NlSegmentedButton`, `NlSkeleton`, `NlEmptyState`, `NlButton` · **Public** (in `@northline/ui/charts`)

**Open items**: none. OD-246, OD-258 and OD-259 decided.

The chart area: a title, the "View as table" switch, and the loading, empty and error states. The chart and its table are slots (D15, OD-246).

#### Anatomy

```
NlChartFrame (section, named by the title)
├── header: NlTextBlock headline-small (title, description) · NlSegmentedButton (Chart | Table)
└── body (chart height): chart slot | table slot | state
    ├── loading: five NlSkeleton rect bars spread down the chart's height (designer, 24 Nov 2026)
    ├── empty: NlEmptyState small, `bar_chart` icon, "No data for this period", "Try a different date range."
    └── error: NlEmptyState small, `error` icon, "This chart couldn't load", "Something went wrong while loading the data." + NlButton primary small "Try again" (`refresh`)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Title, description | text | `title`, `description?`, `headingAs` (default `h2`) |
| State | ready, loading, empty, error | `status`, default `ready`, also `data-status` |
| Retry | callback | `onRetry` (error state) |
| Height | `Size-240`, `Size-320` | `height`, default `'320'` |
| Chart | slot | `children` (an `NlLineChart`, `NlBarChart` or `NlDonutChart`) |
| Table | slot | `table` (an `NlTable` of the same data); without it, no switch |
| View | chart, table | `view` / `defaultView`, `onViewChange` |
| Look | card (default), plain | `variant`, default `card` (OD-258) |

#### Sizes and layout

- Header: title (`NlTextBlock type="headline-small"`, designer, 24 Nov 2026) start, switch end, `Space-L` under it. While loading, empty or in error the switch is hidden but keeps its space (`invisible`, `aria-hidden`, `inert`), so the header doesn't change height (designer, 24 Nov 2026). Switch: `NlSegmentedButton size="xsmall"`, "Chart" (`bar_chart`) and "Table" (`table`), icons added to `nlIcons` (OD-259).
- Body keeps the chart's height in every state, so the dashboard doesn't jump; the table view scrolls inside that height.
- Card (default, OD-258; plain has no fill, border or padding): `bg-primary`, 1px `border-subtle`, `Radius-M`, padding `Space-3XL`.

#### States

Ready (chart or table), loading (`aria-busy`), empty, error. Empty and error use `NlEmptyState size="small"` with `live` so the change is announced.

#### Behaviour and accessibility

- A `<section>` named by the title (`aria-label`), `aria-busy` while loading. The switch is named "View as" and keeps the choice per frame (`view` / `defaultView`, `onViewChange`). `'use client'` (view state).
- Switching to the table moves no focus; the table's caption repeats the chart title.

### NlLineChart

**Level** Molecule (Recharts, `NlChartTooltip`, `NlChartLegend`) · **Base** none · **Depends on** `NlChartTooltip`, `NlChartLegend` · **Public** (in `@northline/ui/charts`)

**Open items**: none. OD-250 to OD-256 decided.

One or more series over time (member growth).

#### Anatomy

```
NlLineChart
├── plot: grid · value axis (start) · time axis (bottom) · line × series (with markers) · cursor line
├── NlChartTooltip
└── NlChartLegend (two or more series)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Data | rows | `data: Record<string, number \| string>[]`, `xKey` (an ISO date or category) |
| Series | 1 to 7 | `series: { key, label }[]`; colours follow the order |
| Markers | always (v1, OD-256) | always on |
| Curve | straight (proposed), smooth | `curve`, default `linear` |
| Formatting | functions | `formatValue?`, `formatX?` |
| Name | text | `title` (required), `description?` |
| Height | `Size-240`, `Size-320` | `height` |

#### Sizes and layout

- Lines 2px, markers `Size-8`; grid horizontal only, 1px `chart-grid`; value axis without a line, time axis with a 1px `chart-axis` line; ticks as the shared rules.
- Plot margins: `Space-M` top and end, axis labels outside the plot.

#### Colours

Series `chart-series-1…7`; grid `chart-grid`; axis line `chart-axis`; axis text `chart-axis-text`; cursor line `chart-axis`; highlight `chart-highlight`.

#### States

Default; hovered or focused point (cursor line, highlight rings on every series' point at that time, tooltip). Loading, empty and error come from `NlChartFrame`.

#### Behaviour and accessibility

As the shared rules: Left and Right move by time step; each step announces the date and every series' value.

### NlBarChart

**Level** Molecule · **Base** none · **Depends on** `NlChartTooltip`, `NlChartLegend` · **Public** (in `@northline/ui/charts`)

**Open items**: none. OD-250 to OD-256 and OD-260 decided.

Vertical or horizontal bars, single, grouped or stacked (points earned vs redeemed by month; top rewards).

#### Anatomy

```
NlBarChart
├── plot: grid · value axis · category axis · bars (by category; grouped side by side or stacked) · cursor band
├── NlChartTooltip
└── NlChartLegend (two or more series)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Orientation | vertical, horizontal | `orientation`, default `vertical`, also `data-orientation` |
| Layout | single, grouped, stacked | `layout` (single when one series), also `data-layout` |
| Series | grouped up to 3, stacked up to 5 (OD-260) | `series: { key, label }[]` |
| Value labels | off, on | `showValues?` (on: the value at the end of each bar, single layout only) |
| Data, formatting, name, height | as `NlLineChart` | `data`, `xKey`, `formatValue?`, `formatX?`, `title`, `description?`, `height` |

#### Sizes and layout

- Bar corners `Radius-XS` at the free end only (stacked: the outermost segment); bars in a group `Space-XXS` apart; groups take 60% of their slot (OD-260).
- Horizontal: category labels in a `Size-120` column, cut with an ellipsis; vertical: as the shared rules.
- Grid lines across the value axis only.

#### Colours

As `NlLineChart`; the cursor is a `chart-cursor` band behind the hovered group.

#### States

Default; hovered or focused category (cursor band, highlight ring on the hovered bar, tooltip; stacked: tooltip has a total). Frame states as above.

#### Behaviour and accessibility

Left and Right (horizontal: Up and Down) move by category; each step announces the category and every series' value.

### NlDonutChart

**Level** Molecule · **Base** none · **Depends on** `NlChartTooltip`, `NlChartLegend` · **Public** (in `@northline/ui/charts`)

**Open items**: none. OD-248, OD-250, OD-253 and OD-255 decided.

Parts of a whole, up to 5 slices (members by tier).

#### Anatomy

```
NlDonutChart
├── ring: slice × up to 5 (2px gaps in the background colour)
├── centre: total (Data L) and its label (Body S)
├── NlChartTooltip
└── NlChartLegend (end or below, with value and share)
```

#### Variants and options

| Option | Values | Prop |
|---|---|---|
| Slices | 1 to 5 | `data: { key, label, value }[]` |
| Colours | series order, never the tier tones (OD-248) | – |
| Order | by value (largest first) or data order | `sortBy: 'value' \| 'data'`, default `value` (designer, 24 Nov 2026); members by tier uses `data`, so tiers stay Bronze, Silver, Gold, Platinum |
| Centre | total and label | `totalLabel` (default "Total"); the total is the sum, through `formatValue` |
| Legend | end (default when wide enough), below | `legendPosition` |
| Name, formatting, height | as the others | `title`, `description?`, `formatValue?`, `height` |

#### Sizes and layout

- The ring fills the height; ring width 25% of the radius; slices start at 12 o'clock and go clockwise, in `sortBy` order.
- Shares are whole percentages that add to 100 (largest remainder), shown in the legend and tooltip.

#### Colours

Slices `chart-series-1…5` in order (OD-248); gaps the background; centre total `text-primary`, label `chart-axis-text`; highlight ring `chart-highlight`.

#### States

Default; hovered or focused slice (pulled out by `Space-XS` and ringed, tooltip with value and share). Frame states as above.

#### Behaviour and accessibility

Left and Right (and Up and Down) move between slices; each announces "Gold: 312 members, 26%". With more than 5 slices the chart shows the largest 4 and groups the rest as "Other", always last (designer, 24 Nov 2026).


---

## 10. Decisions and known issues

| # | Date | Decision |
|---|---|---|
| D1 | 17 Nov 2026 | Public demo with fictional brands. No real company, client or product names anywhere |
| D2 | 17 Nov 2026 | No Figma file. The token JSON, in TokensBrücke shape, is the source of values |
| D3 | 17 Nov 2026 | One primary colour per brand. Secondary and tertiary can be added later in the alias layer |
| D4 | 17 Nov 2026 | `Primary light` alias group added, because Voltic needs a darker Light step than the other brands |
| D5 | 17 Nov 2026 | Info has its own scale, so info stays blue in every brand |
| D6 | 17 Nov 2026 | One shared grey (`Neutral`) for all brands. No per-brand neutral groups for now |
| D7 | 17 Nov 2026 | Alert text uses 700 (warning 800) and icons 600 (warning 700) on the 100 tints. Solid alert fills use 600 with white text. Solid warning uses 500 with dark text |
| D8 | 17 Nov 2026 | No "text on primary" token. The future colour picker rejects colours that fail with white text |
| D9 | 17 Nov 2026 | Chart tokens are deferred to the dashboard stage. **Closed 24 Nov 2026:** chart tokens added (§3.3 Chart): `chart-series-1` follows the brand primary, series 2 to 7 are a fixed set (orange, cyan, violet, magenta, grey, yellow) from new primitive scales, plus grid, axis, tooltip, cursor, highlight and status tokens; `Data S` text style. Charts ship in `@northline/ui/charts` with Recharts 3.10.1 (OD-246 to OD-260) |
| D10 | 17 Nov 2026 | React components that run in Next.js. Tailwind CSS 4 for styling from the start |
| D11 | 17 Nov 2026 | Component specs extracted once from the designer's reference library, outside this repo, as neutral specs. Spacing, radius, type and shadow scales match the reference system so the specs map one to one |
| D12 | 17 Nov 2026 | Buttons follow the reference system. `NlButtonBase`, `NlWhiteButton` and `NlDestructiveButton` are internal bases. `NlButton` is the only public button, with `tone` (normal, white, destructive), `variant` (primary, secondary, tertiary, link), `size` and `icon` (none, leading, trailing, only-icon). Link is normal tone only, with no icon-only form. Destructive has a tertiary variant. Tertiary buttons take a `contentTone` (inverse, primary, secondary, info, success, error, warning) for snackbars, banners and close buttons. The large size uses `Button XL`. No separate icon button Built on `NlButtonBase` (18 Nov 2026): `NlWhiteButton` and `NlDestructiveButton` render `NlButtonBase` with a fixed `appearance` instead of copying its markup. Exception (19 Nov 2026, OD-40): `NlNotificationButton` is its own native button, because its 40 filled circle matches no `NlButton` size or look. |
| D13 | 17 Nov 2026 | Left out of the demo: one-time code input, profile image, avatar group, the "with text" progress and spinner versions, labels on radio and switch, and the reference library's unused pages (notes, image ratios, tabs) |
| D14 | 17 Nov 2026 | Menu and calendar are their own components. Select and date fields use them, so they sit at the level the composition rule gives them |
| D15 | 17 Nov 2026 | Slot content doesn't count toward a component's level (§7.1). `NlTextBlock` takes its label as a slot. Table toolbar, header row, row and footer are internal parts of `NlTable`. `NlAppShell` takes nav, header and content as slots |
| D16 | 17 Nov 2026 | Border widths use Tailwind's 1px and 2px utilities (§4.2). New z-index scale (§4.3) and a pulse duration for skeletons (§5) |
| D17 | 17 Nov 2026 | Token file (S0). Colours stay hex strings, as TokensBrücke exports them. Alpha tokens are an alias reference plus the opacity in `$extensions["com.northline.alpha"]`, applied by the token build. White and black primitives sit at `Primitives.Colors.base.white` and `.black`. Decimal line heights use an underscore in their names (`Line Height-62_4`). Two contrast results are accepted: `text-action` on `bg-active-hover` in Voltic (a chip hover state only), and `border-warning` as a decorative outline beside text, never a control's only outline. Hover and pressed states aren't flagged in contrast audits |
| D18 | 22 Nov 2026 | Required fields on pages. Pressing a form's main button with required fields left empty puts each empty field in `error`, with an error helper text (with its leading icon, as `NlHelperText` draws it in error) saying what to enter. Focus moves to the first empty field. A field's error clears once it has a value. Native browser bubbles are off (`noValidate`); fields keep `required` |
| D19 | 22 Nov 2026 | Smaller corners (designer's choice). Buttons: large and medium `Radius-S` (8), small and xsmall `Radius-XS` (4). Input fields (`NlInputBase`) and text area (`NlTextAreaBase`) `Radius-XS`. Chips (`NlChipBase`) `Radius-XS`. Side nav rows (`NlNavItem`, `NlNavSubItem`, and the `NlSideNavUser` row through `NlListItemBase` nav) `Radius-S`. `NlStatCard` `Radius-S`. `NlSegmentedButton` track `Radius-S` at every size; segments inside the padded medium and small tracks `Radius-XS`, xsmall segments `Radius-S`. The side nav tree line keeps its `Radius-S` curve |
| D20 | 24 Nov 2026 | Member tier colours (designer's choice). `NlBadge` gets four tier tones, `bronze`, `silver`, `gold`, `platinum`: identity, not status. Each is a light 135° gradient (`bg-tier-*_start` step 50 → `bg-tier-*_end` step 200) with a step 300 inside border and step 800 text and icon. The same in Light and Dark, and in every brand (alias group `Colors.Tier`). New primitive scales `bronze` and `platinum`; silver uses `grey`, gold uses `yellow`. The gradients are named utilities in `tailwind.css` (`nl:tier-gradient-*`). Text is 6.79:1 or more on every gradient; the borders are decorative (as `border-warning`, D17) |
| D21 | 24 Nov 2026 | Bulk actions (designer's choice): `NlBulkActionBar`, a floating `bg-direct` pill (not a full-width bar), `Radius-M` corners (12). Counts only what's selected on the page (no "select all matching"). Up to 7 actions show, as many as fit, then a More actions menu. Every action has a leading icon. Destructive actions use the destructive tone as a solid button (white text on `bg-action-destructive`), always show and come last. `NlTable` places it through `bulkActions`. Icons `block`, `download`, `swap_horiz` added |

Known issues

| # | Issue | Status |
|---|---|---|
| K1 | The grey scale has two light steps, so `bg-tertiary`, `bg-neutral`, `bg-icons` and `bg-disabled` share Neutral-100 in Light. A grey-25 step would separate them | Open |
| K2 | `text-white_subtle` (Neutral-100) on `bg-brand` is under 4.5:1 in Northline Dark (3.82), Garnet Dark (3.49) and Voltic (4.23, both themes). Found by `pnpm test:a11y` (S6). Accepted for now; decide when a component uses this pairing | Open |
| K3 | `text-disabled` on `bg-primary` is under 4.5:1 (3.00 Light, 1.79 Dark, every brand). By design: WCAG 1.4.3 exempts text that is part of an inactive control (a disabled list row, checkbox or menu item). axe can't tell from plain text, so story samples of disabled text are marked `data-a11y-known-issue="K3"`. Found by `pnpm test:a11y` with `NlTextBlock`. Accepted by the designer, 18 Nov 2026 | Accepted |
| K4 | The disabled `NlBadge` tone's text (`text-disabled-on_bg` on `bg-disabled`) is under 4.5:1 (3.53 Light, 1.60 Dark, every brand). A disabled badge is a status, not an inactive control, so WCAG 1.4.3's exemption doesn't strictly apply. Kept as specified; the label must say the status. Story samples are marked `data-a11y-known-issue="K4"`. Found with `NlBadge`. Accepted by the designer, 18 Nov 2026 | Accepted |
| K5 | A disabled `NlInputChip`'s label (`text-disabled-on_bg` on `bg-disabled`) is under 4.5:1 (about 3.5 Light, 1.6 Dark, every brand). By design: WCAG 1.4.3 exempts text that is part of an inactive control. axe can't tell, because the chip is a `<span>` (its remove button is left out when disabled), so story samples are marked `data-a11y-known-issue="K5"`. Found by `pnpm test:a11y` with `NlInputChip`. Accepted by the designer, 19 Nov 2026 | Accepted |
| K6 | The calendar range band (`bg-active`) against `bg-primary` is 1.16 to 1.19 in Light and 1.00 to 1.06 in Dark (every brand), so in Dark the band behind range-middle days is close to invisible. The filled range-start and range-end days still show the range, and the cells carry `aria-selected`. Kept as specified. Found with `NlCalendarDay` (#15). Accepted by the designer, 19 Nov 2026 | Accepted |
| K7 | The `NlRowsPerPage` label (`text-tertiary`, Body S) on `bg-tertiary` (hover, pressed, open) is 4.47:1 in Dark, every brand, under 4.5:1 (5.51 at rest; Light 7.73). Kept as specified. Open samples are marked `data-a11y-known-issue="K7"`. Found with `NlRowsPerPage` (#37). Accepted by the designer, 20 Nov 2026 | Accepted |
| K8 | The `NlTableHeaderCell` title (`text-tertiary`, Label M) on the grey header (`bg-tertiary`) is 4.46:1 in Dark, every brand, under 4.5:1 (Light 7.73; plain header 6.36 in Dark). The same pair as K7. Kept as specified. Grey samples are marked `data-a11y-known-issue="K8"`. Found with `NlTableHeaderCell` (#66). Accepted by the designer, 20 Nov 2026 | Accepted |
| K9 | The resting field label (`text-placeholder`, Body L) on the field hover fill (`bg-secondary`) is 4.17:1 in Light, every brand, under 4.5:1 (4.87 not hovered; Dark 5.51). Every `NlInputBase` field, only while hovering an empty field. The static a11y check doesn't hover, so no sample is marked. Kept as specified. Found with `NlSelect` (#70). Accepted by the designer, 20 Nov 2026 | Accepted |

---

## 11. Changelog

| Date | Change |
|---|---|
| 17 Nov 2026 | First draft. Token plan, architecture and setup tasks |
| 17 Nov 2026 | `Button XL` text style added (§3.4). D12 updated: link variant, destructive tertiary, `contentTone` |
| 17 Nov 2026 | `Size-320` added to `Primitives.Sizes` (§3.5), for the rich tooltip's maximum width |
| 17 Nov 2026 | S-1: 78 components added to §8.1 to §8.4 and their specs to §9. Open items tracked in `docs/DEPENDENCIES.md` |
| 17 Nov 2026 | S0: `tokens/design.tokens.json` (425 tokens) and `docs/TOKEN_AUDIT.md`. D17 records the token file decisions. S-1 and S0 approved |
| 17 Nov 2026 | S1: pnpm 12 workspaces (`@northline/tokens`, `@northline/ui`, `apps/storybook`), Node 24, TypeScript 6.0.3 strict, Vite 8 library build with `preserveModules` and a `'use client'` check, ESLint, Stylelint, Prettier, `pnpm scrub` and a pre-push hook that runs it |
| 18 Nov 2026 | S2: token build with Style Dictionary 5.8 (`packages/tokens/build.ts`). CSS variables per layer, brand and theme, Alpha tokens as `color-mix`, TypeScript constants and the Tailwind 4 theme. Utility names per group added to §3.8. Tests: every token in the CSS, every semantic token and text style resolved in 3 brands × 2 themes, and the Tailwind utilities |
| 18 Nov 2026 | S3: `packages/tokens/src/styles.css` with shadows (black from `--nl-palette-black` via `color-mix`), layers, grid (`--nl-grid-columns`, `--nl-grid-gutter`, `--nl-grid-margin`) and motion. Reduced motion sets every duration to 0ms. Tests check every value against §4.1, §4.3 and §5 |
| 18 Nov 2026 | S4: self-hosted fonts through `@fontsource` (Inter, IBM Plex Sans, Space Grotesk; 400 to 700; Latin and Latin Extended) and `material-symbols` (Rounded). `packages/ui/src/styles/` holds `index.css`, `fonts.css`, `tailwind.css` and `reset.css`; the build writes `dist/index.css` with the font files beside it. Page default: Body M, `text-primary` on `bg-primary`; `color-scheme` follows the theme. Data L and Data M use tabular figures (S2) |
| 18 Nov 2026 | S5: Storybook 10.6 (`@storybook/react-vite`, a11y and docs addons) with a Brand and Theme toolbar that sets `data-brand` and `data-theme` on `<html>`. Foundations pages: Token pipeline, Colours (primitives, aliases, semantic tokens), Typography, Spacing and sizes, Radius, Shadows, Layers, Motion, Icons. Approved by the designer, including the §3.8 utility names, the documentation-only dynamic class on the Token pipeline page, and Northline and Light as the `:root` defaults |
| 18 Nov 2026 | S6: Vitest, Testing Library and jsdom in `@northline/ui`. `pnpm test:a11y` runs axe (WCAG 2.2 AA) on every story in 3 brands × 2 themes; contrast skips anything inside `data-a11y-state="hover"` or `"pressed"` (D17) and accepted known issues marked `data-a11y-known-issue`. ESLint is type-aware, and `scripts/lint/` adds the CLAUDE.md rules: `nl:` prefix, theme classes only, no arbitrary values, `!`, `dark:` or raw colours and pixels, no `outline-none` beside a focus ring width, whole literal class strings. Each rule has tests. Found and accepted K2 |
| 18 Nov 2026 | S7: `apps/nextjs-check`, a Next.js 16 App Router app (outside the pnpm workspace) that imports `@northline/ui/index.css` and sets `data-brand` and `data-theme` on `<html>` in the root layout. `pnpm nextjs-check` packs both libraries, installs the tarballs into a copy of the app with npm, runs `next build` and checks the CSS and fonts in the output. Must pass before every release |
| 18 Nov 2026 | S8: `vercel.json` builds Storybook (`pnpm build-storybook`) and serves `apps/storybook/storybook-static`; pnpm 12 through Corepack (`ENABLE_EXPERIMENTAL_COREPACK=1`), Node 24. Production: https://northline-design-system-blond.vercel.app. Every branch gets a preview (behind Vercel Authentication). Links added to CLAUDE.md and the README. Setup S-1 to S8 complete |
| 18 Nov 2026 | Contents list links to each section |
| 18 Nov 2026 | NlIcon (#1): Material Symbols Rounded glyphs by code point from the `nlIcons` registry (25 icons), sizes 16 to 64, 7 tones plus inherit, filled, optional label. `pnpm icons` subsets the font to the registry (5.3 MB to 19 KB). New token `Alias Typography.Icon.Font weight` (300) from primitive `Font Weight-300`; only groups with a font size are text styles. Approved by the designer |
| 18 Nov 2026 | NlStatusDot (#2): presence dot in five sizes (`Size-6` to `Size-24`, default medium), `fg-success` with a 1px `border-inverse` ring outside the diameter, optional label. Approved by the designer |
| 18 Nov 2026 | NlCountBadge (#3): count pill (1 to 99+) or dot, small and large, `error`, `warning` and `success` tones, optional label. Double digits keep the single-digit height with a minimum width (OD-4). Count 0 renders nothing. Approved by the designer |
| 18 Nov 2026 | NlDivider (#4): horizontal rule, `divider` (1px) or `section` (`Size-8`) in `border-default`; `<hr>` or a decorative hidden `<div>`. Section fill through the new `nl:bg-border-default` utility. Horizontal only (OD-5 open). Approved by the designer |
| 18 Nov 2026 | NlSkeleton (#5): `text`, `rect` and `circle` placeholders in `bg-neutral`, always hidden from screen readers. Pulse 100% → 60% per `--nl-duration-pulse` with `--nl-ease-standard` (OD-6) through the new `nl:animate-skeleton-pulse` utility; static under reduced motion. Width-only resizing; circle fixed at `Size-24` for now. Approved by the designer |
| 18 Nov 2026 | NlOverlay (#6): scrim on `--nl-z-overlay` with `Alpha-md`, always hidden from screen readers; `open` and `onClick`. Fades in and out in CSS (hidden = `display: none`), static under reduced motion. Motion utilities added to the token build: `nl:duration-*`, `nl:ease-standard`, and `nl:transition-*` defaults (§3.8). Approved by the designer |
| 18 Nov 2026 | NlProgressBar (#7): `small` (`Size-4`, default) and `large` (`Size-8`) bars, `fg-brand` fill on `bg-active-hover`, `role="progressbar"` named by `label` or `aria-labelledby`. Width animates with Duration base and Ease standard (OD-7), none under reduced motion; fill width through the new `nl:progress-fill` utility. OD-9 (indeterminate) open. Approved by the designer |
| 18 Nov 2026 | NlSlider (#8): native range input under a drawn track, fill and thumb; controlled or uncontrolled, `onChange(value)`, `min` 0 / `max` 100 / `step` 1 (OD-11). Hover, pressed, focus and disabled colours approved after the Storybook check (OD-10). Named variant `nl:range-thumb:` and utilities `nl:slider-fill` / `nl:slider-thumb`; the class check accepts `nl:group` / `nl:peer` markers. OD-12 open. Approved by the designer |
| 18 Nov 2026 | NlRadio (#9): native radio under a drawn `Size-20` ring and `Size-12` dot in a `Size-24` box, following the input through a named group. All eight state colours per the spec; round focus ring around the box. The token build now maps `fg-*` to border colours (§3.8). Approved by the designer |
| 18 Nov 2026 | NlSwitch (#10): native `<button role="switch">`, large (default) and small, handle inset `Space-XS`, slides with Duration fast and Ease standard (OD-13a, c, d). No hover or pressed colours (OD-13b). The token build now maps `border-*` to backgrounds (§3.8); the divider's one-off utility was removed. Approved by the designer |
| 18 Nov 2026 | NlTextBlock (#11): six heading types plus `label` (OD-14) and `body` (OD-41); `align`, label slot, `tone`, `headingAs` (OD-16) and `disabled` (OD-15). Known issue K3 accepted (disabled text contrast). The class check skips quoted object keys; the a11y check waits for the Storybook addon's axe run. OD-120 open. Approved by the designer |
| 18 Nov 2026 | NlMenu (#12): floating panel with sticky header and footer slots; `kind` action, select (`multiple`), filter, navigation with roles and keyboard (OD-19); positioned with the new dependency `@floating-ui/dom` (OD-18); `maxHeight` as a Size name (OD-20); `shadow-menu` (OD-17); fade (OD-21); `nlMenuTriggerProps` helper. Approved by the designer |
| 18 Nov 2026 | NlIconContainer (#20): an `NlIcon` centred on a `Radius-Full` tinted circle, sizes 40, 48 (default) and 64 with a 24 or 36 icon, seven tones (default `primary`), optional label. Fixed size with no padding (OD-45); defaults approved (OD-46). The circle sets the colour and the icon inherits it. K1 accepted for primary and disabled in Light. Approved by the designer |
| 18 Nov 2026 | NlAvatar (#21): photo, initials or icon in a `Radius-Full` circle with a 1px `border-subtle` inside, seven sizes (`Size-24` to `Size-96`, default `medium`), optional `NlStatusDot` bottom-right. Falls back from the photo to initials, then the icon. `person` added to the icon registry (OD-47, 26 icons); Storybook serves story-only artwork from `apps/storybook/public`. Approved by the designer |
| 18 Nov 2026 | NlBadgeBase (#22, internal): one-line tag with a label and optional leading and trailing icons, small (`Label S`, hugs to 26) and large (`Label M`, `Size-32` minimum height, OD-49). Colours come from the mapped component through `appearance` (badge and icon class strings); the 1px inside border is an inset ring so every tone is the same size. Approved by the designer |
| 18 Nov 2026 | NlBadge (#23): status tag mapped on `NlBadgeBase`, eight tones (default `neutral`, OD-53), small (default) and large (OD-51), optional icons off by default in the matching `fg-*` colour (OD-52). Known issue K4 accepted (disabled tone text contrast). Approved by the designer |
| 18 Nov 2026 | NlButtonBase (#24, internal): primary, secondary (2px inset ring), tertiary and link at rest; four sizes with fixed heights (`Size-56` to `Size-36`) and icon-only squares (`Size-56` to `Size-32`); leading, trailing and icon-only icons with a hidden label; `as` and `href` for links. `appearance` replaces the resting colours; standard focus ring in the base; `soft` left out until OD-40 (OD-1). Approved by the designer |
| 18 Nov 2026 | NlWhiteButton (#25, internal): the white button for brand backgrounds, built on `NlButtonBase` with a fixed `appearance` (`bg-action-inverse`, 1px inset ring `border-subtle`, `text-dark_both`, `fg-dark_both`); no markup or sizes of its own. §8 dependency changed to `NlButtonBase`; D12 updated. OD-54: white takes only `variant="primary"`, applied in `NlButton`. Approved by the designer |
| 18 Nov 2026 | NlDestructiveButton (#26, internal): primary (`bg-action-destructive`), secondary (2px inset ring `border-error`) and tertiary (`text-error`) at rest, built on `NlButtonBase` with a fixed `appearance` per variant; no link form. §8 dependency changed to `NlButtonBase`; D12 updated. Approved by the designer |
| 19 Nov 2026 | NlButton (#27, public): picks the base by tone; hover, pressed, expanded (pressed look) and disabled states for every tone and variant; tertiary content tones; disabled links lose `href` and get `aria-disabled`. Link underline on a new label span in `NlButtonBase`. OD-55 to OD-59 decided; `not-disabled:not-aria-disabled:` state selectors approved as a rule 9 exception. Approved by the designer |
| 19 Nov 2026 | NlCheckboxControl (#28, internal): native checkbox under a drawn Size-20 box in a Size-24 hit area; unselected, selected and indeterminate (`check` / `remove`, OD-60) with hover, pressed, disabled and focus (ring on the hit area, Radius-XS); indeterminate set through a ref. Approved by the designer |
| 19 Nov 2026 | NlSpinner (#29, public): SVG ring (4 stroke, artwork) turning once per Duration pulse, or a value arc; success (`check`) and error (`warning`) results; always-present status region announces the result. Spinner utilities in tailwind.css. OD-61 to OD-64 decided. Approved by the designer |
| 19 Nov 2026 | NlLabel (#30, public): Label M / Label S, `tone` (tertiary, primary, secondary, action; OD-50), optional `NlCountBadge` dot with `badgeTone` and required `badgeLabel` (OD-65), `as="label"` for form controls (OD-66). Approved by the designer |
| 19 Nov 2026 | NlChipBase (#31, internal): unselected, unselected-bordered and selected looks at rest; xsmall, small (default) and large (26, 33, 40 high); leading slot, trailing icon or `trailing` slot; `appearance` and `as` for the mapped chips. Approved by the designer |
| 19 Nov 2026 | NlFilterChip (#32, public): toggle button (`aria-pressed`) on `NlChipBase`, controlled or uncontrolled; off/on × enabled, hover, pressed, disabled and focus as in the spec; leading icon `fg-primary` off, `fg-brand` on. Approved by the designer |
| 19 Nov 2026 | NlAssistChip (#33, public): action or dropdown chip on `NlChipBase`; `popup`, `open`, `onOpenChange` (click toggles, Down arrow opens) to pair with `NlMenu`; open keeps its look on hover, pressed still shows. Approved by the designer |
| 19 Nov 2026 | NlInputChip (#34, public): chosen value on `NlChipBase` (bordered) with a native remove button (close 16/20 in a 24 target, Backspace and Delete remove, name "Remove {label}"); disabled has no remove button. K5 accepted. Approved by the designer |
| 19 Nov 2026 | NlSegment (#35, internal): native radio under drawn content; medium, small, xsmall (40, 32, 24; icon-only 36, 28, 24); filled icon when selected; OD-67 and OD-68 decided. Approved by the designer |
| 19 Nov 2026 | NlHelperText (#36, public): five tones (default `text-tertiary`, OD-43; error glyph `error`, OD-69), optional decorative icon centred on the first line (OD-70), described-by id. Approved by the designer |
| 19 Nov 2026 | NlNavIcon (#38, internal): decorative 20 icon, `fg-secondary`, or `fg-active` and filled when selected (OD-71). Approved by the designer |
| 19 Nov 2026 | NlTooltip (#40, public): single-line and rich tooltip, `role="tooltip"` described-by trigger, hover delay (OD-73), keyboard focus, Escape, hoverable transparent frame, floating-ui placement with flips (OD-74), `nl:tooltip-position` utility. Light box in Dark (`bg-direct`) accepted. Approved by the designer |
| 19 Nov 2026 | NlSegmentedButton (#41, public): radiogroup of 2 or 3 `NlSegment`s (OD-75), sizes 48/40/24, icon-only with `NlTooltip`, Home and End, disabled group. Disabled selected matches the track (noted, as specified). Approved by the designer |
| 19 Nov 2026 | NlCheckbox (#42, public): label row of `NlCheckboxControl` and `NlTextBlock type="body"`, hidden-label option, disabled text (K3). Approved by the designer |
| 19 Nov 2026 | NlNotificationButton (#43, public): own native 40 circle (OD-40, D12 exception) with the `notifications` icon (added to the registry, 27 icons) and an `NlCountBadge` dot or number; name carries the shown count. Approved by the designer |
| 19 Nov 2026 | NlInputBase (#44, internal): outlined field with a real floating label (CSS only, OD-42), large/small, leading, trailing, prefix, suffix, helper text in a polite live region (icon only for errors, OD-76), error and disabled; standard focus ring on errors (OD-44). Select type with #70; required marker open (OD-78). Approved by the designer |
| 19 Nov 2026 | NlTextField (#45, public): single-line input on `NlInputBase` with `inputType` (text, email, number, tel, url) and an optional decorative trailing icon (OD-79). The field hint text was removed from `NlInputBase` and `NlTextField`: focused and empty, the box shows only the floating label (designer's choice). Approved by the designer |
| 19 Nov 2026 | NlPasswordField (#46, public): password input on `NlInputBase` with a show/hide `NlButton` (tertiary, icon-only, xsmall, OD-80, OD-31), icons `visibility` / `visibility_off` (OD-81), fixed name "Show password" with `aria-pressed`, caret kept on switch. `NlInputBase`'s focus ring now follows its input only (`nl:input-focus:`), so a focused trailing button shows one ring. OD-78: no required marker. Approved by the designer |
| 19 Nov 2026 | NlSearchField (#47, public): `type="search"` on `NlInputBase` with a hidden label (default "Search") and placeholder text shown while empty, focused too; leading `search` icon; xsmall clear `NlButton` (`cancel`) while there is text (OD-82 to OD-84). Enter calls `onSearch`; Escape clears and stops when there is text. `NlInputBase` gained `hideLabel` and `placeholder`; `nl:search-cancel-none` hides the browser's clear button. Approved by the designer |
| 19 Nov 2026 | NlTextAreaBase (#48, internal): native `<textarea>` with a floating label and no hint text (designer's choice), `rows` (default 4 = 128, OD-85), vertical resize only (OD-86), label `text-tertiary` (OD-87 via OD-77); error, disabled and helper text as `NlInputBase`. Approved by the designer |
| 19 Nov 2026 | NlTextArea (#49, public): multi-line input on `NlTextAreaBase`, no placeholder, value `text-primary` (OD-88). Character count added to the base (OD-89): native `maxLength`, "120 / 500" at the end of the helper line (flush with the box end), limit in the description, polite announcements at 20, 10, 5 and 0 left. Approved by the designer |
| 19 Nov 2026 | NlCalendarDay (#15, internal): `gridcell` drawing the range band (`bg-active`, `Radius-S` on the outer logical corners) around a 40 × 40 native button named by the full date (`label`); seven types; `today` as a separate boolean (OD-27; no border on filled types, `border-disabled` when disabled); standard focus ring (OD-28); `aria-disabled` days stay focusable. K6 accepted (band near invisible in Dark). Approved by the designer |
| 19 Nov 2026 | NlListCaption (#16, internal): one-line trailing text for list rows; small, medium (default) and large; heavy (Label, default; designer's choice) and light (Body); `text-tertiary`, `text-disabled` when the row is disabled (OD-29). Approved by the designer |
| 19 Nov 2026 | NlNavSubItem (#17, internal): side nav page link (`as`, default `<a>`), Label M with an ellipsis and the full text as `title` when cut off; default, hover, pressed (K1) and current colours; standard focus ring (OD-30b); optional tree line under the section icon centre (OD-30a) through the `nl:nav-tree-line` and `nl:nav-tree-continue` utilities (rule 9). Approved by the designer |
| 19 Nov 2026 | NlPaginationItem (#18, internal): page number button ("Page 3", Label M, minimum `Size-32`, hugs long numbers, OD-32) or the "…" gap (one character, `aria-hidden`, OD-35); hover and pressed the same (OD-33); standard focus ring (OD-34); the current page keeps its look and doesn't select. Approved by the designer |
| 19 Nov 2026 | NlPageDot (#19, internal): decorative `Size-6` dot in `fg-placeholder`; the current page a `Size-24` pill in `fg-brand` (OD-36), `Radius-Full` (OD-37); width and fill ease with Duration base (OD-38); not interactive (OD-39, OD-72). Approved by the designer |
| 20 Nov 2026 | NlRowsPerPage (#37, public): table footer pill trigger (`aria-haspopup="listbox"`, `aria-expanded`), Body S label, Label S value, 24 arrow (up when open), `open` / `onOpenChange` for `NlTable`'s `NlMenu`; disabled. Label kept `text-tertiary`: K7 accepted (4.47:1 on `bg-tertiary` in Dark). Approved by the designer |
| 20 Nov 2026 | NlCalendar (#50, public): single date or range month grid; 6 weeks of `NlCalendarDay`, `NlLabel` weekday headers (`tone="secondary"`, OD-50), `NlButton` previous and next; one tab stop with roving focus and full keyboard; range preview; limits and unavailable dates; ISO dates in UTC; `names` instead of locale formatting; today read after hydration; `bg-primary` (OD-90). Approved by the designer |
| 20 Nov 2026 | NlListItemBase (#52, internal): shared list row, plain (divider) or filled (card), large or small, default or compact; leading and trailing accessories take any component; top label (`NlLabel` small, OD-149), extra icon 8 from the title (OD-150); hover and pressed only when actionable (OD-97, OD-151); divider stays `border-default` (OD-148); `as` for the mapped item's element. Approved by the designer |
| 20 Nov 2026 | NlListItem (#53, public): standard row on `NlListItemBase`; leading icon or avatar (medium), trailing `NlListCaption` and chevron; link, button, menu row or static; a chevron makes the whole row clickable (filled always); static rows no hover or focus (OD-98); `aria-current` from the page (OD-152); disabled per element (OD-153); `divider` and `body` exposed (OD-154, OD-155); name from the row's text (WCAG 2.5.3). Approved by the designer |
| 20 Nov 2026 | NlCheckboxListItem (#54, public): `<label>` row on `NlListItemBase` around `NlCheckboxControl`, leading or trailing; checked rows take the selected colours; ring round the row and box hover following the row (OD-100, OD-102: `controlRow`, `inRow`); checkbox on the title's first line (`accessoryAlign="title"`); no indeterminate or menu mode (OD-156, OD-157); `body` exposed (OD-158); group label from the page (OD-159). Approved by the designer |
| 20 Nov 2026 | NlRadioListItem (#55, public): `<label>` row on `NlListItemBase` around `NlRadio inRow`, inside `NlRadioListGroup` (`role="radiogroup"`, value, name, disabled, appearance; OD-101, OD-160); native arrow keys; ring round the row, radio on the title line; no menu mode (OD-161); group label from the page (OD-162). `showBody` added to it and to `NlCheckboxListItem`. Approved by the designer |
| 20 Nov 2026 | NlSwitchListItem (#56, public): settings row on `NlListItemBase`, `<label>` around `NlSwitch size="small" inRow` in the trailing slot, optional leading icon; no highlight when on; switch named by the title and described by the description; ring round the row (OD-102); switch on the title line (OD-163); `body`, `showBody`, `divider` (OD-164). Approved by the designer |
| 20 Nov 2026 | NlBanner (#58, public): tinted inline message in five tones; plain tone-coloured title and description (OD-93); icon on the first text line (OD-165), `error` icon for error (OD-108); action as an xsmall flush link in the tone colour (OD-106, designer's choice); close as an xsmall icon-only `NlButton` "Dismiss {title}" (OD-107); `live` for status or alert (OD-109). `NlButton` link gained `contentTone` and `flush`. Approved by the designer |
| 20 Nov 2026 | NlSnackbar (#59, public): look (`NlSnackbar`, four tones, single or stacked, tertiary action and close) plus `NlSnackbarProvider` and `useNlSnackbar()` (OD-166): bottom-centre region, status and alert live regions from load, one at a time, 6s auto-dismiss without an action (pauses on hover or focus), F6 into it. New tokens `Size-560` (OD-91) and `--nl-duration-snackbar` (OD-92). Approved by the designer |
| 20 Nov 2026 | NlButtonDock (#60, public): bottom action row; tertiary at the start, secondary and primary at the end, all small with fixed variants; optional note (string as `NlTextBlock` description); sticky shadow; end group wraps on narrow containers (OD-170); renders nothing when empty (OD-171); no destructive primary (OD-169). Approved by the designer |
| 20 Nov 2026 | NlEmptyState (#61, public): centred icon (`NlIconContainer` 48 or 64, or `iconSlot`; none when neither, OD-112, OD-173), `NlTextBlock` heading (default `h2`, OD-172) and description, optional action; `live` for "No results" (OD-174). Approved by the designer |
| 20 Nov 2026 | NlStatCard (#62, public): `bg-active` card with `NlLabel` (medium, secondary, OD-50) over a Data M value drawn by the card (OD-113); `inList` for `<dt>` / `<dd>` (OD-175); long values wrap (OD-176). Approved by the designer |
| 20 Nov 2026 | NlFileUpload (#63, public): dashed drop zone for one file (OD-114), large or small; state from the page (enabled, uploading, complete, error) with border, icon and button per state; hidden native input, card click and drop; drag-over (OD-122) and disabled (OD-123) looks; wrong-type drops rejected (OD-178); live announcements and focus return. Icons `cloud_upload` and `refresh` added (OD-124, OD-177). Approved by the designer |
| 20 Nov 2026 | NlDialog (#64, public): native modal `<dialog>` with `NlOverlay`, small (`Size-560`) or large (new `Size-720`, OD-115, OD-121); `h2` title (OD-179) and ghost close icon 16 from the top and side; Body L text body; medium start, secondary and primary actions; alertdialog with focus on Cancel when the primary is destructive (OD-180); fade and scale from 95% (OD-125); long content scrolls in the body (OD-181). Approved by the designer |
| 20 Nov 2026 | NlPagination (#65, public): named `<nav>` list with secondary xsmall previous and next (real disabled at the ends, OD-126; chevrons, OD-128) and `NlPaginationItem` pages; first, last, current ±`siblingCount` (default 1, OD-127) with "…" only where it saves space (OD-182); page clamped (OD-183); focus follows the change. Approved by the designer |
| 20 Nov 2026 | NlTableHeaderCell (#66, public): `<th scope="col">`, plain or grey, narrow; sort as a plain native button (title + icon, `aria-sort`, OD-116, OD-129); filter button "Filter {column}" (", applied" when applied, OD-185) with `filterRef`; select all; sort announcement left to `NlTable` (OD-184); K8 accepted. Approved by the designer |
| 20 Nov 2026 | NlTableCell (#67, public): `<td>` or row header `<th>`; text (one line, `title` when cut, OD-186), small badge, flush xsmall link (OD-117), row-actions menu button in a `Size-64` column, value checkbox, leading row-select checkbox; typed props per type (OD-188); `stickyEnd` (OD-187). Approved by the designer |
| 20 Nov 2026 | NlNavItem (#68, public): side-nav section as a link or a toggle with `NlNavSubItem` pages (tree line, `Space-XS`, OD-131); `current` page or section (OD-130), worked out from the pages (OD-190); long labels cut with `title` (OD-191); minimized icon-only rows with an `NlTooltip` (OD-189) and pages in an `NlMenu` beside the row (OD-118). `NlMenu` gained `placement`; `NlListItem` menu rows can be links. Approved by the designer |
| 20 Nov 2026 | NlSideNavUser (#69, public): the signed-in user row on `NlListItemBase appearance="nav"` (OD-119, new) with `NlAvatar` medium (OD-132), Label M name and Body M email (`NlTextBlock type="label-body"`, OD-120, new); opens its own account `NlMenu` from the rows passed in `menu` (OD-192), above it or to the end when minimized (new placements `top-start`, `end-end`, OD-193); named from its text plus a hidden menu label (OD-194); minimized `Space-L` all round with an `NlTooltip` (OD-195); long text cut with `title` (OD-196). Approved by the designer |
| 20 Nov 2026 | NlSelect (#70, public): `NlInputBase type="select"` (new: read-only combobox field, open look while expanded, box click, `boxRef`) with a chevron, and an `NlMenu kind="select"` of small compact `NlListItem` options under the box (`maxHeight="320"`, new `returnFocusRef`); focus moves into the list (OD-197); type-ahead on the closed field (OD-139); value in a hidden input; `aria-required` (OD-198). OD-139, OD-140, OD-197 to OD-201 decided; K9 accepted. Approved by the designer |
| 20 Nov 2026 | NlMultiSelect (#71, public): `NlInputBase type="select"` field whose value reads the chosen labels, with `NlInputChip` xsmall chips drawn over it (new `valueOverlay`, clipped sideways only) and a decorative "+N" chip for those that don't fit (new `NlInputChip removable`, OD-136); `NlMenu kind="select" multiple` of `NlCheckboxListItem` option rows (new `role="option"` mode, OD-202) with an optional `NlSearchField` header (new `NlMenu initialFocus`, OD-204, OD-205); focus after a removal (OD-206). OD-136, OD-202 to OD-206 decided. Approved by the designer |
| 20 Nov 2026 | NlDateField (#72, public): typed date with a digit mask (`format`, default `DD/MM/YYYY`, OD-137; `dateFormat.ts`), the pattern shown while focused (new `NlInputBase formatHint`, OD-209), errors for invalid and out-of-range dates; calendar `NlButton` opening an `NlMenu` dialog with `NlCalendar` (new `NlMenu matchAnchorWidth`, `initialFocusSelector`, OD-207, OD-208); focus back to the input (OD-210); ISO value (OD-211); large only (OD-141). Approved by the designer |
| 20 Nov 2026 | NlTableColumnFilter (#74, exported for custom tables): `NlMenu kind="filter"` dialog "Filter {column}" from the header cell's filter button; `NlCheckboxListItem` rows with Reset and Apply, or an `NlRadioListGroup` with "All" first (choosing applies and closes, arrow keys apply and stay open, OD-215); `NlSearchField` header above 8 values; starts from the applied values; focus back to the filter button. OD-212 to OD-215 decided. Approved by the designer |
| 20 Nov 2026 | NlSideSheet (#75, public): full-height panel on the end edge, a native modal `<dialog>` as `NlDialog` (focus kept inside, page inert, scroll locked, focus back to the opener); header with optional back and close `NlButton`s around the title (gap `Space-XS`, OD-216), optional edge-to-edge `NlDivider` (OD-218), scrolling body (its gaps inside the scroll area), optional sticky `NlButtonDock`; `size` small `Size-560` / large `Size-720` (OD-133); slides in, fade only with reduced motion (OD-143). Approved by the designer |
| 20 Nov 2026 | NlPageHeader (#76, public): the bar at the top of the content panel, a `div` for `NlAppShell`'s `<header>` slot (OD-219); optional back `NlButton` or link ("Back" / `backLabel`), the title as an `h1` `NlTextBlock` headline-small cut with a tooltip (OD-144), an optional line or slot under it, and an optional `NlNotificationButton`; rising unread counts announced politely (OD-220); no bottom edge, `NlAppShell` leaves a `Space-XS` gap (OD-135). Approved by the designer |
| 21 Nov 2026 | NlTable (#77, public): data table with an optional toolbar (search, filters slot, small primary action), a real `<table>` (hidden caption, grey `NlTableHeaderCell` headers with sort, `NlTableColumnFilter` from `column.filter` and select-all; `NlTableCell` rows with select, text, badge or link cells and a sticky row-actions `NlMenu`), and a footer (summary with the selected count, `NlRowsPerPage` + `NlMenu`, `NlPagination`); bordered variant; `Size-*` column widths; loading `Size-80` skeleton rows, empty `NlEmptyState` with `Space-4XL`; polite result and selection announcements. `NlTableHeaderCell` gained `stickyEnd`. OD-138, OD-145, OD-221 to OD-230 decided; K8 marked. Approved by the designer |
| 21 Nov 2026 | NlSideNav (#78, public): the main `<nav>` with a logo slot and a `dock_to_right` collapse `NlButton` (no `aria-expanded`, OD-233), `NlNavItem` sections (`currentHref`, tree lines only in the tree style through the new `NlNavItem tree`, OD-231) and `NlSideNavUser` at the bottom; expanded `Size-240` column (new token, OD-134) or minimized `Size-80`, easing over Duration slow (OD-147); follows `Breakpoint-1280` until toggled (OD-232). Approved by the designer |
| 21 Nov 2026 | NlAppShell (#14, public): the page frame, full window on `bg-secondary`: nav slot, then a `Radius-L` panel (no fill) with the header slot in `<header>` and the content in a scrolling, focusable `<main>` (`Space-3XL` padding, inside focus ring, OD-24, OD-26), `Space-XS` apart (OD-135); optional skip link pill (`Space-M` from top and start, `--nl-z-snackbar`, standard ring, OD-25, OD-235); no `<nav>` added (OD-236). Approved by the designer |
| 22 Nov 2026 | NlCheckbox `size`: medium (default, `Body L`, top-aligned) and small (`Body M`, text centred on the control), OD-237. NlTextBlock `body-m` type (`Body M` description, no heading), OD-238. Approved by the designer |
| 22 Nov 2026 | Page P1, Login (`Pages/Login`, §8.6): the first Storybook page. Wordmark, h1 heading, username and password fields, small forgot password link, small remember me checkbox and a full-width Log in button; the form spans 4 of the 12 grid columns, centred. D18 added: empty required fields go to error with an error helper text when the form's main button is pressed. Approved by the designer |
| 22 Nov 2026 | D19, smaller corners: buttons large and medium `Radius-S`, small and xsmall `Radius-XS`; input fields, text area and chips `Radius-XS`; side nav rows (with the `NlSideNavUser` row) and `NlStatCard` `Radius-S`; `NlSegmentedButton` track `Radius-S`, segments `Radius-XS` inside the padded sizes. Side nav tree line connected from the section icon through every page (OD-239). Approved by the designer |
| 24 Nov 2026 | Page rules (§8.6, CLAUDE.md "Pages"): pages in `apps/storybook/src/pages/<area>/`, library components and tokens only, `NlAppShell` through `_shared/PageLayout`, Default / Loading / Empty / Error (+ Filtered) stories, 1440 checked at 1024, every brand and theme, seeded fixtures; nav links between page stories with `@storybook/addon-links`; Coming soon stories for unbuilt pages; rows P3 to P10. Icons `dashboard`, `event`, `help`, `mail`, `redeem` added. Approved by the designer |
| 24 Nov 2026 | Table changes for the member list: `NlTableHeaderCell` titles on one line (OD-240); `NlTableColumnFilter` `type="date-range"` with `NlCalendar` (OD-241); `NlTable` footer with the summary and rows per page at the start (OD-242) and `onRowClick` (OD-243, replaces OD-230). Approved by the designer |
| 24 Nov 2026 | D20, member tier tones on `NlBadge` (`bronze`, `silver`, `gold`, `platinum`): light 135° gradients with tier borders and text, the same in every brand and theme; primitives `bronze` and `platinum`, alias group `Tier`, 20 tier semantic tokens (430 → 486, audit addendum); `nl:tier-gradient-*` utilities. Approved by the designer |
| 24 Nov 2026 | NlBulkActionBar (#79, public, D21): a floating `bg-direct` bar with `Radius-M` corners, Clear selection, "{n} selected", up to 7 actions with leading icons (as many as fit, the rest in More actions), destructive actions solid red and last; `NlTable` `bulkActions`. Icons `block`, `download`, `swap_horiz` added. Approved by the designer |
| 24 Nov 2026 | Page P2, Member list (`Pages/Members/Member list`, §8.6): fixed-width search, filter chips and Add member in the toolbar; Tier, Status and Join date filters in the header cells; tier tones; sorting, row actions, row click (details side sheet to come), pagination; the bulk action bar. Default, Filtered, Bulk selected, No results, Empty, Loading and Error stories. Approved by the designer |
| 24 Nov 2026 | Member details on P2: a row click or View opens the member details `NlSideSheet` (Detail / Value `NlTable`, Suspend and Edit); Suspend from a row, the side sheet or the bulk action bar asks in an `NlDialog`, then a success snackbar at the top end. The planned Member detail page is removed (pages renumbered P3 to P9). `NlButtonDock` secondary and tertiary can be destructive (OD-244); `NlSnackbarProvider` `placement="top-end"` (OD-245). `test:a11y` waits for an open dialog's fade-in. Approved by the designer |
| 24 Nov 2026 | Charts, plan and tokens (D9 closed): chart specs for the shared rules, `NlChartTooltip`, `NlChartLegend`, `NlChartFrame`, `NlLineChart`, `NlBarChart` and `NlDonutChart` (§9, §8.5 C1 to C6, OD-246 to OD-260 decided); primitive scales orange, cyan, violet, magenta; `Chart` aliases and 17 chart semantic tokens (486 → 559, audit addendum); `Data S`; icons `bar_chart`, `table`; Foundations Chart colours page. Approved by the designer |
| 24 Nov 2026 | `@northline/ui/charts` entry point (a second library entry and the `./charts` export). NlChartMarker (C0, internal): series shapes circle, square, triangle, diamond, then hollow; `Size-8` or `Size-12`; chart token colours only. NlChartTooltip (C1, public): heading, a row per series (marker, name, value in `Data S`), a total row with extra space instead of a divider; markers keep the series colours on the inverse tooltip background (designer's choice). Approved by the designer |
| 24 Nov 2026 | NlChartLegend (C2, public, in `@northline/ui/charts`): line charts a `Size-16`, 2px line with the series' `NlChartMarker`; bars and slices a `Size-12` square; label `Body S` in `chart-axis-text` (cut at `Size-240`), donut value and share in `Data S`; a wrapping row below or a column at the end, parts `Space-S` apart; not interactive in v1. Approved by the designer |
| 24 Nov 2026 | NlChartFrame (C3, public, in `@northline/ui/charts`): a section named by the title (`NlTextBlock` headline-small), a "View as" switch (Chart \| Table) when a table is given, hidden but keeping its space unless ready; a body at the chart's height: the chart or table slot (D15), five skeleton bars while loading, `NlEmptyState` for empty and error (Try again); card (default) or plain. Approved by the designer |
