// ─── components/ui/Breadcrumb.tsx ─────────────────────────────────────────────
//
// Breadcrumb navigation for inner pages.
// Matches Pencil design: bg white, height 40px, bottom border #F0F0F0.
//
// Server Component — no client interactivity needed.
//
// Usage:
//   <Breadcrumb items={[
//     { label: "Home", href: "/" },
//     { label: "Hair Care", href: "/category/hair" },
//     { label: "Herbal Hair Oil" },          // last item = current page (no link)
//   ]} />
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div
      className="w-full bg-white"
      style={{ height: 40, borderBottom: "1px solid #F0F0F0" }}
    >
      <nav
        aria-label="Breadcrumb"
        className="content-container flex items-center h-full"
      >
        <ol className="flex items-center" style={{ gap: 0 }}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.label} className="flex items-center">
                {/* Separator */}
                {index > 0 && (
                  <span
                    className="font-inter text-text-secondary mx-2 select-none"
                    style={{ fontSize: 13 }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}

                {/* Link or plain text for current page */}
                {!isLast && item.href ? (
                  <Link
                    href={item.href}
                    className="font-inter text-text-secondary transition-colors hover:text-dark"
                    style={{ fontSize: 13 }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-inter text-text-secondary"
                    style={{ fontSize: 13 }}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
