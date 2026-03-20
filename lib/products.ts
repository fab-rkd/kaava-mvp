// ─── lib/products.ts ──────────────────────────────────────────────────────────
//
// All product data access lives here. Pages import these functions instead of
// importing products.json directly — keeps pages clean and logic centralised.
//
// TypeScript lesson: Function signatures here show the input type → return type.
// e.g. `(sku: string): Product | undefined` means:
//   takes a string, returns either a Product or undefined (if not found).
// ─────────────────────────────────────────────────────────────────────────────

import productsData from "@/data/products.json";
import type { Product } from "@/types";

// Cast the imported JSON to Product[] so TypeScript knows the shape
const allProducts: Product[] = productsData.products as Product[];

// Get every product
export function getAllProducts(): Product[] {
  return allProducts;
}

// Get a single product by its SKU slug
export function getProductBySku(sku: string): Product | undefined {
  return allProducts.find((p) => p.sku === sku);
}

// Get all products for a specific brand
export function getProductsByBrand(brand: string): Product[] {
  return allProducts.filter(
    (p) => p.brand.toLowerCase() === brand.toLowerCase()
  );
}

// Get all products matching a health concern (e.g. "Hair", "Liver")
export function getProductsByConcern(concern: string): Product[] {
  return allProducts.filter((p) =>
    p.concerns.some((c) => c.toLowerCase() === concern.toLowerCase())
  );
}

// Get all unique brand names (used for the Top Brands section)
export function getAllBrands(): string[] {
  return [...new Set(allProducts.map((p) => p.brand))];
}

// Get all unique health concerns (used for the Concerns section)
export function getAllConcerns(): string[] {
  const all = allProducts.flatMap((p) => p.concerns);
  return [...new Set(all)];
}

// Get related products: same concern, excluding the current product
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return allProducts
    .filter(
      (p) =>
        p.sku !== product.sku &&
        p.concerns.some((c) => product.concerns.includes(c))
    )
    .slice(0, limit);
}

// Get all SKUs — used by Next.js to pre-generate all product pages at build time
export function getAllProductSlugs(): string[] {
  return allProducts.map((p) => p.sku);
}

// Calculate discount percentage between MRP and special price
export function getDiscountPercent(price: number, specialPrice: number): number {
  return Math.round(((price - specialPrice) / price) * 100);
}

// Format price as Indian Rupees, e.g. 1200 → "₹1,200"
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}
