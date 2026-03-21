"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Heart, ShoppingBag, ShieldCheck, Star, Loader2, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getDiscountPercent, formatPrice } from "@/lib/products";
import type { Product } from "@/types";

// ─── Types ──────────────────────────────────────────────────────────────────
type ProductCardProps = {
  product: Product;
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function seedFromSku(sku: string): number {
  let hash = 0;
  for (let i = 0; i < sku.length; i++) {
    hash = (hash * 31 + sku.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getSeededRating(sku: string): { rating: number; reviews: number } {
  const seed = seedFromSku(sku);
  const rating = 4.0 + ((seed % 10) / 10);
  const reviews = 500 + (seed % 4501);
  return { rating: +rating.toFixed(1), reviews };
}

// Category-based Unsplash images — one per product category in the dataset.
// When real product images are available, they'll be at product.image_url
// and this map becomes the fallback.
const CATEGORY_IMAGES: Record<string, string> = {
  "Hair Care":         "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
  "Skin Care":         "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
  "Digestive Health":  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop",
  "Immunity":          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
  "Eye Care":          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
  "Wellness":          "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
  "Liver Care":        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
  "Joint Health":      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
  "Sleep Wellness":    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
  "Women's Health":    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
  "Mental Wellness":   "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
  "General Wellness":  "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop";

function getProductImage(product: Product): string {
  return CATEGORY_IMAGES[product.category] || DEFAULT_IMAGE;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.sku);
  // Use real image if it exists locally, otherwise use category-based Unsplash image
  const [imgSrc, setImgSrc] = useState(
    product.image_url.startsWith("http") ? product.image_url : getProductImage(product)
  );

  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");

  const discount = getDiscountPercent(product.price, product.special_price);
  const { rating, reviews } = getSeededRating(product.sku);

  const handleAddToCart = useCallback(() => {
    if (cartState !== "idle") return;
    setCartState("adding");
    setTimeout(() => {
      addItem(product);
      setCartState("added");
      setTimeout(() => setCartState("idle"), 1000);
    }, 600);
  }, [cartState, addItem, product]);

  return (
    <div
      className="product-card flex flex-col overflow-hidden bg-white hover-lift"
      style={{
        borderRadius: "var(--radius-card)",
        border: "1px solid #F0F0F0",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Image Area ─────────────────────────────────────────────────── */}
      <Link
        href={`/product/${product.sku}`}
        className="relative block h-[260px] overflow-hidden bg-surface"
        style={{ borderRadius: "var(--radius-card) var(--radius-card) 0 0" }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="product-card-image w-full h-full object-cover"
          onError={() => setImgSrc(getProductImage(product))}
        />

        {/* Discount badge */}
        {discount > 0 && (
          <span
            className="absolute top-[14px] left-[14px] rounded-[12px] bg-[#1B1B1B] px-[14px] py-[6px] text-[12px] font-bold leading-none text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            -{discount}%
          </span>
        )}

        {/* Category badge */}
        <span
          className="absolute top-[14px] left-[80px] rounded-[12px] bg-white px-[14px] py-[6px] text-[12px] font-medium leading-none text-[#444444] shadow"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {product.category}
        </span>

        {/* Verified icon */}
        <span className="absolute top-[14px] right-[14px] flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <ShieldCheck size={18} className="text-white" />
        </span>

        {/* Rating badge */}
        <span className="absolute bottom-[14px] left-[14px] flex items-center gap-1 rounded-[12px] bg-white/20 px-[10px] py-[6px] backdrop-blur-sm">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-semibold leading-none text-white">
            {rating}
          </span>
          <span className="text-[11px] leading-none text-white/80">
            ({reviews.toLocaleString("en-IN")})
          </span>
        </span>
      </Link>

      {/* ── Info Area ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-[14px]">
        {/* Top row: product info + price */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: brand + name */}
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#888888]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.brand}
            </p>
            <h3
              className="mt-0.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#1B1B1B]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {product.name}
            </h3>
          </div>

          {/* Right: prices */}
          <div className="flex shrink-0 flex-col items-end">
            {discount > 0 && (
              <span
                className="text-[12px] font-normal text-[#BBBBBB] line-through"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {formatPrice(product.price)}
              </span>
            )}
            <span
              className="text-[18px] font-bold text-[#1B1B1B]"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {formatPrice(product.special_price)}
            </span>
          </div>
        </div>

        {/* Button row */}
        <div className="mt-3 flex items-center gap-2">
          {/* Wishlist */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.sku)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EEEEEE] bg-[#F5F5F5] transition-colors hover:bg-[#EAEAEA]"
          >
            <Heart
              size={18}
              className={wishlisted ? "text-red-500 fill-red-500" : "text-[#1B1B1B]"}
            />
          </button>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartState !== "idle"}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-100"
            style={{
              backgroundColor: cartState === "added" ? "#2D6A4F" : "var(--color-forest-light)",
              fontFamily: "var(--font-outfit)",
            }}
          >
            {cartState === "adding" && (
              <>
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </>
            )}
            {cartState === "added" && (
              <>
                <Check size={16} />
                Added!
              </>
            )}
            {cartState === "idle" && (
              <>
                <ShoppingBag size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
