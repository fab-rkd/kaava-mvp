"use client";
// ─── components/layout/HomepageHeader.tsx ────────────────────────────────────
//
// Full-width homepage header containing:
//   LEFT   — Logo text ("Kaava") with tagline
//   CENTER — Search bar with magnifying-glass icon
//   RIGHT  — Nav links (Concerns, Brands, About) + cart icon with badge
//
// The cart badge reads totalItems from CartContext and only renders when > 0.
// Clicking the cart icon calls openDrawer() to slide open the cart drawer.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function HomepageHeader() {
  const { totalItems, openDrawer } = useCart();

  return (
    <header className="w-full bg-white border-b border-kaava-border">
      <div className="max-w-content mx-auto px-4 py-3 flex items-center justify-between">

        {/* ── LEFT: Logo ─────────────────────────────────────────────────── */}
        <Link href="/" className="flex flex-col leading-none">
          <h1 className="font-outfit text-2xl font-bold text-forest">Kaava</h1>
          <span className="text-xs text-kaava-muted font-inter">
            Verified Ayurveda
          </span>
        </Link>

        {/* ── CENTER: Search bar ──────────────────────────────────────────── */}
        <div className="flex items-center flex-1 mx-8 max-w-md">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Search for products, brands, concerns..."
              className="border border-kaava-border rounded-full px-4 py-2 w-full text-sm font-inter focus:outline-none focus:border-saffron pr-10"
            />
            {/* Magnifying glass icon */}
            <span className="absolute right-3 text-kaava-muted pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
        </div>

        {/* ── RIGHT: Nav links + Cart ─────────────────────────────────────── */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-inter text-kaava-dark hover:text-forest transition-colors"
          >
            Concerns
          </Link>
          <Link
            href="/"
            className="text-sm font-inter text-kaava-dark hover:text-forest transition-colors"
          >
            Brands
          </Link>
          <Link
            href="/"
            className="text-sm font-inter text-kaava-dark hover:text-forest transition-colors"
          >
            About
          </Link>

          {/* Cart icon with badge */}
          <button
            onClick={openDrawer}
            className="relative p-1 text-kaava-dark hover:text-forest transition-colors"
            aria-label="Open cart"
          >
            {/* Shopping bag SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {/* Badge — only rendered when cart has items */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-saffron text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-inter font-semibold">
                {totalItems}
              </span>
            )}
          </button>
        </nav>

      </div>
    </header>
  );
}
