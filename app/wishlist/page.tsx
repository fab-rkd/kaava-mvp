"use client";
// ─── app/wishlist/page.tsx ──────────────────────────────────────────────────
//
// Wishlist page (/wishlist).
// Layout: InnerHeader + Breadcrumb + Wishlist Grid + Footer
// Client component — reads wishlist state via useWishlist().
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { Heart } from "lucide-react";
import InnerHeader from "@/components/layout/InnerHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { getProductBySku } from "@/lib/products";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  // Resolve SKUs to full Product objects (filter out any that no longer exist)
  const products = wishlistItems
    .map((sku) => getProductBySku(sku))
    .filter((p) => p !== undefined);

  return (
    <>
      <InnerHeader />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wishlist" },
        ]}
      />

      <main className="min-h-screen bg-white">
        <div
          className="content-container"
          style={{ paddingTop: 40, paddingBottom: 72 }}
        >
          {/* ── Empty State ──────────────────────────────────────────── */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-green"
                style={{ fontSize: 36 }}
              >
                <Heart size={36} className="text-forest" />
              </div>
              <h1 className="font-outfit text-[22px] font-bold text-dark mb-2">
                Your wishlist is empty
              </h1>
              <p className="font-inter text-[14px] text-muted mb-6 max-w-sm">
                Save products you love by tapping the heart icon. They&apos;ll appear here so you can find them easily later.
              </p>
              <Link
                href="/products"
                className="flex h-12 items-center justify-center rounded-[8px] bg-forest px-8 font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            /* ── Wishlist Grid ───────────────────────────────────────── */
            <>
              <h1 className="font-outfit text-[22px] font-bold text-dark mb-6">
                My Wishlist ({products.length}{" "}
                {products.length === 1 ? "item" : "items"})
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.sku} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
