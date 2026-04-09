import Link from "next/link";

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#1B4D3E]" style={{ height: 90, paddingBottom: 15 }}>
        <div className="content-container flex items-center justify-center h-full">
          <Link href="/">
            <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="bg-[#1B1B1B] text-white">
        <div className="content-container py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Left — Brand & Info */}
            <div>
              <img src="/checkveda-logo-footer.png" alt="CheckVeda" className="h-12 w-auto mb-3" />
              <p className="text-sm text-white/70 font-inter mb-2">
                India&apos;s Verified Ayurveda &amp; Organic Marketplace
              </p>
              <p className="text-sm text-white/60 font-inter mb-5">
                Every product is AYUSH-licensed and lab-tested for purity.
              </p>
              <div className="flex flex-col gap-1.5 mb-5">
                <p className="text-sm text-white/70 font-inter">
                  <span className="text-white/50">Email:</span>{" "}
                  <a href="mailto:vendors@checkveda.com" className="hover:text-white transition-colors">vendors@checkveda.com</a>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-white/10 rounded-full text-[11px] font-inter text-white/60 border border-white/10">FSSAI Verified</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-full text-[11px] font-inter text-white/60 border border-white/10">AYUSH Compliant</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-full text-[11px] font-inter text-white/60 border border-white/10">GMP Certified</span>
              </div>
            </div>

            {/* Right — Links */}
            <div className="sm:text-right">
              <p className="font-outfit text-base font-semibold text-white mb-4">Quick Links</p>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link href="/vendor-onboarding" className="text-sm font-inter text-white/70 hover:text-white transition-colors">
                    Vendor Onboarding
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms" className="text-sm font-inter text-white/70 hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/policies/commission" className="text-sm font-inter text-white/70 hover:text-white transition-colors">
                    Marketplace Commission Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/returns" className="text-sm font-inter text-white/70 hover:text-white transition-colors">
                    Return &amp; Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/privacy" className="text-sm font-inter text-white/70 hover:text-white transition-colors">
                    Privacy Notice (DPDP Act 2023)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row gap-2 justify-between items-center">
            <p className="text-sm text-white/40 font-inter">
              &copy; {new Date().getFullYear()} CheckVeda. All rights reserved.
            </p>
            <p className="text-sm text-white/40 font-inter">
              Made with care in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
