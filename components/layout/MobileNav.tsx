"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Heart, User, MessageCircle, ChevronDown } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { getBrandDropdownItems, getConcernDropdownItems } from "@/lib/nav-data";

type MobileNavProps = {
  cartItemCount: number;
  onCartClick: () => void;
};

export default function MobileNav({ cartItemCount, onCartClick }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [concernsOpen, setConcernsOpen] = useState(false);
  const { openAuthModal } = useAuthModal();

  const brands = getBrandDropdownItems();
  const concerns = getConcernDropdownItems();

  return (
    <>
      {/* Burger icon trigger */}
      <div className="lg:hidden">
        <button
          aria-label="Open menu"
          className="glass-icon-btn"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col overflow-y-auto"
        style={{
          width: 300,
          background: "linear-gradient(180deg, #1B4D3E 0%, #2D6A4F 100%)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms ease",
        }}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            aria-label="Close menu"
            className="glass-icon-btn"
            style={{ width: 38, height: 38 }}
            onClick={() => setOpen(false)}
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-6" style={{ gap: 4 }}>
          {/* Shop All */}
          <Link
            href="/category/all"
            onClick={() => setOpen(false)}
            className="font-inter font-medium text-white py-2"
            style={{ fontSize: 16 }}
          >
            Shop All
          </Link>

          {/* Brands — accordion */}
          <div>
            <button
              type="button"
              onClick={() => setBrandsOpen((v) => !v)}
              className="flex items-center justify-between w-full font-inter font-medium text-white py-2"
              style={{ fontSize: 16 }}
            >
              Brands
              <ChevronDown
                size={16}
                className="text-white/60 transition-transform"
                style={{ transform: brandsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {brandsOpen && (
              <div className="flex flex-col pl-4 pb-2" style={{ gap: 2 }}>
                {brands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/category/${b.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between font-inter text-white/80 py-1.5 transition-colors hover:text-white"
                    style={{ fontSize: 14 }}
                  >
                    <span>{b.name}</span>
                    <span className="text-white/40" style={{ fontSize: 12 }}>{b.count}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Concerns — accordion */}
          <div>
            <button
              type="button"
              onClick={() => setConcernsOpen((v) => !v)}
              className="flex items-center justify-between w-full font-inter font-medium text-white py-2"
              style={{ fontSize: 16 }}
            >
              Concerns
              <ChevronDown
                size={16}
                className="text-white/60 transition-transform"
                style={{ transform: concernsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
            {concernsOpen && (
              <div className="flex flex-col pl-4 pb-2" style={{ gap: 2 }}>
                {concerns.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 font-inter text-white/80 py-1.5 transition-colors hover:text-white"
                      style={{ fontSize: 14 }}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span>{c.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bestsellers */}
          <Link
            href="/category/bestsellers"
            onClick={() => setOpen(false)}
            className="font-inter font-medium text-white py-2"
            style={{ fontSize: 16 }}
          >
            Bestsellers
          </Link>

          {/* Know Ayurveda */}
          <Link
            href="/#know-your-ayurveda"
            onClick={() => setOpen(false)}
            className="font-inter font-medium text-white py-2"
            style={{ fontSize: 16 }}
          >
            Know Ayurveda
          </Link>
        </nav>

        {/* Bottom icon row */}
        <div className="mt-auto px-6 pb-8">
          <div className="flex items-center" style={{ gap: 12 }}>
            <button aria-label="Wishlist" className="glass-icon-btn">
              <Heart size={18} className="text-white" />
            </button>
            <button aria-label="Account" onClick={() => { setOpen(false); openAuthModal(); }} className="glass-icon-btn">
              <User size={18} className="text-white" />
            </button>
            <button aria-label="WhatsApp" className="glass-icon-btn">
              <MessageCircle size={18} className="text-whatsapp" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
