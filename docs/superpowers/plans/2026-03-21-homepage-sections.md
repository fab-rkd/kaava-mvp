# Homepage Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all remaining homepage sections matching the Pencil design (kaava-design-v2.pen), using reusable components and the established design system tokens.

**Architecture:** Each homepage section is a separate component in `components/home/`. Shared components (ProductCard, BrandCard, SectionHeading) live in `components/ui/` and `components/product/`. All sections use `content-container` for layout. Data comes from `products.json` via `lib/products.ts`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4 (@theme tokens), Lucide icons

---

## File Structure

### Reusable Components (shared across pages)
- `components/ui/SectionHeading.tsx` — Title + optional arrows/link, used in 7+ homepage sections
- `components/ui/Button.tsx` — Primary/secondary/outline/text variants
- `components/product/ProductCard.tsx` — Product card used on Homepage, Category, Product pages
- `components/product/BrandCard.tsx` — Brand card used on Homepage (Top Brands)

### Homepage Section Components (page-specific)
- `components/home/UnifiedHero.tsx` — Already built, needs top padding fix
- `components/home/FeaturedProducts.tsx` — 4-col product grid with SectionHeading
- `components/home/BestSellers.tsx` — 4-col product grid with SectionHeading
- `components/home/TopBrands.tsx` — Horizontal brand cards with SectionHeading
- `components/home/WhyTrustKaava.tsx` — Trust bento grid
- `components/home/HowItWorks.tsx` — 4-step process
- `components/home/KnowYourAyurveda.tsx` — 4-col edu cards
- `components/home/Testimonials.tsx` — Review cards
- `components/home/Newsletter.tsx` — Email capture on green bg

### Page Assembly
- `app/page.tsx` — Compose all sections in order

---

## Tasks

### Task 1: Fix Hero Top Padding
**Files:** Modify: `components/home/UnifiedHero.tsx`
- [ ] Add top padding to the nav row so content doesn't touch browser edge

### Task 2: Build SectionHeading Component
**Files:** Create: `components/ui/SectionHeading.tsx`
- [ ] Build component with props: title, subtitle?, tag?, align?, viewAllLink?, showArrows?, onPrev?, onNext?
- [ ] Match Pencil typography: Outfit 28px/800 for titles, with arrow buttons

### Task 3: Build ProductCard Component
**Files:** Create: `components/product/ProductCard.tsx`
- [ ] Build card matching Pencil node tvCqb exactly
- [ ] Props: product (Product type), with image, name, brand, price, discount, rating, add-to-cart
- [ ] Use placeholder.webp fallback for missing images

### Task 4: Build Featured Products Section
**Files:** Create: `components/home/FeaturedProducts.tsx`
- [ ] 4-column grid using ProductCard
- [ ] Pencil: onas9 — padding [72, 64], gap 28, border-bottom
- [ ] Use SectionHeading with arrows

### Task 5: Build Best Sellers Section
**Files:** Create: `components/home/BestSellers.tsx`
- [ ] Same pattern as Featured Products, different data slice
- [ ] Pencil: MmjXb — padding [72, 64], gap 28

### Task 6: Build BrandCard Component
**Files:** Create: `components/product/BrandCard.tsx`
- [ ] Match Pencil node f43jO — logo area + name + count + CTA
- [ ] Props: name, logoUrl, productCount, slug

### Task 7: Build Top Brands Section
**Files:** Create: `components/home/TopBrands.tsx`
- [ ] Horizontal row of BrandCards
- [ ] Pencil: 6mv3D — padding [72, 64], gap 28

### Task 8: Build Why Trust Kaava Section
**Files:** Create: `components/home/WhyTrustKaava.tsx`
- [ ] Bento grid layout
- [ ] Pencil: iOwm6 — bg #F8FBF8, padding [72, 64], gap 40

### Task 9: Build How It Works Section
**Files:** Create: `components/home/HowItWorks.tsx`
- [ ] 4-step process with icons and connecting arcs
- [ ] Pencil: 4q3ef — padding [72, 64], gap 40, centered

### Task 10: Build Know Your Ayurveda Section
**Files:** Create: `components/home/KnowYourAyurveda.tsx`
- [ ] 4-column edu card grid
- [ ] Pencil: oVRVG — padding [72, 64], gap 32

### Task 11: Build Testimonials Section
**Files:** Create: `components/home/Testimonials.tsx`
- [ ] Review cards with ratings
- [ ] Pencil: PxV6O — padding [72, 64], gap 40

### Task 12: Build Newsletter Section
**Files:** Create: `components/home/Newsletter.tsx`
- [ ] Green bg, email input, glow effects
- [ ] Pencil: piUYb — bg #2D6A4F, height 309

### Task 13: Assemble Homepage
**Files:** Modify: `app/page.tsx`
- [ ] Import and compose all sections in order
- [ ] Remove placeholder text

### Task 14: Visual QA Pass
- [ ] Compare each section against Pencil screenshots
- [ ] Note issues for Robin's review
