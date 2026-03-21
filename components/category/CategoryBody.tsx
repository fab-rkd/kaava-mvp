"use client";

// ─── components/category/CategoryBody.tsx ─────────────────────────────────────
//
// Client component for the interactive category page body.
// Handles sidebar filters, sorting, and "Load More" pagination.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

// ─── Types ──────────────────────────────────────────────────────────────────
type PriceRange = "under-200" | "200-500" | "500-1000" | "above-1000" | null;
type SortOption = "relevance" | "price-low" | "price-high" | "name-az";

type CategoryBodyProps = {
  products: Product[];
  concernLabel: string;
  isFallback: boolean;
};

// ─── Constants ──────────────────────────────────────────────────────────────
const BRANDS = ["Himalaya", "Dabur", "Patanjali", "Baidyanath", "Zandu"];

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: "under-200", label: "Under \u20B9200" },
  { value: "200-500", label: "\u20B9200 \u2013 \u20B9500" },
  { value: "500-1000", label: "\u20B9500 \u2013 \u20B91,000" },
  { value: "above-1000", label: "Above \u20B91,000" },
];

const CERTIFICATIONS = [
  "AYUSH Certified",
  "FSSAI Approved",
  "GMP Certified",
  "Lab Tested",
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A-Z" },
];

const PRODUCTS_PER_PAGE = 9;

// ─── Helpers ────────────────────────────────────────────────────────────────
function matchesPriceRange(price: number, range: PriceRange): boolean {
  switch (range) {
    case "under-200":
      return price < 200;
    case "200-500":
      return price >= 200 && price <= 500;
    case "500-1000":
      return price >= 500 && price <= 1000;
    case "above-1000":
      return price > 1000;
    default:
      return true;
  }
}

