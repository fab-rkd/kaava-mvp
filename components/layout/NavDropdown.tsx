"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type BrandDropdownItem = {
  name: string;
  slug: string;
  count: number;
};

export type ConcernDropdownItem = {
  label: string;
  slug: string;
  icon: LucideIcon;
};

type NavDropdownProps = {
  label: string;
  items: BrandDropdownItem[] | ConcernDropdownItem[];
  variant: "brands" | "concerns";
  /** Additional className for the trigger link */
  triggerClassName?: string;
  /** Inline style for the trigger button */
  triggerStyle?: React.CSSProperties;
};

// ─── Type guard ─────────────────────────────────────────────────────────────
function isBrandItem(
  item: BrandDropdownItem | ConcernDropdownItem
): item is BrandDropdownItem {
  return "name" in item && "count" in item;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function NavDropdown({
  label,
  items,
  variant,
  triggerClassName = "",
  triggerStyle,
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), 120);
  }, []);

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger */}
      <button
        type="button"
        className={triggerClassName}
        style={triggerStyle}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-1/2 top-full z-50"
          style={{
            transform: "translateX(-50%)",
            paddingTop: 8,
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.082)",
              border: "1px solid #F0F0F0",
              padding: 20,
              maxHeight: 400,
              overflowY: "auto",
              minWidth: variant === "brands" ? 240 : 220,
            }}
          >
            <div className="flex flex-col" style={{ gap: 2 }}>
              {items.map((item) => {
                if (isBrandItem(item)) {
                  return (
                    <Link
                      key={item.slug}
                      href={`/category/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 font-inter text-[14px] transition-colors hover:bg-[#F5F5F5]"
                      style={{
                        color: "#444444",
                        padding: "8px 12px",
                        borderRadius: 8,
                      }}
                    >
                      {/* Brand initial as avatar */}
                      <span
                        className="flex items-center justify-center shrink-0 rounded-md font-inter font-bold text-white"
                        style={{
                          width: 24,
                          height: 24,
                          fontSize: 11,
                          background: "#2D6A4F",
                        }}
                      >
                        {item.name.charAt(0)}
                      </span>
                      <span className="flex-1">{item.name}</span>
                      <span
                        className="font-inter text-[12px]"
                        style={{ color: "#999999" }}
                      >
                        {item.count}
                      </span>
                    </Link>
                  );
                }

                // Concern item
                const Icon = item.icon;
                return (
                  <Link
                    key={item.slug}
                    href={`/category/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 font-inter text-[14px] transition-colors hover:bg-[#F5F5F5]"
                    style={{
                      color: "#444444",
                      padding: "8px 12px",
                      borderRadius: 8,
                    }}
                  >
                    <Icon size={18} className="shrink-0" style={{ color: "#2D6A4F" }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
