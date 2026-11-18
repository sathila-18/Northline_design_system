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
