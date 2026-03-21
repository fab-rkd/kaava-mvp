"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuthModal } from "@/context/AuthModalContext";
import {
  Search, Heart, User, MessageCircle, ShoppingBag,
  ShieldCheck, BadgeCheck, Award, FlaskConical,
  ChevronLeft, ChevronRight, ChevronDown,
  ShieldPlus, HeartPulse, Sparkles, Eye, Brain, Bone, Moon, Flower2,
  Leaf, Droplets, Wind, Activity, Smile,
} from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";
import MegaNav from "@/components/layout/MegaNav";

// ── Static Data ──────────────────────────────────────────────────────────

const POPULAR_TAGS = ["Ashwagandha", "Immunity Booster", "Chyawanprash", "Triphala", "Shilajit"];

const CONCERNS = [
  { icon: ShieldPlus,  label: "Immunity",       slug: "immunity" },
  { icon: HeartPulse,  label: "Digestion",      slug: "digestion" },
  { icon: Sparkles,    label: "Skin Care",      slug: "skin-care" },
  { icon: Eye,         label: "Eye Care",       slug: "eye-care" },
  { icon: Brain,       label: "Mental Clarity",  slug: "mental-clarity" },
  { icon: Bone,        label: "Joint Health",    slug: "joint-health" },
  { icon: Moon,        label: "Sleep",           slug: "sleep" },
  { icon: Flower2,     label: "Women's Health",  slug: "womens-health" },
  { icon: Leaf,        label: "Hair Care",       slug: "hair-care" },
  { icon: Droplets,    label: "Liver Health",    slug: "liver-health" },
  { icon: Wind,        label: "Respiratory",     slug: "respiratory" },
  { icon: Activity,    label: "Heart Health",    slug: "heart-health" },
  { icon: Smile,       label: "Oral Care",       slug: "oral-care" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck,   label: "AYUSH Licensed Sellers" },
  { icon: BadgeCheck,    label: "FSSAI Verified" },
  { icon: Award,         label: "GMP Certified" },
  { icon: FlaskConical,  label: "Lab Tested Products" },
];

// ── Component ────────────────────────────────────────────────────────────

