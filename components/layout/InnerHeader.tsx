"use client";
// ─── components/layout/InnerHeader.tsx ───────────────────────────────────────
//
// Two-row header for inner pages (category, product, cart, checkout).
//
// Row 1: Logo | Search bar | Home link + Cart icon with badge
// Row 2: Category navigation links
//
// Client component because it uses useCart (React context/hook).
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function InnerHeader() {
  const { totalItems, openDrawer } = useCart();

  return (
    <header>
      {/* ── Row 1: Main header bar ── */}
      <div className="w-full bg-white border-b border-kaava-border">
        <div className="max-w-content mx-auto px-4 py-3 flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link href="/">
            <span className="font-outfit text-xl font-bold text-forest">
              Kaava
            </span>
          </Link>

          {/* CENTER: Search bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="border border-kaava-border rounded-full px-4 py-2 text-sm font-inter w-full max-w-sm focus:outline-none focus:border-saffron"
          />

          {/* RIGHT: Home link + Cart */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-inter text-kaava-secondary hover:text-forest"
            >
              Home
            </Link>

            {/* Cart button with badge */}
            <button
              onClick={openDrawer}
              className="relative"
              aria-label="Open cart"
            >
              {/* Shopping bag icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-kaava-dark"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {/* Badge: only shown when cart has items */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-saffron text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Navigation bar ── */}
      <div className="w-full bg-kaava-surface1">
        <nav className="max-w-content mx-auto px-4 py-2 flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-inter text-kaava-secondary hover:text-forest transition-colors"
          >
            All Concerns
          </Link>
          <Link
            href="/category/hair"
            className="text-sm font-inter text-kaava-secondary hover:text-forest transition-colors"
          >
            Hair
          </Link>
          <Link
            href="/category/skin"
            className="text-sm font-inter text-kaava-secondary hover:text-forest transition-colors"
          >
            Skin
          </Link>
          <Link
            href="/category/digestion"
            className="text-sm font-inter text-kaava-secondary hover:text-forest transition-colors"
          >
            Digestion
          </Link>
          <Link
            href="/category/immunity"
            className="text-sm font-inter text-kaava-secondary hover:text-forest transition-colors"
          >
            Immunity
          </Link>
        </nav>
      </div>
    </header>
  );
}
