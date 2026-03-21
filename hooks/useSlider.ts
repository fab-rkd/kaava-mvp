"use client";

import { useRef, useState, useCallback } from "react";

export function useSlider(itemsPerView: number = 4) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by roughly one "page" of visible items
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
    // Update state after animation
    setTimeout(checkScroll, 350);
  }, [checkScroll]);

  const prev = useCallback(() => scrollBy("left"), [scrollBy]);
  const next = useCallback(() => scrollBy("right"), [scrollBy]);

  return { scrollRef, prev, next, canScrollLeft, canScrollRight, checkScroll };
}
