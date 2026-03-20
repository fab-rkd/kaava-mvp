---
phase: 01-layout-shell
plan: 03
subsystem: ui
tags: [nextjs, react, layout, routing, dynamic-routes]

# Dependency graph
requires:
  - phase: 01-layout-shell/01-01
    provides: HomepageHeader, AnnouncementBar components
  - phase: 01-layout-shell/01-02
    provides: InnerHeader, Footer components
provides:
  - Homepage shell at / with HomepageHeader and Footer
  - Category page shell at /category/[concern] with InnerHeader and Footer
  - Product page shell at /product/[sku] with InnerHeader and Footer
  - Cart page shell at /cart with InnerHeader, no Footer (LAY-05)
  - Checkout page shell at /checkout with InnerHeader, no Footer (LAY-05)
affects: [02-homepage, 03-category-page, 04-product-detail, 05-cart, 06-checkout]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Next.js 16 async params pattern (params is a Promise, must await)
    - Server component pages importing client component headers
    - Simplified layout (no Footer) for transactional pages

key-files:
  created:
    - app/page.tsx
    - app/category/[concern]/page.tsx
    - app/product/[sku]/page.tsx
    - app/cart/page.tsx
    - app/checkout/page.tsx
  modified: []

key-decisions:
  - "Dynamic route params typed as Promise<{ param: string }> rather than PageProps helper — no generated .next/types at time of execution"
  - "Cart and checkout omit Footer per LAY-05 — transactional pages use simplified layout to reduce distraction"
  - "Homepage is a server component even though it imports client components (HomepageHeader) — client boundary handled by the component itself"

patterns-established:
  - "Async params pattern: export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params }"
  - "Page-level components are server components; imported client components manage their own client boundary"
  - "LAY-05 pattern: cart and checkout render InnerHeader but no Footer"

requirements-completed: [LAY-02, LAY-03, LAY-04, LAY-05]

# Metrics
duration: 3min
completed: 2026-03-20
---

# Phase 1 Plan 03: Page Shells Summary

**5 route shells wired to correct header/footer components, completing the layout chrome for all MVP pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-20T16:22:36Z
- **Completed:** 2026-03-20T16:25:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Homepage (/) shell replaced boilerplate with HomepageHeader + Footer + Kaava placeholder content
- Category (/category/[concern]) and product (/product/[sku]) pages created with InnerHeader + Footer using Next.js 16 async params pattern
- Cart (/cart) and checkout (/checkout) pages created with InnerHeader only, no Footer, per LAY-05
- All 5 pages pass TypeScript compilation and `npm run build` with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create homepage shell and category/product page shells with Footer** - `a4d4cf5` (feat)
2. **Task 2: Create cart and checkout page shells without Footer** - `cbb7265` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified
- `app/page.tsx` - Homepage shell with HomepageHeader and Footer
- `app/category/[concern]/page.tsx` - Category page shell with InnerHeader + Footer, async params
- `app/product/[sku]/page.tsx` - Product page shell with InnerHeader + Footer, async params
- `app/cart/page.tsx` - Cart page shell with InnerHeader, no Footer (LAY-05)
- `app/checkout/page.tsx` - Checkout page shell with InnerHeader, no Footer (LAY-05)

## Decisions Made
- Used explicit `params: Promise<{ param: string }>` typing instead of `PageProps<'/route'>` helper because `.next/types` are generated at build/dev time and didn't exist yet — explicit typing is equivalent and avoids false TS errors
- Cart and checkout omit Footer per LAY-05 requirement — transactional pages benefit from focused layout
- Page components left as server components even when importing client components — Next.js client boundary propagates from the child component itself

## Deviations from Plan

None — plan executed exactly as written. The `params` typing approach used explicit Promise type rather than `PageProps` helper (both are valid and equivalent; explicit typing was safer without generated types).

## Issues Encountered
None — TypeScript compiled clean, `npm run build` passed on first attempt.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Full layout shell complete: all 5 routes have correct header/footer chrome
- Phase 2 (Homepage) can now fill in homepage content beneath HomepageHeader
- Phase 3 (Category Page) can fill in product grid under InnerHeader
- Phase 4 (Product Detail) can fill in product info under InnerHeader
- Phase 5 (Cart) and Phase 6 (Checkout) can fill in transactional UI under InnerHeader

---
*Phase: 01-layout-shell*
*Completed: 2026-03-20*

## Self-Check: PASSED

- FOUND: app/page.tsx
- FOUND: app/category/[concern]/page.tsx
- FOUND: app/product/[sku]/page.tsx
- FOUND: app/cart/page.tsx
- FOUND: app/checkout/page.tsx
- FOUND: commit a4d4cf5 (Task 1)
- FOUND: commit cbb7265 (Task 2)
