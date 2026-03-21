import type { Metadata } from "next";
import { Outfit, Inter, Noto_Serif_Devanagari } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import CartDrawer from "@/components/cart/CartDrawer";
import AccountModal from "@/components/auth/AccountModal";
import "./globals.css";

// ── Font Setup (Next.js 16 self-hosted via next/font) ──────────────────
// These are loaded at build time and served from the same domain.
// No external requests to Google Fonts at runtime.

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const devanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kaava — Verified Ayurveda Marketplace",
    template: "%s | Kaava",
  },
  description:
    "Discover 100% verified Ayurvedic products from India's top brands. Every product AYUSH-licensed, lab-tested, and sourced from certified manufacturers.",
  keywords: ["Ayurveda", "herbal", "AYUSH", "Himalaya", "Dabur", "Patanjali"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${devanagari.variable}`}
    >
      <body>
        <CartProvider>
          <WishlistProvider>
            <AuthModalProvider>
              {children}
              <CartDrawer />
              <AccountModal />
            </AuthModalProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
