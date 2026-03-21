"use client";

import { getAllProducts } from "@/lib/products";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { useSlider } from "@/hooks/useSlider";

export default function FeaturedProducts() {
  const featured = getAllProducts().slice(0, 12);
  const { scrollRef, prev, next, checkScroll } = useSlider();

  return (
    <section className="w-full bg-white" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col" style={{ gap: 28 }}>
          <SectionHeading title="Featured Products" showArrows onPrev={prev} onNext={next} />

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto scroll-smooth"
            style={{ gap: 20, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featured.map((product) => (
              <div key={product.sku} className="slider-product-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
