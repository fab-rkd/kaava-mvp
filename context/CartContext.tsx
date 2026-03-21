"use client";
// ─── context/CartContext.tsx ──────────────────────────────────────────────────
//
// This file is the entire cart brain. It:
//   1. Holds cart state (items, drawer open/closed)
//   2. Provides actions (add, remove, update qty, open/close drawer)
//   3. Wraps the whole app so any component can access the cart
//
// TypeScript lesson: `createContext` needs a type so TypeScript knows what
// the context holds. We pass `undefined` as default and check for it in the hook.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import type { CartState, CartAction, CartItem, Product } from "@/types";

const STORAGE_KEY = "kaava-cart";

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
// TypeScript lesson: A reducer is a pure function — given state + action, it
// returns the NEW state. We never mutate the existing state directly.
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.sku === action.payload.sku);
      if (existing) {
        // Product already in cart — just increase quantity
        return {
          ...state,
          isDrawerOpen: true,
          items: state.items.map((i) =>
            i.sku === action.payload.sku
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      // New product — add with quantity 1
      const newItem: CartItem = { ...action.payload, quantity: 1 };
      return {
        ...state,
        isDrawerOpen: true,
        items: [...state.items, newItem],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.sku !== action.payload.sku),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        // Quantity zero or less = remove the item
        return {
          ...state,
          items: state.items.filter((i) => i.sku !== action.payload.sku),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.sku === action.payload.sku
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };

    case "CLEAR_CART":
      return { ...initialState };

    case "HYDRATE":
      return {
        ...state,
        items: action.payload as CartItem[],
      };

    default:
      return state;
  }
}

// ─── Context Type ─────────────────────────────────────────────────────────────
// This describes everything a component gets when it uses the cart context.
type CartContextType = {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

// ─── Create Context ───────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Provider Component ───────────────────────────────────────────────────────
// Wrap your app with this so all child components can access the cart.
// `children: ReactNode` means "anything React can render" — components, text, etc.
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        if (items.length > 0) {
          dispatch({ type: "HYDRATE", payload: items });
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist cart items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignore storage errors
    }
  }, [state.items]);

  // Derived values — computed from state, not stored separately
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.special_price * i.quantity,
    0
  );

  // Action helpers — components call these instead of dispatch directly
  const addItem = (product: Product) =>
    dispatch({ type: "ADD_ITEM", payload: product });

  const removeItem = (sku: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { sku } });

  const updateQuantity = (sku: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { sku, quantity } });

  const openDrawer = () => dispatch({ type: "OPEN_DRAWER" });
  const closeDrawer = () => dispatch({ type: "CLOSE_DRAWER" });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        openDrawer,
        closeDrawer,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
// TypeScript lesson: This hook ensures you ALWAYS use CartContext inside a
// CartProvider. If you forget, you get a clear error message instead of a
// confusing "undefined" crash.
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }
  return context;
}
