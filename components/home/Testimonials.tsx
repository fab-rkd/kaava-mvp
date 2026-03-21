"use client";

import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSlider } from "@/hooks/useSlider";

const REVIEWS = [
  {
    text: "Finally a platform where I can trust the Ayurvedic products are genuine. The AYUSH verification gives me confidence. Very good service.",
    stars: 5, name: "Priya Sharma", location: "Mumbai", avatar: "PS",
  },
  {
    text: "I was buying Shilajit from random sellers before. Kaava lab-tested badge made me switch. The quality difference is real and noticeable.",
    stars: 5, name: "Rajesh Patel", location: "Delhi", avatar: "RP",
  },
  {
    text: "Great selection of brands and fast delivery. The concern-based search made it so easy to find exactly what I needed for my family.",
    stars: 4, name: "Anita Roy", location: "Pune", avatar: "AR",
  },
  {
    text: "Ordered Chyawanprash and Triphala — both arrived well-packed with all FSSAI labels intact. Will definitely order again from Kaava.",
    stars: 5, name: "Vikram Mehta", location: "Bangalore", avatar: "VM",
  },
  {
    text: "As a yoga instructor, I recommend only verified products. Kaava makes it easy to trust what you are buying. Highly recommended!",
    stars: 5, name: "Sneha Iyer", location: "Chennai", avatar: "SI",
  },
  {
    text: "My grandmother always preferred Baidyanath. Finding their full range here with proper certification info was wonderful.",
    stars: 5, name: "Arjun Kapoor", location: "Jaipur", avatar: "AK",
  },
  {
    text: "The concern-based browsing is genius. I searched for joint health and found exactly what my father needed. Fast shipping too!",
    stars: 4, name: "Meera Desai", location: "Ahmedabad", avatar: "MD",
  },
  {
    text: "Been using Dabur products for years but always worried about fakes online. Kaava solved that problem completely.",
    stars: 5, name: "Rohit Singh", location: "Lucknow", avatar: "RS",
  },
  {
    text: "Love the transparency — every product shows its AYUSH licence number and lab reports. This is how online Ayurveda should work.",
    stars: 5, name: "Kavita Nair", location: "Kochi", avatar: "KN",
  },
];

export default function Testimonials() {
  const { scrollRef, prev, next, checkScroll } = useSlider(3);

  return (
    <section className="w-full bg-white">
      <div className="content-container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="flex flex-col items-center" style={{ gap: 40 }}>

          {/* Top Area */}
          <div className="flex flex-col items-center" style={{ gap: 16 }}>
            <h2
              className="font-outfit text-section-title lg:text-display text-dark text-center"
              style={{ fontWeight: 900, letterSpacing: -1 }}
            >
              Read reviews, buy with confidence.
            </h2>
            <div className="flex items-center flex-wrap justify-center" style={{ gap: 12 }}>
              <span className="font-inter font-medium text-text-secondary" style={{ fontSize: 16 }}>4.7/5</span>
              <span className="text-forest" style={{ fontSize: 20 }}>★</span>
              <span className="font-outfit font-bold text-dark" style={{ fontSize: 16 }}>Google Reviews</span>
              <span className="font-inter text-muted" style={{ fontSize: 14 }}>Based on 2,400 reviews</span>
            </div>
          </div>

          {/* Bottom Area */}
          <div className="flex w-full" style={{ gap: 32 }}>

            {/* Left Side — desktop only */}
            <div className="hidden lg:flex flex-col shrink-0" style={{ width: 280, gap: 20 }}>
              <span className="font-outfit text-[#DDDDDD]" style={{ fontSize: 64, fontWeight: 900, lineHeight: 0.6 }}>
                &ldquo;&rdquo;
              </span>
              <h3 className="font-outfit text-dark" style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>
                What our customers are saying
              </h3>
              <div className="flex items-center" style={{ gap: 12 }}>
                <button onClick={prev} aria-label="Previous reviews" className="transition-colors hover:text-dark">
                  <ArrowLeft size={20} className="text-muted" />
                </button>
                <div className="bg-dark rounded-sm" style={{ width: 60, height: 3 }} />
                <button onClick={next} aria-label="Next reviews" className="transition-colors hover:text-forest">
                  <ArrowRight size={20} className="text-dark" />
                </button>
              </div>
            </div>

            {/* Review Cards — scrollable */}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex flex-1 overflow-x-auto scroll-smooth scrollbar-hide"
              style={{ gap: 16 }}
            >
              {REVIEWS.map(({ text, stars, name, location, avatar }) => (
                <div
                  key={name}
                  className="slider-testimonial-item flex flex-col justify-between"
                  style={{
                    height: 280,
                    padding: 24,
                    gap: 16,
                    borderRadius: 16,
                    background: "var(--color-surface-2)",
                  }}
                >
                  <p className="font-inter text-text-label" style={{ fontSize: 14, lineHeight: 1.6 }}>
                    &lsquo;{text}&rsquo;
                  </p>
                  <span className="text-forest" style={{ fontSize: 16 }}>
                    {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                  </span>
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <div
                      className="flex items-center justify-center rounded-full bg-forest font-inter font-bold text-white"
                      style={{ width: 32, height: 32, fontSize: 11 }}
                    >
                      {avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-inter font-medium text-dark" style={{ fontSize: 13 }}>{name}</span>
                      <span className="font-inter text-muted" style={{ fontSize: 11 }}>{location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation — arrows below cards on mobile/tablet */}
          <div className="flex lg:hidden items-center justify-center" style={{ gap: 16 }}>
            <button
              onClick={prev}
              aria-label="Previous reviews"
              className="flex items-center justify-center rounded-full border border-border-light bg-surface-3 text-dark transition-colors hover:bg-border-light"
              style={{ width: 38, height: 38 }}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-inter text-muted" style={{ fontSize: 13 }}>Swipe or tap to see more</span>
            <button
              onClick={next}
              aria-label="Next reviews"
              className="flex items-center justify-center rounded-full border border-border-light bg-surface-3 text-dark transition-colors hover:bg-border-light"
              style={{ width: 38, height: 38 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
