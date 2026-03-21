"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SectionHeadingProps = {
  title: string;
  tag?: string;
  subtitle?: string;
  viewAllLink?: string;
  showArrows?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  align?: "left" | "center";
  variant?: "section" | "display";
};

export default function SectionHeading({
  title,
  tag,
  subtitle,
  viewAllLink,
  showArrows = false,
  onPrev,
  onNext,
  align = "left",
  variant = "section",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDisplay = variant === "display";

  return (
    <div
      className={`flex w-full items-start gap-4 ${
        isCenter ? "flex-col items-center text-center" : "items-center justify-between"
      }`}
    >
      {/* Left side: tag + title + subtitle */}
      <div className={isCenter ? "flex flex-col items-center" : ""}>
        {tag && (
          <span className="mb-2 inline-block rounded-full border border-forest/20 px-3 py-1 font-outfit text-[11px] font-bold uppercase tracking-[2px] text-forest">
            {tag}
          </span>
        )}

        <h2
          className={`font-outfit text-dark ${
            isDisplay
              ? "text-display font-black leading-[1.15] tracking-[-1px]"
              : "text-section-title font-extrabold"
          }`}
        >
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1.5 max-w-lg text-sm text-muted">{subtitle}</p>
        )}
      </div>

      {/* Right side: View All link and/or arrows */}
      {(viewAllLink || showArrows) && (
        <div className="flex shrink-0 items-center gap-3">
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="font-inter text-sm font-semibold text-forest transition-opacity hover:opacity-80"
            >
              View All &rarr;
            </Link>
          )}

          {showArrows && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous"
                className="slider-arrow flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#EEEEEE] bg-surface-3 text-dark"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next"
                className="slider-arrow flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#EEEEEE] bg-surface-3 text-dark"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
