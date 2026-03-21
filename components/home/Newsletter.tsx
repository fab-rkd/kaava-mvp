"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1B4D3E 0%, #2D6A4F 50%, #245c44 100%)" }}
    >
      {/* Subtle accent glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width: 500, height: 400, left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 0.15, background: "radial-gradient(circle, rgb(255 186 8 / 0.3) 0%, transparent 70%)" }} />
      </div>

      <div className="content-container relative" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="flex flex-col items-center" style={{ gap: 24 }}>
          {/* Title — Pencil: IpuU5 */}
          <h2 className="font-outfit text-section-title text-white text-center" style={{ fontWeight: 800 }}>
            Get Ayurveda Tips &amp; Exclusive Deals
          </h2>

          {/* Subtitle — Pencil: idazo */}
          <p
            className="font-inter text-white/70 text-center"
            style={{ fontSize: 14, maxWidth: 500 }}
          >
            Join 15,000+ subscribers. Weekly Ayurveda insights, new product drops, and member-only discounts.
          </p>

          {/* Form — Pencil: l6eFJ — gap 8, width 460 */}
          <div className="flex flex-col sm:flex-row w-full" style={{ maxWidth: 460, gap: 8 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 font-inter text-white outline-none"
              style={{
                fontSize: 14,
                padding: "14px 20px",
                borderRadius: 12,
                background: "rgb(255 255 255 / 0.15)",
                border: "none",
              }}
            />
            <button
              className="font-outfit font-bold text-dark bg-gold rounded-xl transition-colors hover:bg-gold/90 shrink-0"
              style={{ padding: "14px 28px", fontSize: 14 }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
