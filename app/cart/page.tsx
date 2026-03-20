// ─── app/cart/page.tsx ────────────────────────────────────────────────────────
//
// Cart page shell (/cart).
// Renders InnerHeader + placeholder content.
// Deliberately omits Footer — simplified layout per LAY-05.
// ─────────────────────────────────────────────────────────────────────────────

import InnerHeader from "@/components/layout/InnerHeader";

export default function CartPage() {
  return (
    <>
      <InnerHeader />
      <main className="min-h-screen bg-kaava-surface1">
        <div className="max-w-content mx-auto px-4 py-8">
          <h1 className="text-2xl font-outfit font-bold text-kaava-dark">
            Your Cart
          </h1>
          <p className="mt-4 text-kaava-secondary font-inter">
            Cart functionality coming in Phase 5
          </p>
        </div>
      </main>
    </>
  );
}
