// ─── app/blog/[slug]/page.tsx ─────────────────────────────────────────────────
//
// Individual blog post page (/blog/[slug]).
// Server component that renders article content at build time.
//
// Sections: InnerHeader > Breadcrumb > Article > Related Posts > Footer
//
// Next.js 16: params is a Promise — must await it.
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import Link from "next/link";
import InnerHeader from "@/components/layout/InnerHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  getPostBySlug,
  getAllPostSlugs,
  getPostsByCategory,
} from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

// ─── Static Params ──────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — Kaava Blog`,
    description: post.excerpt,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

// ─── Related Post Card ──────────────────────────────────────────────────────
function RelatedPostCard({ post }: { post: BlogPost }) {
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
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 220, borderRadius: "20px 20px 0 0" }}
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
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

// ─── Page Component ─────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  // Split content into paragraphs
  const paragraphs = post.content
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  // Get related posts from same category (excluding current post)
  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <InnerHeader />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        {/* ── Article ────────────────────────────────────────────────── */}
        <article
          className="w-full bg-white"
          style={{ paddingTop: 48, paddingBottom: 64 }}
        >
          <div
            className="content-container"
            style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}
          >
            {/* Category tag */}
            <span
              className="inline-block font-inter font-bold text-white"
              style={{
                fontSize: 11,
                padding: "5px 14px",
                borderRadius: 12,
                background: getCategoryColor(post.category),
                marginBottom: 16,
              }}
            >
              {post.category}
            </span>

            {/* Title */}
            <h1
              className="font-outfit font-bold text-dark"
              style={{ fontSize: 36, lineHeight: 1.2, marginBottom: 16 }}
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div
              className="flex flex-wrap items-center"
              style={{ gap: 16, marginBottom: 32 }}
            >
              <span
                className="font-inter text-muted"
                style={{ fontSize: 13 }}
              >
                {formatDate(post.date)}
              </span>
              <span className="font-inter text-muted" style={{ fontSize: 13 }}>
                &middot;
              </span>
              <span
                className="font-inter text-muted"
                style={{ fontSize: 13 }}
              >
                {post.author}
              </span>
              <span className="font-inter text-muted" style={{ fontSize: 13 }}>
                &middot;
              </span>
              <span
                className="font-inter text-muted"
                style={{ fontSize: 13 }}
              >
                {post.readTime}
              </span>
            </div>

            {/* Featured image */}
            <div
              className="w-full overflow-hidden"
              style={{
                borderRadius: 16,
                height: 400,
                marginBottom: 40,
              }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article body */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-inter"
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "#444444",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* ── Related Posts ───────────────────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <section
            className="w-full bg-white"
            style={{
              paddingTop: 48,
              paddingBottom: 72,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <div className="content-container">
              <h2
                className="font-outfit font-bold text-dark"
                style={{ fontSize: 22, marginBottom: 32 }}
              >
                You Might Also Like
              </h2>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                style={{ gap: 20 }}
              >
                {relatedPosts.map((relPost) => (
                  <RelatedPostCard key={relPost.slug} post={relPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
