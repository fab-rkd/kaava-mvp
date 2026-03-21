import Link from "next/link";

const EDU_CARDS = [
  {
    image: "https://images.unsplash.com/photo-1701418527182-f2a181574cb5?w=600&h=440&fit=crop",
    tag: "Ingredient Guide",
    tagBg: "#2D6A4F",
    title: "Ashwagandha: The Complete Guide",
    desc: "Benefits, dosage, and what to look for in a genuine product",
  },
  {
    image: "https://images.unsplash.com/photo-1631980839248-1a84a60c66ac?w=600&h=440&fit=crop",
    tag: "How To",
    tagBg: "#E85D04",
    title: "How to Read Ayurvedic Product Labels",
    desc: "Understanding AYUSH numbers, batch codes, and expiry formats",
  },
  {
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=440&fit=crop",
    tag: "Wellness",
    tagBg: "#2D6A4F",
    title: "Building a Daily Ayurvedic Routine",
    desc: "Morning rituals, herbal teas, and simple practices for better health",
  },
  {
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=440&fit=crop",
    tag: "Nutrition",
    tagBg: "#E85D04",
    title: "Triphala vs Chyawanprash: Which One?",
    desc: "Comparing two iconic Ayurvedic formulations for modern wellness",
  },
];

export default function KnowYourAyurveda() {
  return (
    <section id="know-your-ayurveda" className="w-full bg-white" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col" style={{ gap: 32 }}>

          {/* Header — Pencil: eEsoE — justify space-between */}
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

          {/* Edu Grid — Pencil: wGZL4 — gap 20, 4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 20 }}>
            {EDU_CARDS.map(({ image, tag, tagBg, title, desc }) => (
              <article
                key={title}
                className="flex flex-col bg-white overflow-hidden hover-lift"
                style={{
                  minHeight: 340,
                  borderRadius: 20,
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card-sm)",
                }}
              >
                {/* Image — Pencil: 220px height */}
                <div className="relative w-full overflow-hidden" style={{ height: 220, borderRadius: "20px 20px 0 0" }}>
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  {/* Tag badge */}
                  <span
                    className="absolute font-inter font-bold text-white"
                    style={{
                      top: 14,
                      left: 14,
                      fontSize: 10,
                      padding: "5px 12px",
                      borderRadius: 12,
                      background: tagBg,
                    }}
                  >
                    {tag}
                  </span>
                </div>

                {/* Body — Pencil: padding [16, 16, 18, 16], gap 6 */}
                <div className="flex flex-col flex-1" style={{ padding: "16px 16px 18px 16px", gap: 6 }}>
                  <h3 className="font-outfit font-bold text-dark" style={{ fontSize: 15, lineHeight: 1.3 }}>
                    {title}
                  </h3>
                  <p className="font-inter text-muted" style={{ fontSize: 12, lineHeight: 1.4 }}>
                    {desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
