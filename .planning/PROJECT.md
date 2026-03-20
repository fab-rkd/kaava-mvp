# Kaava MVP

## What This Is

Kaava (कावा) is a verified Ayurvedic marketplace that curates and sells products from India's top brands — Himalaya, Dabur, Patanjali, Baidyanath, and Zandu. Every product is AYUSH-licensed, lab-tested, and compliance-tagged. The MVP is a Next.js storefront that must be live on Vercel by Sunday 2026-03-22.

## Core Value

A shopper can browse verified Ayurvedic products by concern or brand, view product details, and add items to a working cart — all on a fast, professionally designed site.

## Requirements

### Validated

- ✓ Project scaffolded (Next.js App Router + TypeScript + Tailwind) — Phase 0
- ✓ Design tokens configured (forest green, saffron, gold) — Phase 0
- ✓ CartContext with useReducer (add/remove/qty/drawer) — Phase 0
- ✓ TypeScript types (Product, CartItem, CartState) — Phase 0
- ✓ lib/products.ts query helpers — Phase 0
- ✓ products.json (100 products, 5 brands) — Phase 0
- ✓ GitHub repo connected (fabwebstudio/kaava-mvp) — Phase 0

### Active

- [ ] Layout components: AnnouncementBar, Header, InnerHeader, Footer
- [ ] Homepage: all 15 sections rendered with real data
- [ ] Category page: filterable product grid by concern/brand
- [ ] Product detail page: gallery, info, benefits, related products
- [ ] Cart drawer: slides in, shows items, qty controls
- [ ] Full cart page: items + order summary + coupon field
- [ ] Checkout page: 3-step UI form (no real payment)
- [ ] Deployed and live on Vercel

### Out of Scope

- Real payment processing — MVP only, UI stub for checkout
- User authentication — not needed for browsing MVP
- CMS / admin panel — products served from static JSON
- Backend API — all data is static SSG from products.json
- Mobile app — web only

## Context

- Design specs fully complete: homepage (15 sections) + 6 inner pages
- Design system: Outfit (headings), Inter (body), Noto Serif Devanagari (logo)
- Colors: Forest #2D6A4F, Saffron #E85D04, Gold #FFBA08, Dark #1B1B1B
- All brand logos + concern SVG icons available in /public/icons/
- Product images: placeholder strategy (/public/products/placeholder.webp)
- Vercel deployment: connect GitHub repo after first working build

## Constraints

- **Timeline**: Live by Sunday 2026-03-22 — 2 days
- **Tech Stack**: Next.js App Router, TypeScript, Tailwind CSS, React Context
- **Data**: Static JSON only — no database, no API calls
- **Developer**: Robin is learning TypeScript — explain types as we write

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router (not Pages Router) | Modern standard, Vercel-native, better performance | — Pending |
| Static JSON data (not CMS/API) | Fastest path to Sunday deadline, zero backend cost | — Pending |
| React Context + useReducer for cart | Built-in React, no extra deps, transparent logic | — Pending |
| Tailwind CSS | Design tokens map directly, fastest build speed | — Pending |
| Separate kaava-mvp/ folder inside HerbalMarketPlace/ | Single VS Code workspace for design + code | ✓ Good |
| Placeholder image for all products | 100 real images not feasible in 2 days | ✓ Good |

---
*Last updated: 2026-03-20 after project initialization*
