// ─── lib/blog.ts ──────────────────────────────────────────────────────────────
//
// All blog data access lives here. Pages import these functions instead of
// importing blog-posts.json directly — keeps pages clean and logic centralised.
// ─────────────────────────────────────────────────────────────────────────────

import blogData from "@/data/blog-posts.json";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
};

const allPosts: BlogPost[] = blogData.posts as BlogPost[];

// Get all posts sorted by date (most recent first)
export function getAllPosts(): BlogPost[] {
  return [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Get a single post by its slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

// Get the featured post (most recent)
export function getFeaturedPost(): BlogPost {
  return getAllPosts()[0];
}

// Get all posts matching a category
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

// Get all unique slugs (for generateStaticParams)
export function getAllPostSlugs(): string[] {
  return allPosts.map((p) => p.slug);
}

// Get all unique categories
export function getAllCategories(): string[] {
  const cats = new Set(allPosts.map((p) => p.category));
  return Array.from(cats);
}
