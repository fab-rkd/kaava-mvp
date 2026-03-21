import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

const TAG_COLORS: Record<string, string> = {
  "Ingredient Guide": "#2D6A4F",
  "How To": "#E85D04",
  "Wellness": "#2D6A4F",
  "Nutrition": "#E85D04",
  "Ayurveda 101": "#1B4D3E",
};

export default function KnowYourAyurveda() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <section id="know-your-ayurveda" className="w-full bg-white" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col" style={{ gap: 32 }}>

          <div className="flex items-center justify-between">
            <h2 className="font-outfit text-section-title text-dark" style={{ fontWeight: 800 }}>
              Know Your Ayurveda
            </h2>
            <Link
              href="/blog"
              className="font-inter font-semibold text-forest transition-colors hover:text-forest-light"
              style={{ fontSize: 14 }}
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 20 }}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col bg-white overflow-hidden hover-lift"
                style={{
                  minHeight: 340,
                  borderRadius: 20,
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card-sm)",
                }}
              >
                <div className="relative w-full overflow-hidden" style={{ height: 220, borderRadius: "20px 20px 0 0" }}>
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
                      background: TAG_COLORS[post.category] || "#2D6A4F",
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-col flex-1" style={{ padding: "16px 16px 18px 16px", gap: 6 }}>
                  <h3 className="font-outfit font-bold text-dark" style={{ fontSize: 15, lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                  <p className="font-inter text-muted" style={{ fontSize: 12, lineHeight: 1.4 }}>
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
