"use client";
// ─── components/layout/InnerHeader.tsx ───────────────────────────────────────
//
// Two-row header for inner pages (category, product, cart, checkout).
// Matches Pencil design node BNDgj.
//
// Announcement bar: promo strip (same as homepage)
// Row 1 (Main bar): Logo | Search bar | Icon buttons
// Row 2 (Nav bar):  Category navigation links
//
// Client component because it uses useCart (React context/hook).
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Heart, User, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuthModal } from "@/context/AuthModalContext";
import MobileNav from "@/components/layout/MobileNav";
import MegaNav from "@/components/layout/MegaNav";

export default function InnerHeader() {
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { openAuthModal } = useAuthModal();
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }, [query, router]);

  return (
    <header className="w-full">
      {/* ── Announcement Bar + Main Bar — single gradient parent ──────── */}
      <div
        className="w-full"
        style={{ background: "linear-gradient(180deg, #1B4D3E 0%, #2D6A4F 100%)" }}
      >
        {/* Announcement Bar — subtle, secondary to nav */}
        <div
          className="content-container flex flex-wrap items-center justify-center"
          style={{ paddingTop: 10, paddingBottom: 10, gap: 6, borderBottom: "1px solid rgb(255 255 255 / 0.08)" }}
        >
          <span className="font-inter font-normal text-white/60" style={{ fontSize: 12 }}>
            Free shipping above
          </span>
          <span className="font-inter font-semibold text-gold" style={{ fontSize: 12 }}>₹499</span>
          <span className="font-inter font-normal text-white/40" style={{ fontSize: 12 }}>|</span>
          <span className="font-inter font-normal text-white/60" style={{ fontSize: 12 }}>
            Use code
          </span>
          <span className="font-inter font-semibold text-gold" style={{ fontSize: 12 }}>KAAVA10</span>
          <span className="font-inter font-normal text-white/60" style={{ fontSize: 12 }}>
            for 10% off
          </span>
        </div>

        {/* Main Bar — 72px height */}
        <div style={{ height: 72 }}>
        <div className="content-container relative flex items-center justify-between h-full">
          {/* LEFT: Burger (mobile) + Logo (desktop) */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <MobileNav cartItemCount={totalItems} onCartClick={openDrawer} />
            <Link href="/" className="hidden lg:flex items-center">
              <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-10 w-auto" />
            </Link>
          </div>

          {/* CENTER: Logo on mobile, Search bar on desktop */}
          <Link href="/" className="lg:hidden flex items-center absolute left-1/2 -translate-x-1/2">
            <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-7 w-auto" />
          </Link>
          <div
            className="search-container hidden lg:flex items-center bg-white transition-shadow"
            style={{
              width: 600,
              maxWidth: "100%",
              height: 44,
              borderRadius: 9999,
              paddingLeft: 20,
              paddingRight: 5,
              boxShadow: "0 4px 16px #00000015",
            }}
          >
            <Search size={18} className="shrink-0 text-placeholder" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="Search for products, brands, concerns..."
              className="search-input flex-1 bg-transparent font-inter text-body-sm px-3 text-dark"
              style={{ caretColor: "var(--color-forest)" }}
            />
            <button
              aria-label="Search"
              onClick={handleSearch}
              className="flex items-center justify-center shrink-0 rounded-full bg-forest transition-colors hover:bg-forest-light"
              style={{ height: 34, paddingLeft: 20, paddingRight: 20 }}
            >
              <span className="font-inter font-bold text-white" style={{ fontSize: 12 }}>
                Search
              </span>
            </button>
          </div>

          {/* RIGHT: Wishlist/Account/WhatsApp desktop only, Cart always */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <div className="hidden lg:block">
              <Link href="/wishlist" aria-label="Wishlist" className="glass-icon-btn relative">
                <Heart size={18} className="text-white" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center rounded-full bg-saffron font-inter font-bold text-white"
                    style={{ width: 16, height: 16, top: -4, right: -4, fontSize: 9 }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="hidden lg:block">
              <button aria-label="Account" onClick={openAuthModal} className="glass-icon-btn">
                <User size={18} className="text-white" />
              </button>
            </div>
            <div className="hidden lg:block">
              <button aria-label="WhatsApp" className="glass-icon-btn">
                <MessageCircle size={18} className="text-whatsapp" />
              </button>
            </div>
            <button
              onClick={openDrawer}
              aria-label={`Cart (${totalItems} items)`}
              className="glass-icon-btn relative"
            >
              <ShoppingBag size={18} className="text-white" />
              {totalItems > 0 && (
                <span
                  className="absolute flex items-center justify-center rounded-full bg-saffron font-inter font-bold text-white"
                  style={{ width: 16, height: 16, top: -4, right: -4, fontSize: 9 }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* ── Row 2: Nav Bar ───────────────────────────────────────────────
           Pencil: bg #245c44, height 44px, centered links
           Hidden on mobile — nav links live inside MobileNav drawer
           ─────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block w-full bg-forest-nav" style={{ height: 44 }}>
        <nav
          className="content-container flex items-center justify-center h-full"
        >
          <MegaNav />
        </nav>
      </div>
    </header>
  );
}
