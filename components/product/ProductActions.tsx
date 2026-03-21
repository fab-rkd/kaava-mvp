"use client";

import { useState, useCallback } from "react";
import { Minus, Plus, ShoppingBag, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");

  const isOutOfStock = product.stock === "Out of Stock";

  const handleAddToCart = useCallback(() => {
    if (cartState !== "idle" || isOutOfStock) return;
    setCartState("adding");
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setCartState("added");
      setTimeout(() => setCartState("idle"), 1000);
    }, 600);
  }, [cartState, isOutOfStock, quantity, addItem, product]);

  const handleBuyNow = useCallback(() => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    router.push("/checkout");
  }, [isOutOfStock, quantity, addItem, product, router]);

  return (
    <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
      {/* ── Quantity Selector ───────────────────────────────────────── */}
      <div
        className="flex items-center"
        style={{
          height: 48,
          borderRadius: 8,
          border: "1px solid #F0F0F0",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex items-center justify-center transition-colors hover:bg-[#F5F5F5]"
          style={{ width: 48, height: 48 }}
        >
          <Minus size={16} className="text-[#1B1B1B]" />
        </button>
        <span
          className="flex items-center justify-center font-outfit font-bold text-[15px] text-[#1B1B1B]"
          style={{ width: 40, height: 48 }}
        >
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex items-center justify-center transition-colors hover:bg-[#F5F5F5]"
          style={{ width: 48, height: 48 }}
        >
          <Plus size={16} className="text-[#1B1B1B]" />
        </button>
      </div>

      {/* ── Add to Cart ────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || cartState !== "idle"}
        className="flex flex-1 items-center justify-center gap-2 font-outfit font-bold text-[15px] text-white transition-all hover:opacity-90 disabled:cursor-not-allowed"
        style={{
          height: 48,
          borderRadius: 8,
          backgroundColor: cartState === "added" ? "#2D6A4F" : cartState === "adding" ? "#40916C" : "#2D6A4F",
          minWidth: 160,
          opacity: isOutOfStock ? 0.5 : 1,
        }}
      >
        {cartState === "adding" && (
          <>
            <Loader2 size={18} className="animate-spin" />
            Adding...
          </>
        )}
        {cartState === "added" && (
          <>
            <Check size={18} />
            Added!
          </>
        )}
        {cartState === "idle" && (
          <>
            <ShoppingBag size={18} />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </button>

      {/* ── Buy Now ────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={isOutOfStock}
        className="flex items-center justify-center font-outfit font-bold text-[15px] text-[#1B1B1B] transition-colors hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          height: 48,
          borderRadius: 8,
          border: "1px solid #1B1B1B",
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        Buy Now
      </button>
    </div>
  );
}