export default function UnifiedHero() {
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

  // Concerns slider scroll
  const concernsRef = useRef<HTMLDivElement>(null);
  const scrollConcerns = useCallback((dir: "left" | "right") => {
    const el = concernsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1B4D3E 0%, #2D6A4F 40%, #245c44 100%)" }}
    >
      {/* ── Subtle gradient accents (cleaner than scattered blobs) ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Top-right light wash */}
        <div className="absolute rounded-full" style={{ width: 800, height: 600, right: -200, top: -200, opacity: 0.3, background: "radial-gradient(circle, rgb(64 145 108 / 0.6) 0%, transparent 70%)" }} />
        {/* Center subtle warm glow */}
        <div className="absolute rounded-full" style={{ width: 600, height: 400, left: "50%", top: "40%", transform: "translate(-50%, -50%)", opacity: 0.15, background: "radial-gradient(circle, rgb(255 186 8 / 0.4) 0%, transparent 70%)" }} />
        {/* Bottom-left soft light */}
        <div className="absolute rounded-full" style={{ width: 600, height: 400, left: -150, bottom: -100, opacity: 0.2, background: "radial-gradient(circle, rgb(255 255 255 / 0.15) 0%, transparent 70%)" }} />
      </div>

      {/* ═══ ANNOUNCEMENT BAR + NAV ROW (single gradient parent) ═════
           Matches inner header layout: announcement on top, nav below
           ─────────────────────────────────────────────────────────── */}
      <div className="relative">
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

        {/* Nav Row — height 72px matches inner header exactly */}
        <div className="content-container flex items-center justify-between" style={{ height: 72 }}>

          {/* Left: burger (mobile) + logo (desktop) */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <MobileNav cartItemCount={totalItems} onCartClick={openDrawer} />
            {/* Logo — desktop: normal, hidden on mobile (centered logo below) */}
            <Link href="/" className="hidden lg:flex items-center">
              <img src="/kaava-logo-text.png" alt="Kaava" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Center: logo on mobile, nav menu on desktop */}
          <Link href="/" className="lg:hidden flex items-center absolute left-1/2 -translate-x-1/2">
            <img src="/kaava-logo-text.png" alt="Kaava" className="h-7 w-auto" />
          </Link>
          <div className="hidden lg:flex items-center">
            <MegaNav />
          </div>

          {/* Right: Icon Buttons — wishlist/account/whatsapp desktop only, cart always */}
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
            <button onClick={openDrawer} aria-label={`Cart (${totalItems} items)`} className="glass-icon-btn relative">
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

      {/* ═══ 2. SEARCH HERO ═══════════════════════════════════════════
           Pencil: L8NPs — padding [48, 120, 40, 120], gap 20
           Centered content, vertical layout
           ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <div
          className="content-container flex flex-col items-center"
          style={{ paddingTop: 48, paddingBottom: 40, gap: 20 }}
        >
          {/* Headline — Pencil: VqD9N — Outfit 40px/1.15, 900, max-w 700 */}
          <h1
            className="font-outfit text-section-title lg:text-hero text-white text-center"
            style={{ fontWeight: 900, letterSpacing: -1, maxWidth: 700 }}
          >
            Verified Ayurveda, Delivered To Your Door
          </h1>

          {/* Subtitle — Pencil: wZCXD — Inter 16px/1.5, #FFFFFFAA, max-w 600 */}
          <p
            className="font-inter text-body-sm sm:text-body-lg text-white/67 text-center"
            style={{ maxWidth: 600 }}
          >
            Explore AYUSH-licensed herbal medicines, supplements, and wellness
            products from India&apos;s top brands.
          </p>

          {/* Search Bar — Pencil: soxMr — 650px wide, pill shape */}
          <div
            className="search-container flex items-center bg-white w-full transition-shadow"
            style={{
              maxWidth: 650,
              borderRadius: 50,
              padding: "6px 6px 6px 24px",
              boxShadow: "var(--shadow-search)",
            }}
          >
            <Search size={20} className="shrink-0 text-placeholder" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="Search for Ashwagandha, Triphala, Shilajit..."
              className="search-input flex-1 bg-transparent font-inter text-body px-3 text-dark"
              style={{ caretColor: "var(--color-forest)" }}
            />
            <div className="hidden sm:block shrink-0 w-px bg-divider mx-1" style={{ height: 28 }} />
            <button className="hidden sm:flex items-center gap-1 px-3.5 shrink-0 font-inter font-medium text-caption text-text-secondary">
              All Categories <ChevronDown size={14} className="text-text-secondary" />
            </button>
            <button
              aria-label="Search"
              onClick={handleSearch}
              className="flex items-center justify-center rounded-full shrink-0 bg-saffron transition-colors hover:bg-saffron-light"
              style={{ width: 44, height: 44 }}
            >
              <Search size={20} className="text-white" />
            </button>
          </div>

          {/* Popular Tags — Pencil: jsUob — gap 8 */}
          <div className="flex flex-wrap justify-center items-center" style={{ gap: 8 }}>
            <span className="font-inter font-medium text-small text-white/53">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="font-inter text-xs rounded-2xl text-white/73 cursor-pointer transition-all hover:bg-white/20 hover:scale-105"
                style={{
                  padding: "5px 12px",
                  background: "rgb(255 255 255 / 0.1)",
                  border: "1px solid rgb(255 255 255 / 0.133)",
                }}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 3. CONCERNS SLIDER ═══════════════════════════════════════
           Pencil: SqKXQ — padding [32, 48], gap 24, justify center
           ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <div
          className="content-container flex items-center"
          style={{ paddingTop: 32, paddingBottom: 32, gap: 16 }}
        >
          <button
            onClick={() => scrollConcerns("left")}
            aria-label="Previous concerns"
            className="hidden sm:flex glass-icon-btn shrink-0"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>

          <div
            ref={concernsRef}
            className="flex-1 flex items-center overflow-x-auto scroll-smooth scrollbar-hide"
            style={{ gap: 24 }}
          >
            {/* Spacer for centering on desktop when content doesn't overflow */}
            <div className="hidden lg:block shrink-0" style={{ width: 1 }} />
            {CONCERNS.map(({ icon: Icon, label, slug }) => (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="flex flex-col items-center gap-2 group shrink-0"
                style={{ minWidth: 72 }}
              >
                <Icon size={32} className="text-white transition-transform group-hover:scale-110" />
                <span className="font-inter font-medium text-small text-white/80 transition-colors group-hover:text-white whitespace-nowrap">
                  {label}
                </span>
              </Link>
            ))}
            <div className="hidden lg:block shrink-0" style={{ width: 1 }} />
          </div>

          <button
            onClick={() => scrollConcerns("right")}
            aria-label="Next concerns"
            className="hidden sm:flex glass-icon-btn shrink-0"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* ═══ 4. TRUST STRIP ═══════════════════════════════════════════
           Pencil: WHXgl — bg #1B4D3E, padding [16, 48], gap 24
           ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-forest-dark">
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ paddingTop: 16, paddingBottom: 16 }}
        >
          {TRUST_BADGES.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center" style={{ gap: 10, padding: "4px 16px" }}>
              {i > 0 && <div className="w-px bg-white/20 mr-4 hidden md:block" style={{ height: 20 }} />}
              <Icon size={20} className="text-white" />
              <span className="font-inter font-semibold text-white" style={{ fontSize: 12 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
