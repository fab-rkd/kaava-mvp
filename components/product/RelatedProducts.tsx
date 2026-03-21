"use client";
// ─── components/product/RelatedProducts.tsx ─────────────────────────────────
//
// Related products section for the product detail page.
// On desktop: 4-column grid. On mobile: horizontal scroll slider.
// Client component because ProductCard uses useCart().
// ─────────────────────────────────────────────────────────────────────────────

import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

type RelatedProductsProps = {
  products: Product[];
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2
        className="font-outfit font-bold text-[22px] text-[#1B1B1B]"
        style={{ marginBottom: 24 }}
      >
        You Might Also Like
      </h2>

      {/* Desktop: 4-col grid */}
      <div className="hidden lg:grid grid-cols-4" style={{ gap: 20 }}>
        {products.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </div>

      {/* Mobile/Tablet: horizontal scroll slider */}
      <div
        className="lg:hidden flex overflow-x-auto scrollbar-hide"
        style={{ gap: 20 }}
      >
        {products.map((product) => (
          <div key={product.sku} className="slider-product-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
