// ─── lib/nav-data.ts ──────────────────────────────────────────────────────────
//
// Provides brand and concern data for navigation dropdowns.
// Centralised here so UnifiedHero, InnerHeader, and MobileNav all share
// the same source of truth derived from products.json.
// ─────────────────────────────────────────────────────────────────────────────

import { getAllProducts } from "@/lib/products";
import type { BrandDropdownItem, ConcernDropdownItem } from "@/components/layout/NavDropdown";
import {
  ShieldPlus, HeartPulse, Sparkles, Eye, Brain, Bone, Moon, Flower2,
  Leaf, Droplets,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Slug helpers ───────────────────────────────────────────────────────────

function brandSlug(brand: string): string {
  return "brand-" + brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function concernSlug(concern: string): string {
  return concern.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Concern → icon mapping ────────────────────────────────────────────────

const CONCERN_ICONS: Record<string, LucideIcon> = {
  "Hair": Leaf,
  "Eyes": Eye,
  "Overall Wellness": ShieldPlus,
  "Mental Clarity": Brain,
  "Skin Care": Sparkles,
  "Liver": Droplets,
  "Gut/Digestion": HeartPulse,
  "Joint Health": Bone,
  "Sleep": Moon,
  "Women's Health": Flower2,
};

// ─── Exported data builders ─────────────────────────────────────────────────

export function getBrandDropdownItems(): BrandDropdownItem[] {
  const products = getAllProducts();
  const countMap = new Map<string, number>();

  for (const p of products) {
    countMap.set(p.brand, (countMap.get(p.brand) ?? 0) + 1);
  }

  return Array.from(countMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({
      name,
      slug: brandSlug(name),
      count,
    }));
}

export function getConcernDropdownItems(): ConcernDropdownItem[] {
  const products = getAllProducts();
  const seen = new Set<string>();
  const items: ConcernDropdownItem[] = [];

  for (const p of products) {
    for (const c of p.concerns) {
      if (!seen.has(c)) {
        seen.add(c);
        items.push({
          label: c,
          slug: concernSlug(c),
          icon: CONCERN_ICONS[c] ?? ShieldPlus,
        });
      }
    }
  }

  return items.sort((a, b) => a.label.localeCompare(b.label));
}
