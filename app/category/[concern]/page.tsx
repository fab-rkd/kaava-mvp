// ─── app/category/[concern]/page.tsx ─────────────────────────────────────────
//
// Category page — lists products for a given health concern with sidebar
// filters, sorting, and load-more pagination.
//
// Handles special slugs:
//   "all"          → show every product
//   "bestsellers"  → products sorted by highest discount %
//   "brand-*"      → products filtered by brand name
//   (other slugs)  → concern-based filtering
//
// Next.js 16: params is a Promise — must use async function and await params.
// ─────────────────────────────────────────────────────────────────────────────

import InnerHeader from "@/components/layout/InnerHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryBody from "@/components/category/CategoryBody";
import {
  getProductsByConcern,
  getProductsByBrand,
  getAllProducts,
  getAllConcerns,
  getAllBrands,
} from "@/lib/products";

// ─── Slug ↔ Concern Mapping ────────────────────────────────────────────────
// URL slugs like "digestion" or "skin-care" need to map to the actual concern
// strings stored in products.json (e.g. "Gut/Digestion", "Skin Care").
const SLUG_TO_CONCERNS: Record<string, string[]> = {
  // Direct concern mappings
  digestion: ["Gut/Digestion"],
  "gut-digestion": ["Gut/Digestion"],
  "skin-care": ["Skin Care"],
  hair: ["Hair"],
  "hair-care": ["Hair"],
  eyes: ["Eyes"],
  "eye-care": ["Eyes"],
  wellness: ["Overall Wellness"],
  "overall-wellness": ["Overall Wellness"],
  "mental-clarity": ["Mental Clarity"],
  liver: ["Liver"],
  "liver-health": ["Liver"],
  "joint-health": ["Joint Health"],
  sleep: ["Sleep"],
  "womens-health": ["Women's Health"],
  // Hero slider slugs that map to the closest concern
  immunity: ["Overall Wellness"],
  respiratory: ["Overall Wellness"],
  "heart-health": ["Overall Wellness"],
  "oral-care": ["Overall Wellness"],
};

// Build a human-readable label from the slug
function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Resolve a URL slug to matching concern names
function resolveConcerns(slug: string): string[] {
  // Direct map hit
  if (SLUG_TO_CONCERNS[slug]) return SLUG_TO_CONCERNS[slug];

  // Fuzzy: find any concern whose lowercased/slugified form matches
  const allConcerns = getAllConcerns();
  const matching = allConcerns.filter((c) => {
    const concernSlug = c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return concernSlug === slug || concernSlug.includes(slug) || slug.includes(concernSlug);
  });

  return matching.length > 0 ? matching : [];
}

// ─── Static Params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  // Concern slugs
  const concernParams = getAllConcerns().map((c) => ({
    concern: c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));

  // Brand slugs
  const brandParams = getAllBrands().map((b) => ({
    concern: "brand-" + b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));

  // Special slugs
  const specialParams = [{ concern: "all" }, { concern: "bestsellers" }];

  return [...concernParams, ...brandParams, ...specialParams];
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ concern: string }>;
}) {
  const { concern } = await params;

  // ── Handle special slug: "all" ──────────────────────────────────────────
  if (concern === "all") {
    const products = getAllProducts();
    return (
      <>
        <InnerHeader />
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "All Products" }]} />
        <main className="min-h-screen bg-white">
          <CategoryBody products={products} concernLabel="All Products" isFallback={false} />
        </main>
        <Footer />
      </>
    );
  }

  // ── Handle special slug: "bestsellers" ──────────────────────────────────
  if (concern === "bestsellers") {
    const all = getAllProducts();
    // Sort by highest discount percentage, take top 30
    const bestsellers = [...all]
      .sort((a, b) => {
        const discA = a.price > 0 ? ((a.price - a.special_price) / a.price) : 0;
        const discB = b.price > 0 ? ((b.price - b.special_price) / b.price) : 0;
        return discB - discA;
      })
      .slice(0, 30);

    return (
      <>
        <InnerHeader />
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Bestsellers" }]} />
        <main className="min-h-screen bg-white">
          <CategoryBody products={bestsellers} concernLabel="Bestsellers" isFallback={false} />
        </main>
        <Footer />
      </>
    );
  }

  // ── Handle brand slugs: "brand-himalaya", "brand-dabur", etc. ───────────
  if (concern.startsWith("brand-")) {
    const brandSlugPart = concern.slice(6); // remove "brand-" prefix
    // Find the actual brand name by matching the slugified version
    const allBrands = getAllBrands();
    const matchedBrand = allBrands.find(
      (b) =>
        b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === brandSlugPart
    );

    if (matchedBrand) {
      const products = getProductsByBrand(matchedBrand);
      return (
        <>
          <InnerHeader />
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: matchedBrand }]} />
          <main className="min-h-screen bg-white">
            <CategoryBody products={products} concernLabel={matchedBrand} isFallback={false} />
          </main>
          <Footer />
        </>
      );
    }
    // If brand not found, fall through to concern logic (which will fallback to all)
  }

  // ── Standard concern slug resolution ────────────────────────────────────
  const concernNames = resolveConcerns(concern);
  let products =
    concernNames.length > 0
      ? concernNames.flatMap((name) => getProductsByConcern(name))
      : [];

  // Deduplicate (a product could match multiple concern names)
  const seen = new Set<string>();
  products = products.filter((p) => {
    if (seen.has(p.sku)) return false;
    seen.add(p.sku);
    return true;
  });

  // Fallback: if no products matched, show all
  const isFallback = products.length === 0;
  if (isFallback) {
    products = getAllProducts();
  }

  const label = slugToLabel(concern);

  return (
    <>
      <InnerHeader />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: label },
        ]}
      />
      <main className="min-h-screen bg-white">
        <CategoryBody
          products={products}
          concernLabel={label}
          isFallback={isFallback}
        />
      </main>
      <Footer />
    </>
  );
}
