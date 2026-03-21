"use client";
// ─── components/product/ProductGallery.tsx ──────────────────────────────────
//
// Product image gallery with thumbnail strip + main image.
// Desktop: vertical thumbnails on left, main image on right.
// Mobile: main image on top, horizontal thumbnail strip below.
//
// For MVP, we repeat the same category-based Unsplash image as placeholders.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import type { Product } from "@/types";

// Same category image map as ProductCard for consistency
const CATEGORY_IMAGES: Record<string, string> = {
  "Hair Care":        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
  "Skin Care":        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
  "Digestive Health": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop",
  "Immunity":         "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop",
  "Eye Care":         "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=600&fit=crop",
  "Wellness":         "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop",
  "Liver Care":       "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&h=600&fit=crop",
  "Joint Health":     "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
  "Sleep Wellness":   "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop",
  "Women's Health":   "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
  "Mental Wellness":  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop",
  "General Wellness": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop";

function getProductImage(product: Product): string {
  return CATEGORY_IMAGES[product.category] || DEFAULT_IMAGE;
}

type ProductGalleryProps = {
  product: Product;
};

export default function ProductGallery({ product }: ProductGalleryProps) {
  const baseImage = product.image_url.startsWith("http")
    ? product.image_url
    : getProductImage(product);

  // For MVP: 4 thumbnail placeholders using the same image
  const images = [baseImage, baseImage, baseImage, baseImage];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState(baseImage);

  return (
    <div className="flex flex-col-reverse lg:flex-row" style={{ gap: 16 }}>
      {/* ── Thumbnail Strip ──────────────────────────────────────────── */}
      {/* Desktop: vertical strip | Mobile: horizontal strip */}
      <div
        className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-hide"
        style={{ gap: 8 }}
      >
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setSelectedIndex(i);
              setImgSrc(src);
            }}
            className="shrink-0 overflow-hidden transition-all"
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              border: selectedIndex === i
                ? "2px solid #2D6A4F"
                : "1px solid #F0F0F0",
              opacity: selectedIndex === i ? 1 : 0.7,
            }}
          >
            <img
              src={src}
              alt={`${product.name} thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* ── Main Image ───────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          height: 440,
          borderRadius: 16,
          border: "1px solid #F0F0F0",
        }}
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImgSrc(getProductImage(product))}
        />
      </div>
    </div>
  );
}
