# Token audit

Audit of `tokens/design.tokens.json` against `DESIGN.md` §3, as described in CLAUDE.md ("Token audit"). Nothing in the JSON or the spec was changed to fix a problem. Every problem below is for the designer to decide.

Date: 17 Nov 2026 (S0, first build of the token file).

## Validation

- The JSON parses: yes. Tokens: 425.
- Duplicate keys in one object: 0.
- References that don't resolve: 0.
- Circular references: 0.

## 1. DESIGN.md §3.9 rules

| Rule | Check | Result | Detail |
|---|---|---|---|
| 1 | Every token has `$type`, `$value`, `$description` and `$extensions.mode` | Pass | all 425 |
| 2 | Colour tokens in `Color collection` and `Alias Colors` say where to use them; primitives say what they are | Pass, with a note | All 82 primitive descriptions follow the pattern ("Royal blue, step 500, #1532EA"). The automatic check flagged 79 colour descriptions as "weak" because it looks for words such as "for" or "use". Read by hand, every one carries the DESIGN.md "Use" text plus its Light and Dark (or brand) values, for example "Focus ring. Light: Primary-light-focus; Dark: Primary-dark-focus." Some "Use" entries in DESIGN.md are very short ("Hover", "Pressed", "Info border"). See risk R7 |
| 3 | Descriptions are never copied and never name a real product or client | Pass | 425 unique descriptions; names checked by the scrub (step 6) |
| 4 | Font weights are `fontWeight` numbers, not dimensions | Pass | 4 primitives, 25 alias weights, all numbers |
| 5 | Dimensions use `{ "value": n, "unit": "px" }`, no float noise | Pass | all dimension objects; largest precision one decimal (62.4) |
| 6 | Alias values point at primitives, semantic values at aliases; nothing skips a layer | Pass | every reference checked |
| 7 | `Primary light` and `Primary dark` point at `Primary-*` aliases in every mode | Pass | 14 tokens × 3 brands |
| 8 | Every mode of a collection has a value for every token | Pass | Alias Colors and Alias Typography 3 brands; Color collection 2 themes; others no modes |
| 9 | No duplicate names in a group; no duplicate hex in one primitive scale | Pass | no duplicate keys; 9 scales without repeated hex |

## 2. Mappings compared with DESIGN.md

Every value was re-read from DESIGN.md §3.1 to §3.7 by this audit (independently of the generator) and compared with the JSON, resolved through every reference, for every brand and theme. Comparisons made: 839. Mismatches: 0.

## 3. Descriptions, duplicates and spelling

- Empty descriptions: 0.
- Descriptions used by more than one token: 0.
- Duplicate token names in one group: 0. Duplicate hex values in one primitive scale: 0.
- Spelling and form (double spaces, repeated words, 'color' for 'colour', missing full stop): 0.

## 4. Contrast

WCAG 2.2 AA: 4.5:1 for text, 3:1 for icons, borders, focus rings and other graphics. Ratios use the resolved hex in each brand and theme. Alpha tokens are left out because their result depends on what they sit on.

