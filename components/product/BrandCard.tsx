import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

type BrandCardProps = {
  name: string;
  logoUrl?: string;
  productCount: number;
  slug: string;
};

export default function BrandCard({
  name,
  logoUrl,
  productCount,
  slug,
}: BrandCardProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="group flex flex-col rounded-[20px] border border-[#F0F0F0] bg-white shadow-[0_4px_16px_#00000008] overflow-hidden transition-shadow hover:shadow-[0_4px_24px_#00000012]"
    >
      {/* Brand Logo Area */}
      <div className="flex h-[120px] items-center justify-center bg-[#F8F8F8] rounded-t-[20px]">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="object-contain"
            style={{ width: 120, height: 60 }}
          />
        ) : (
          <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#EEEEEE]">
            <Building2 size={32} color="#CCCCCC" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Brand Info Area */}
      <div className="flex flex-col items-center gap-1 px-4 pb-4 pt-[14px]">
        <h3 className="font-outfit text-[15px] font-bold leading-tight text-[#1B1B1B] text-center">
          {name}
        </h3>
        <span className="font-inter text-[11px] font-medium text-[#999999] text-center">
          {productCount} {productCount === 1 ? "Product" : "Products"}
        </span>
        <span className="mt-1 inline-flex items-center gap-1 rounded-[20px] bg-[#F5F5F5] px-[14px] py-[6px] font-inter text-[11px] font-semibold text-[#2D6A4F]">
          Explore
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