function matchesCertification(product: Product, certs: string[]): boolean {
  if (certs.length === 0) return true;
  // Map certification labels to compliance tag fields
  const tag = product.compliance_tags;
  for (const cert of certs) {
    if (cert === "AYUSH Certified" && tag.label === "AYUSH") return true;
    if (cert === "FSSAI Approved" && tag.label === "FSSAI") return true;
    // GMP Certified and Lab Tested — treat as always true for MVP
    // (no data field for these yet, so they pass through)
    if (cert === "GMP Certified") return true;
    if (cert === "Lab Tested") return true;
  }
  return false;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function CategoryBody({
  products,
  concernLabel,
  isFallback,
}: CategoryBodyProps) {
  // Filter state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  // ── Filtered + sorted products ────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = products;

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price range filter
    if (priceRange) {
      result = result.filter((p) =>
        matchesPriceRange(p.special_price, priceRange)
      );
    }

    // Certification filter
    if (selectedCerts.length > 0) {
      result = result.filter((p) => matchesCertification(p, selectedCerts));
    }

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.special_price - b.special_price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.special_price - a.special_price);
        break;
      case "name-az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; // relevance = original order
    }

    return sorted;
  }, [products, selectedBrands, priceRange, selectedCerts, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // ── Toggle helpers ────────────────────────────────────────────────────
  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
    setVisibleCount(PRODUCTS_PER_PAGE);
  }

  function toggleCert(cert: string) {
    setSelectedCerts((prev) =>
      prev.includes(cert)
        ? prev.filter((c) => c !== cert)
        : [...prev, cert]
    );
    setVisibleCount(PRODUCTS_PER_PAGE);
  }

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Relevance";

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="content-container" style={{ paddingTop: 40, paddingBottom: 64 }}>
      {/* Fallback notice */}
      {isFallback && (
        <div
          className="mb-6 rounded-lg px-4 py-3 font-inter text-[14px] text-[#666666]"
          style={{ backgroundColor: "#FFF8F0", border: "1px solid #F0E0D0" }}
        >
          No exact match for &ldquo;{concernLabel}&rdquo; &mdash; showing all
          products instead.
        </div>
      )}

      <div className="flex gap-[28px]">
        {/* ═══════════════════════════════════════════════════════════════
           SIDEBAR — 260px, hidden on mobile
           ═══════════════════════════════════════════════════════════════ */}
        <aside
          className="hidden lg:block shrink-0"
          style={{ width: 260 }}
        >
          {/* ── Brand Filter ───────────────────────────────────────── */}
          <FilterSection title="Brand">
            {BRANDS.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 rounded border-[#D0D0D0] text-forest accent-[#2D6A4F]"
                />
                <span
                  className="font-inter text-[14px] text-[#444444]"
                >
                  {brand}
                </span>
              </label>
            ))}
          </FilterSection>

          {/* ── Price Range Filter ─────────────────────────────────── */}
          <FilterSection title="Price Range">
            {PRICE_RANGES.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={priceRange === range.value}
                  onChange={() => {
                    setPriceRange(
                      priceRange === range.value ? null : range.value
                    );
                    setVisibleCount(PRODUCTS_PER_PAGE);
                  }}
                  className="h-4 w-4 border-[#D0D0D0] text-forest accent-[#2D6A4F]"
                />
                <span className="font-inter text-[14px] text-[#444444]">
                  {range.label}
                </span>
              </label>
            ))}
          </FilterSection>

          {/* ── Certification Filter ───────────────────────────────── */}
          <FilterSection title="Certification" noBorder>
            {CERTIFICATIONS.map((cert) => (
              <label
                key={cert}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCerts.includes(cert)}
                  onChange={() => toggleCert(cert)}
                  className="h-4 w-4 rounded border-[#D0D0D0] text-forest accent-[#2D6A4F]"
                />
                <span className="font-inter text-[14px] text-[#444444]">
                  {cert}
                </span>
              </label>
            ))}
          </FilterSection>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════
           GRID AREA — flex-1
           ═══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          {/* ── Sort Bar ─────────────────────────────────────────────── */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5"
            style={{ height: "auto", minHeight: 44 }}
          >
            <p className="font-inter text-[14px] text-[#666666]">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} in{" "}
              {concernLabel}
            </p>

            {/* Sort dropdown */}
            <div className="relative mt-2 sm:mt-0">
              <button
                type="button"
                onClick={() => setShowSortMenu((v) => !v)}
                className="flex items-center gap-1.5 font-inter text-[14px] font-medium text-[#1B1B1B] hover:opacity-70 transition-opacity"
              >
                Sort: {currentSortLabel}
                <ChevronDown size={16} className={`transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
              </button>

              {showSortMenu && (
                <div
                  className="absolute right-0 top-full mt-1 z-20 min-w-[200px] rounded-lg bg-white py-1"
                  style={{
                    border: "1px solid #F0F0F0",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 font-inter text-[14px] transition-colors hover:bg-[#F5F5F5] ${
                        sortBy === option.value
                          ? "text-[#2D6A4F] font-medium"
                          : "text-[#444444]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Product Grid ─────────────────────────────────────────── */}
          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleProducts.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-inter text-[16px] text-[#666666]">
                No products match the selected filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedBrands([]);
                  setPriceRange(null);
                  setSelectedCerts([]);
                }}
                className="mt-3 font-inter text-[14px] font-medium text-[#2D6A4F] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* ── Load More ────────────────────────────────────────────── */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)
                }
                className="font-inter text-[14px] font-medium text-[#1B1B1B] rounded-full transition-colors hover:bg-[#F5F5F5]"
                style={{
                  padding: "12px 32px",
                  border: "1px solid #F0F0F0",
                }}
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FilterSection sub-component ────────────────────────────────────────────
function FilterSection({
  title,
  children,
  noBorder = false,
}: {
  title: string;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-[10px] pb-4"
      style={
        noBorder
          ? undefined
          : { borderBottom: "1px solid #F0F0F0", marginBottom: 16 }
      }
    >
      <h4 className="font-inter text-[14px] font-bold text-[#1B1B1B]">
        {title}
      </h4>
      {children}
    </div>
  );
}
