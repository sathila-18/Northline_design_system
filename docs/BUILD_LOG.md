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
| NlOverlay | 2026-11-18 12:02 | | |
