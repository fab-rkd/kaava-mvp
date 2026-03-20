# Roadmap: Kaava MVP

**Milestone:** v1.0 — Live by Sunday 2026-03-22
**Phases:** 7 | **Requirements:** 36 | **Status:** In Progress

---

## Phase 1: Layout Shell
**Goal:** Every page has a working shell with shared layout components
**Requirements**: LAY-01, LAY-02, LAY-03, LAY-04, LAY-05
**Plans:** 3/3 plans complete
**Success Criteria:**
1. AnnouncementBar renders with rotating messages on every page
2. Homepage Header renders with logo, search bar, nav links, cart icon with badge
3. InnerHeader renders with two rows on /category, /product, /cart pages
4. Footer renders correctly on homepage, category, and product pages
5. All components are TypeScript-typed with no errors

Plans:
- [x] 01-01-PLAN.md — AnnouncementBar + HomepageHeader + root layout wiring
- [x] 01-02-PLAN.md — InnerHeader + Footer components
- [ ] 01-03-PLAN.md — Page shells with correct layout wiring per route

---

## Phase 2: Homepage
**Goal:** Full homepage renders all 15 sections with real product data
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, HOME-09, HOME-10
**Success Criteria:**
1. Hero section shows headline and search bar
2. Concerns section shows all 20 concern icons/labels
3. Featured Products and Best Sellers sliders show real products from products.json
4. Top Brands shows 5 brand logos
5. Trust, How It Works, Testimonials sections render correctly
6. Page loads without console errors

---

## Phase 3: Category Page
**Goal:** Browsable product listing at /category/[concern] for all concerns
**Requirements**: CAT-01, CAT-02, CAT-03, CAT-04, CAT-05
**Success Criteria:**
1. /category/hair renders and shows all Hair products
2. All 10 concern routes are statically generated at build time
3. Product grid renders product cards with image, name, brand, price
4. Filter sidebar renders all filter groups (UI only for MVP)
5. Breadcrumb and sort bar render correctly

---

## Phase 4: Product Detail Page
**Goal:** Full product page at /product/[sku] for all 100 products
**Requirements**: PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06, PROD-07, PROD-08
**Success Criteria:**
1. All 100 product pages statically generated at build time
2. Gallery, info column, benefits, ingredients, usage all render
3. AYUSH/FSSAI compliance badge shows correctly per product
4. "Add to Cart" button works — opens cart drawer with the product
5. Related products row shows up to 4 products from same concern
6. Breadcrumb renders correctly

---

## Phase 5: Cart (Drawer + Full Page)
**Goal:** Working cart with add/remove/qty and both cart views
**Requirements**: CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07, CART-08
**Success Criteria:**
1. Cart drawer slides in from right when product is added
2. Qty +/- controls work; removing last qty removes item
3. Subtotal updates correctly as items change
4. Header cart icon badge shows correct item count
5. /cart page renders full cart with sticky order summary
6. "Proceed to Checkout" button navigates to /checkout

---

## Phase 6: Checkout Page
**Goal:** 3-step checkout UI that looks production-ready
**Requirements**: CHK-01, CHK-02, CHK-03, CHK-04, CHK-05, CHK-06
**Success Criteria:**
1. /checkout renders with simplified header
2. Step indicator shows 3 steps with active/complete states
3. Step 1 address form renders all fields
4. Step 2 payment options render (UPI, Card, Net Banking, COD)
5. Step 3 review and "Place Order" button render
6. Order summary sidebar is sticky throughout all steps

---

## Phase 7: Deploy & Polish
**Goal:** App is live on Vercel and passes a basic quality check
**Requirements**: DEP-01, DEP-02, DEP-03
**Success Criteria:**
1. `npm run build` completes with zero errors
2. App is deployed at a public Vercel URL
3. GitHub push to main triggers automatic redeploy
4. Homepage loads in under 3 seconds
5. No broken images, missing icons, or console errors on key pages

---

## Progress

| Phase | Name | Status | Requirements |
|-------|------|--------|-------------|
| 1 | 3/3 | Complete   | 2026-03-20 |
| 2 | Homepage | ○ Pending | HOME-01–10 |
| 3 | Category Page | ○ Pending | CAT-01–05 |
| 4 | Product Detail | ○ Pending | PROD-01–08 |
| 5 | Cart | ○ Pending | CART-01–08 |
| 6 | Checkout | ○ Pending | CHK-01–06 |
| 7 | Deploy & Polish | ○ Pending | DEP-01–03 |
