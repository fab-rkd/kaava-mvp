// Shared product image helper — used by ProductCard, CartDrawer, Checkout, etc.
// Returns a category-appropriate Unsplash image when local product images aren't available.

const CATEGORY_IMAGES: Record<string, string> = {
  "Hair Care":         "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
  "Skin Care":         "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
  "Digestive Health":  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop",
  "Immunity":          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
  "Eye Care":          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
  "Wellness":          "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
  "Liver Care":        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
  "Joint Health":      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
  "Sleep Wellness":    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
  "Women's Health":    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
  "Mental Wellness":   "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
  "General Wellness":  "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop";

export function getProductImage(category: string, imageUrl?: string): string {
  // If the image URL is an absolute URL (http), use it directly
  if (imageUrl && imageUrl.startsWith("http")) return imageUrl;
  // Otherwise use category-based Unsplash placeholder
  return CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
}
