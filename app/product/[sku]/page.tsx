// ─── app/product/[sku]/page.tsx ─────────────────────────────────────────────
//
// Full product detail page (/product/[sku]).
// Server component that fetches product data at build time.
//
// Sections: InnerHeader > Breadcrumb > Product Hero > Below Fold > Footer
// Interactive parts (cart buttons, gallery) are split into client components.
//
// Next.js 16: params is a Promise — must await it.
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Leaf, ChevronRight } from "lucide-react";

import InnerHeader from "@/components/layout/InnerHeader";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import RelatedProducts from "@/components/product/RelatedProducts";

import {
  getProductBySku,
  getRelatedProducts,
  getAllProductSlugs,
  getDiscountPercent,
  formatPrice,
} from "@/lib/products";

// ─── Static Params ──────────────────────────────────────────────────────────
// Pre-generate all product pages at build time
export async function generateStaticParams() {
  return getAllProductSlugs().map((sku) => ({ sku }));
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = getProductBySku(sku);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} by ${product.brand} — Kaava Ayurveda`,
    description: product.short_desc,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────
// Same seeded rating logic as ProductCard for consistency
function seedFromSku(sku: string): number {
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash * 31 + sku.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getSeededRating(sku: string): { rating: number; reviews: number } {
  const seed = seedFromSku(sku);
  const rating = 4.0 + (seed % 10) / 10;
  const reviews = 500 + (seed % 4501);
  return { rating: +rating.toFixed(1), reviews };
}

// ─── Page Component ─────────────────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = getProductBySku(sku);

  if (!product) notFound();

  const discount = getDiscountPercent(product.price, product.special_price);
  const { rating, reviews } = getSeededRating(product.sku);
  const relatedProducts = getRelatedProducts(product, 4);

  // Split usage string into steps by sentence-ending punctuation
  const usageSteps = product.usage
    .split(/(?<=\.)\s+/)
    .filter((s) => s.trim().length > 0);

  return (
    <>
      <InnerHeader />
      <main className="min-h-screen">
        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <div
          className="w-full"
          style={{
            borderBottom: "1px solid #F0F0F0",
            backgroundColor: "#FAFAFA",
          }}
        >
          <nav
            className="content-container flex items-center"
            style={{ height: 40, gap: 8 }}
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="font-inter text-[13px] text-[#888888] transition-colors hover:text-[#2D6A4F]"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-[#CCCCCC]" />
            <span className="font-inter text-[13px] text-[#888888]">
              {product.category}
            </span>
            <ChevronRight size={14} className="text-[#CCCCCC]" />
            <span className="font-inter text-[13px] text-[#1B1B1B] font-medium">
              {product.name}
            </span>
          </nav>
        </div>

        {/* ── Product Hero ────────────────────────────────────────────── */}
        <section className="content-container" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div
            className="flex flex-col lg:flex-row"
            style={{ gap: 40 }}
          >
            {/* LEFT — Gallery Column */}
            <div className="w-full lg:w-[520px] shrink-0">
              <ProductGallery product={product} />
            </div>

            {/* RIGHT — Info Column */}
            <div className="flex-1 flex flex-col" style={{ gap: 14 }}>
              {/* Brand label */}
              <span
                className="font-inter text-[12px] font-semibold uppercase text-[#2D6A4F]"
                style={{ letterSpacing: "1px" }}
              >
                {product.brand}
              </span>

              {/* Product title */}
              <h1
                className="font-outfit font-extrabold text-[24px] text-[#1B1B1B]"
                style={{ lineHeight: 1.2 }}
              >
                {product.name}
              </h1>

              {/* Ratings row */}
              <div className="flex items-center" style={{ gap: 8 }}>
                <div className="flex items-center" style={{ gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.floor(rating)
                          ? "fill-amber-400 text-amber-400"
                          : star - 0.5 <= rating
                            ? "fill-amber-400/50 text-amber-400"
                            : "text-[#E0E0E0]"
                      }
                    />
                  ))}
                </div>
                <span className="font-inter text-[14px] font-semibold text-[#1B1B1B]">
                  {rating}
                </span>
                <span className="font-inter text-[13px] text-[#888888]">
                  ({reviews.toLocaleString("en-IN")} reviews)
                </span>
              </div>

              {/* Trust badges */}
              <div className="flex items-center" style={{ gap: 8 }}>
                <span
                  className="inline-flex items-center font-inter text-[12px] font-semibold text-[#2D6A4F]"
                  style={{
                    backgroundColor: "#EBF5EE",
                    borderRadius: 50,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  {product.compliance_tags.label}
                </span>
                <span
                  className="inline-flex items-center font-inter text-[12px] font-semibold text-[#2D6A4F]"
                  style={{
                    backgroundColor: "#EBF5EE",
                    borderRadius: 50,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  Lab Tested
                </span>
              </div>

              {/* Price row */}
              <div className="flex items-center" style={{ gap: 12 }}>
                {discount > 0 && (
                  <span
                    className="font-inter text-[16px] text-[#BBBBBB] line-through"
                  >
                    {formatPrice(product.price)}
                  </span>
                )}
                <span
                  className="font-outfit font-bold text-[28px] text-[#1B1B1B]"
                >
                  {formatPrice(product.special_price)}
                </span>
                {discount > 0 && (
                  <span
                    className="font-outfit font-bold text-[13px]"
                    style={{
                      backgroundColor: "#FFF0E6",
                      color: "#E85D04",
                      borderRadius: 8,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}
                  >
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "#F0F0F0" }} />

              {/* Short description */}
              <p
                className="font-inter text-[14px] text-[#555555]"
                style={{ lineHeight: 1.6 }}
              >
                {product.short_desc}
              </p>

              {/* Key Benefits */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h3 className="font-outfit font-bold text-[14px] text-[#1B1B1B]">
                  Key Benefits
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 18 }}>
                  {product.key_benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="font-inter text-[14px] text-[#444444]"
                      style={{ listStyleType: "disc" }}
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "#F0F0F0" }} />

              {/* CTA Row — client component */}
              <ProductActions product={product} />
            </div>
          </div>
        </section>

        {/* ── Below Fold ──────────────────────────────────────────────── */}
        <section
          className="content-container"
          style={{
            paddingTop: 48,
            paddingBottom: 72,
            display: "flex",
            flexDirection: "column",
            gap: 48,
          }}
        >
          {/* ── Product Description ─────────────────────────────────── */}
          <div
            style={{
              paddingBottom: 40,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <h2
              className="font-outfit font-bold text-[20px] text-[#1B1B1B]"
              style={{ marginBottom: 16 }}
            >
              Product Description
            </h2>
            <p
              className="font-inter text-[15px] text-[#555555]"
              style={{ lineHeight: 1.7 }}
            >
              {product.long_desc}
            </p>
          </div>

          {/* ── Key Ingredients ─────────────────────────────────────── */}
          <div>
            <h2
              className="font-outfit font-bold text-[20px] text-[#1B1B1B]"
              style={{ marginBottom: 20 }}
            >
              Key Ingredients
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
              {product.ingredients.map((ingredient) => (
                <div
                  key={ingredient}
                  style={{
                    backgroundColor: "#F8FBF8",
                    borderRadius: 12,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Leaf size={20} className="text-[#2D6A4F]" />
                  <span className="font-outfit font-bold text-[14px] text-[#1B1B1B]">
                    {ingredient}
                  </span>
                  <span className="font-inter text-[13px] text-[#666666]">
                    Traditional Ayurvedic ingredient known for its natural health benefits.
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── How to Use ──────────────────────────────────────────── */}
          <div>
            <h2
              className="font-outfit font-bold text-[20px] text-[#1B1B1B]"
              style={{ marginBottom: 16 }}
            >
              How to Use
            </h2>
            <ol style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 20 }}>
              {usageSteps.map((step, i) => (
                <li
                  key={i}
                  className="font-inter text-[15px] text-[#555555]"
                  style={{ lineHeight: 1.8, listStyleType: "decimal" }}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* ── Related Products ────────────────────────────────────── */}
          <RelatedProducts products={relatedProducts} />
        </section>
      </main>
      <Footer />
    </>
  );
}
