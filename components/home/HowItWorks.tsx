import { Search, ShieldCheck, CreditCard, PackageCheck } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    num: "01",
    numColor: "#2D6A4F",
    iconColor: "#2D6A4F",
    circleBg: "#EBF5EE",
    title: "Search or Browse",
    desc: "Find products by name, brand, or health concern",
  },
  {
    icon: ShieldCheck,
    num: "02",
    numColor: "#E85D04",
    iconColor: "#E85D04",
    circleBg: "#FFF5ED",
    title: "Check Credentials",
    desc: "See AYUSH licence, lab reports, and brand verification",
  },
  {
    icon: CreditCard,
    num: "03",
    numColor: "#C4960A",
    iconColor: "#C4960A",
    circleBg: "#FFF9E6",
    title: "Order Securely",
    desc: "Pay via UPI, COD, or cards. Every transaction is protected.",
  },
  {
    icon: PackageCheck,
    num: "04",
    numColor: "#2D6A4F",
    iconColor: "#2D6A4F",
    circleBg: "#EBF5EE",
    title: "Receive Genuine",
    desc: "Products sourced directly from verified manufacturers to your doorstep",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col items-center" style={{ gap: 40 }}>

          {/* Header — Pencil: 0XfgP */}
          <div className="flex flex-col items-center" style={{ gap: 8 }}>
            <span
              className="inline-block font-outfit font-bold text-forest rounded-[20px]"
              style={{
                fontSize: 11,
                letterSpacing: 2,
                padding: "6px 14px",
                border: "1px solid rgb(45 106 79 / 0.2)",
              }}
            >
              HOW IT WORKS
            </span>
            <h2
              className="font-outfit text-section-title lg:text-display text-dark text-center"
              style={{ fontWeight: 900, letterSpacing: -1 }}
            >
              From Search to Doorstep
            </h2>
            <p className="font-inter text-body-lg text-muted text-center">
              Verified at every step
            </p>
          </div>

          {/* Steps — Pencil: WMrpI — 4 steps with connecting arcs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 items-start justify-center w-full" style={{ maxWidth: 1200, gap: 40 }}>
            {STEPS.map(({ icon: Icon, num, numColor, iconColor, circleBg, title, desc }, i) => (
              <div key={num} className="flex flex-col items-center" style={{ gap: 12 }}>
                {/* Icon circle — 90×90, with connecting line to next */}
                <div className="relative">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 45,
                      background: circleBg,
                      border: "3px solid #FFFFFF",
                      boxShadow: "0 0 0 1px #F0F0F0",
                    }}
                  >
                    <Icon size={36} style={{ color: iconColor }} />
                  </div>
                  {/* Connecting dashed line (not on last step) */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 hidden lg:block"
                      style={{
                        left: "100%",
                        width: "calc(100% + 40px)",
                        borderTop: "2px dashed rgb(45 106 79 / 0.13)",
                        marginLeft: 8,
                      }}
                    />
                  )}
                </div>

                {/* Step number */}
                <span className="font-outfit font-bold" style={{ fontSize: 13, color: numColor }}>
                  {num}
                </span>

                {/* Title */}
                <span className="font-outfit font-bold text-dark text-center" style={{ fontSize: 17 }}>
                  {title}
                </span>

                {/* Description */}
                <span
                  className="font-inter text-muted text-center"
                  style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 200 }}
                >
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
