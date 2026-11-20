# Northline component dependencies and open decisions

The working tracker for the build. It has two parts:

1. **Dependencies**: what each component needs before it can be built, what uses it, and which open decisions block it.
2. **Open decisions**: everything found during spec extraction that the designer decides during the build, once the component can be seen in Storybook. Each has an ID (`OD-n`).

DESIGN.md stays the spec and keeps the official status (§8). This file is where the build is tracked day to day. Proposed changes to DESIGN.md are listed in part 2 first and moved into DESIGN.md only when the designer agrees.

**How to use it during the build**
- **Ready to build** = every component in "Depends on" is ✅ built, and nothing is left in "Blocked by".
- Before planning a component (CLAUDE.md, step 0), list its open decisions from part 2 in the plan, so the designer can decide them while looking at the stories.
- When a decision is made: mark it **Decided** in part 2 with the decision, remove its ID from "Blocked by" in part 1, and update the component's spec in DESIGN.md §9.
- When a component is approved: set its **Build** cell to ✅ (🟨 while in progress), copy the status to DESIGN.md §8, then check its "Used by" list for components that are now ready.
- "Depends on" lists only the components a component renders itself. Slot content doesn't count (D15).

Spec: ✅ written · ⬜ not yet. Build: ⬜ not started · 🟨 in progress · ✅ built and approved.

