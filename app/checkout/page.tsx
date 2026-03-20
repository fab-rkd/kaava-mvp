// ─── app/checkout/page.tsx ────────────────────────────────────────────────────
//
// Checkout page shell (/checkout).
// Renders InnerHeader + placeholder content.
// Deliberately omits Footer — simplified layout per LAY-05.
// ─────────────────────────────────────────────────────────────────────────────

import InnerHeader from "@/components/layout/InnerHeader";

export default function CheckoutPage() {
  return (
    <>
      <InnerHeader />
      <main className="min-h-screen bg-kaava-surface1">
        <div className="max-w-content mx-auto px-4 py-8">
          <h1 className="text-2xl font-outfit font-bold text-kaava-dark">
            Checkout
          </h1>
          <p className="mt-4 text-kaava-secondary font-inter">
            Checkout form coming in Phase 6
          </p>
        </div>
      </main>
    </>
  );
}
