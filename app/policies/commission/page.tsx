"use client";

import Link from "next/link";

export default function CommissionPolicyPage() {
  return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/vendor-onboarding"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-inter text-[#1B4D3E] hover:underline"
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
        <h1 className="font-outfit text-3xl font-bold text-gray-900 mt-4">
          Marketplace Commission Policy
        </h1>
        <p className="mt-2 font-inter text-sm text-gray-500">
          Last updated: April 2026
        </p>

        <div className="mt-10 space-y-10 font-inter text-gray-700 leading-relaxed">
          {/* Intro */}
          <p>
            This document outlines the commission structure, tax obligations, payment terms, and
            related policies applicable to all vendors selling on the CheckVeda marketplace.
            CheckVeda is an Indian marketplace for verified Ayurvedic medicines and organic food
            products. By onboarding as a vendor, you agree to the terms described below.
          </p>

          {/* 1. Commission Structure */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              1. Commission Structure
            </h2>
            <p>
              CheckVeda charges a standard marketplace commission of <strong>10% to 15%</strong> on
              the net selling price of each product sold through the platform. The exact commission
              rate depends on the product category:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                <strong>Ayurvedic Medicines &amp; Supplements:</strong> 12-15% depending on brand
                exclusivity and product margin.
              </li>
              <li>
                <strong>Organic Food &amp; Grocery:</strong> 10-12% given thinner margins typical of
                the category.
              </li>
              <li>
                <strong>Personal Care &amp; Wellness:</strong> 12-15% based on the product
                sub-category.
              </li>
              <li>
                <strong>Herbal Cosmetics:</strong> 15% standard rate.
              </li>
            </ul>
            <p className="mt-3">
              The applicable commission rate for each category is clearly disclosed to the vendor
              during the onboarding process, before any product is listed. Vendors will see their
              category-wise commission rates in the Vendor Dashboard at all times. No hidden charges
              or variable fees are applied beyond the disclosed commission rate.
            </p>
            <p className="mt-2">
              Commission is calculated on the <strong>net selling price</strong> (i.e., the final
              price paid by the customer minus any platform-funded discounts or coupons). GST on
              product price is excluded from the commission base.
            </p>
          </section>

          {/* 2. TDS */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              2. TDS (Tax Deducted at Source)
            </h2>
            <p>
              In accordance with <strong>Section 194O of the Income Tax Act, 1961</strong>,
              CheckVeda is required to deduct TDS at the rate of <strong>1%</strong> on the gross
              amount of sales facilitated through the platform for each vendor.
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                TDS is deducted on the <strong>gross sales amount</strong> (inclusive of GST
                collected on the product) before any commission or other deductions.
              </li>
              <li>
                TDS is applicable when the gross amount of sales for a vendor exceeds Rs. 5,00,000
                in a financial year, as per the provisions of Section 194O.
              </li>
              <li>
                CheckVeda deposits the deducted TDS with the Government of India within the
                prescribed timelines and files quarterly TDS returns (Form 26Q).
              </li>
              <li>
                <strong>Form 16A</strong> (TDS certificate) is issued to every vendor on a quarterly
                basis. Vendors can download this from the Vendor Dashboard.
              </li>
              <li>
                Vendors <strong>must provide a valid PAN</strong> (Permanent Account Number) during
                onboarding. If PAN is not provided or is invalid, TDS will be deducted at the higher
                rate of <strong>5%</strong> as mandated under Section 206AA.
              </li>
              <li>
                Vendors can claim credit for the TDS deducted while filing their Income Tax Returns
                by verifying the same on Form 26AS / AIS.
              </li>
            </ul>
          </section>

          {/* 3. GST on Commission */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              3. GST on Commission
            </h2>
            <p>
              CheckVeda acts as a service provider to its vendors by facilitating marketplace
              services (listing, discovery, order management, payment processing, etc.). The
              commission charged by CheckVeda is subject to <strong>GST at 18%</strong> (9% CGST +
              9% SGST for intra-state, or 18% IGST for inter-state transactions).
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                GST is charged <strong>on the commission amount</strong>, not on the product selling
                price. For example, if the commission on a sale is Rs. 100, GST of Rs. 18 will be
                added, making the total commission deduction Rs. 118.
              </li>
              <li>
                CheckVeda issues a proper <strong>tax invoice</strong> to each vendor on a monthly
                basis, detailing the commission earned and GST charged. This invoice is available for
                download in the Vendor Dashboard.
              </li>
              <li>
                GST-registered vendors can claim <strong>Input Tax Credit (ITC)</strong> on the GST
                paid on commission charges, subject to applicable GST rules.
              </li>
              <li>
                Vendors are responsible for their own GST compliance on product sales, including
                charging the correct GST rate on products and filing their GST returns.
              </li>
            </ul>
          </section>

          {/* 4. Payment Cycle */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              4. Payment Cycle
            </h2>
            <p>
              CheckVeda follows a structured payment cycle to ensure timely and predictable payouts
              to all vendors:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                <strong>Settlement Period:</strong> Payouts are processed on a{" "}
                <strong>T+7 business days</strong> basis, where T is the date of order delivery
                confirmation by the logistics partner. This means the vendor receives the payout
                within 7 working days after the customer&apos;s order is marked as delivered.
              </li>
              <li>
                <strong>Payout Method:</strong> All payouts are made to the vendor&apos;s registered
                bank account via <strong>NEFT or IMPS</strong>. The bank account must be verified
                during vendor onboarding.
              </li>
              <li>
                <strong>Payout Frequency:</strong> Payouts are batched and processed on every
                business day. Vendors will see the credited amount in their bank account within 1-2
                banking days after payout initiation.
              </li>
              <li>
                <strong>Minimum Payout Threshold:</strong> A minimum balance of Rs. 100 must be
                accumulated before a payout is triggered. Balances below this threshold are carried
                forward to the next payout cycle.
              </li>
              <li>
                <strong>Payout Dashboard:</strong> Vendors can track all payout statuses, expected
                dates, and transaction history in real-time through the Vendor Dashboard.
              </li>
            </ul>
          </section>

          {/* 5. Deductions */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              5. Deductions
            </h2>
            <p>
              Each payout to the vendor is net of the following deductions. All deductions are
              itemized transparently:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                <strong>Marketplace Commission:</strong> The category-wise commission as described in
                Section 1 above.
              </li>
              <li>
                <strong>GST on Commission:</strong> 18% GST on the commission amount as described in
                Section 3.
              </li>
              <li>
                <strong>TDS (1%):</strong> Tax Deducted at Source as described in Section 2.
              </li>
              <li>
                <strong>Return Adjustments:</strong> If a customer returns a product and a refund is
                processed, the corresponding sale amount is adjusted against the vendor&apos;s
                payable balance. Commission already deducted on the returned order is credited back
                to the vendor.
              </li>
              <li>
                <strong>Penalties (if applicable):</strong> Penalties may be levied for policy
                violations such as shipping counterfeit products, repeated late shipments, or failure
                to meet quality standards. Penalty amounts are communicated in advance and are
                governed by the Vendor Code of Conduct.
              </li>
              <li>
                <strong>Shipping Charges (if applicable):</strong> In cases where CheckVeda
                facilitates shipping, the logistics cost may be deducted from the payout. This is
                disclosed per order.
              </li>
            </ul>
            <p className="mt-3">
              A detailed <strong>monthly statement</strong> is generated and made available in the
              Vendor Dashboard by the 5th of each month for the preceding month. The statement
              includes an order-level breakdown of all sales, deductions, returns, and net payouts.
            </p>
          </section>

          {/* 6. Escrow */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              6. Escrow Mechanism
            </h2>
            <p>
              To protect both buyers and vendors, CheckVeda uses an escrow-based payment system
              powered by <strong>PayU</strong>:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                When a buyer places an order on CheckVeda, the payment is collected and held in a
                secure <strong>escrow account</strong> managed by PayU. The funds are not
                transferred directly to the vendor at the time of purchase.
              </li>
              <li>
                The escrowed funds are released to the vendor only after{" "}
                <strong>
                  delivery confirmation and the expiry of the return/exchange window
                </strong>{" "}
                (typically 7 days after delivery, unless a different return window is specified for
                the product category).
              </li>
              <li>
                If the customer initiates a return within the return window, the escrowed funds are
                used to process the refund. The vendor is not required to make a separate refund
                payment.
              </li>
              <li>
                This escrow mechanism ensures vendors receive payment for successfully fulfilled
                orders while buyers are protected against non-delivery or quality issues.
              </li>
              <li>
                PayU&apos;s escrow service is compliant with RBI guidelines for payment aggregators
                and marketplace settlements.
              </li>
            </ul>
          </section>

          {/* 7. Disputes */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              7. Payout Disputes
            </h2>
            <p>
              CheckVeda provides a clear and fair process for resolving payout-related disputes:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                Vendors can raise a payout dispute within <strong>30 days</strong> of the payout
                date if they believe there is a discrepancy in the amount received, deductions
                applied, or any other payout-related issue.
              </li>
              <li>
                Disputes can be raised through the <strong>Vendor Dashboard</strong> under the
                &quot;Payout Disputes&quot; section, or by emailing{" "}
                <strong>vendor-support@checkveda.com</strong>.
              </li>
              <li>
                CheckVeda commits to acknowledging the dispute within <strong>2 business days</strong>{" "}
                and providing a resolution within <strong>15 business days</strong> from the date of
                dispute submission.
              </li>
              <li>
                During the dispute investigation, the vendor will be provided with detailed
                transaction records and deduction breakdowns for the orders in question.
              </li>
              <li>
                If the dispute is resolved in the vendor&apos;s favor, the differential amount is
                credited in the next payout cycle. If the dispute is not resolved satisfactorily, the
                vendor may escalate to CheckVeda&apos;s Grievance Officer.
              </li>
            </ul>
          </section>

          {/* 8. Rate Revisions */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              8. Commission Rate Revisions
            </h2>
            <p>
              CheckVeda reserves the right to revise commission rates from time to time. However,
              any such revision will be carried out with full transparency:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1.5">
              <li>
                Vendors will be given a minimum of <strong>30 days&apos; advance written notice</strong>{" "}
                before any change in commission rates takes effect. The notice will be sent via email
                and displayed prominently in the Vendor Dashboard.
              </li>
              <li>
                The notice will clearly state the current rate, the revised rate, the effective date,
                and the product categories affected.
              </li>
              <li>
                Vendors who do not wish to continue under the revised commission structure may
                choose to delist their products and close their vendor account before the new rates
                take effect, without any penalty.
              </li>
              <li>
                Commission rates applicable to orders already placed before the effective date of
                the revision will be honored at the old rate, regardless of when the order is
                delivered.
              </li>
              <li>
                CheckVeda may introduce promotional or reduced commission rates for specific
                categories or time periods. Vendors will be notified of such promotions and may
                opt in voluntarily.
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              Questions?
            </h2>
            <p>
              If you have any questions about this commission policy or need clarification on any
              deductions, reach out to our vendor support team at{" "}
              <a
                href="mailto:vendor-support@checkveda.com"
                className="text-[#1B4D3E] font-medium hover:underline"
              >
                vendor-support@checkveda.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
  );
}
