# Build log

How long the rebuild takes. One row per setup task, component and page: added when work starts, completed when the designer approves (CLAUDE.md, "Build log"). Times are local, from the system clock.

| Item | Started | Approved | Notes |
|---|---|---|---|
| S-1 | 2026-11-17 21:46 | 2026-11-17 23:34 | Specs into DESIGN.md §8 and §9 |
| S0 | 2026-11-17 21:46 | 2026-11-17 23:34 | Token JSON and audit. Decisions in D17 |
| S1 | 2026-11-17 23:49 | 2026-11-17 23:52 | Scaffold. Merged without a separate review (setup tasks S1 to S8, designer's instruction 17 Nov) |
| S2 | 2026-11-17 23:55 | 2026-11-18 00:00 | Token build. Merged without a separate review (setup S1 to S8) |
| S3 | 2026-11-18 00:00 | 2026-11-18 00:01 | Hand-written styles. Merged without a separate review (setup S1 to S8) |
| S4 | 2026-11-18 00:02 | 2026-11-18 00:04 | Fonts and base styles. Merged without a separate review (setup S1 to S8) |
| S5 | 2026-11-18 00:06 | 2026-11-18 00:27 | Storybook. Reviewed and approved by the designer |
| S6 | 2026-11-18 00:29 | 2026-11-18 00:41 | Checks. K2 accepted by the designer; merged without a separate review (setup S1 to S8) |
| S7 | 2026-11-18 00:42 | 2026-11-18 00:44 | Next.js check. Merged without a separate review (setup S1 to S8) |
| S8 | 2026-11-18 00:45 | 2026-11-18 01:07 | Vercel. Dashboard set up by the designer; production checked in a browser, preview build succeeded |
| NlIcon | 2026-11-18 07:40 | 2026-11-18 08:04 | Includes the icon font subset (§6), option (a), and the Icon font weight token (300). Approved by the designer |
| NlStatusDot | 2026-11-18 08:15 | 2026-11-18 08:22 | Ring uses border-inverse (same values as fg-inverse), designer's choice. Approved by the designer |
| NlCountBadge | 2026-11-18 08:26 | 2026-11-18 08:32 | OD-4 approved; fixed height for double digits; count 0 renders nothing. Approved by the designer |
| NlDivider | 2026-11-18 10:29 | 2026-11-18 11:43 | Horizontal only (OD-5 stays open); section fill via nl:bg-border-default utility, designer's choice. Approved by the designer |
| NlSkeleton | 2026-11-18 11:48 | 2026-11-18 11:58 | OD-6 approved; pulse via nl:animate-skeleton-pulse utility; width-only resizing, circle fixed at Size-24 for now. Approved by the designer |
| NlOverlay | 2026-11-18 12:02 | 2026-11-18 12:12 | Motion utilities added to the token build (§3.8); hidden = display none so it fades out. Approved by the designer |
| NlProgressBar | 2026-11-18 12:47 | 2026-11-18 13:05 | OD-7 and OD-8 approved; fill width via nl:progress-fill utility; OD-9 open. Approved by the designer |
| NlSlider | 2026-11-18 13:09 | 2026-11-18 14:10 | OD-10 states approved after Storybook check; OD-11 approved; OD-12 open. Native range input under drawn parts; lint accepts group/peer markers. Approved by the designer |
| NlRadio | 2026-11-18 14:47 | 2026-11-18 14:54 | Native radio under drawn ring and dot (named group); fg-* border colours added to the token build; round focus ring. Approved by the designer |
| NlSwitch | 2026-11-18 14:57 | 2026-11-18 15:03 | OD-13a/c/d approved; OD-13b: no hover or pressed colours; border-* mapped to backgrounds in the token build. Approved by the designer |
| NlTextBlock | 2026-11-18 15:07 | 2026-11-18 15:25 | OD-2/14/15/16/41 decided, OD-120 open; K3 accepted; lint and a11y script fixes. Approved by the designer |
| NlMenu | 2026-11-18 15:31 | 2026-11-18 15:43 | OD-17 to OD-21 approved; @floating-ui/dom added for positioning; Tab closes action, select and navigation menus. Approved by the designer |
| NlIconContainer | 2026-11-18 16:02 | 2026-11-18 16:10 | OD-45 and OD-46 approved; circle sets the colour, icon inherits; K1 accepted for primary and disabled in Light. Approved by the designer |
| NlAvatar | 2026-11-18 16:19 | 2026-11-18 16:35 | OD-47 and OD-48 approved; `person` icon added; bounding box holds circle and dot; image fallback checks after hydration; story placeholder in apps/storybook/public. Approved by the designer |
| NlBadgeBase | 2026-11-18 16:39 | 2026-11-18 16:47 | OD-49: small hugs (26), large min Size-32; border as inset ring; colours via appearance; long labels widen. Approved by the designer |
| NlBadge | 2026-11-18 17:00 | 2026-11-18 17:10 | OD-51, OD-52 (icons off by default), OD-53 approved; K4 accepted. Approved by the designer |
| NlButtonBase | 2026-11-18 17:13 | 2026-11-18 17:22 | appearance replaces resting colours; focus ring in the base; soft variant left out (OD-1/OD-40 open); D12 note updated. Approved by the designer |
| NlWhiteButton | 2026-11-18 17:29 | 2026-11-18 17:40 | Built on NlButtonBase (fixed appearance); §8 dependency and D12 updated; OD-54 decided (applied in #27). Approved by the designer |
| NlDestructiveButton | 2026-11-18 17:44 | 2026-11-18 17:54 | Built on NlButtonBase (fixed appearance per variant); no link variant; §8 dependency and D12 updated. Approved by the designer |
| NlButton | 2026-11-19 07:47 | 2026-11-19 08:05 | OD-55 to OD-59 decided; state selectors not-disabled:not-aria-disabled: (rule 9 exception, approved); link underline on a label span in NlButtonBase. Approved by the designer |
| NlCheckboxControl | 2026-11-19 08:13 | 2026-11-19 08:40 | OD-60 approved; focus ring on the hit area with Radius-XS; bg-active-hover for unselected hover and pressed; indeterminate is the caller's. Approved by the designer |
| NlSpinner | 2026-11-19 09:43 | 2026-11-19 10:04 | OD-61 to OD-64 approved; spinner track, arc, value and turn utilities (rule 9, approved); status region always rendered. Approved by the designer |
| NlLabel | 2026-11-19 10:09 | 2026-11-19 10:42 | OD-50 (tone), OD-65, OD-66 approved; badgeLabel required with a badge. Approved by the designer |
| NlChipBase | 2026-11-19 11:26 | 2026-11-19 11:57 | Default size small; trailing slot added for NlInputChip; appearance replaces resting colours. Approved by the designer |
| NlFilterChip | 2026-11-19 12:07 | 2026-11-19 12:34 | Leading icon fg-primary when off (designer's choice); no border = inset ring width 0. Approved by the designer |
| NlAssistChip | 2026-11-19 13:44 | 2026-11-19 14:11 | popup prop and onOpenChange added; open keeps its look on hover (designer's choice); checked with NlMenu in the browser. Approved by the designer |
| NlInputChip | 2026-11-19 14:17 | 2026-11-19 15:10 | Native remove button (not NlButton) so the chip keeps its height; focus ring Radius-XS; K5 accepted for disabled contrast. Approved by the designer |
| NlSegment | 2026-11-19 15:14 | 2026-11-19 15:22 | OD-67, OD-68 approved; native radio (designer's choice); sizes measured in the browser. Approved by the designer |
| NlHelperText | 2026-11-19 15:30 | 2026-11-19 16:01 | OD-43 (text-tertiary), OD-69 (error glyph), OD-70 (icon centred on first line via 1lh slot); disabled samples marked K3. Approved by the designer |
| NlNavIcon | 2026-11-19 16:11 | 2026-11-19 16:31 | OD-71 approved (filled when selected); no states of its own. Approved by the designer |
| NlTooltip | 2026-11-19 16:32 | 2026-11-19 16:47 | OD-73, OD-74 approved; tooltip-position utility (rule 9, approved); hoverable frame instead of a hide delay; light box in Dark accepted. Approved by the designer |
| NlSegmentedButton | 2026-11-19 16:50 | 2026-11-19 17:31 | OD-75 approved; NlTooltip added as a dependency; Home and End added; menu use not built. Approved by the designer |
| NlCheckbox | 2026-11-19 17:34 | 2026-11-19 17:43 | OD-15/OD-41 already settled by NlTextBlock; label row kept (designer's choice). Approved by the designer |
| NlNotificationButton | 2026-11-19 17:52 | 2026-11-19 18:08 | OD-40 (a) own button; notifications icon added; name uses "99+" (WCAG 2.5.3). Approved by the designer |
| NlInputBase | 2026-11-19 18:10 | 2026-11-19 18:24 | OD-42, OD-44, OD-76, OD-77 decided; OD-78 open; select type deferred to #70; label floats via peer variants. Approved by the designer |
| NlTextField | 2026-11-19 18:27 | 2026-11-19 18:42 | OD-79 approved; hint text removed from NlInputBase and NlTextField (designer's choice). Approved by the designer |
| NlPasswordField | 2026-11-19 21:36 | 2026-11-19 21:47 | OD-31, OD-78, OD-80, OD-81 decided; fixed toggle name with aria-pressed; NlInputBase ring via nl:input-focus (rule 9, approved). Approved by the designer |
| NlSearchField | 2026-11-19 22:02 | 2026-11-19 22:16 | OD-82 to OD-84 decided; hidden label with placeholder shown while focused (designer's choice); hideLabel and placeholder added to NlInputBase; search-cancel-none utility (rule 9, approved). Approved by the designer |
| NlTextAreaBase | 2026-11-19 22:23 | 2026-11-19 22:32 | OD-85, OD-86, OD-87 decided; no placeholder (designer's choice); padding on the textarea so the resize handle sits in the corner. Approved by the designer |
| NlTextArea | 2026-11-19 22:34 | 2026-11-19 22:53 | OD-88, OD-89 approved; count built into NlTextAreaBase (hard limit, announced at 20/10/5/0 left); count flush with the box end. Approved by the designer |
| NlCalendarDay | 2026-11-19 22:55 | 2026-11-19 23:07 | OD-27, OD-28 approved; label prop for the accessible name; one-day range passes selected; K6 accepted (band in Dark). Approved by the designer |
| NlListCaption | 2026-11-19 23:14 | 2026-11-19 23:24 | OD-29 approved; default weight heavy (Label, designer's choice); one line, never truncated. Approved by the designer |
| NlNavSubItem | 2026-11-19 23:27 | 2026-11-19 23:37 | OD-30a, OD-30b approved; tree line utilities in tailwind.css (rule 9, approved); title when cut off. Approved by the designer |
| NlPaginationItem | 2026-11-19 23:39 | 2026-11-19 23:49 | OD-32 to OD-35 approved; current page does nothing on press; flat story controls for the union props. Approved by the designer |
| NlPageDot | 2026-11-19 23:51 | 2026-11-20 00:09 | OD-36 to OD-39 and OD-72 approved; width and fill on the same timing. Approved by the designer |
| NlRowsPerPage | 2026-11-19 16:03 | 2026-11-20 00:25 | Parked 19 Nov (Dark label contrast), resumed 2026-11-20 00:10; label kept text-tertiary, K7 accepted. Approved by the designer |
| NlCalendar | 2026-11-20 00:29 | 2026-11-20 00:41 | OD-90 approved; names prop instead of locale; today via useSyncExternalStore; range rules and limits approved. Approved by the designer |
| NlListItemBase | 2026-11-20 08:06 | 2026-11-20 08:27 | OD-97, OD-148 to OD-151 decided; accessories take any component; hover and pressed only when actionable; OD-119 left for #69. Approved by the designer |
| NlListItem | 2026-11-20 08:33 | 2026-11-20 09:33 | OD-98, OD-99, OD-152 to OD-155 decided; chevron makes the row clickable; name from the row's text (WCAG 2.5.3); NlListItemBase sets native disabled on a button root. Approved by the designer |
| NlCheckboxListItem | 2026-11-20 09:44 | 2026-11-20 10:05 | OD-100, OD-102, OD-156 to OD-159 decided; no indeterminate or menu mode; checkbox on the title line (accessoryAlign="title", designer's choice); NlCheckboxControl inRow and NlListItemBase controlRow added. Approved by the designer |
| NlRadioListItem | 2026-11-20 10:12 | 2026-11-20 10:33 | OD-101 (NlRadioListGroup), OD-160 to OD-162 decided; NlRadio inRow added; showBody added here and to NlCheckboxListItem (designer's choice). Approved by the designer |
| NlSwitchListItem | 2026-11-20 10:36 | 2026-11-20 10:42 | OD-163, OD-164 decided; NlSwitch inRow added (row draws the ring); switch named by the title, described by the description. Approved by the designer |
| NlBanner | 2026-11-20 10:50 | 2026-11-20 11:15 | OD-93, OD-106 to OD-109, OD-165 decided; action as a flush link in the tone colour (designer's choice): NlButton link gained contentTone and flush after the plain link failed contrast. Approved by the designer |
| NlSnackbar | 2026-11-20 11:28 | 2026-11-20 11:53 | OD-91, OD-92 (Size-560 and --nl-duration-snackbar tokens added, audit addendum), OD-93, OD-104, OD-105, OD-110, OD-111, OD-166 to OD-168 decided; NlSnackbarProvider + useNlSnackbar. Approved by the designer |
| NlButtonDock | 2026-11-20 12:03 | 2026-11-20 13:20 | OD-169 to OD-171 decided; buttons small, variants fixed; string accessory as NlTextBlock description. Approved by the designer |
| NlEmptyState | 2026-11-20 13:22 | 2026-11-20 13:56 | OD-112, OD-172 to OD-174 decided; iconSlot wins over icon; live adds role status. Approved by the designer |
| NlStatCard | 2026-11-20 14:02 | 2026-11-20 14:12 | OD-50, OD-113, OD-175, OD-176 decided; value in Data M drawn by the card; inList for dt/dd. Approved by the designer |
| NlFileUpload | 2026-11-20 14:14 | 2026-11-20 14:37 | OD-114, OD-122 to OD-124, OD-177, OD-178 decided; cloud_upload and refresh added to the icon registry (code points checked against the font's ligatures); page owns the upload. Approved by the designer |
| NlDialog | 2026-11-20 14:43 | 2026-11-20 16:07 | OD-115, OD-121 (Size-720 added, audit addendum), OD-125, OD-179 to OD-181 decided; native dialog; max-*-full (max-*-none is Space-none); ghost close icon 16 from top and side (designer's choice); checked open in Chrome with axe. Approved by the designer |
| NlPagination | 2026-11-20 16:30 | 2026-11-20 16:54 | OD-126 to OD-128, OD-182, OD-183 decided; no gaps that save nothing (one hidden page, or every page fits); focus follows the change. Approved by the designer |
| NlTableHeaderCell | 2026-11-20 17:02 | 2026-11-20 17:32 | OD-116, OD-129, OD-184, OD-185 decided; plain native sort and filter buttons; K8 accepted (grey header title 4.46:1 in Dark). Approved by the designer |
| NlTableCell | 2026-11-20 17:37 | 2026-11-20 17:57 | OD-117 (settled by link flush), OD-186 to OD-188 decided; typed props per type; title when cut; stickyEnd for the actions column. Approved by the designer |
| NlNavItem | 2026-11-20 18:04 | 2026-11-20 18:25 | OD-118, OD-130, OD-131, OD-189 to OD-191 decided; NlMenu placement end-start and NlListItem menu links added; minimized tooltip and menu checked in Chrome. Approved by the designer |
| NlSideNavUser | 2026-11-20 21:44 | 2026-11-20 21:58 | OD-119 (appearance nav), OD-120 (label-body), OD-132, OD-192 to OD-196 decided; NlMenu placements top-start and end-end; named from its text plus a hidden menu label (aria-labelledby failed axe label-content-name-mismatch); checked open and hovered in Chrome with axe. Approved by the designer |
| NlSelect | 2026-11-20 22:01 | 2026-11-20 22:10 | OD-139, OD-140, OD-197 to OD-201 decided; NlInputBase select type (read-only combobox, open look, box click, boxRef), NlMenu returnFocusRef; K9 accepted (field label on hover 4.17 Light, found by a hover axe sweep). Approved by the designer |
| NlMultiSelect | 2026-11-20 22:13 | 2026-11-20 22:37 | OD-136, OD-202 to OD-206 decided; NlInputBase valueOverlay (clipped sideways only, so chip borders show), NlCheckboxListItem option mode, NlInputChip removable, NlMenu initialFocus; full test:a11y passed. Approved by the designer |
| NlDateField | 2026-11-20 22:39 | 2026-11-20 22:55 | OD-137, OD-141, OD-207 to OD-211 decided; dateFormat.ts (mask, parse); NlInputBase formatHint; NlMenu matchAnchorWidth and initialFocusSelector; full test:a11y passed. Approved by the designer |
| NlTableColumnFilter | 2026-11-20 23:02 | 2026-11-20 23:16 | OD-212 to OD-215 decided; built from existing parts, no base changes; full test:a11y passed. Approved by the designer |
| NlSideSheet | 2026-11-20 23:19 | 2026-11-20 23:34 | OD-133 (dialog widths, no new token), OD-143, OD-216 to OD-218 decided; native dialog as NlDialog; body gaps inside the scroll area so floating labels aren't cut off; full test:a11y passed. Approved by the designer |
| NlPageHeader | 2026-11-20 23:44 | 2026-11-20 23:56 | OD-135 (option a, no edge; gap noted in NlAppShell's spec), OD-144, OD-219, OD-220 decided; built from existing parts; full test:a11y passed. Approved by the designer |
| NlTable | 2026-11-20 23:59 | 2026-11-21 00:34 | OD-138, OD-145, OD-221 to OD-230 decided (skeleton Size-80, empty Space-4XL, rows bg-primary at rest); NlTableHeaderCell stickyEnd; K8 marked on the stories; full test:a11y passed. Approved by the designer |
| NlSideNav | 2026-11-21 00:37 | 2026-11-21 01:10 | Size-240 token added (OD-134, audit addendum); OD-146, OD-147, OD-231 to OD-233 decided; NlNavItem tree prop; collapse button without aria-expanded (designer's choice); full test:a11y passed. Approved by the designer |
| NlAppShell | 2026-11-21 01:21 | 2026-11-21 01:38 | OD-24, OD-25, OD-26 (outline inside), OD-235, OD-236 decided; panel without fill so the header gap shows the page background; skip link reveal on its own span; full test:a11y passed. Approved by the designer |
| Page: Login | 2026-11-22 17:53 | 2026-11-22 21:34 | Storybook only (Pages/Login). Built from existing components; form 4 grid columns wide; empty required fields show errors on Log in (D18); remember me uses NlCheckbox small; full test:a11y passed. Approved by the designer |
| NlCheckbox size | 2026-11-22 21:16 | 2026-11-22 21:33 | `size` small (Body M, text centred on the control) for the login page; NlTextBlock `body-m` type. OD-237, OD-238; full test:a11y passed. Approved by the designer |
| Radius update | 2026-11-22 21:52 | 2026-11-22 22:45 | Smaller corners (D19): buttons, fields, text area, chips, side nav rows, stat card, segmented button. Side nav tree line connected (OD-239); full test:a11y passed. Approved by the designer |
| Page: Member list | 2026-11-24 14:07 | 2026-11-24 16:15 | Storybook only (Pages/Members/Member list). Page rules, shared layout, member fixtures; icons dashboard, event, help, mail, redeem added. Second pass: filters in the header cells; library OD-240 to OD-243 (header titles on one line, date range column filter, footer layout, onRowClick). Third pass: tier tones on NlBadge (D20), tokens 430 → 486. Approved by the designer |
| NlBulkActionBar | 2026-11-24 15:45 | 2026-11-24 16:15 | Floating pill for bulk actions (D21); NlTable `bulkActions`; icons block, download, swap_horiz; Radius-M corners. Approved by the designer |
| Page: Member details | 2026-11-24 16:23 | 2026-11-24 17:37 | Member list (P2): details side sheet, suspend dialog, success snackbar; replaces the planned Member detail page (P3 removed). NlButtonDock destructive tone (OD-244), NlSnackbarProvider top end (OD-245). Approved by the designer |
| Charts: plan and tokens | 2026-11-24 17:55 | 2026-11-24 19:49 | D9 chart colours, plan for @northline/ui/charts (steps 1 to 3). Approved by the designer |
| NlChartTooltip | 2026-11-24 19:52 | 2026-11-24 21:06 | With the internal NlChartMarker and the @northline/ui/charts entry point. Approved by the designer |
| NlChartLegend | 2026-11-24 21:09 | | Line marker Size-16 2px with the shape; gaps Space-S |
