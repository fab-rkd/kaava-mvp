"use client";

import { getProductsByBrand } from "@/lib/products";
import SectionHeading from "@/components/ui/SectionHeading";
import BrandCard from "@/components/product/BrandCard";
import { useSlider } from "@/hooks/useSlider";

const BRANDS = [
  { name: "Himalaya", logo: "/icons/Brand/Himalaya.png", slug: "himalaya", fallbackCount: 48 },
  { name: "Dabur", logo: "/icons/Brand/DABUR.png", slug: "dabur", fallbackCount: 62 },
  { name: "Patanjali", logo: "/icons/Brand/Patanjali_Ayurved_Logo.png", slug: "patanjali", fallbackCount: 35 },
  { name: "Baidyanath", logo: "/icons/Brand/Baidyanath_logo.png", slug: "baidyanath", fallbackCount: 28 },
  { name: "Zandu", logo: "/icons/Brand/Zandu.png", slug: "zandu", fallbackCount: 31 },
  { name: "Kapiva", logo: "/icons/Brand/Kapiva.png", slug: "kapiva", fallbackCount: 22 },
  { name: "Organic India", logo: "/icons/Brand/organic-india-logo.png", slug: "organic-india", fallbackCount: 40 },
  { name: "Kerala Ayurveda", slug: "kerala-ayurveda", fallbackCount: 18 },
  { name: "Kottakkal Arya Vaidya", slug: "kottakkal", fallbackCount: 25 },
  { name: "Sri Sri Tattva", slug: "sri-sri-tattva", fallbackCount: 33 },
  { name: "Jiva Ayurveda", slug: "jiva", fallbackCount: 15 },
  { name: "Forest Essentials", slug: "forest-essentials", fallbackCount: 12 },
];

export default function TopBrands() {
  const { scrollRef, prev, next, checkScroll } = useSlider();

  return (
    <section className="w-full bg-white" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col" style={{ gap: 28 }}>
          <SectionHeading title="Shop From Top Brands" showArrows onPrev={prev} onNext={next} />

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto scroll-smooth"
            style={{ gap: 16, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {BRANDS.map(({ name, logo, slug, fallbackCount }) => {
              const count = getProductsByBrand(name).length;
              return (
                <div key={slug} className="slider-brand-item">
                  <BrandCard
                    name={name}
                    logoUrl={logo}
                    productCount={count || fallbackCount}
                    slug={slug}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
