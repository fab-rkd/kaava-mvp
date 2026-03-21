import { ShieldCheck, FileText, Shield, ShieldAlert, ArrowRight } from "lucide-react";

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: "Vendor Verification",
    desc: "Every seller submits AYUSH licence, FSSAI certification, GMP proof before listing any product.",
  },
  {
    icon: FileText,
    title: "Product Screening",
    desc: "Lab test reports reviewed. Claims checked against FSSAI guidelines. Only compliant products go live.",
  },
];

export default function WhyTrustKaava() {
  return (
    <section
      className="w-full bg-surface-green"
      style={{ borderBottom: "1px solid var(--color-border-green-section)" }}
    >
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col" style={{ gap: 40 }}>

          {/* Tag — Pencil: tQFkw */}
          <div>
            <span
              className="inline-block font-outfit font-bold text-forest rounded-[20px]"
              style={{
                fontSize: 11,
                letterSpacing: 2,
                padding: "6px 14px",
                border: "1px solid rgb(45 106 79 / 0.2)",
              }}
            >
              WHY TRUST US
            </span>
          </div>

          {/* Headline — Pencil: eU1EG — Outfit 36px/1.15, 900 */}
          <h2
            className="font-outfit text-section-title lg:text-display text-dark"
            style={{ fontWeight: 900, letterSpacing: -1, maxWidth: 600 }}
          >
            Why Kaava is The Right Choice for Your Wellness
          </h2>

          {/* Bento Grid — Pencil: 43gG3 — gap 16, height 520 on desktop */}
          <div className="flex flex-col lg:flex-row lg:h-[520px]" style={{ gap: 16 }}>

            {/* Left Column — Pencil: G8QFi */}
            <div className="flex flex-col flex-1" style={{ gap: 16 }}>

              {/* Top Row — two small cards */}
              <div className="flex flex-col sm:flex-row" style={{ gap: 16, flex: 1 }}>
                {TRUST_CARDS.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex flex-col justify-between flex-1 bg-white hover-lift"
                    style={{
                      padding: "28px 24px",
                      gap: 16,
                      borderRadius: 20,
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 4px 20px #00000010",
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        background: "rgb(45 106 79 / 0.13)",
                      }}
                    >
                      <Icon size={22} className="text-forest" />
                    </div>
                    {/* Text */}
                    <div className="flex flex-col" style={{ gap: 6 }}>
                      <span className="font-outfit font-bold text-dark" style={{ fontSize: 17 }}>
                        {title}
                      </span>
                      <span
                        className="font-inter font-normal text-muted"
                        style={{ fontSize: 13, lineHeight: 1.5 }}
                      >
                        {desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Card — Pencil: hNOrc — ongoing quality audits */}
              <div
                className="relative flex-1 overflow-hidden hover-lift"
                style={{ borderRadius: 20, background: "#E8F0E4", minHeight: 200 }}
              >
                {/* Background image */}
                <img
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&h=280&fit=crop"
                  alt="Ayurvedic ingredients"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, #1B1B1BE0 0%, #1B1B1B88 40%, #1B1B1B00 70%)",
                  }}
                />
                {/* Text content */}
                <div className="absolute bottom-7 left-7 flex flex-col" style={{ gap: 8, maxWidth: 400 }}>
                  <span className="font-outfit font-bold text-white" style={{ fontSize: 20 }}>
                    Ongoing Quality Audits
                  </span>
                  <span
                    className="font-inter text-white/73"
                    style={{ fontSize: 13, lineHeight: 1.4 }}
                  >
                    Random product sampling, independent lab testing, and instant delisting for violations.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column — Dark Accent Card — Pencil: WpWDb, width 420 on desktop */}
            <div
              className="flex flex-col justify-between w-full lg:w-[420px] lg:shrink-0 hover-lift"
              style={{
                padding: "36px 32px",
                gap: 24,
                borderRadius: 20,
                background: "linear-gradient(180deg, #1B4D3E 0%, #2D6A4F 100%)",
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  background: "rgb(255 255 255 / 0.13)",
                }}
              >
                <Shield size={24} className="text-white" />
              </div>

              {/* Content */}
              <div className="flex flex-col" style={{ gap: 12 }}>
                <h3
                  className="font-outfit text-white"
                  style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}
                >
                  Your Safety is Non-Negotiable
                </h3>
                <p
                  className="font-inter text-white/67"
                  style={{ fontSize: 14, lineHeight: 1.6 }}
                >
                  We built Kaava on one principle: every product you buy must be genuine, safe, and
                  traceable. From vendor onboarding to your doorstep — trust is verified at every step.
                </p>
              </div>

              {/* CTA Button — Pencil: ifP3E */}
              <button
                className="flex items-center self-start bg-saffron rounded-full font-outfit font-bold text-white transition-colors hover:bg-saffron-light"
                style={{ padding: "14px 28px", gap: 8, fontSize: 14 }}
              >
                Learn More <ArrowRight size={16} />
              </button>

              {/* Report row — Pencil: EnRpa */}
              <div className="flex items-center" style={{ gap: 12 }}>
                <ShieldAlert size={16} className="text-white/67" />
                <span className="font-inter font-medium text-white/67" style={{ fontSize: 13 }}>
                  Spot something suspicious?
                </span>
                <span className="font-inter font-bold text-saffron" style={{ fontSize: 13 }}>
                  Report a Product →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
