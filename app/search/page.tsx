"use client";

// ─── app/search/page.tsx ──────────────────────────────────────────────────────
//
// Search results page — filters all products by keyword against name, brand,
// category, and concerns. Uses the same grid layout as the category page.
//
// useSearchParams() requires a Suspense boundary at the page level.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import InnerHeader from "@/components/layout/InnerHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/types";

// ─── Search Logic ───────────────────────────────────────────────────────────
function searchProducts(products: Product[], keyword: string): Product[] {
  const lower = keyword.toLowerCase();
  return products.filter((p) => {
    if (p.name.toLowerCase().includes(lower)) return true;
    if (p.brand.toLowerCase().includes(lower)) return true;
    if (p.category.toLowerCase().includes(lower)) return true;
    if (p.concerns.some((c) => c.toLowerCase().includes(lower))) return true;
    return false;
  });
}

// ─── Inner component that reads searchParams ────────────────────────────────
function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return searchProducts(getAllProducts(), q.trim());
  }, [q]);

  return (
    <div className="content-container" style={{ paddingTop: 40, paddingBottom: 72 }}>
      {/* Title */}
      <h1
        className="font-outfit font-bold text-dark"
        style={{ fontSize: 22 }}
      >
        Search results for &lsquo;{q}&rsquo;
      </h1>

      {/* Count */}
      <p
        className="font-inter text-[#666666] mt-1"
        style={{ fontSize: 14 }}
      >
        {results.length} product{results.length !== 1 ? "s" : ""} found
      </p>

      {/* Product Grid or Empty State */}
      {results.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
          style={{ gap: 20 }}
        >
          {results.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-inter text-[16px] text-[#666666]">
            No products found for &lsquo;{q}&rsquo;. Try a different search term.
          </p>
          <Link
            href="/category/all"
            className="mt-4 inline-block font-inter text-[14px] font-medium text-[#2D6A4F] hover:underline"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Page (wraps SearchResults in Suspense) ─────────────────────────────────
export default function SearchPage() {
  return (
    <>
      <InnerHeader />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Search Results" },
        ]}
      />
      <main className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="content-container py-20 text-center">
              <p className="font-inter text-[14px] text-[#666666]">Loading results...</p>
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
