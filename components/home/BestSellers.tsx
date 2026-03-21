"use client";

import { getAllProducts } from "@/lib/products";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { useSlider } from "@/hooks/useSlider";

export default function BestSellers() {
  // Different slice for variety — products 20-31
  const bestSellers = getAllProducts().slice(20, 32);
  const { scrollRef, prev, next, checkScroll } = useSlider();

  return (
    <section className="w-full bg-white" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col" style={{ gap: 28 }}>
          <SectionHeading title="Best Sellers" showArrows onPrev={prev} onNext={next} />

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto scroll-smooth"
            style={{ gap: 20, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {bestSellers.map((product) => (
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
