// ─── app/category/[concern]/page.tsx ─────────────────────────────────────────
//
// Category page shell (/category/[concern]).
// Renders InnerHeader + placeholder content + Footer.
//
// Next.js 16: params is a Promise — must use async function and await params.
// ─────────────────────────────────────────────────────────────────────────────

import InnerHeader from "@/components/layout/InnerHeader";
import Footer from "@/components/layout/Footer";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ concern: string }>;
}) {
  const { concern } = await params;

  return (
    <>
      <InnerHeader />
      <main className="min-h-screen">
        <div className="max-w-content mx-auto px-4 py-8">
          <h1 className="text-2xl font-outfit font-bold text-kaava-dark capitalize">
            {concern.replace(/-/g, " ")}
          </h1>
          <p className="mt-4 text-kaava-secondary font-inter">
            Category products coming in Phase 3
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
