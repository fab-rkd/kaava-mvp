"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { getProductImage } from "@/lib/images";

const FREE_SHIPPING_THRESHOLD = 499;

export default function CartDrawer() {
  const {
    state,
    removeItem,
    updateQuantity,
    closeDrawer,
    totalItems,
    totalPrice,
  } = useCart();

  const { items, isDrawerOpen } = state;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    if (isDrawerOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* ── Overlay ─────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 z-50 flex h-full w-full flex-col bg-white shadow-xl transition-transform duration-300 ease-out sm:w-[25rem] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          className="flex h-[56px] shrink-0 items-center justify-between px-5"
          style={{ backgroundColor: "#2D6A4F" }}
        >
          <h2 className="font-outfit text-[16px] font-bold text-white">
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h2>
          <button
            onClick={closeDrawer}
            className="flex h-7 w-7 items-center justify-center rounded bg-white/20 font-inter text-[13px] text-white transition-colors hover:bg-white/30"
            aria-label="Close cart"
          >
            &#10005;
          </button>
        </div>

        {/* ── Items (scrollable) ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <p className="font-outfit text-[15px] font-semibold text-dark">
                Your cart is empty
              </p>
              <p className="font-inter text-[13px] text-muted">
                Browse our products and add items to your cart.
              </p>
              <button
                onClick={closeDrawer}
                className="mt-2 rounded-[8px] bg-forest px-5 py-2.5 font-outfit text-[14px] font-bold text-white transition-colors hover:bg-forest-dark"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.sku}
                className="flex gap-3 border-b border-border px-4 py-3.5"
              >
                {/* Product image */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] bg-surface-3">
                  <img
                    src={getProductImage(item.category, item.image_url)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product details */}
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-outfit text-[14px] font-bold leading-tight text-dark">
                        {item.name}
                      </p>
                      <p className="font-inter text-[12px] text-muted">
                        {item.brand}
                      </p>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-muted transition-colors hover:bg-surface-3 hover:text-dark"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      &#10005;
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-outfit text-[15px] font-bold text-dark">
                      {formatPrice(item.special_price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() =>
                          updateQuantity(item.sku, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-l-[6px] border border-border font-inter text-[14px] text-text-label transition-colors hover:bg-surface"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        &minus;
                      </button>
                      <span className="flex h-7 w-8 items-center justify-center border-y border-border font-inter text-[13px] font-medium text-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.sku, item.quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-r-[6px] border border-border font-inter text-[14px] text-text-label transition-colors hover:bg-surface"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-border px-4 pb-6 pt-4 flex flex-col gap-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-inter text-[14px] text-text-label">
                Subtotal
              </span>
              <span className="font-outfit text-[16px] font-bold text-dark">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Shipping note */}
            {amountToFreeShipping > 0 && (
              <p className="font-inter text-[12px] text-forest">
                Add {formatPrice(amountToFreeShipping)} more for FREE shipping
              </p>
            )}

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex h-12 w-full items-center justify-center rounded-[8px] bg-forest font-outfit text-[15px] font-bold text-white transition-colors hover:bg-forest-dark"
            >
              Proceed to Checkout &rarr;
            </Link>

            {/* View full cart link */}
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block text-center font-inter text-[13px] text-forest transition-colors hover:text-forest-dark"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
