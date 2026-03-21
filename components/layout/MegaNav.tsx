"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getBrandDropdownItems, getConcernDropdownItems } from "@/lib/nav-data";
import type { BrandDropdownItem, ConcernDropdownItem } from "@/components/layout/NavDropdown";

// ─── Nav config ──────────────────────────────────────────────────────────────

type NavItem =
  | { label: string; href: string; submenu?: undefined }
  | { label: string; submenu: "brands" | "concerns"; href?: undefined };

const NAV_ITEMS: NavItem[] = [
  { label: "Shop All", href: "/category/all" },
  { label: "Brands", submenu: "brands" },
  { label: "Concerns", submenu: "concerns" },
  { label: "Bestsellers", href: "/category/bestsellers" },
  { label: "Know Ayurveda", href: "/#know-your-ayurveda" },
];

// ─── Submenu content components ──────────────────────────────────────────────

function BrandsPanel({ brands, onClose }: { brands: BrandDropdownItem[]; onClose: () => void }) {
  return (
    <div>
      <p
        className="font-inter font-semibold uppercase"
        style={{ fontSize: 12, color: "#888888", marginBottom: 16, letterSpacing: "0.05em" }}
      >
        Shop by Brand
      </p>
      <div className="grid grid-cols-2 gap-1" style={{ minWidth: 380 }}>
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/category/${brand.slug}`}
            onClick={onClose}
            className="flex items-center gap-3 font-inter transition-colors hover:bg-[#F5F5F5]"
            style={{ fontSize: 14, color: "#444444", padding: "8px 12px", borderRadius: 8 }}
          >
            <span
              className="flex items-center justify-center shrink-0 rounded-full font-inter font-bold text-white"
              style={{ width: 28, height: 28, fontSize: 12, background: "#2D6A4F" }}
            >
              {brand.name.charAt(0)}
            </span>
            <span className="flex-1" style={{ color: "#444444" }}>{brand.name}</span>
            <span className="font-inter" style={{ fontSize: 12, color: "#999999" }}>
              {brand.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ConcernsPanel({ concerns, onClose }: { concerns: ConcernDropdownItem[]; onClose: () => void }) {
  return (
    <div>
      <p
        className="font-inter font-semibold uppercase"
        style={{ fontSize: 12, color: "#888888", marginBottom: 16, letterSpacing: "0.05em" }}
      >
        Shop by Concern
      </p>
      <div className="grid grid-cols-2 gap-1" style={{ minWidth: 340 }}>
        {concerns.map((concern) => {
          const Icon = concern.icon;
          return (
            <Link
              key={concern.slug}
              href={`/category/${concern.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 font-inter transition-colors hover:bg-[#F5F5F5]"
              style={{ fontSize: 14, color: "#444444", padding: "8px 12px", borderRadius: 8 }}
            >
              <Icon size={18} className="shrink-0" style={{ color: "#2D6A4F" }} />
              <span>{concern.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── MegaNav ─────────────────────────────────────────────────────────────────

export default function MegaNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<"brands" | "concerns" | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-fetch data once
  const brands = getBrandDropdownItems();
  const concerns = getConcernDropdownItems();

  const clearLeaveTimeout = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }, []);

  const handleItemEnter = useCallback(
    (index: number) => {
      clearLeaveTimeout();
      setHoveredIndex(index);
      const item = NAV_ITEMS[index];
      if (item.submenu) {
        setActiveSubmenu(item.submenu);
      } else {
        setActiveSubmenu(null);
      }
    },
    [clearLeaveTimeout]
  );

  const handleContainerLeave = useCallback(() => {
    clearLeaveTimeout();
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      setActiveSubmenu(null);
    }, 150);
  }, [clearLeaveTimeout]);

  const handleDropdownEnter = useCallback(() => {
    clearLeaveTimeout();
  }, [clearLeaveTimeout]);

  const closeMenu = useCallback(() => {
    setHoveredIndex(null);
    setActiveSubmenu(null);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      style={{ gap: 8 }}
      onMouseLeave={handleContainerLeave}
    >
      {NAV_ITEMS.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const hasSubmenu = !!item.submenu;
        const isSubmenuOpen = hasSubmenu && activeSubmenu === item.submenu;

        const commonClass =
          "relative inline-flex items-center font-inter font-medium transition-colors cursor-pointer select-none whitespace-nowrap";
        const commonStyle: React.CSSProperties = {
          fontSize: 13,
          color: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.8)",
          padding: "6px 14px",
        };

        const content = (
          <span className="relative z-10 inline-flex items-center gap-1">
            {item.label}
            {hasSubmenu && (
              <motion.span
                animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown size={14} />
              </motion.span>
            )}
          </span>
        );

        return (
          <div key={item.label} className="relative" onMouseEnter={() => handleItemEnter(index)}>
            {/* Animated pill — absolute behind the text */}
            {isHovered && (
              <motion.div
                layoutId="nav-hover"
                className="absolute inset-0 z-0"
                style={{
                  background: "rgb(255 255 255 / 0.12)",
                  borderRadius: 99,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}

            {hasSubmenu ? (
              <button
                type="button"
                className={commonClass}
                style={commonStyle}
                aria-expanded={isSubmenuOpen || undefined}
                aria-haspopup="true"
              >
                {content}
              </button>
            ) : (
              <Link href={item.href} className={commonClass} style={commonStyle}>
                {content}
              </Link>
            )}
          </div>
        );
      })}

      {/* ── Dropdown mega panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeSubmenu && (
          <motion.div
            className="absolute top-full left-1/2 z-50"
            style={{ paddingTop: 8 }}
            initial={false}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleContainerLeave}
          >
            <motion.div
              layoutId="mega-panel"
              style={{
                background: "#FFFFFF",
                border: "1px solid #F0F0F0",
                borderRadius: 16,
                boxShadow: "0 16px 48px rgb(0 0 0 / 0.12)",
                padding: 24,
                x: "-50%",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSubmenu}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeSubmenu === "brands" && (
                    <BrandsPanel brands={brands} onClose={closeMenu} />
                  )}
                  {activeSubmenu === "concerns" && (
                    <ConcernsPanel concerns={concerns} onClose={closeMenu} />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
