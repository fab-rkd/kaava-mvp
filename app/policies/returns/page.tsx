"use client";

import Image from "next/image";
import Link from "next/link";

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1B4D3E] pb-15">
        <div className="flex justify-center pt-6">
          <Link href="/">
            <Image
              src="/checkveda-logo-header.png"
              alt="CheckVeda"
              width={160}
              height={90}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/vendor-onboarding"
          className="inline-flex items-center gap-1.5 text-sm font-inter text-[#1B4D3E] hover:underline mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to Vendor Onboarding
        </Link>

        {/* Title */}
        <h1 className="font-outfit text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Return &amp; Refund Policy
        </h1>
        <p className="font-inter text-sm text-gray-500 mb-4">
          Last updated: April 2026
        </p>
        <p className="font-inter text-gray-700 mb-10 leading-relaxed">
          This Return &amp; Refund Policy governs all vendor obligations related to product returns, refunds, and quality disputes on the CheckVeda marketplace. CheckVeda operates as a verified marketplace for Ayurvedic medicines, herbal products, and organic food items. By listing products on CheckVeda, vendors agree to comply with this policy in its entirety.
        </p>

        <hr className="border-gray-200 mb-10" />

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            1. Return Window
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              Buyers may initiate a return request within <strong>7 calendar days</strong> from the date of delivery for all non-perishable items. The return window begins on the day the product is marked as delivered by the shipping carrier.
            </p>
            <p>
              <strong>Perishable and organic food items</strong> (including but not limited to fresh herbs, organic ghee, cold-pressed oils, herbal teas, and dietary supplements with short shelf life) are <strong>not eligible for standard returns</strong> unless the product is found to be defective, damaged during transit, or expired upon receipt.
            </p>
            <p>
              Vendors must clearly indicate the perishable or non-perishable nature of each product in their listing. Mislabeling a perishable item as non-perishable to avoid return obligations constitutes a policy violation and may result in penalties.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            2. Grounds for Return
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              A return request will be accepted if the product meets one or more of the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Defective product:</strong> The item has a manufacturing defect, does not function as described, or fails to meet the quality standards stated in the product listing.
              </li>
              <li>
                <strong>Wrong item shipped:</strong> The buyer received a product that does not match the order — incorrect SKU, variant, quantity, or entirely different product.
              </li>
              <li>
                <strong>Damaged in transit:</strong> The product arrived with visible damage to the item itself (not just outer packaging) that renders it unusable or materially diminished in value.
              </li>
              <li>
                <strong>Expired product:</strong> The item received has passed its expiry date or best-before date at the time of delivery, or has an unreasonably short remaining shelf life (less than 30 days unless stated in the listing).
              </li>
              <li>
                <strong>Significantly different from listing:</strong> The product is materially different from what was described or shown in the listing — including size, weight, composition, potency, ingredients, or appearance.
              </li>
            </ul>
            <p>
              Buyers are required to provide photographic or video evidence when filing a return request. CheckVeda reserves the right to reject return requests that lack sufficient evidence or do not meet the above criteria.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            3. Perishable Goods Policy
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              Due to the nature of Ayurvedic and organic food products, perishable goods require special handling under this policy. The following items fall under the perishable goods category:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Organic food items (grains, pulses, spices, ready-to-eat preparations)</li>
              <li>Ghee, cold-pressed oils, and cooking fats</li>
              <li>Fresh or dried herbs and botanicals</li>
              <li>Herbal teas, decoctions, and liquid formulations</li>
              <li>Probiotic or fermented Ayurvedic products</li>
              <li>Any product with a total shelf life of less than 6 months</li>
            </ul>
            <p>
              <strong>Perishable items have a shortened return window of 48 hours</strong> from delivery, applicable only in cases of visible quality issues, spoilage, contamination, or damage. Standard change-of-mind returns are not permitted for perishable goods.
            </p>
            <p>
              For quality-related complaints on perishable items, CheckVeda operates a <strong>photo-evidence based refund system</strong>. Buyers must submit clear photographs showing the defect or quality issue within 48 hours. If the evidence is deemed valid by CheckVeda&apos;s quality team, a full refund is processed without requiring the physical return of the product. The vendor bears the cost of this refund.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            4. Defective Product Liability
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              In accordance with the <strong>Consumer Protection Act, 2019 (Sections 84&ndash;87)</strong>, vendors on CheckVeda bear full liability for defective products sold through the platform. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Product replacement:</strong> The vendor must ship a replacement product at their own cost within 5 business days of being notified of the defect.
              </li>
              <li>
                <strong>Full refund:</strong> If a replacement is not feasible or the buyer prefers a refund, the vendor must authorize a complete refund including the original shipping charges paid by the buyer.
              </li>
              <li>
                <strong>Consequential costs:</strong> If a defective product causes additional harm or loss to the buyer, the vendor may be held liable for consequential damages as determined by applicable consumer protection laws.
              </li>
            </ul>
            <p>
              Section 84 of the Consumer Protection Act, 2019 establishes that a product manufacturer is liable for any harm caused by a defective product. Section 85 extends this liability to product sellers who cannot identify the manufacturer or who have modified the product. Sections 86 and 87 outline the exceptions and defenses available.
            </p>
            <p>
              <strong>Vendors are strongly advised to maintain product liability insurance.</strong> CheckVeda may require proof of insurance for vendors selling ingestible products, medicinal preparations, or items intended for therapeutic use.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            5. Return Shipping
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              The responsibility for return shipping costs depends on the reason for the return:
            </p>
            <div className="bg-gray-50 rounded-lg p-5 space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Vendor-borne return shipping:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Defective product returns</li>
                  <li>Wrong item shipped</li>
                  <li>Damaged in transit</li>
                  <li>Expired product</li>
                  <li>Product significantly different from listing</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Buyer-borne return shipping:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Change of mind (non-perishable items only, within 7-day window)</li>
                  <li>Buyer ordered incorrect variant/size</li>
                </ul>
              </div>
            </div>
            <p>
              CheckVeda will coordinate the return pickup through its logistics partners. The applicable shipping cost will be deducted from the vendor&apos;s settlement or charged to the buyer&apos;s refund amount, as appropriate. Vendors may also arrange their own return pickup within 3 business days of return authorization; failure to do so will result in CheckVeda arranging pickup and charging the vendor.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            6. Refund Timeline
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              Refunds are initiated after the returned product has been received and its condition verified, or in the case of perishable goods, after photo-evidence review is complete.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Standard refund processing:</strong> Within <strong>5&ndash;7 business days</strong> of return receipt confirmation or evidence approval.
              </li>
              <li>
                <strong>Refund method:</strong> All refunds are processed via the buyer&apos;s original payment method (UPI, credit/debit card, net banking, or wallet). Vendors cannot offer store credit in lieu of a monetary refund unless the buyer explicitly agrees.
              </li>
              <li>
                <strong>Partial refunds:</strong> In cases where a product is returned in a used or partially consumed state (and the return is still valid), CheckVeda may authorize a partial refund. The vendor will be consulted before a partial refund is finalized.
              </li>
              <li>
                <strong>Refund deductions:</strong> The refund amount deducted from the vendor&apos;s settlement account will include the product price, applicable taxes, and return shipping costs (if vendor-borne). CheckVeda&apos;s marketplace commission on the original order may be refunded to the vendor at CheckVeda&apos;s discretion.
              </li>
            </ul>
            <p>
              Vendors are notified via email and their vendor dashboard when a refund is processed against their account.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            7. Quality Inspection
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              CheckVeda reserves the right to inspect any returned product before processing a refund or replacement. This inspection serves to verify the buyer&apos;s claim and to maintain quality standards across the marketplace.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Returned products may be routed to CheckVeda&apos;s quality inspection facility or a third-party inspection partner.
              </li>
              <li>
                <strong>Inspection results are communicated to the vendor within 3 business days</strong> of the product reaching the inspection facility.
              </li>
              <li>
                If the inspection confirms the buyer&apos;s claim (defect, damage, expiry, etc.), the refund is processed and the cost is borne by the vendor.
              </li>
              <li>
                If the inspection determines the product is in acceptable condition and the buyer&apos;s claim is not substantiated, CheckVeda may reject the return. In such cases, the product is returned to the buyer at their cost.
              </li>
              <li>
                Inspection reports, including photographs and notes, are made available to the vendor through their dashboard for transparency.
              </li>
            </ul>
            <p>
              For Ayurvedic medicines and therapeutic products, CheckVeda may engage NABL-accredited laboratories for quality testing if the return involves a claim of adulteration, contamination, or sub-standard potency.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            8. Dispute Resolution
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              Vendors have the right to dispute any return decision made by CheckVeda. The dispute resolution process is as follows:
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Filing a dispute:</strong> The vendor must file a dispute within <strong>7 calendar days</strong> of receiving the return notification. Disputes can be filed through the vendor dashboard under the &quot;Returns &amp; Disputes&quot; section.
              </li>
              <li>
                <strong>Supporting evidence:</strong> The vendor must provide supporting evidence for their dispute, including but not limited to: quality control records, packaging photographs, shipping receipts, batch testing certificates, and any other documentation that supports their position.
              </li>
              <li>
                <strong>Initial review:</strong> CheckVeda&apos;s returns team reviews the dispute and the vendor&apos;s evidence within 5 business days. The vendor is notified of the decision via email and dashboard notification.
              </li>
              <li>
                <strong>Escalation:</strong> If the vendor disagrees with the initial review outcome, they may escalate the dispute to CheckVeda&apos;s Grievance Redressal Team within 3 business days of the initial decision. The grievance team conducts an independent review and issues a final decision within 10 business days.
              </li>
              <li>
                <strong>Final resolution:</strong> The decision of the Grievance Redressal Team is final and binding within the platform&apos;s internal process. This does not preclude either party from seeking external legal remedies under applicable consumer protection or commercial laws.
              </li>
            </ol>
            <p>
              CheckVeda aims to resolve all return-related disputes fairly and transparently. Repeated frivolous disputes by a vendor may be considered a policy violation.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-4">
            9. Vendor Obligations
          </h2>
          <div className="font-inter text-gray-700 leading-relaxed space-y-3">
            <p>
              Vendors listing products on CheckVeda are expected to maintain the highest standards of product quality, packaging, and labeling. The following obligations are directly tied to return and refund outcomes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Proper packaging:</strong> All products must be packaged in materials suitable for transit. Ayurvedic medicines must be sealed in tamper-evident packaging. Fragile items (glass bottles, ceramic containers) must include adequate cushioning and protective layers.
              </li>
              <li>
                <strong>Accurate labeling:</strong> Product labels must include all mandatory information as per FSSAI, AYUSH licensing, and Legal Metrology Act requirements — including ingredients, net quantity, manufacturing date, expiry date, batch number, manufacturer details, and MRP.
              </li>
              <li>
                <strong>Valid expiry dates:</strong> Products shipped must have a minimum remaining shelf life of 60% of total shelf life, or at least 3 months — whichever is greater. Shipping near-expiry products without clear disclosure in the listing is a violation.
              </li>
              <li>
                <strong>Listing accuracy:</strong> Product descriptions, images, ingredient lists, and health claims must accurately represent the actual product. Misleading listings that result in returns are entirely the vendor&apos;s responsibility.
              </li>
              <li>
                <strong>Timely response:</strong> Vendors must respond to return notifications within 48 hours. Failure to respond is treated as acceptance of the return and refund.
              </li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mt-4">
              <p className="font-semibold text-amber-900 mb-2">Non-Compliance Consequences</p>
              <p className="text-amber-800">
                Vendors who fail to meet these obligations will bear <strong>all costs</strong> associated with returns, including return shipping, refund amounts, and any inspection fees. Repeated non-compliance may result in listing suspension, increased commission rates, mandatory quality audits, or permanent removal from the CheckVeda marketplace.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        {/* Footer note */}
        <div className="font-inter text-sm text-gray-500 space-y-3 mb-12">
          <p>
            This policy is governed by and construed in accordance with the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
          </p>
          <p>
            CheckVeda reserves the right to update this Return &amp; Refund Policy at any time. Vendors will be notified of material changes via email at least 15 days before they take effect. Continued use of the platform after policy changes constitutes acceptance.
          </p>
          <p>
            For questions regarding this policy, contact us at{" "}
            <a
              href="mailto:support@checkveda.com"
              className="text-[#1B4D3E] hover:underline"
            >
              support@checkveda.com
            </a>
          </p>
        </div>

        {/* Back link bottom */}
        <Link
          href="/vendor-onboarding"
          className="inline-flex items-center gap-1.5 text-sm font-inter text-[#1B4D3E] hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to Vendor Onboarding
        </Link>
      </main>
    </div>
  );
}
