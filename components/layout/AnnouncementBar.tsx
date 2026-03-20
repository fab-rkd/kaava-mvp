"use client";
// ─── components/layout/AnnouncementBar.tsx ────────────────────────────────────
//
// Full-width promo bar that rotates through 3 messages every 4 seconds.
// Rendered at the top of every page via the root layout.
//
// Accessibility: respects prefers-reduced-motion — when the user has requested
// reduced motion the bar simply shows the first message with no animation.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

const MESSAGES = [
  "Free shipping on orders above Rs.499",
  "100% AYUSH Verified Products",
  "Use code KAAVA10 for 10% off your first order",
] as const;

const ROTATION_INTERVAL_MS = 4000;

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track visibility for the opacity fade transition
  const [visible, setVisible] = useState(true);
  // Detect reduced-motion preference on mount
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    // Skip rotation when user prefers reduced motion
    if (reducedMotion) return;

    const interval = setInterval(() => {
      // Fade out
      setVisible(false);

      // After fade-out completes (500 ms), advance the index and fade back in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
        setVisible(true);
      }, 500);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="w-full bg-forest py-2 px-4">
      <p
        className={[
          "text-white text-sm font-inter text-center",
          "transition-opacity duration-500",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {MESSAGES[currentIndex]}
      </p>
    </div>
  );
}
