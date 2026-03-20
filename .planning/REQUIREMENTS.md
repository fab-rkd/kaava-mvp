# Requirements: Kaava MVP

**Defined:** 2026-03-20
**Core Value:** Shopper can browse, find, and add verified Ayurvedic products to cart on a live site

## v1 Requirements

### Layout
- [x] **LAY-01**: Every page shows AnnouncementBar with rotating promo messages
- [x] **LAY-02**: Homepage uses full-width Header with logo, search bar, and nav links
- [x] **LAY-03**: Inner pages (category, product, cart, checkout) use two-row InnerHeader
- [x] **LAY-04**: Category and product pages show Footer with 4-column links grid
- [x] **LAY-05**: Cart and checkout pages omit footer (simplified layout)

### Homepage
- [ ] **HOME-01**: Hero section shows headline, search bar, and popular search tags
- [ ] **HOME-02**: "Shop by Concern" section shows all 20 concern icons with labels
- [ ] **HOME-03**: Featured Products slider shows real products from products.json
- [ ] **HOME-04**: Best Sellers slider shows real products from products.json
- [ ] **HOME-05**: Top Brands section shows 5 brand logos (Himalaya, Dabur, Patanjali, Baidyanath, Zandu)
- [ ] **HOME-06**: "Why Trust Kaava" section shows 3-step verification cards
- [ ] **HOME-07**: "How It Works" section shows 4-step flow
- [ ] **HOME-08**: Testimonials section shows 3 customer reviews
- [ ] **HOME-09**: Newsletter section shows email signup form (UI only)
- [ ] **HOME-10**: Footer renders with all link columns

### Category Page
- [ ] **CAT-01**: Page renders at /category/[concern] for all 10 concerns
- [ ] **CAT-02**: Product grid shows all products matching the concern
- [ ] **CAT-03**: Sidebar shows filter groups (Brand, Price, Certification)
- [ ] **CAT-04**: Sort bar shows product count and sort dropdown
- [ ] **CAT-05**: Breadcrumb shows Home › Concern Name

### Product Detail
- [ ] **PROD-01**: Page renders at /product/[sku] for all 100 products
- [ ] **PROD-02**: Product gallery shows placeholder image with thumbnail strip
- [ ] **PROD-03**: Info column shows name, brand, price, special price, discount %
- [ ] **PROD-04**: Trust badges show AYUSH or FSSAI based on compliance_tags
- [ ] **PROD-05**: Key benefits, ingredients, and usage sections render
- [ ] **PROD-06**: "Add to Cart" button adds product and opens cart drawer
- [ ] **PROD-07**: Related products row shows up to 4 products from same concern
- [ ] **PROD-08**: Breadcrumb shows Home › Category › Product Name

### Cart
- [ ] **CART-01**: Cart drawer slides in from right when item is added
- [ ] **CART-02**: Drawer shows all cart items with image, name, price, qty controls
- [ ] **CART-03**: Qty +/− buttons update quantity; 0 removes item
- [ ] **CART-04**: Drawer footer shows subtotal and "Proceed to Checkout" button
- [ ] **CART-05**: Cart icon in header shows item count badge
- [ ] **CART-06**: Full cart page at /cart shows all items and order summary
- [ ] **CART-07**: Order summary shows MRP, savings, delivery (free), and total
- [ ] **CART-08**: "Continue Shopping" link navigates back

### Checkout
- [ ] **CHK-01**: Checkout page at /checkout shows simplified header (logo + secure badge)
- [ ] **CHK-02**: Step indicator shows 3 steps: Address → Payment → Review
- [ ] **CHK-03**: Step 1 form has fields: Name, Mobile, Address, Pincode, City, State
- [ ] **CHK-04**: Step 2 shows payment options: UPI, Card, Net Banking, COD
- [ ] **CHK-05**: Step 3 shows order summary and "Place Order" button (UI only)
- [ ] **CHK-06**: Order summary sidebar is sticky with item list and totals

### Deployment
- [ ] **DEP-01**: App builds without errors (npm run build passes)
- [ ] **DEP-02**: App is deployed and publicly accessible on Vercel
- [ ] **DEP-03**: GitHub push to main triggers automatic Vercel redeploy

## v2 Requirements

### Search
- User can search products by name or ingredient from the header search bar
- Search results page shows filtered products

### Filtering
- Category page filters actually filter the product grid (client-side)
- Price range slider works

### Persistence
- Cart persists across page refreshes (localStorage)

### Auth
- User can create account and log in
- Order history page

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real payment processing | MVP only — too complex for 2-day deadline |
| User authentication | Not needed to demonstrate marketplace value |
| CMS / admin panel | Static JSON sufficient for MVP |
| Backend API / database | Zero backend = zero cost and complexity |
| Mobile app | Web-first |
| Real product images | 100 images not feasible in 2 days; placeholder used |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAY-01 to LAY-05 | Phase 1 | Pending |
| HOME-01 to HOME-10 | Phase 2 | Pending |
| CAT-01 to CAT-05 | Phase 3 | Pending |
| PROD-01 to PROD-08 | Phase 4 | Pending |
| CART-01 to CART-08 | Phase 5 | Pending |
| CHK-01 to CHK-06 | Phase 6 | Pending |
| DEP-01 to DEP-03 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-20*
