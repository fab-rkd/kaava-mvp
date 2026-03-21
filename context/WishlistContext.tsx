"use client";
// ─── context/WishlistContext.tsx ────────────────────────────────────────────
//
// Wishlist state management. Stores an array of product SKUs in localStorage
// so the wishlist survives page reloads.
//
// Pattern mirrors CartContext — createContext + custom hook.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const STORAGE_KEY = "kaava-wishlist";

// ─── Context Type ─────────────────────────────────────────────────────────
type WishlistContextType = {
  wishlistItems: string[];
  addToWishlist: (sku: string) => void;
  removeFromWishlist: (sku: string) => void;
  toggleWishlist: (sku: string) => void;
  isInWishlist: (sku: string) => boolean;
  wishlistCount: number;
};

// ─── Create Context ───────────────────────────────────────────────────────
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// ─── Helper: read from localStorage ───────────────────────────────────────
function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

// ─── Helper: write to localStorage ────────────────────────────────────────
function writeStorage(items: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

// ─── Provider Component ───────────────────────────────────────────────────
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setWishlistItems(readStorage());
  }, []);

  // Persist whenever items change (skip initial empty render)
  useEffect(() => {
    writeStorage(wishlistItems);
  }, [wishlistItems]);

  const addToWishlist = useCallback((sku: string) => {
    setWishlistItems((prev) => {
      if (prev.includes(sku)) return prev;
      return [...prev, sku];
    });
  }, []);

  const removeFromWishlist = useCallback((sku: string) => {
    setWishlistItems((prev) => prev.filter((s) => s !== sku));
  }, []);

  const toggleWishlist = useCallback((sku: string) => {
    setWishlistItems((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  }, []);

  const isInWishlist = useCallback(
    (sku: string) => wishlistItems.includes(sku),
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────
export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside a <WishlistProvider>");
  }
  return context;
}
