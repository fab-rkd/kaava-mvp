// ─── components/layout/Footer.tsx ────────────────────────────────────────────
//
// 4-column footer for all inner pages.
// Server Component — no interactivity, purely static content.
//
// Columns: Brand | Shop | Company | Support
// Bottom bar: copyright + tagline
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-dark text-white">
      {/* ── Main grid ── */}
      <div className="content-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ── Column 1: Brand ── */}
          <div>
            <div className="mb-2">
              <img src="/kaava-logo-text.png" alt="Kaava" className="h-9 w-auto brightness-100" />
            </div>
            <p className="text-sm text-white/70 font-inter mb-4">
              India&apos;s Verified Ayurveda Marketplace
            </p>
            <p className="text-sm text-white/60 font-inter">
              Every product is AYUSH-licensed and lab-tested for purity.
            </p>
          </div>

          {/* ── Column 2: Shop ── */}
          <div>
            <p className="font-outfit text-base font-semibold text-white mb-4">
              Shop
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/category/hair"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Hair Care
                </Link>
              </li>
              <li>
                <Link
                  href="/category/skin"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Skin Care
                </Link>
              </li>
              <li>
                <Link
                  href="/category/digestion"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Digestion
                </Link>
              </li>
              <li>
                <Link
                  href="/category/immunity"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Immunity
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Column 3: Company ── */}
          <div>
            <p className="font-outfit text-base font-semibold text-white mb-4">
              Company
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  AYUSH Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Column 4: Support ── */}
          <div>
            <p className="font-outfit text-base font-semibold text-white mb-4">
              Support
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm font-inter text-white/70 hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row gap-2 justify-between items-center">
          <p className="text-sm text-white/50 font-inter">
            2026 Kaava. All rights reserved.
          </p>
          <p className="text-sm text-white/50 font-inter">
            Made with care in India
          </p>
        </div>
      </div>
    </footer>
  );
}