Last updated: 20 Nov 2026 (Build column up to date: #1 to #12, #15 to #38, #40 to #50, #52 to #56 and #58 to #65 approved. OD-27 to OD-39, OD-50, OD-72, OD-78, OD-80 to OD-93, OD-97 to OD-102, OD-104 to OD-115, OD-121 to OD-128 and OD-148 to OD-183 decided; OD-14, OD-15 and OD-50 cleared from Blocked by).

---

## Part 1. Dependencies

### Atoms L0

| # | Component | Public | Depends on | Used by | Blocked by | Spec | Build |
|---|---|---|---|---|---|---|---|
| 1 | `NlIcon` | yes | – | `NlIconContainer`, `NlAvatar`, `NlBadgeBase`, `NlButtonBase`, `NlWhiteButton`, `NlDestructiveButton`, `NlCheckboxControl`, `NlSpinner`, `NlChipBase`, `NlSegment`, `NlHelperText`, `NlRowsPerPage`, `NlNavIcon`, `NlNotificationButton`, `NlInputBase`, `NlStep`, `NlListItem`, `NlSwitchListItem`, `NlAccordion`, `NlBanner`, `NlSnackbar` | – | ✅ batch 1 | ✅ |
| 2 | `NlStatusDot` | yes | – | `NlAvatar` | – | ✅ batch 1 | ✅ |
| 3 | `NlCountBadge` | yes | – | `NlLabel`, `NlNotificationButton` | – | ✅ batch 1 | ✅ |
| 4 | `NlDivider` | yes | – | `NlListItemBase`, `NlAccordion`, `NlSideSheet` | – | ✅ batch 1 | ✅ |
| 5 | `NlSkeleton` | yes | – | `NlTable` | – | ✅ batch 1 | ✅ |
| 6 | `NlOverlay` | yes | – | `NlDialog`, `NlSideSheet` | – | ✅ batch 1 | ✅ |
| 7 | `NlProgressBar` | yes | – | `NlFileUpload` | – | ✅ batch 1 | ✅ |
| 8 | `NlSlider` | yes | – | – | – | ✅ batch 1 | ✅ |
| 9 | `NlRadio` | yes | – | `NlRadioListItem` | – | ✅ batch 1 | ✅ |
| 10 | `NlSwitch` | yes | – | `NlSwitchListItem` | – | ✅ batch 1 | ✅ |
| 11 | `NlTextBlock` | yes | – | `NlTooltip`, `NlCheckbox`, `NlListItemBase`, `NlAccordion`, `NlButtonDock`, `NlEmptyState`, `NlStatCard`, `NlFileUpload`, `NlDialog`, `NlSideSheet`, `NlPageHeader` | OD-120 | ✅ batch 2 | ✅ |
| 12 | `NlMenu` | yes | – | `NlSelect`, `NlMultiSelect`, `NlDateField`, `NlTableColumnFilter`, `NlTable` | – | ✅ batch 2 | ✅ |
| 13 | `NlChipGroup` | yes | – | – | – | ✅ batch 2 | ⬜ |
| 14 | `NlAppShell` | yes | – | – | – | ✅ batch 2 | ⬜ |
| 15 | `NlCalendarDay` | internal | – | `NlCalendar` | – | ✅ batch 2 | ✅ |
| 16 | `NlListCaption` | internal | – | `NlListItem` | – | ✅ batch 2 | ✅ |
| 17 | `NlNavSubItem` | internal | – | `NlNavItem` | – | ✅ batch 2 | ✅ |
| 18 | `NlPaginationItem` | internal | – | `NlPagination` | – | ✅ batch 2 | ✅ |
| 19 | `NlPageDot` | internal | – | `NlPageDots` | – | ✅ batch 2 | ✅ |

### Atoms L1

| # | Component | Public | Depends on | Used by | Blocked by | Spec | Build |
|---|---|---|---|---|---|---|---|
| 20 | `NlIconContainer` | yes | `NlIcon` | `NlEmptyState`, `NlFileUpload` | – | ✅ batch 2 | ✅ |
| 21 | `NlAvatar` | yes | `NlIcon`, `NlStatusDot` | `NlListItem`, `NlSideNavUser` | – | ✅ batch 3 | ✅ |
| 22 | `NlBadgeBase` | internal | `NlIcon` | `NlBadge` | – | ✅ batch 3 | ✅ |
| 23 | `NlBadge` | yes | `NlBadgeBase` | `NlAccordion`, `NlTableCell` | – | ✅ batch 3 | ✅ |
| 24 | `NlButtonBase` | internal | `NlIcon` | `NlButton` | OD-1 / OD-40 (soft variant?) | ✅ batch 3 | ✅ |
| 25 | `NlWhiteButton` | internal | `NlButtonBase` | `NlButton` | OD-54 | ✅ batch 3 | ✅ |
| 26 | `NlDestructiveButton` | internal | `NlButtonBase` | `NlButton` | – | ✅ batch 3 | ✅ |
| 27 | `NlButton` | yes | `NlButtonBase`, `NlWhiteButton`, `NlDestructiveButton` | `NlNotificationButton`, `NlPasswordField`, `NlSearchField`, `NlCalendar`, `NlBanner`, `NlSnackbar`, `NlButtonDock`, `NlEmptyState`, `NlFileUpload`, `NlDialog`, `NlPagination`, `NlTableCell`, `NlTableColumnFilter`, `NlSideSheet`, `NlPageHeader`, `NlTable`, `NlSideNav` | OD-1 / OD-40, OD-117 | ✅ batch 3 | ✅ |
| 28 | `NlCheckboxControl` | internal | `NlIcon` | `NlCheckbox`, `NlCheckboxListItem`, `NlTableHeaderCell`, `NlTableCell`, `NlTable` | – | ✅ batch 3 | ✅ |
| 29 | `NlSpinner` | yes | `NlIcon` | – | OD-61, OD-62 | ✅ batch 3 | ✅ |
| 30 | `NlLabel` | yes | `NlCountBadge` | `NlCalendar`, `NlStep`, `NlListItemBase`, `NlAccordion`, `NlStatCard`, `NlTableHeaderCell` | – | ✅ batch 3 | ✅ |
| 31 | `NlChipBase` | internal | `NlIcon` | `NlFilterChip`, `NlAssistChip`, `NlInputChip` | – | ✅ batch 4 | ✅ |
| 32 | `NlFilterChip` | yes | `NlChipBase` | – | – | ✅ batch 4 | ✅ |
| 33 | `NlAssistChip` | yes | `NlChipBase` | – | – | ✅ batch 4 | ✅ |
| 34 | `NlInputChip` | yes | `NlChipBase` | `NlMultiSelect` | – | ✅ batch 4 | ✅ |
| 35 | `NlSegment` | internal | `NlIcon` | `NlSegmentedButton` | – | ✅ batch 4 | ✅ |
| 36 | `NlHelperText` | yes | `NlIcon` | `NlInputBase`, `NlTextAreaBase` | – | ✅ batch 4 | ✅ |
| 37 | `NlRowsPerPage` | yes | `NlIcon` | `NlTable` | – | ✅ batch 4 | ✅ |
| 38 | `NlNavIcon` | internal | `NlIcon` | `NlNavItem` | – | ✅ batch 4 | ✅ |
| 39 | `NlPageDots` | yes | `NlPageDot` | – | – | ✅ batch 4 | ⬜ |
| 40 | `NlTooltip` | yes | `NlTextBlock` | – | – | ✅ batch 4 | ✅ |

### Molecules

| # | Component | Public | Depends on | Used by | Blocked by | Spec | Build |
|---|---|---|---|---|---|---|---|
| 41 | `NlSegmentedButton` | yes | `NlSegment`, `NlTooltip` | – | – | ✅ batch 5 | ✅ |
| 42 | `NlCheckbox` | yes | `NlCheckboxControl`, `NlTextBlock` | – | OD-41, OD-15 | ✅ batch 5 | ✅ |
| 43 | `NlNotificationButton` | yes | `NlCountBadge`, `NlIcon` | `NlPageHeader` | – | ✅ batch 5 | ✅ |
| 44 | `NlInputBase` | internal | `NlHelperText`, `NlIcon` | `NlTextField`, `NlPasswordField`, `NlSearchField`, `NlSelect`, `NlMultiSelect`, `NlDateField` | – | ✅ batch 5 | ✅ |
| 45 | `NlTextField` | yes | `NlInputBase` | – | – | ✅ batch 5 | ✅ |
| 46 | `NlPasswordField` | yes | `NlInputBase`, `NlButton` | – | – | ✅ batch 5 | ✅ |
| 47 | `NlSearchField` | yes | `NlInputBase`, `NlButton` | `NlTableColumnFilter`, `NlTable` | – | ✅ batch 5 | ✅ |
| 48 | `NlTextAreaBase` | internal | `NlHelperText` | `NlTextArea` | – | ✅ batch 5 | ✅ |
| 49 | `NlTextArea` | yes | `NlTextAreaBase` | – | – | ✅ batch 5 | ✅ |
| 50 | `NlCalendar` | yes | `NlCalendarDay`, `NlButton`, `NlLabel` | `NlDateField` | – | ✅ batch 5 | ✅ |
| 51 | `NlStep` | internal | `NlIcon`, `NlLabel` | `NlStepper` | – | ✅ batch 6 | ⬜ |
| 52 | `NlListItemBase` | internal | `NlLabel`, `NlTextBlock`, `NlDivider` | `NlListItem`, `NlCheckboxListItem`, `NlRadioListItem`, `NlSwitchListItem`, `NlSideNavUser` | OD-119 | ✅ batch 6 | ✅ |
| 53 | `NlListItem` | yes | `NlListItemBase`, `NlAvatar`, `NlListCaption`, `NlIcon` | `NlSelect`, `NlTable` | – | ✅ batch 6 | ✅ |
| 54 | `NlCheckboxListItem` | yes | `NlListItemBase`, `NlCheckboxControl` | `NlMultiSelect`, `NlTableColumnFilter` | – | ✅ batch 6 | ✅ |
| 55 | `NlRadioListItem` | yes | `NlListItemBase`, `NlRadio` | `NlTableColumnFilter` | – | ✅ batch 6 | ✅ |
| 56 | `NlSwitchListItem` | yes | `NlListItemBase`, `NlSwitch`, `NlIcon` | – | – | ✅ batch 6 | ✅ |
| 57 | `NlAccordion` | yes | `NlTextBlock`, `NlBadge`, `NlLabel`, `NlDivider`, `NlIcon` | – | OD-14, OD-103a | ✅ batch 6 | ⬜ |
| 58 | `NlBanner` | yes | `NlIcon`, `NlButton` | – | – | ✅ batch 6 | ✅ |
| 59 | `NlSnackbar` | yes | `NlIcon`, `NlButton` | – | – | ✅ batch 6 | ✅ |
| 60 | `NlButtonDock` | yes | `NlButton`, `NlTextBlock` | `NlSideSheet` | – | ✅ batch 6 | ✅ |
| 61 | `NlEmptyState` | yes | `NlIconContainer`, `NlTextBlock`, `NlButton` | `NlTable` | – | ✅ batch 7 | ✅ |
| 62 | `NlStatCard` | yes | `NlLabel` | – | – | ✅ batch 7 | ✅ |
| 63 | `NlFileUpload` | yes | `NlIconContainer`, `NlTextBlock`, `NlButton`, `NlProgressBar` | – | – | ✅ batch 7 | ✅ |
| 64 | `NlDialog` | yes | `NlTextBlock`, `NlButton`, `NlOverlay` | – | – | ✅ batch 7 | ✅ |
| 65 | `NlPagination` | yes | `NlPaginationItem`, `NlButton` | `NlTable` | – | ✅ batch 7 | ✅ |
| 66 | `NlTableHeaderCell` | yes | `NlCheckboxControl`, `NlLabel`, `NlIcon` | `NlTable` | OD-116 | ✅ batch 7 | ⬜ |
| 67 | `NlTableCell` | yes | `NlCheckboxControl`, `NlBadge`, `NlButton` | `NlTable` | OD-117 | ✅ batch 7 | ⬜ |
| 68 | `NlNavItem` | yes | `NlNavIcon`, `NlNavSubItem`, `NlIcon` (`NlMenu` if OD-118 is approved) | `NlSideNav` | OD-118 | ✅ batch 7 | ⬜ |
| 69 | `NlSideNavUser` | yes | `NlListItemBase`, `NlAvatar` | `NlSideNav` | OD-119, OD-120 | ✅ batch 7 | ⬜ |

### Organisms

| # | Component | Public | Depends on | Used by | Blocked by | Spec | Build |
|---|---|---|---|---|---|---|---|
| 70 | `NlSelect` | yes | `NlInputBase`, `NlMenu`, `NlListItem` | – | – | ✅ batch 8 | ⬜ |
| 71 | `NlMultiSelect` | yes | `NlInputBase`, `NlMenu`, `NlCheckboxListItem`, `NlInputChip` | – | OD-136 | ✅ batch 8 | ⬜ |
| 72 | `NlDateField` | yes | `NlInputBase`, `NlMenu`, `NlCalendar`, `NlButton` | – | OD-137 | ✅ batch 8 | ⬜ |
| 73 | `NlStepper` | yes | `NlStep` | – | – | ✅ batch 8 | ⬜ |
| 74 | `NlTableColumnFilter` | yes | `NlMenu`, `NlCheckboxListItem`, `NlRadioListItem`, `NlSearchField`, `NlButton` | `NlTable` (opened from the header cell) | – | ✅ batch 8 | ⬜ |
| 75 | `NlSideSheet` | yes | `NlTextBlock`, `NlButton`, `NlDivider`, `NlButtonDock`, `NlOverlay` | – | OD-16, OD-133 | ✅ batch 8 | ⬜ |
| 76 | `NlPageHeader` | yes | `NlTextBlock`, `NlButton`, `NlNotificationButton` | – | OD-16, OD-135 | ✅ batch 8 | ⬜ |
| 77 | `NlTable` | yes | `NlTableHeaderCell`, `NlTableCell`, `NlCheckboxControl`, `NlSearchField`, `NlButton`, `NlPagination`, `NlRowsPerPage`, `NlMenu`, `NlListItem`, `NlEmptyState`, `NlSkeleton` (and `NlTableColumnFilter` for column filters) | – | OD-138 | ✅ batch 8 | ⬜ |
| 78 | `NlSideNav` | yes | `NlNavItem`, `NlSideNavUser`, `NlButton` | – | OD-134 | ✅ batch 8 | ⬜ |

**Note on `NlTable` and `NlTableColumnFilter`.** Both are organisms. The table only opens the filter from a header cell, so the filter is rendered as the menu's content when a filter button is used. Under D15 that counts as slot content, so `NlTable` stays an organism that doesn't contain another organism. If the designer prefers, the filter can be passed in by the page instead.

## Most depended on

Build and settle these early. A change to them ripples widely.

| Component | Used by (direct) | Open decisions |
|---|---|---|
| `NlIcon` | 21 | – |
| `NlButton` | 17 | OD-1 / OD-40 |
| `NlTextBlock` | 11 | OD-120 (OD-14, OD-15, OD-16, OD-41 decided) |
| `NlLabel` | 6 | – |
| `NlInputBase` | 6 | – |
| `NlListItemBase` | 5 | OD-119 (OD-14, OD-15, OD-97, OD-148 to OD-151 decided) |
| `NlCheckboxControl` | 5 | – |
| `NlMenu` | 5 | OD-19 |

---

## Part 2. Open decisions

Everything still waiting on the designer. Decisions are made during the build, with the component visible in Storybook, not before.

- Each item has an ID (`OD-n`). When it's decided, set its status to **Decided** and write the decision next to it. Remove nothing.
- "Affects" lists other components that change with the decision. Decide those before building the components they affect.

Status: **Open** · **Decided** · **Dropped**

### 1. Proposed DESIGN.md changes

| ID | Change | Status | Notes |
|---|---|---|---|
| – | `Button XL` text style (§3.4) | Decided | Already in DESIGN.md |
| – | `Size-320` (§3.5) | Decided | Already in DESIGN.md |
| OD-1 | `NlButton variant="soft"` (filled `bg-action-secondary`, no border) | Open | Only if OD-40 goes that way. Would change D12. Left out of `NlButtonBase` for now (18 Nov 2026); adding it later is not breaking |
| OD-2 | `NlTextBlock` types `label` and `body` | **Decided** 18 Nov 2026: both added | See OD-14 and OD-41 |
| OD-3 | Focus ring colour on fields with an error: `border-error` instead of `border-focused` | Decided 19 Nov 2026: no; standard ring (OD-44) | Would add an exception to CLAUDE.md's focus ring rule. See OD-44 |
| OD-91 | A maximum-width size token for snackbars (for example `Size-560`) | **Decided** 20 Nov 2026: `Size-560` added | See OD-104 |
| OD-92 | A time token for snackbar auto-dismiss (for example 6 s) | **Decided** 20 Nov 2026: `--nl-duration-snackbar` 6000ms | See OD-105 |
| OD-121 | Dialog width tokens, for example a small and a large width (480 and 720) in §3.5 | **Decided** 20 Nov 2026: small `Size-560` (existing), large `Size-720` (added) | See OD-115 |
| OD-133 | A side sheet width token (the reference uses 600) in §3.5 | Open, **needs approval** (decide in Storybook) | Could share a scale with OD-121 |
| OD-134 | A side nav column width token (240; the expanded nav is 240 + `Space-XL` either side) in §3.5 | Open, **needs approval** (decide in Storybook) | Minimized width uses the existing `Size-80` |

### 2. Decisions that affect other components

Decide these before building the components listed under "Affects".

| ID | Component | Question | Proposal | Affects | Status |
|---|---|---|---|---|---|
| OD-14 | `NlTextBlock` | List rows need `Label M` / `Body S` text | Add `type="label"` (gap `Space-none`) | All list items, `NlSideNavUser`, `NlMenu` rows | **Decided** 18 Nov 2026: approved |
| OD-15 | `NlTextBlock` | Disabled text colour | `disabled` prop → `text-disabled` | `NlCheckbox`, list items, `NlListCaption` | **Decided** 18 Nov 2026: approved (contrast: K3) |
| OD-16 | `NlTextBlock` | Heading element | `headingAs`, default `p` | `NlDialog`, `NlSideSheet`, `NlPageHeader`, `NlEmptyState` | **Decided** 18 Nov 2026: approved |
| OD-31 | `NlButton` | Icon-only sizes inside fields | Fields use the xsmall icon-only button (20 icon). Large fields lose the 24 icon | `NlPasswordField`, `NlSearchField`, `NlSelect`, `NlDateField` | **Decided** 19 Nov 2026: xsmall (32, 20 icon) in both field sizes |
| OD-40 | `NlNotificationButton` | Its look matches no `NlButton` variant | (b) add `variant="soft"` to `NlButton` (recommended) or (a) its own button as a D12 exception | `NlButton`, `NlPageHeader` | **Decided** 19 Nov 2026: (a) its own native button |
| OD-41 | `NlCheckbox` | How to get `Body L` text | (b) `NlTextBlock type="body"` (recommended) or (a) `type="display-large"` | `NlTextBlock` | **Decided** 18 Nov 2026: (b), built in `NlTextBlock` |
| OD-42 | `NlInputBase` | Label at rest | A real label at all times, in the placeholder position at rest, floating on focus or when filled | Every field | **Decided** 19 Nov 2026: approved; the hint text was then removed (box empty while focused) |
| OD-43 | `NlHelperText` | Default text colour | `text-tertiary` (as fields use it) instead of `text-secondary` | Every field | **Decided** 19 Nov 2026: `text-tertiary` |
| OD-44 | `NlInputBase` | Error focus ring colour | `border-error` (reference) vs `border-focused` (CLAUDE.md) | Every field | **Decided** 19 Nov 2026: the standard `border-focused` ring |
| OD-50 | `NlLabel` | Tone option | Batch 6 makes this stronger: add `tone` (tertiary default, primary, secondary, action). `NlStep` needs three colours, `NlCalendar` weekday names want `text-secondary` | `NlCalendar`, `NlStep` | **Decided** 19 Nov 2026: `tone` added to `NlLabel` (tertiary default, primary, secondary, action) |
| OD-93 | `NlBanner`, `NlSnackbar` | Their text is recoloured by tone, which `NlTextBlock` can't do | Plain text inside these components, not `NlTextBlock` (inventory dependency for the snackbar goes) | `NlBanner`, `NlSnackbar` | **Decided** 20 Nov 2026: plain text |
| OD-117 | `NlButton` | The table's link cell needs a link button with no inline padding, so its text lines up with the header | `variant="link"` gets no inline padding (instead of tertiary padding) | `NlTableCell`, any inline link | Open |
| OD-119 | `NlListItemBase` | The side nav user row uses different padding (`Space-L` / `Space-XL`) and `Radius-M` | A third density, `density="nav"` | `NlSideNavUser` | Open |
| OD-120 | `NlTextBlock` | The side nav user row pairs a `Label M` title with a `Body M` description, which neither proposed small type gives | A second small type, or let `type="label"` take `Body M` | `NlSideNavUser`, maybe list rows | Open |

### 3. By component

#### Atoms L0

**NlCountBadge**
- OD-4 · Minimum width for two digits: `Size-16` (small), `Size-20` (large) · **Decided** 18 Nov 2026: approved

**NlDivider**
- OD-5 · Vertical orientation: not specified; add if a component needs it · Open. 18 Nov 2026: built horizontal only; look again if a page needs it

**NlSkeleton**
- OD-6 · Pulse easing: `--nl-ease-standard` · **Decided** 18 Nov 2026: approved

**NlProgressBar**
- OD-7 · Width animation: `--nl-duration-base`, `--nl-ease-standard`, none under reduced motion · **Decided** 18 Nov 2026: approved
- OD-8 · Default size: `small` · **Decided** 18 Nov 2026: approved
- OD-9 · Indeterminate bar: not specified (`NlSpinner` covers unknown duration) · Open

**NlSlider**
- OD-10 · Hover, pressed, focus, disabled states: approved for now, check in Storybook · **Decided** 18 Nov 2026: approved after the Storybook check
- OD-11 · Defaults: `min` 0, `max` 100, `step` 1 · **Decided** 18 Nov 2026: approved
- OD-12 · Visible value or ticks: not specified · Open

**NlSwitch**
- OD-13a · Handle inset: `Space-XS` · **Decided** 18 Nov 2026: approved
- OD-13b · Hover and pressed: on = `fg-hovered` / `fg-pressed`; off = unchanged (no token works in both themes) · **Decided** 18 Nov 2026: no hover or pressed colours, on or off (white handle too faint in Dark)
- OD-13c · Slide animation: `--nl-duration-fast`, `--nl-ease-standard` · **Decided** 18 Nov 2026: approved
- OD-13d · Default size: `large` · **Decided** 18 Nov 2026: approved

**NlTextBlock**
- OD-14, OD-15, OD-16: see section 2

**NlMenu**
- OD-17 · Shadow: `--nl-shadow-menu` · **Decided** 18 Nov 2026: approved
- OD-18 · Placement: `Space-XS` from the trigger, flips, `Space-M` from the window edge, at least the trigger's width · **Decided** 18 Nov 2026: approved, built with `@floating-ui/dom`
- OD-19 · `kind` prop (action, select, filter, navigation) with roles and keyboard · **Decided** 18 Nov 2026: approved; Tab closes action, select and navigation menus
- OD-20 · `maxHeight` as a `Size-*` token name · **Decided** 18 Nov 2026: approved
- OD-21 · Open and close: fade, `--nl-duration-base` · **Decided** 18 Nov 2026: approved

**NlChipGroup**
- OD-22 · `wrap` option · Open
- OD-23 · `selection` model (none, single, multiple) · Open

**NlAppShell**
- OD-24 · Content padding `Space-3XL`, block gap `Space-4XL` · Open
- OD-25 · Skip link: standard focus ring · Open
- OD-26 · Content focus ring: 2px inset `border-focused` · Open

**NlCalendarDay**
- OD-27 · `today` as a separate boolean (combines with selected and range) · **Decided** 19 Nov 2026: approved; no border on filled types, `border-disabled` when disabled
- OD-28 · Focus: standard ring · **Decided** 19 Nov 2026: approved

**NlListCaption**
- OD-29 · Disabled colour `text-disabled`, set by the row · **Decided** 19 Nov 2026: approved

**NlNavSubItem**
- OD-30a · Tree line position: the icon centre, `Space-L` + half of `Size-20` from the row's start (worked out in the `NlNavItem` spec, matches the reference) · **Decided** 19 Nov 2026: approved, through `nl:nav-tree-line`
- OD-30b · Focus: standard ring · **Decided** 19 Nov 2026: approved

**NlPaginationItem**
- OD-32 · Minimum width `Size-32`, hugs longer numbers · **Decided** 19 Nov 2026: approved
- OD-33 · Pressed state: same as hover · **Decided** 19 Nov 2026: approved
- OD-34 · Focus: standard ring · **Decided** 19 Nov 2026: approved
- OD-35 · Ellipsis: one "…" character · **Decided** 19 Nov 2026: approved

**NlPageDot**
- OD-36 · Selected width `Size-24` (reference 22) · **Decided** 19 Nov 2026: approved
- OD-37 · Radius `Radius-Full` · **Decided** 19 Nov 2026: approved
- OD-38 · Width animation `--nl-duration-base` · **Decided** 19 Nov 2026: approved; the fill changes on the same timing
- OD-39 · Clickable dots: not specified · **Decided** 19 Nov 2026: not interactive

#### Atoms L1

**NlIconContainer**
- OD-45 · Drop padding and gap (fixed size, icon centred) · **Decided** 18 Nov 2026: approved
- OD-46 · Defaults: size 48, tone `primary` · **Decided** 18 Nov 2026: approved

**NlAvatar**
- OD-47 · Default icon `person` · **Decided** 18 Nov 2026: approved, added to the registry
- OD-48 · Default size `medium` · **Decided** 18 Nov 2026: approved

**NlBadgeBase**
- OD-49 · Height hugs the content (26 and 32 aren't tokens) · **Decided** 18 Nov 2026: small hugs (26); large has a `Size-32` minimum height

**NlBadge**
- OD-51 · `size` passed through, default `small` · **Decided** 18 Nov 2026: approved
- OD-52 · Leading and trailing icons passed through, coloured `fg-*` per tone · **Decided** 18 Nov 2026: approved, off by default
- OD-53 · Default tone `neutral` · **Decided** 18 Nov 2026: approved

**NlWhiteButton**
- OD-54 · With `tone="white"`, `variant` is ignored (or restricted to `primary`) · **Decided** 18 Nov 2026: restricted to `primary` in `NlButton`'s types (applied in #27)

**NlButton**
- OD-55 · No separate icon tone (`contentTone="secondary"` covers close buttons) · **Decided** 19 Nov 2026: approved
- OD-56 · Content tones use the same alpha for hover and press · **Decided** 19 Nov 2026: approved
- OD-57 · `aria-expanded="true"` uses the pressed look · **Decided** 19 Nov 2026: approved
- OD-58 · Defaults: normal, primary, medium, no icon · **Decided** 19 Nov 2026: approved
- OD-59 · Loading state: not specified · **Decided** 19 Nov 2026: left out for now (adding it later is not breaking)
- OD-31: see section 2

**NlCheckboxControl**
- OD-60 · Icons `check` and `remove` · **Decided** 19 Nov 2026: approved

**NlSpinner**
- OD-61 · 4px ring as an SVG stroke (artwork exception) · **Decided** 19 Nov 2026: approved
- OD-62 · Indeterminate by default, optional `value` · **Decided** 19 Nov 2026: approved
- OD-63 · One turn per `--nl-duration-pulse`, linear · **Decided** 19 Nov 2026: approved
- OD-64 · Error icon `warning` · **Decided** 19 Nov 2026: approved

**NlLabel**
- OD-65 · `badgeTone` (error, warning, success) · **Decided** 19 Nov 2026: approved
- OD-66 · `as="label"` · **Decided** 19 Nov 2026: approved
- OD-50: see section 2

**NlSegment**
- OD-67 · Small icon-only size from padding (reference 28, not a token) · **Decided** 19 Nov 2026: approved
- OD-68 · Unselected hover label `text-tertiary` (as the reference) · **Decided** 19 Nov 2026: approved

**NlHelperText**
- OD-69 · Icons: `info`, `check_circle`, `warning`; maybe `error` for the error tone · **Decided** 19 Nov 2026: approved
- OD-70 · Icon aligned to the first line when text wraps · **Decided** 19 Nov 2026: approved
- OD-43: see section 2

**NlNavIcon**
- OD-71 · Filled glyph when selected · **Decided** 19 Nov 2026: approved

**NlPageDots**
- OD-72 · Clickable dots: not specified · **Decided** 19 Nov 2026: not interactive (with OD-39)

**NlTooltip**
- OD-73 · Show delay `--nl-duration-base` on hover, none on focus · **Decided** 19 Nov 2026: approved
- OD-74 · Placement: `Space-XS` from the trigger, `Space-M` from the window edge · **Decided** 19 Nov 2026: approved

#### Molecules

**NlSegmentedButton**
- OD-75 · An `options` array (2 or 3) instead of show/hide booleans · **Decided** 19 Nov 2026: approved

**NlCheckbox**
- OD-41, OD-15: see section 2

**NlNotificationButton**
- OD-40: see section 2

**NlInputBase**
- OD-42, OD-43, OD-44: see section 2
- OD-76 · Helper icon: hidden for default, shown for success, warning and error everywhere · **Decided** 19 Nov 2026: approved
- OD-77 · Floating label `text-tertiary` everywhere · **Decided** 19 Nov 2026: approved
- OD-78 · Required marker: not specified · **Decided** 19 Nov 2026: no marker (native `required` only)

**NlTextField**
- OD-79 · Trailing icon: any registry icon, decorative · **Decided** 19 Nov 2026: approved

**NlPasswordField**
- OD-80 · Toggle as an `NlButton` (see OD-31 for size) · **Decided** 19 Nov 2026: approved, xsmall; fixed name "Show password" with `aria-pressed`
- OD-81 · Icons `visibility`, `visibility_off` · **Decided** 19 Nov 2026: approved

**NlSearchField**
- OD-82 · Hover and disabled taken from `NlInputBase` · **Decided** 19 Nov 2026: approved
- OD-83 · Clear button as an `NlButton` (see OD-31) · **Decided** 19 Nov 2026: approved, xsmall
- OD-84 · Icons `search`, `cancel` · **Decided** 19 Nov 2026: approved

**NlTextAreaBase**
- OD-85 · Height from `rows` (default 4) · **Decided** 19 Nov 2026: approved (4 rows = 128)
- OD-86 · Vertical resize only · **Decided** 19 Nov 2026: approved; none when disabled
- OD-87 · Floating label `text-tertiary` · **Decided** 19 Nov 2026: covered by OD-77

**NlTextArea**
- OD-88 · Filled value `text-primary` (the reference shows placeholder colour) · **Decided** 19 Nov 2026: approved
- OD-89 · Character count with `maxLength` · **Decided** 19 Nov 2026: approved; built into `NlTextAreaBase`, hard limit, announced at 20, 10, 5 and 0 left

**NlCalendar**
- OD-90 · Raw white fills map to `bg-primary` · **Decided** 20 Nov 2026: `bg-primary`
- OD-50: see section 2

**NlStep**
- OD-50: see section 2 (label colour per state)
- OD-94 · Column width `Space-10XL` (a spacing token used as a width) · Open
- OD-95 · Line length set by the stepper layout, not a raw 124 · Open
- OD-96 · Hover on done steps that go back: label underlined · Open

**NlListItemBase**
- OD-14, OD-15: see section 2 (small-row text, disabled text)
- OD-97 · Pressed: same as hover · **Decided** 20 Nov 2026: approved
- OD-148 · Divider colour when disabled · **Decided** 20 Nov 2026: stays `border-default`
- OD-149 · Top label style · **Decided** 20 Nov 2026: `NlLabel` small, hidden by default
- OD-150 · Extra icon after the title · **Decided** 20 Nov 2026: in the title row, `Space-M` (8) gap, decorative
- OD-151 · Hover and pressed · **Decided** 20 Nov 2026: only on actionable rows

**NlListItem**
- OD-98 · Static rows (no action) have no hover or focus · **Decided** 20 Nov 2026: approved; a chevron makes the whole row clickable
- OD-99 · Chevron icon `chevron_right` · **Decided** 20 Nov 2026: approved
- OD-152 · `aria-current` on selected rows · **Decided** 20 Nov 2026: the page sets it
- OD-153 · Disabled: native on buttons, `aria-disabled` on links (no `href`) and menu rows · **Decided** 20 Nov 2026: approved
- OD-154 · `divider` prop · **Decided** 20 Nov 2026: exposed, on by default
- OD-155 · Base slots · **Decided** 20 Nov 2026: `body` exposed; top label and extra icon hidden

**NlCheckboxListItem / NlRadioListItem / NlSwitchListItem**
- OD-100 · The control's hover look follows the row hover · **Decided** 20 Nov 2026: `NlCheckboxControl inRow` + `NlListItemBase controlRow`
- OD-101 · Radio group wrapper: plain `role="radiogroup"` or a provided `.Group` · **Decided** 20 Nov 2026: `NlRadioListGroup`, a separate export
- OD-160 · Radio group layout · **Decided** 20 Nov 2026: the group passes `appearance`; filled cards `Space-L` apart
- OD-161 · `NlRadioListItem` menu mode · **Decided** 20 Nov 2026: left out; menus use `NlListItem role="option"`
- OD-162 · Radio group label · **Decided** 20 Nov 2026: the page's; `aria-label` or `aria-labelledby` required
- OD-163 · `NlSwitchListItem` switch position · **Decided** 20 Nov 2026: on the title's first line
- OD-164 · `NlSwitchListItem` `body`, `showBody`, `divider` · **Decided** 20 Nov 2026: all three exposed
- OD-102 · Switch rows: focus ring around the row · **Decided** 20 Nov 2026: ring round the row for control rows (`controlRow`), first used by `NlCheckboxListItem`
- OD-156 · `NlCheckboxListItem` indeterminate · **Decided** 20 Nov 2026: left out; table components handle it
- OD-157 · `NlCheckboxListItem` menu mode (`role="option"`) · **Decided** 20 Nov 2026: left out
- OD-158 · `NlCheckboxListItem` body slot · **Decided** 20 Nov 2026: exposed
- OD-159 · Group label for checkbox rows · **Decided** 20 Nov 2026: the page provides `role="group"` with a name

**NlAccordion**
- OD-103a · `open` prop and behaviour (not drawn as states in the reference) · Open
- OD-103b · Small title via `NlTextBlock type="label"` (OD-14) instead of a recoloured `NlLabel` · Open
- OD-103c · Header hover (frame `bg-secondary`) and focus ring · Open
- OD-103d · Disabled: not specified · Open
- OD-103e · Chevron icons · Open

**NlBanner**
- OD-93: see section 2
- OD-106 · Action button: tertiary xsmall with `contentTone` (36 tall; the reference squeezes it to 24) · **Decided** 20 Nov 2026: link button, xsmall, normal tone (designer's choice)
- OD-107 · Close as an `NlButton` icon-only · **Decided** 20 Nov 2026: xsmall (32), tertiary, `contentTone`
- OD-108 · Error icon `error` (differs from warning) · **Decided** 20 Nov 2026: approved
- OD-109 · `role="status"` / `role="alert"` for banners added after load · **Decided** 20 Nov 2026: opt-in with `live`
- OD-165 · Banner icon on the first text line; close stays top-aligned · **Decided** 20 Nov 2026: approved

**NlSnackbar**
- OD-93: see section 2
- OD-104 · Position: bottom-centre of the content panel, `Space-3XL` up; maximum width needs a token (OD-91) · **Decided** 20 Nov 2026: bottom centre, `Space-3XL` up, `Size-560` max
- OD-105 · Auto-dismiss duration needs a token (OD-92); none when there's an action · **Decided** 20 Nov 2026: 6s token; none with an action
- OD-110 · Keyboard access to the action (F6 or next Tab into the region) · **Decided** 20 Nov 2026: F6
- OD-111 · Error icon `error` · **Decided** 20 Nov 2026: approved
- OD-166 · How pages show snackbars · **Decided** 20 Nov 2026: `NlSnackbarProvider` + `useNlSnackbar()`
- OD-167 · Single or stacked · **Decided** 20 Nov 2026: explicit `layout`, default single
- OD-168 · Close on by default · **Decided** 20 Nov 2026: `showClose`, default on

**NlButtonDock**
- OD-169 · Destructive primary · **Decided** 20 Nov 2026: left out
- OD-170 · Narrow containers · **Decided** 20 Nov 2026: the end group wraps, stays at the end
- OD-171 · Nothing to show · **Decided** 20 Nov 2026: renders nothing

**NlEmptyState**
- OD-112 · `icon` (container built in) or `iconSlot` for anything else · **Decided** 20 Nov 2026: approved
- OD-172 · Default heading level · **Decided** 20 Nov 2026: `h2`
- OD-173 · No icon given · **Decided** 20 Nov 2026: no icon shown
- OD-174 · "No results" announcement · **Decided** 20 Nov 2026: opt-in `live` (`role="status"`)

**NlStatCard**
- OD-50: see section 2 (label in `text-secondary`)
- OD-113 · Value in `Data M` (tabular figures), rendered by the card itself, so it no longer uses `NlTextBlock` · **Decided** 20 Nov 2026: approved
- OD-175 · Cards in a description list · **Decided** 20 Nov 2026: opt-in `inList` (`<dt>` / `<dd>`)
- OD-176 · Long values · **Decided** 20 Nov 2026: wrap

**NlFileUpload**
- OD-114 · Dashed border via Tailwind's `border-dashed` (dash length set by the browser, not exactly 4/4) · **Decided** 20 Nov 2026: approved
- OD-122 · Drag-over look: `border-active` + `bg-active` · **Decided** 20 Nov 2026: approved
- OD-123 · Disabled look: `border-disabled`, icon `tone="disabled"`, button disabled · **Decided** 20 Nov 2026: approved
- OD-124 · Icons `cloud_upload`, `check`, `delete`, `error` · **Decided** 20 Nov 2026: approved (`cloud_upload` added)
- OD-177 · Button icons: `cloud_upload`, `close`, `refresh` · **Decided** 20 Nov 2026: approved (`refresh` added)
- OD-178 · Wrong-type drops ignored, `onFileReject` · **Decided** 20 Nov 2026: approved

**NlDialog**
- OD-16, OD-41: see section 2 (heading level; `Body L` body text)
- OD-115 · Width: needs tokens (OD-121) · **Decided** 20 Nov 2026: `Size-560` / `Size-720`, default small
- OD-125 · Open motion: fade and slight scale, `--nl-duration-slow`; reduced motion fade only · **Decided** 20 Nov 2026: scale from 95%
- OD-179 · Title as `h2` · **Decided** 20 Nov 2026: approved
- OD-180 · `role="alertdialog"` when the primary is destructive · **Decided** 20 Nov 2026: approved
- OD-181 · Long content: panel `Space-3XL` from the edges, body scrolls · **Decided** 20 Nov 2026: approved

**NlPagination**
- OD-126 · Previous at page 1 uses the real disabled state (the reference draws it enabled with a grey icon) · **Decided** 20 Nov 2026: approved
- OD-127 · `siblingCount` 1 (first, last, current ±1) · **Decided** 20 Nov 2026: approved
- OD-128 · Icons `chevron_left`, `chevron_right` · **Decided** 20 Nov 2026: approved
- OD-182 · No gaps that save nothing (one hidden page, or every page fits) · **Decided** 20 Nov 2026: approved
- OD-183 · Out-of-range page clamped · **Decided** 20 Nov 2026: approved

**NlTableHeaderCell**
- OD-116 · Sort and filter controls are plain native buttons inside the cell, not `NlButton` · Open
- OD-129 · Icons `unfold_more`, `arrow_upward`, `arrow_downward`, `keyboard_arrow_down/up` · Open

**NlTableCell**
- OD-117: see section 2 (link with no inline padding)

**NlNavItem**
- OD-118 · Minimized nav: a section's pages open in an `NlMenu` (`kind="navigation"`) to the right · Open
- OD-130 · State names `current="page"` (white row) and `current="section"` (grey row) · Open
- OD-131 · Pages `Space-XS` apart (the reference also uses `Space-M` in one place) · Open

**NlSideNavUser**
- OD-119, OD-120: see section 2
- OD-132 · Avatar `size="medium"` (40); the reference sets the xsmall variant but draws 40 · Open

### Organisms

**NlSelect**
- OD-139 · "Typing" means type-ahead on the focused field, no free text · Open
- OD-140 · Option rows are `NlListItem size="small"` · Open

**NlMultiSelect**
- OD-136 · "+N" overflow chip, chips `Space-XS` apart · Open

**NlDateField**
- OD-31: see section 2 (calendar button size)
- OD-137 · `format` prop, default `DD/MM/YYYY`; locale formats later · Open
- OD-141 · Small size: not in the reference · Open

**NlStepper**
- OD-142 · More than 5 steps: not supported · Open

**NlTableColumnFilter**
- No open items (behaviour comes from the reference's description)

**NlSideSheet**
- OD-133: see section 1 (width)
- OD-143 · Slide in from the right, `--nl-duration-slow`; reduced motion fade only · Open

**NlPageHeader**
- OD-135 · Bottom edge: the reference uses a 4px `bg-secondary` stroke, which §4.2 doesn't allow. Options: no border with a `Space-XS` gap, or a 1px `border-default` divider · Open, **needs approval** (decide in Storybook)
- OD-144 · Title as `h1` · Open

**NlTable**
- OD-138 · Empty (`NlEmptyState`) and loading (`NlSkeleton` rows) states; column widths and sideways scrolling · Open
- OD-145 · `NlTableColumnFilter` rendered as menu content from the header cell (slot content, D15), or passed in by the page · Open, **needs approval** (decide in Storybook)

**NlSideNav**
- OD-134: see section 1 (column width)
- OD-146 · Collapse icon `dock_to_right` · Open
- OD-147 · Width change animated with `--nl-duration-slow` · Open
