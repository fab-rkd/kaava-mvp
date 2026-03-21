"use client";
// ─── app/cart/page.tsx ────────────────────────────────────────────────────────
//
// Full cart page (/cart).
// Layout: InnerHeader + Breadcrumb + Cart Body (items + order summary) + Footer
// Client component — reads cart state via useCart().
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import InnerHeader from "@/components/layout/InnerHeader";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { getProductImage } from "@/lib/images";

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;

export default function CartPage() {
  const {
    state,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  const { items } = state;

  // Promo code state (UI only for MVP)
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = promoApplied ? Math.round(totalPrice * 0.1) : 0;
  const total = totalPrice + shipping - discount;

  function handleApplyPromo() {
    if (promoCode.trim().toUpperCase() === "KAAVA10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code");
    }
  }

  return (
    <>
      <InnerHeader />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart" },
        ]}
      />

      <main className="min-h-screen bg-white">
        <div
          className="content-container"
          style={{ paddingTop: 40, paddingBottom: 72 }}
        >
          {/* ── Empty Cart State ───────────────────────────────────────── */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-green"
                style={{ fontSize: 36 }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <h1 className="font-outfit text-[22px] font-bold text-dark mb-2">
                Your cart is empty
              </h1>
              <p className="font-inter text-[14px] text-muted mb-6 max-w-sm">
                Looks like you haven&apos;t added any products yet. Browse our collection of verified Ayurvedic products.
              </p>
              <Link
                href="/products"
                className="flex h-12 items-center justify-center rounded-[8px] bg-forest px-8 font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            /* ── Cart with Items ─────────────────────────────────────── */
            <div className="flex flex-col lg:flex-row" style={{ gap: 32 }}>
              {/* ── LEFT: Cart Items Column ──────────────────────────── */}
              <div className="flex-1">
                <h1 className="font-outfit text-[22px] font-bold text-dark mb-6">
                  Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
                </h1>

                {/* Cart item rows */}
                <div>
                  {items.map((item) => (
                    <div
                      key={item.sku}
                      className="flex items-start gap-4 border-b border-border"
                      style={{ padding: "24px 0" }}
                    >
                      {/* Product image */}
                      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[12px] bg-surface-3">
                        <img
                          src={getProductImage(item.category, item.image_url)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-outfit text-[16px] font-bold text-dark">
                            {item.name}
                          </p>
                          <p className="font-inter text-[13px] text-muted">
                            {item.brand}
                          </p>
                          <p className="font-outfit text-[18px] font-bold text-dark mt-1">
                            {formatPrice(item.special_price)}
                          </p>
                          {item.price > item.special_price && (
                            <p className="font-inter text-[13px] text-muted line-through">
                              {formatPrice(item.price)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                          {/* Quantity controls */}
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(item.sku, item.quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-l-[6px] border border-border font-inter text-[14px] text-text-label transition-colors hover:bg-surface"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              &minus;
                            </button>
                            <span className="flex h-8 w-9 items-center justify-center border-y border-border font-inter text-[13px] font-medium text-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.sku, item.quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-r-[6px] border border-border font-inter text-[14px] text-text-label transition-colors hover:bg-surface"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeItem(item.sku)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-3 hover:text-dark"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping link */}
                <Link
                  href="/products"
                  className="inline-block mt-6 font-inter text-[14px] text-forest transition-colors hover:text-forest-dark"
                >
                  &larr; Continue Shopping
                </Link>
              </div>

              {/* ── RIGHT: Order Summary ─────────────────────────────── */}
              <div className="w-full lg:w-[320px] shrink-0">
                <div
                  className="rounded-[12px] bg-surface-green border border-border-green flex flex-col"
                  style={{ padding: 20, gap: 12 }}
                >
                  <h2 className="font-outfit text-[16px] font-bold text-dark">
                    Order Summary
                  </h2>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-[14px] text-text-secondary">
                      Subtotal
                    </span>
                    <span className="font-inter text-[14px] text-dark">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-[14px] text-text-secondary">
                      Shipping
                    </span>
                    <span className="font-inter text-[14px] text-dark">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  {/* Discount (if applied) */}
                  {promoApplied && (
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-[14px] text-forest">
                        Discount (KAAVA10)
                      </span>
                      <span className="font-inter text-[14px] text-forest">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-border-green" />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="font-outfit text-[16px] font-bold text-dark">
                      Total
                    </span>
                    <span className="font-outfit text-[20px] font-bold text-dark">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* Promo code */}
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      placeholder="Promo code"
                      className="flex-1 h-10 rounded-[6px] border border-border-green bg-white px-3 font-inter text-[13px] text-dark placeholder:text-placeholder outline-none focus:border-forest"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="h-10 rounded-[6px] bg-white border border-border-green px-4 font-inter text-[13px] font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="font-inter text-[12px] text-saffron">
                      {promoError}
                    </p>
                  )}
                  {promoApplied && (
                    <p className="font-inter text-[12px] text-forest">
                      10% discount applied!
                    </p>
                  )}

                  {/* Checkout button */}
                  <Link
                    href="/checkout"
                    className="flex h-12 w-full items-center justify-center rounded-[8px] bg-forest font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark mt-1"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Free shipping note */}
                  {totalPrice < FREE_SHIPPING_THRESHOLD && (
                    <p className="font-inter text-[12px] text-forest text-center">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} more for FREE shipping
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
