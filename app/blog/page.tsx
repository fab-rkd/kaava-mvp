// ─── app/blog/page.tsx ────────────────────────────────────────────────────────
//
// Blog listing page (/blog).
// Server component — no client interactivity needed.
//
// Sections: InnerHeader > Breadcrumb > Featured Post > Blog Grid > Footer
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import InnerHeader from "@/components/layout/InnerHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getAllPosts, getFeaturedPost } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Kaava Ayurveda",
  description:
    "Explore Ayurvedic knowledge: ingredient guides, wellness routines, dosha insights, and practical tips for a healthier life.",
};

// ─── Category tag color mapping ──────────────────────────────────────────────
function getCategoryColor(category: string): string {
  switch (category) {
    case "Ingredient Guide":
      return "#2D6A4F";
    case "How To":
      return "#E85D04";
    case "Wellness":
      return "#2D6A4F";
    case "Nutrition":
      return "#E85D04";
    case "Ayurveda 101":
      return "#1B4D3E";
    default:
      return "#2D6A4F";
  }
}

// ─── Format date ─────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Blog Card Component ─────────────────────────────────────────────────────
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article
        className="flex flex-col bg-white overflow-hidden hover-lift"
        style={{
          borderRadius: 20,
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card-sm)",
        }}
      >
        {/* Image */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 220, borderRadius: "20px 20px 0 0" }}
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Category tag */}
          <span
            className="absolute font-inter font-bold text-white"
            style={{
              top: 14,
              left: 14,
              fontSize: 10,
              padding: "5px 12px",
              borderRadius: 12,
              background: getCategoryColor(post.category),
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Body */}
        <div
          className="flex flex-col flex-1"
          style={{ padding: "16px 16px 18px 16px", gap: 8 }}
        >
          <h3
            className="font-outfit font-bold text-dark"
            style={{ fontSize: 15, lineHeight: 1.3 }}
          >
            {post.title}
          </h3>
          <p
            className="font-inter text-muted"
            style={{ fontSize: 12, lineHeight: 1.5 }}
          >
            {post.excerpt.length > 120
              ? post.excerpt.slice(0, 120) + "..."
              : post.excerpt}
          </p>
          <div
            className="flex items-center justify-between"
            style={{ marginTop: "auto", paddingTop: 8 }}
          >
            <span
              className="font-inter text-text-secondary"
              style={{ fontSize: 11 }}
            >
              {formatDate(post.date)}
            </span>
            <span
              className="font-inter text-text-secondary"
              style={{ fontSize: 11 }}
            >
              {post.author}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default function BlogPage() {
  const allPosts = getAllPosts();
  const featured = getFeaturedPost();
  const restPosts = allPosts.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <InnerHeader />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
        />

        {/* ── Featured Post ──────────────────────────────────────────── */}
        <section className="w-full bg-white" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div className="content-container">
            <Link href={`/blog/${featured.slug}`}>
              <article
                className="flex flex-col lg:flex-row bg-white overflow-hidden hover-lift"
                style={{
                  borderRadius: 20,
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                  minHeight: 400,
                }}
              >
                {/* Image — 60% width on desktop */}
                <div
                  className="relative w-full lg:w-[60%] overflow-hidden"
                  style={{
                    minHeight: 260,
                    borderRadius: "20px 20px 0 0",
                  }}
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                    style={{ minHeight: 400 }}
                  />
                </div>

                {/* Content — 40% width on desktop */}
                <div
                  className="flex flex-col justify-center w-full lg:w-[40%]"
                  style={{ padding: "32px 32px 36px 32px", gap: 16 }}
                >
                  <span
                    className="font-inter font-bold text-white self-start"
                    style={{
                      fontSize: 11,
                      padding: "5px 14px",
                      borderRadius: 12,
                      background: getCategoryColor(featured.category),
                    }}
                  >
                    {featured.category}
                  </span>
                  <h2
                    className="font-outfit font-bold text-dark"
                    style={{ fontSize: 28, lineHeight: 1.25 }}
                  >
                    {featured.title}
                  </h2>
                  <p
                    className="font-inter text-text-secondary"
                    style={{ fontSize: 14, lineHeight: 1.6 }}
                  >
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center" style={{ gap: 16 }}>
                    <span
                      className="font-inter font-semibold text-forest"
                      style={{ fontSize: 14 }}
                    >
                      Read More &rarr;
                    </span>
                  </div>
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <span
                      className="font-inter text-muted"
                      style={{ fontSize: 12 }}
                    >
                      {formatDate(featured.date)}
                    </span>
                    <span
                      className="font-inter text-muted"
                      style={{ fontSize: 12 }}
                    >
                      &middot;
                    </span>
                    <span
                      className="font-inter text-muted"
                      style={{ fontSize: 12 }}
                    >
                      {featured.author}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* ── Blog Grid ──────────────────────────────────────────────── */}
        <section
          className="w-full bg-white"
          style={{
            paddingBottom: 72,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div className="content-container" style={{ paddingTop: 48 }}>
            <h2
              className="font-outfit font-bold text-dark"
              style={{ fontSize: 22, marginBottom: 32 }}
            >
              Latest Articles
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: 20 }}
            >
              {restPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