**Text on the main background** (needs 4.5:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `text-primary` | `bg-primary` | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ |
| `text-secondary` | `bg-primary` | 8.39 ✓ | 9.60 ✓ | 8.39 ✓ | 9.60 ✓ | 8.39 ✓ | 9.60 ✓ |
| `text-tertiary` | `bg-primary` | 10.67 ✓ | 6.36 ✓ | 10.67 ✓ | 6.36 ✓ | 10.67 ✓ | 6.36 ✓ |
| `text-placeholder` | `bg-primary` | 4.87 ✓ | 6.36 ✓ | 4.87 ✓ | 6.36 ✓ | 4.87 ✓ | 6.36 ✓ |
| `text-action` | `bg-primary` | 7.85 ✓ | 5.76 ✓ | 7.98 ✓ | 6.30 ✓ | 5.84 ✓ | 5.73 ✓ |
| `text-hovered` | `bg-primary` | 10.27 ✓ | 8.96 ✓ | 10.26 ✓ | 9.58 ✓ | 8.79 ✓ | 7.50 ✓ |
| `text-pressed` | `bg-primary` | 13.23 ✓ | 13.38 ✓ | 13.21 ✓ | 13.78 ✓ | 13.08 ✓ | 10.23 ✓ |
| `text-info` | `bg-primary` | 8.12 ✓ | 11.65 ✓ | 8.12 ✓ | 11.65 ✓ | 8.12 ✓ | 11.65 ✓ |
| `text-success` | `bg-primary` | 7.60 ✓ | 11.84 ✓ | 7.60 ✓ | 11.84 ✓ | 7.60 ✓ | 11.84 ✓ |
| `text-warning` | `bg-primary` | 8.84 ✓ | 14.68 ✓ | 8.84 ✓ | 14.68 ✓ | 8.84 ✓ | 14.68 ✓ |
| `text-error` | `bg-primary` | 9.17 ✓ | 10.38 ✓ | 9.17 ✓ | 10.38 ✓ | 9.17 ✓ | 10.38 ✓ |

**Text on grey panels (side nav)** (needs 4.5:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `text-primary` | `bg-secondary` | 16.36 ✓ | 16.55 ✓ | 16.36 ✓ | 16.55 ✓ | 16.36 ✓ | 16.55 ✓ |
| `text-secondary` | `bg-secondary` | 7.18 ✓ | 8.31 ✓ | 7.18 ✓ | 8.31 ✓ | 7.18 ✓ | 8.31 ✓ |
| `text-tertiary` | `bg-secondary` | 9.13 ✓ | 5.51 ✓ | 9.13 ✓ | 5.51 ✓ | 9.13 ✓ | 5.51 ✓ |
| `text-action` | `bg-secondary` | 6.71 ✓ | 4.98 ✓ | 6.82 ✓ | 5.45 ✓ | 5.00 ✓ | 4.96 ✓ |

**Text on selected and active backgrounds** (needs 4.5:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `text-action` | `bg-active` | 6.58 ✓ | 5.80 ✓ | 6.83 ✓ | 6.30 ✓ | 5.02 ✓ | 5.39 ✓ |
| `text-primary` | `bg-active` | 16.05 ✓ | 19.27 ✓ | 16.38 ✓ | 19.13 ✓ | 16.43 ✓ | 18.01 ✓ |
| `text-primary` | `bg-active-hover` | 13.38 ✓ | 16.51 ✓ | 13.78 ✓ | 16.29 ✓ | 14.07 ✓ | 13.08 ✓ |
| `text-action` | `bg-active-hover` | 5.49 ✓ | 4.97 ✓ | 5.75 ✓ | 5.37 ✓ | 4.30 **✗** | 3.92 **✗** |

**White text on fills** (needs 4.5:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `text-white_both` | `bg-action-primary` | 7.85 ✓ | 5.28 ✓ | 7.98 ✓ | 4.82 ✓ | 5.84 ✓ | 5.84 ✓ |
| `text-white_both` | `bg-action-primary_hovered` | 10.27 ✓ | 7.85 ✓ | 10.26 ✓ | 7.98 ✓ | 8.79 ✓ | 8.79 ✓ |
| `text-white_both` | `bg-action-primary_pressed` | 13.23 ✓ | 10.27 ✓ | 13.21 ✓ | 10.26 ✓ | 13.08 ✓ | 13.08 ✓ |
| `text-white_both` | `bg-brand` | 7.85 ✓ | 5.28 ✓ | 7.98 ✓ | 4.82 ✓ | 5.84 ✓ | 5.84 ✓ |
| `text-white_both` | `bg-action-destructive` | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ |
| `text-white_both` | `bg-action-destructive_hovered` | 9.17 ✓ | 9.17 ✓ | 9.17 ✓ | 9.17 ✓ | 9.17 ✓ | 9.17 ✓ |
| `text-white_both` | `bg-action-destructive_pressed` | 13.46 ✓ | 13.46 ✓ | 13.46 ✓ | 13.46 ✓ | 13.46 ✓ | 13.46 ✓ |
| `text-white_both` | `bg-info` | 5.40 ✓ | 5.40 ✓ | 5.40 ✓ | 5.40 ✓ | 5.40 ✓ | 5.40 ✓ |
| `text-white_both` | `bg-success` | 4.92 ✓ | 4.92 ✓ | 4.92 ✓ | 4.92 ✓ | 4.92 ✓ | 4.92 ✓ |
| `text-white_both` | `bg-error` | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ | 6.22 ✓ |

**Dark and inverse text on fills** (needs 4.5:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `text-dark_both` | `bg-warning` | 9.91 ✓ | 9.91 ✓ | 9.91 ✓ | 9.91 ✓ | 9.91 ✓ | 9.91 ✓ |
| `text-dark_both` | `bg-action-inverse` | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ |
| `text-inverse` | `bg-direct` | 19.12 ✓ | 16.36 ✓ | 19.12 ✓ | 16.36 ✓ | 19.12 ✓ | 16.36 ✓ |

**Alert text on tints** (needs 4.5:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `text-info` | `bg-info_secondary` | 6.39 ✓ | 10.63 ✓ | 6.39 ✓ | 10.63 ✓ | 6.39 ✓ | 10.63 ✓ |
| `text-success` | `bg-success_secondary` | 6.04 ✓ | 10.63 ✓ | 6.04 ✓ | 10.63 ✓ | 6.04 ✓ | 10.63 ✓ |
| `text-warning` | `bg-warning_secondary` | 7.75 ✓ | 11.81 ✓ | 7.75 ✓ | 11.81 ✓ | 7.75 ✓ | 11.81 ✓ |
| `text-error` | `bg-error_secondary` | 6.81 ✓ | 9.81 ✓ | 6.81 ✓ | 9.81 ✓ | 6.81 ✓ | 9.81 ✓ |

**Alert icons on tints** (needs 3.0:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `fg-info` | `bg-info_secondary` | 4.25 ✓ | 8.19 ✓ | 4.25 ✓ | 8.19 ✓ | 4.25 ✓ | 8.19 ✓ |
| `fg-success` | `bg-success_secondary` | 3.91 ✓ | 8.31 ✓ | 3.91 ✓ | 8.31 ✓ | 3.91 ✓ | 8.31 ✓ |
| `fg-warning` | `bg-warning_secondary` | 4.38 ✓ | 10.32 ✓ | 4.38 ✓ | 10.32 ✓ | 4.38 ✓ | 10.32 ✓ |
| `fg-error` | `bg-error_secondary` | 4.62 ✓ | 7.15 ✓ | 4.62 ✓ | 7.15 ✓ | 4.62 ✓ | 7.15 ✓ |

**Count badge text on its fill** (needs 4.5:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `text-inverse` | `fg-error` | 6.22 ✓ | 7.56 ✓ | 6.22 ✓ | 7.56 ✓ | 6.22 ✓ | 7.56 ✓ |
| `text-inverse` | `fg-warning` | 5.00 ✓ | 12.83 ✓ | 5.00 ✓ | 12.83 ✓ | 5.00 ✓ | 12.83 ✓ |
| `text-inverse` | `fg-success` | 4.92 ✓ | 9.26 ✓ | 4.92 ✓ | 9.26 ✓ | 4.92 ✓ | 9.26 ✓ |

**Icons on the main background** (needs 3.0:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `fg-primary` | `bg-primary` | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ | 19.12 ✓ |
| `fg-secondary` | `bg-primary` | 8.39 ✓ | 9.60 ✓ | 8.39 ✓ | 9.60 ✓ | 8.39 ✓ | 9.60 ✓ |
| `fg-placeholder` | `bg-primary` | 4.87 ✓ | 3.92 ✓ | 4.87 ✓ | 3.92 ✓ | 4.87 ✓ | 3.92 ✓ |
| `fg-action` | `bg-primary` | 7.85 ✓ | 5.76 ✓ | 7.98 ✓ | 6.30 ✓ | 5.84 ✓ | 5.73 ✓ |
| `fg-brand` | `bg-primary` | 7.85 ✓ | 5.76 ✓ | 7.98 ✓ | 6.30 ✓ | 5.84 ✓ | 5.73 ✓ |
| `fg-active` | `bg-primary` | 10.27 ✓ | 8.96 ✓ | 10.26 ✓ | 9.58 ✓ | 8.79 ✓ | 7.50 ✓ |
| `fg-info` | `bg-primary` | 5.40 ✓ | 8.97 ✓ | 5.40 ✓ | 8.97 ✓ | 5.40 ✓ | 8.97 ✓ |
| `fg-success` | `bg-primary` | 4.92 ✓ | 9.26 ✓ | 4.92 ✓ | 9.26 ✓ | 4.92 ✓ | 9.26 ✓ |
| `fg-warning` | `bg-primary` | 5.00 ✓ | 12.83 ✓ | 5.00 ✓ | 12.83 ✓ | 5.00 ✓ | 12.83 ✓ |
| `fg-error` | `bg-primary` | 6.22 ✓ | 7.56 ✓ | 6.22 ✓ | 7.56 ✓ | 6.22 ✓ | 7.56 ✓ |

**Focus ring and control borders on the main background** (needs 3.0:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `border-focused` | `bg-primary` | 5.28 ✓ | 5.76 ✓ | 4.82 ✓ | 6.30 ✓ | 3.99 ✓ | 5.73 ✓ |
| `border-strong` | `bg-primary` | 4.87 ✓ | 6.36 ✓ | 4.87 ✓ | 6.36 ✓ | 4.87 ✓ | 6.36 ✓ |
| `border-active` | `bg-primary` | 7.85 ✓ | 5.76 ✓ | 7.98 ✓ | 6.30 ✓ | 5.84 ✓ | 5.73 ✓ |
| `border-hovered` | `bg-primary` | 10.27 ✓ | 8.96 ✓ | 10.26 ✓ | 9.58 ✓ | 8.79 ✓ | 7.50 ✓ |
| `border-pressed` | `bg-primary` | 13.23 ✓ | 13.38 ✓ | 13.21 ✓ | 13.78 ✓ | 13.08 ✓ | 10.23 ✓ |
| `border-action-primary` | `bg-primary` | 7.85 ✓ | 3.62 ✓ | 7.98 ✓ | 3.97 ✓ | 5.84 ✓ | 3.27 ✓ |
| `border-info` | `bg-primary` | 3.70 ✓ | 6.80 ✓ | 3.70 ✓ | 6.80 ✓ | 3.70 ✓ | 6.80 ✓ |
| `border-success` | `bg-primary` | 3.35 ✓ | 7.26 ✓ | 3.35 ✓ | 7.26 ✓ | 3.35 ✓ | 7.26 ✓ |
| `border-warning` | `bg-primary` | 1.93 **✗** | 11.24 ✓ | 1.93 **✗** | 11.24 ✓ | 1.93 **✗** | 11.24 ✓ |
| `border-error` | `bg-primary` | 4.31 ✓ | 5.61 ✓ | 4.31 ✓ | 5.61 ✓ | 4.31 ✓ | 5.61 ✓ |
| `border-focused` | `bg-secondary` | 4.52 ✓ | 4.98 ✓ | 4.12 ✓ | 5.45 ✓ | 3.42 ✓ | 4.96 ✓ |

**Switch, slider and progress graphics** (needs 3.0:1)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `fg-white_both` | `fg-brand` | 7.85 ✓ | 3.32 ✓ | 7.98 ✓ | 3.04 ✓ | 5.84 ✓ | 3.34 ✓ |
| `fg-white_both` | `fg-placeholder` | 4.87 ✓ | 4.87 ✓ | 4.87 ✓ | 4.87 ✓ | 4.87 ✓ | 4.87 ✓ |
| `fg-placeholder` | `bg-primary` | 4.87 ✓ | 3.92 ✓ | 4.87 ✓ | 3.92 ✓ | 4.87 ✓ | 3.92 ✓ |
| `fg-brand` | `bg-active-hover` | 5.49 ✓ | 4.97 ✓ | 5.75 ✓ | 5.37 ✓ | 4.30 ✓ | 3.92 ✓ |
| `fg-white_both` | `bg-action-primary` | 7.85 ✓ | 5.28 ✓ | 7.98 ✓ | 4.82 ✓ | 5.84 ✓ | 5.84 ✓ |

**Decorative or exempt (shown for information)** (no minimum)

| Foreground | Background | Northline Light | Northline Dark | Garnet Light | Garnet Dark | Voltic Light | Voltic Dark |
|---|---|---|---|---|---|---|---|
| `border-default` | `bg-primary` | 1.38 | 1.42 | 1.38 | 1.42 | 1.38 | 1.42 |
| `border-subtle` | `bg-primary` | 1.17 | 1.16 | 1.17 | 1.16 | 1.17 | 1.16 |
| `text-disabled` | `bg-primary` | 3.00 | 1.79 | 3.00 | 1.79 | 3.00 | 1.79 |
| `text-disabled-on_bg` | `bg-disabled` | 3.53 | 1.60 | 3.53 | 1.60 | 3.53 | 1.60 |

**Below the AA line: 5 results.**

| Foreground | Background | Brand | Theme | Ratio | Needs |
|---|---|---|---|---|---|
| `text-action` | `bg-active-hover` | Voltic | Light | 4.30 | 4.5:1 |
| `text-action` | `bg-active-hover` | Voltic | Dark | 3.92 | 4.5:1 |
| `border-warning` | `bg-primary` | Northline | Light | 1.93 | 3.0:1 |
| `border-warning` | `bg-primary` | Garnet | Light | 1.93 | 3.0:1 |
| `border-warning` | `bg-primary` | Voltic | Light | 1.93 | 3.0:1 |

Where these pairs are used:

- `text-action` on `bg-active-hover`: a selected `NlFilterChip` on hover (§9). Voltic only. Its Light action colour is pink 600 on pink 100, and its Dark action colour is pink 400 on pink 800.
- `border-warning` on `bg-primary`: the outline of the warning `NlBadge` (§9) sits on `bg-warning_secondary`, not `bg-primary`, and its text carries the meaning. A border is only a 3:1 requirement when it is the only thing that identifies a control, so this may be acceptable. It needs a decision if `border-warning` is ever used as a field's or control's only outline.

## 5. Risks in the plan

These are things in DESIGN.md §3 or in the token file's shape that may cause problems later. Nothing was changed to fix them.

| # | Risk | Detail |
|---|---|---|
| R1 | Colours are hex strings, not DTCG 2025.10 colour objects | DTCG 2025.10 defines a colour `$value` as an object (`colorSpace`, `components`, optional `alpha` and `hex`). The file follows the requested TokensBrücke shape with `colorMode: "hex"`, so colours are `"#1532EA"` strings. A strict 2025.10 validator or tool would reject them. Style Dictionary reads them without trouble |
| R2 | Alpha tokens keep their opacity in an extension | DTCG 2025.10 can't add an alpha to a referenced colour: a property-level `$ref` can't reach through an alias whose value is itself a reference. So each Alpha token's `$value` is the alias reference (keeping the layers intact), and the opacity is in `$extensions["com.northline.alpha"]` per theme. A tool that ignores the extension sees the colour at full opacity. The S2 token build must apply it (for example with `color-mix()`) |
| R3 | White and black primitives have no steps | They are at `Primitives.Colors.base.white` and `Primitives.Colors.base.black` (group `base`), because the path pattern `<scale>.<scale>-<step>` has no step for them. The aliases are `Alias Colors.Colors.Brand.Base.White` and `.Black` |
| R4 | Decimal line heights can't use a dot in their names | DTCG names may not contain a dot, so primitives are named `Line Height-16_5`, `Line Height-62_4` and so on, with an underscore for the decimal point. The values themselves are 16.5 and 62.4 |
| R5 | Letter spacing isn't in the file | §3.4 says letter spacing is 0 for every style. No token was added for it. The build can treat it as 0 |
| R6 | Four backgrounds share one grey in Light (known issue K1) | `bg-tertiary`, `bg-neutral`, `bg-icons` and `bg-disabled` all resolve to Neutral-100 in Light. Several specs rely on hover and pressed looking different (for example nav items: hover `bg-tertiary`, pressed `bg-neutral`), and in Light they don't |
| R7 | Some "Use" entries in §3.3 are very short | Descriptions repeat DESIGN.md's "Use" column, as asked. Entries such as "Hover", "Pressed" or "Info border" say little about where to use the token. Better wording would go into DESIGN.md first, then the JSON |
| R8 | The spec URL hasn't been checked | `$extensions.tokens-bruecke-meta.spec` is `https://www.designtokens.org/tr/2025.10/format/`. The address was written from memory and not opened, so it should be checked once |
| R9 | `Primary-light-focus` is lighter than the action colour | The focus ring (`border-focused`) uses step 400 in Light (500 in Voltic). It passes 3:1 on `bg-primary` in every brand and theme, but it's the token closest to failing whenever a new brand is added |

## 6. Questions for the designer

1. Should the two failing pairs change? Options: give `bg-active-hover` a lighter Voltic step, darken Voltic's action colour on that background, or accept it for the filter chip. For `border-warning`, decide whether it is ever used as a control's only outline.
2. Is the Alpha form in R2 acceptable, or would you rather have Alpha tokens as resolved 8-digit hex values (for example `#0F0F1329`)? Resolved values work in any tool but stop following the brand.
3. Are the names in R3 (`base.white`, `base.black`) and R4 (`Line Height-62_4`) fine?
4. Should colours stay hex strings (R1), or move to DTCG 2025.10 colour objects before the token build?

## 7. Found later

| Date | Finding | Decision |
|---|---|---|
| 18 Nov 2026 | `pnpm test:a11y` (S6) found a pairing this audit didn't check: `text-white_subtle` on `bg-brand` (the pairing its description names). 3.82:1 in Northline Dark, 3.49:1 in Garnet Dark, 4.23:1 in Voltic Light and Dark; needs 4.5:1. Northline Light (5.68) and Garnet Light (5.78) pass | Accepted for now as known issue K2 (DESIGN.md). Add this pairing to the audit's contrast list next time the JSON changes |

## 8. Change on 18 Nov 2026: icon weight

The designer chose weight 300 for icons (NlIcon) and a separate icon-only token, so text can't pick it up. Added:

| Token | Value | Modes |
|---|---|---|
| `Primitives.Typography.Font Weight.Font Weight-300` | 300 | none (primitive) |
| `Alias Typography.Icon.Font weight` | `{Font Weight-300}` | Northline, Garnet, Voltic, all 300 |

The token build now treats only `Alias Typography` groups with a font size as text styles, so `Icon` gets `--nl-font-icon-weight` in every brand but no font shorthand and no `nl:text-*` utility. Still 25 text styles.

| Rule (§3.9) | Result |
|---|---|
| 1 Fields | Pass, all 427 tokens |
| 3 Descriptions unique | Pass, 427 unique |
| 4 Weights are numbers | Pass, 5 primitives (300 to 700), 26 alias weights |
| 6 Layers | Pass. The new alias points at a primitive. (The only alias-to-alias references are `Primary light` and `Primary dark` → `Primary-*`, which rule 7 requires) |
| 8 Modes | Pass, the new alias has all three brands |
| 9 Duplicate names | Pass |

Mappings: §3.4 updated to describe the icon weight, and it matches the JSON. Contrast: no colour changed, so every ratio above still holds. As agreed in §7, the pairing `text-white_subtle` on `bg-brand` is now on the contrast list: unchanged from K2 (Northline Dark 3.82, Garnet Dark 3.49, Voltic Light and Dark 4.23; Northline Light 5.68, Garnet Light 5.78; needs 4.5). Still accepted as K2.

## 9. Contrast added on 18 Nov 2026: status dot

`NlStatusDot` asks for `fg-success` against its ring (a graphic, 3:1). The ring uses `border-inverse`, which has the same values as `fg-inverse` and `bg-primary` in every brand and theme. No token changed.

| Pairing | Light (Northline, Garnet, Voltic) | Dark (Northline, Garnet, Voltic) |
|---|---|---|
| `fg-success` on `border-inverse` | `#0A8310` on `#FFFFFF`, 4.92 ✓ | `#6EC872` on `#0F0F13`, 9.26 ✓ |
| `fg-success` on `bg-primary` | 4.92 ✓ | 9.26 ✓ |

The dot against an avatar image or fill is checked when `NlAvatar` is built.

## 10. Contrast added on 18 Nov 2026: count badge

`NlCountBadge` puts `Caption S` / `Caption L` text in `text-inverse` on the solid status colours. Small text needs 4.5:1. No token changed. The values are the same in all three brands.

| Text on | Light (`#FFFFFF` text) | Dark (`#0F0F13` text) |
|---|---|---|
| `fg-error` | `#B92816`, 6.22 ✓ | `#F18476`, 7.56 ✓ |
| `fg-warning` | `#886C09`, 5.00 ✓ | `#EED26F`, 12.83 ✓ |
| `fg-success` | `#0A8310`, 4.92 ✓ | `#6EC872`, 9.26 ✓ |

The spec asked specifically for white on `fg-warning` in Light: 5.00, a pass.

## 11. Contrast added on 18 Nov 2026: progress bar

`NlProgressBar` draws a `fg-brand` fill on a `bg-active-hover` track. The fill is a meaningful graphic and needs 3:1 (WCAG 1.4.11, §2.6). No token changed. Measured in the browser from the built tokens.

| Brand | Light | Dark |
|---|---|---|
| Northline | 5.49 ✓ | 4.97 ✓ |
| Garnet | 5.75 ✓ | 5.37 ✓ |
| Voltic | 4.30 ✓ | 3.92 ✓ |

All pass. The lowest is Voltic Dark, 3.92.

## 12. Contrast added on 18 Nov 2026: slider

`NlSlider` draws its fill and thumb on a `bg-active-hover` track. They are meaningful graphics and need 3:1 (WCAG 1.4.11, §2.6). No token changed. Measured in the browser from the built tokens.

| Fill and thumb on `bg-active-hover` | Northline L / D | Garnet L / D | Voltic L / D |
|---|---|---|---|
| `fg-brand` (enabled) | 5.49 / 4.97 ✓ | 5.75 / 5.37 ✓ | 4.30 / 3.92 ✓ |
| `fg-hovered` (hover) | 7.19 / 7.73 ✓ | 7.39 / 8.16 ✓ | 6.46 / 5.13 ✓ |
| `fg-pressed` (pressed) | 9.26 / 11.55 ✓ | 9.52 / 11.74 ✓ | 9.62 / 6.99 ✓ |

Disabled (`fg-disabled-on_bg` on `bg-disabled`) is exempt from 1.4.11. For the record: 3.53 in Light and 1.60 in Dark, the same in every brand. In Dark the disabled fill is faint against its track; part of the OD-10 Storybook check. The thumb's `border-inverse` ring keeps its outline visible against the track.

## 13. Contrast added on 18 Nov 2026: radio

`NlRadio` draws its ring on the page background. The ring is a meaningful graphic and needs 3:1 (WCAG 1.4.11, §2.6). No token changed. Measured in the browser from the built tokens; the values are the same in all three brands unless noted.

| Ring | Light | Dark |
|---|---|---|
| `border-strong` on `bg-primary` (unselected) | 4.87 ✓ | 6.36 ✓ |
| `fg-action` on `bg-primary` (selected) | Northline 7.85, Garnet 7.98, Voltic 5.84 ✓ | Northline 5.76, Garnet 6.30, Voltic 5.73 ✓ |
| `border-hovered` on `bg-active` (unselected hover) | 7.55 to 8.79 ✓ | 7.06 to 9.59 ✓ |
| `border-pressed` on `bg-active-hover` (unselected pressed) | 9.26 to 9.62 ✓ | 6.99 to 11.74 ✓ |

Disabled (`fg-disabled` on `bg-primary`, 3.00 / 1.79) is exempt from 1.4.11.

## 14. Contrast added on 18 Nov 2026: switch

`NlSwitch` draws a white handle (`fg-white_both`) on its track, and the off track on the page. Both are meaningful graphics and need 3:1 (WCAG 1.4.11, §2.6). No token changed. Measured in the browser from the built tokens.

| Pair | Northline L / D | Garnet L / D | Voltic L / D |
|---|---|---|---|
| Off track `fg-placeholder` on `bg-primary` | 4.87 / 3.92 ✓ | 4.87 / 3.92 ✓ | 4.87 / 3.92 ✓ |
| Handle on the off track (`fg-placeholder`) | 4.87 / 4.87 ✓ | 4.87 / 4.87 ✓ | 4.87 / 4.87 ✓ |
| Handle on the on track (`fg-brand`) | 7.85 / 3.32 ✓ | 7.98 / 3.04 ✓ | 5.84 / 3.34 ✓ |

The spec asked for Voltic Light on `fg-brand` especially: 5.84, a pass. The lowest is Garnet Dark, 3.04.

Not built, for the record (OD-13b): the white handle on `fg-hovered` would be 2.14 / 2.00 / 2.55 and on `fg-pressed` 1.43 / 1.39 / 1.87 in Dark (Northline / Garnet / Voltic). Hover and pressed are outside the audit (D17), but the switch has no hover or pressed colours because of this.

---

## Addendum, 20 Nov 2026: `Size-560` (NlSnackbar, OD-91)

Change asked for by the designer (go-ahead on the NlSnackbar plan): one primitive added, `Primitives.Sizes.Size-560` (dimension, 560 px, "Used only as a maximum width (snackbar), never as spacing.").

| Check | Result |
|---|---|
| JSON parses; tokens | Yes; 428 (was 427) |
| `$type`, `$value`, `$description`, `$extensions.mode` on every token (§3.9 rule 1) | Pass |
| Dimension as `{ value, unit: "px" }` (rule 5) | Pass |
| Duplicate descriptions | 0 |
| Duplicate values in `Primitives.Sizes` | 0 |
| References | The token build resolves every reference (no errors) |
| Colour contrast | Not affected (no colour change) |

Also added, outside the JSON (hand-written motion values in `packages/tokens/src/styles.css`, §5): `--nl-duration-snackbar: 6000ms` (OD-92), not zeroed under reduced motion because it is reading time, not an animation.

---

## Addendum, 20 Nov 2026: `Size-720` (NlDialog, OD-121)

Asked for by the designer (go-ahead on the NlDialog plan): one primitive added, `Primitives.Sizes.Size-720` (dimension, 720 px, "Used only as a width (large dialog), never as spacing."). `Size-560`'s description now also names the small dialog.

| Check | Result |
|---|---|
| JSON parses; tokens | Yes; 429 (was 428) |
| `$type`, `$value`, `$description`, `$extensions.mode` on every token (§3.9 rule 1) | Pass |
| Dimension as `{ value, unit: "px" }` (rule 5) | Pass |
| Duplicate descriptions | 0 |
| Duplicate values in `Primitives.Sizes` | 0 |
| References | The token build resolves every reference (no errors) |
| Colour contrast | Not affected (no colour change) |

