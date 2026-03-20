---
phase: 01-layout-shell
plan: 01
subsystem: layout
tags: [components, header, announcement-bar, tailwind, client-components]
dependency_graph:
  requires: []
  provides: [AnnouncementBar, HomepageHeader]
  affects: [app/layout.tsx]
tech_stack:
  added: []
  patterns: [rotating-messages-with-useEffect, cart-badge-with-useCart]
key_files:
  created:
    - components/layout/AnnouncementBar.tsx
    - components/layout/HomepageHeader.tsx
  modified:
    - app/layout.tsx
decisions:
  - AnnouncementBar placed outside CartProvider in root layout because it requires no cart state
  - prefers-reduced-motion respected by skipping interval rotation and showing first message statically
metrics:
  duration: "2 minutes"
  completed_date: "2026-03-20"
  tasks_completed: 2
  files_created: 2
  files_modified: 1
---

# Phase 01 Plan 01: Layout Shell — Announcement Bar & Homepage Header Summary

**One-liner:** Client-side rotating announcement bar (bg-forest, 4s interval, reduced-motion aware) and full-width homepage header (logo, search, nav, cart badge) wired into root layout.

## What Was Built

### AnnouncementBar (`components/layout/AnnouncementBar.tsx`)
A "use client" component that renders a full-width forest-green bar. It cycles through three promo messages every 4 seconds using `setInterval` inside `useEffect`, with an opacity fade transition (500ms) between messages. Detects `prefers-reduced-motion` on mount and skips rotation when the user has requested it.

### HomepageHeader (`components/layout/HomepageHeader.tsx`)
A "use client" component with a three-zone layout inside `max-w-content`:
- LEFT: Kaava logo (font-outfit, text-forest) with "Verified Ayurveda" tagline
- CENTER: Search input with rounded-full border and inline magnifying-glass SVG
- RIGHT: Concerns / Brands / About links plus a cart button with a bg-saffron badge that renders only when `totalItems > 0`, calling `openDrawer()` on click

### Root Layout (`app/layout.tsx`)
Added `import AnnouncementBar from "@/components/layout/AnnouncementBar"` and rendered it as the first child inside `<body>`, above `<CartProvider>`. All existing metadata, Google Fonts links, and CartProvider structure preserved.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Create AnnouncementBar and HomepageHeader | 82a05cb |
| 2 | Wire AnnouncementBar into root layout | 612ba0a |

## Deviations from Plan

None — plan executed exactly as written.

## Decisions Made

1. AnnouncementBar is placed outside CartProvider because it needs no cart state, keeping the dependency boundary clean.
2. prefers-reduced-motion handling detects the media query on mount via `useEffect` and sets a boolean that prevents the rotation interval from being created at all (rather than running the interval but skipping the visual).

## Self-Check

Verified files exist:
- components/layout/AnnouncementBar.tsx — FOUND
- components/layout/HomepageHeader.tsx — FOUND
- app/layout.tsx updated with AnnouncementBar import and render — FOUND

Verified commits:
- 82a05cb — FOUND
- 612ba0a — FOUND

`npx tsc --noEmit` — zero errors both after Task 1 and Task 2.

## Self-Check: PASSED
