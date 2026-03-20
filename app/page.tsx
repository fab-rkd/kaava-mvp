// ─── app/page.tsx ─────────────────────────────────────────────────────────────
//
// Homepage shell (/).
// Server component — HomepageHeader and Footer handle their own client/server
// boundaries. No "use client" needed at the page level.
// ─────────────────────────────────────────────────────────────────────────────

import HomepageHeader from "@/components/layout/HomepageHeader";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <HomepageHeader />
      <main className="min-h-screen">
        <div className="max-w-content mx-auto px-4 py-12">
          <h1 className="text-3xl font-outfit font-bold text-kaava-dark">
            Welcome to Kaava
          </h1>
          <p className="mt-4 text-kaava-secondary font-inter">
            Homepage content coming in Phase 2
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
