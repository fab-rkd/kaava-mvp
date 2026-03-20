// ─── app/layout.tsx ───────────────────────────────────────────────────────────
//
// Root layout — wraps every page on the site.
// This is where we:
//   1. Set the HTML metadata (title, description)
//   2. Load fonts
//   3. Wrap everything in CartProvider so all pages can access the cart
//
// TypeScript lesson: `Metadata` is a Next.js type that ensures your metadata
// object has the right fields. If you add an unknown field, TypeScript warns you.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kaava — Verified Ayurveda Marketplace",
    template: "%s | Kaava",  // e.g. "Ashwagandha | Kaava" on product pages
  },
  description:
    "Discover 100% verified Ayurvedic products from India's top brands. Every product AYUSH-licensed, lab-tested, and sourced from certified manufacturers.",
  keywords: ["Ayurveda", "herbal", "AYUSH", "Himalaya", "Dabur", "Patanjali"],
};

// RootLayout receives `children` — this is the current page being rendered.
// ReactNode is a TypeScript type meaning "anything React can render".
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — loaded here instead of CSS to avoid PostCSS @import order issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;600;700&family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* AnnouncementBar appears on every page, outside CartProvider (no cart context needed) */}
        <AnnouncementBar />
        {/*
          CartProvider wraps everything so any component anywhere in the app
          can call useCart() to read or update the cart.
        */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
