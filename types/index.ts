// ─── types/index.ts ───────────────────────────────────────────────────────────
//
// TypeScript lesson: This file defines the "shape" of your data.
// A `type` or `interface` tells TypeScript exactly what fields an object has
// and what type each field is (string, number, array, etc.).
// If you try to use a field that isn't here, TypeScript will warn you immediately.
// ─────────────────────────────────────────────────────────────────────────────

// ComplianceTag describes the small AYUSH/FSSAI badge on each product.
// The `type` field can ONLY be "Medicine" or "Food Supplement" — nothing else.
// This is a TypeScript "union type": string literals separated by |
export type ComplianceTag = {
  type: "Medicine" | "Food Supplement";
  label: "AYUSH" | "FSSAI";
};

// Product matches the exact shape of each object in products.json
export type Product = {
  sku: string;               // unique slug, e.g. "himalaya-ashwagandha"
  brand: string;             // e.g. "Himalaya"
  name: string;              // e.g. "Ashwagandha"
  category: string;          // e.g. "Wellness"
  concerns: string[];        // array of concern strings, e.g. ["Hair", "Overall Wellness"]
  price: number;             // MRP in INR
  special_price: number;     // discounted price in INR
  image_url: string;         // path like "/products/himalaya-ashwagandha.webp"
  short_desc: string;        // one sentence
  long_desc: string;         // 2–3 sentences
  key_benefits: string[];    // e.g. ["Reduces stress", "Improves sleep"]
  ingredients: string[];     // e.g. ["Ashwagandha Root Extract"]
  usage: string;             // how to use instructions
  compliance_tags: ComplianceTag;
  stock: "In Stock" | "Out of Stock";
};

// CartItem is a Product + how many the user has added
// The `extends` keyword means: "everything Product has, plus these extra fields"
export type CartItem = Product & {
  quantity: number;
};

// CartState holds the full cart data at any point in time
export type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
};

// CartAction describes every possible thing that can happen to the cart.
// TypeScript lesson: This is a "discriminated union" — each action has a unique
// `type` string so TypeScript knows exactly which fields are available for each.
export type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: { sku: string } }
  | { type: "UPDATE_QUANTITY"; payload: { sku: string; quantity: number } }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "CLEAR_CART" };
