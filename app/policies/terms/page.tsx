"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VendorTermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-forest-dark" style={{ height: 90, paddingBottom: 15 }}>
        <div className="flex items-center justify-center h-full">
          <Link href="/" className="flex items-center">
            <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/vendor-onboarding"
          className="inline-flex items-center gap-2 font-inter text-sm text-forest hover:text-forest-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendor Onboarding
        </Link>

        {/* Title */}
        <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-dark mb-3">
          Vendor Terms &amp; Conditions
        </h1>
        <p className="font-inter text-sm text-text-secondary mb-10">
          Last updated: April 2026
        </p>

        <div className="font-inter text-[15px] leading-relaxed text-gray-800 space-y-10">
          {/* Preamble */}
          <p>
            These Vendor Terms &amp; Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between
            you (&ldquo;Vendor&rdquo;) and CheckVeda Technologies Private Limited, a company incorporated under
            the Companies Act, 2013, having its registered office in Chandigarh, India (&ldquo;CheckVeda&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operating the marketplace accessible at{" "}
            <a href="https://checkveda.com" className="text-forest underline" target="_blank" rel="noopener noreferrer">
              checkveda.com
            </a>{" "}
            (&ldquo;Platform&rdquo;).
          </p>
          <p>
            By registering as a vendor on the Platform, you acknowledge that you have read, understood, and agree
            to be bound by these Terms, our Privacy Policy, and all applicable Indian laws. If you do not agree
            with any provision herein, do not complete the registration process.
          </p>

          {/* ── 1. DEFINITIONS ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">1. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>&ldquo;Marketplace&rdquo;</strong> means the CheckVeda e-commerce platform at checkveda.com,
                including its mobile applications and any associated sub-domains, through which verified Ayurvedic
                medicines and organic food products are listed, marketed, and sold to buyers.
              </li>
              <li>
                <strong>&ldquo;Vendor&rdquo;</strong> means any individual, sole proprietorship, partnership firm,
                limited liability partnership, or company that registers on the Platform to list and sell products,
                and includes the vendor&rsquo;s employees, agents, and authorized representatives.
              </li>
              <li>
                <strong>&ldquo;Buyer&rdquo;</strong> means any person or entity that purchases or intends to
                purchase products through the Marketplace.
              </li>
              <li>
                <strong>&ldquo;Products&rdquo;</strong> means Ayurvedic medicines, herbal preparations, organic
                food products, natural personal care products, and any other goods listed by the Vendor on the
                Platform that fall within CheckVeda&rsquo;s permitted product categories.
              </li>
              <li>
                <strong>&ldquo;Services&rdquo;</strong> means the technology, logistics coordination, payment
                processing, marketing, customer support, and other marketplace services provided by CheckVeda to
                facilitate transactions between Vendors and Buyers.
              </li>
              <li>
                <strong>&ldquo;Commission&rdquo;</strong> means the percentage-based fee charged by CheckVeda on
                each successful transaction, as specified in the applicable commission schedule or the Vendor&rsquo;s
                subscription tier.
              </li>
              <li>
                <strong>&ldquo;Listing&rdquo;</strong> means a product page created by the Vendor on the Platform,
                including all associated images, descriptions, pricing, and compliance information.
              </li>
            </ul>
          </section>

          {/* ── 2. VENDOR ELIGIBILITY & REGISTRATION ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">
              2. Vendor Eligibility &amp; Registration
            </h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">2.1 Eligibility Criteria</h3>
            <p className="mb-3">To register as a vendor on CheckVeda, you must satisfy all of the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>You must be a business entity registered in India (sole proprietorship, partnership, LLP, or company).</li>
              <li>You must possess a valid Permanent Account Number (PAN) issued by the Income Tax Department of India.</li>
              <li>
                You must hold a valid Goods and Services Tax Identification Number (GSTIN) and be in active
                compliance with GST filing requirements.
              </li>
              <li>
                If you intend to sell food products, you must hold a valid license or registration under the
                Food Safety and Standards Act, 2006, issued by the Food Safety and Standards Authority of India (FSSAI).
              </li>
              <li>
                If you intend to sell Ayurvedic medicines or preparations, you must hold valid manufacturing or
                distribution licenses under the Drugs and Cosmetics Act, 1940 and the rules made thereunder.
              </li>
              <li>You must be at least 18 years of age (if an individual or sole proprietor).</li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">2.2 Registration Process</h3>
            <p className="mb-3">During registration, you will be required to provide:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Business name, type, and registered address.</li>
              <li>PAN and GSTIN details.</li>
              <li>FSSAI license number and expiry date (for food product vendors).</li>
              <li>Bank account details (account number, IFSC code, bank name) for settlement payments.</li>
              <li>Warehouse and pickup address for shipping logistics.</li>
              <li>Product categories and brand information.</li>
              <li>
                Supporting documents: GST certificate, FSSAI certificate, trademark registration certificate
                (if applicable), and brand authorization letter (if selling third-party brands).
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">2.3 Verification</h3>
            <p>
              CheckVeda reserves the right to verify all information and documents submitted during registration.
              We may request additional documents or information at any time. Your vendor account will be activated
              only after successful verification. We reserve the right to reject any application without assigning
              reasons, at our sole discretion.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">2.4 Account Security</h3>
            <p>
              You are solely responsible for maintaining the confidentiality of your account credentials. Any
              activity conducted through your account shall be deemed to be authorized by you. You must notify
              CheckVeda immediately at{" "}
              <a href="mailto:support@checkveda.com" className="text-forest underline">support@checkveda.com</a>{" "}
              if you suspect unauthorized access to your account.
            </p>
          </section>

          {/* ── 3. FSSAI COMPLIANCE ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">3. FSSAI Compliance</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">3.1 License Requirements</h3>
            <p className="mb-3">
              Vendors selling food products on the Platform must comply with the Food Safety and Standards Act,
              2006 (&ldquo;FSS Act&rdquo;), the Food Safety and Standards (Licensing and Registration of Food
              Businesses) Regulations, 2011, and all rules and regulations made thereunder. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You must hold a valid FSSAI license (for businesses with annual turnover exceeding ₹12 lakhs)
                or FSSAI registration (for smaller food businesses) as applicable.
              </li>
              <li>
                Your FSSAI license number must be displayed prominently on all product listings on the Platform.
              </li>
              <li>
                You must renew your FSSAI license before its expiry and provide updated license details to
                CheckVeda within 7 days of renewal.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">3.2 Labeling Requirements</h3>
            <p className="mb-3">
              All food products must comply with the Food Safety and Standards (Packaging and Labelling) Regulations,
              2011. Product labels (both physical and as displayed on the Platform) must include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name of the food product and brand name.</li>
              <li>List of ingredients in descending order of their composition by weight or volume.</li>
              <li>Nutritional information as prescribed.</li>
              <li>Net quantity in metric units.</li>
              <li>Name and complete address of the manufacturer, packer, or importer.</li>
              <li>FSSAI license number with the FSSAI logo.</li>
              <li>Date of manufacture or packaging and best before / use by date.</li>
              <li>Lot or batch number for traceability.</li>
              <li>Allergen declaration, if applicable.</li>
              <li>Veg/Non-veg symbol as mandated.</li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">3.3 Food Safety Standards</h3>
            <p>
              You warrant that all food products listed on the Platform are manufactured, stored, and transported
              in compliance with hygiene and safety standards prescribed under the FSS Act. You shall maintain
              adequate records of sourcing, manufacturing, and quality testing. CheckVeda reserves the right to
              request certificates of analysis, test reports, or conduct independent quality checks at any time.
            </p>
          </section>

          {/* ── 4. AYUSH / COSMETICS COMPLIANCE ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">
              4. AYUSH / Cosmetics Compliance
            </h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">4.1 Licensing Under the Drugs &amp; Cosmetics Act, 1940</h3>
            <p className="mb-3">
              Vendors listing Ayurvedic, Siddha, or Unani (ASU) medicines must comply with the Drugs and Cosmetics
              Act, 1940 (&ldquo;D&amp;C Act&rdquo;) and the Drugs and Cosmetics Rules, 1945. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Holding a valid manufacturing license issued by the State Licensing Authority under Rule 153-B
                or a valid wholesale / retail distribution license as applicable.
              </li>
              <li>
                Ensuring that all products are manufactured in premises that comply with Good Manufacturing
                Practices (GMP) as specified in Schedule T of the D&amp;C Act.
              </li>
              <li>
                Displaying the manufacturing license number, batch number, date of manufacture, and expiry date
                on all product listings.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">4.2 AYUSH Ministry Guidelines</h3>
            <p className="mb-3">
              You must comply with all guidelines, notifications, and orders issued by the Ministry of AYUSH,
              Government of India, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Formulations must be based on authoritative classical texts or must have been approved by the
                relevant regulatory body.
              </li>
              <li>
                Proprietary Ayurvedic medicines must carry a valid product approval number from the State Licensing Authority.
              </li>
              <li>
                Products containing ingredients listed in Schedule E(1) of the D&amp;C Act (poisonous substances)
                must include appropriate warnings and dosage instructions.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">4.3 Cosmetics Regulations</h3>
            <p>
              If any of your products are classified as cosmetics under the D&amp;C Act, you must hold a valid
              cosmetics manufacturing license and comply with the Bureau of Indian Standards (BIS) specifications
              applicable to the product category. All cosmetic products must meet the labeling requirements under
              the Drugs and Cosmetics Rules, 1945, and the Legal Metrology (Packaged Commodities) Rules, 2011.
            </p>
          </section>

          {/* ── 5. PRODUCT LISTING OBLIGATIONS ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">5. Product Listing Obligations</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">5.1 E-Commerce Rules Compliance</h3>
            <p className="mb-3">
              In accordance with the Consumer Protection (E-Commerce) Rules, 2020, every product listing on the
              Platform must include the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name and description of the product.</li>
              <li>Images that accurately represent the product.</li>
              <li>
                Maximum Retail Price (MRP) inclusive of all taxes, and the selling price if different from MRP.
              </li>
              <li>Country of origin.</li>
              <li>Name and details of the manufacturer or importer.</li>
              <li>Date of manufacture and expiry date / best before date.</li>
              <li>Net quantity or volume.</li>
              <li>Key ingredients or composition.</li>
              <li>Any applicable safety warnings or usage instructions.</li>
              <li>Return, refund, and exchange policy applicable to the product.</li>
              <li>
                Grievance redressal mechanism details, including the name and contact details of the grievance
                officer.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">5.2 Accuracy and Truthfulness</h3>
            <p className="mb-3">
              You warrant that all information provided in your product listings is accurate, complete, and not
              misleading. You must:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Not exaggerate or misrepresent the properties, benefits, or effects of any product.</li>
              <li>Not use images or descriptions that do not accurately reflect the actual product delivered.</li>
              <li>Update listings promptly if any information changes (e.g., new batch with different expiry date).</li>
              <li>Ensure that pricing is consistent with the MRP printed on the product packaging.</li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">5.3 Inventory Management</h3>
            <p>
              You must maintain accurate inventory levels on the Platform. Products that are out of stock must be
              marked as unavailable immediately. Repeated instances of order cancellation due to inventory
              discrepancies may result in penalties, listing suspension, or account termination.
            </p>
          </section>

          {/* ── 6. PROHIBITED CLAIMS ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">6. Prohibited Claims</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">6.1 Magic Remedies (Objectionable Advertisements) Act, 1954</h3>
            <p className="mb-3">
              In compliance with the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954, you must
              not make any claims, whether in product listings, marketing materials, or any communication through
              the Platform, that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Claim to cure, treat, or prevent any disease or condition listed in the Schedule to the Act,
                unless such claims are supported by valid clinical evidence and regulatory approval.
              </li>
              <li>
                Use terms such as &ldquo;miracle cure&rdquo;, &ldquo;guaranteed results&rdquo;, &ldquo;100%
                effective&rdquo;, or similar absolute claims without scientific substantiation.
              </li>
              <li>
                Suggest that the product is a &ldquo;magic remedy&rdquo; as defined under Section 2(c) of the Act.
              </li>
              <li>
                Make therapeutic claims for products that are classified as food, cosmetics, or supplements
                rather than drugs.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">6.2 Advertising Standards</h3>
            <p className="mb-3">
              All product descriptions and promotional content must comply with the Advertising Standards Council
              of India (ASCI) Code for Self-Regulation of Advertising Content. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Claims must be truthful and substantiated.</li>
              <li>Testimonials must be genuine and not misleading.</li>
              <li>Comparisons with competing products must be factual and fair.</li>
              <li>Content must not exploit consumer fears or superstitions.</li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">6.3 Consequences of Violation</h3>
            <p>
              CheckVeda reserves the right to remove any listing that contains prohibited claims, without prior
              notice. Repeated violations will result in account suspension or termination. The Vendor shall be
              solely liable for any legal consequences arising from prohibited claims, including fines, penalties,
              and litigation.
            </p>
          </section>

          {/* ── 7. GST & TAX COMPLIANCE ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">7. GST &amp; Tax Compliance</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">7.1 GST Registration and Filing</h3>
            <p className="mb-3">You must:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Maintain an active GSTIN throughout the duration of your vendor relationship with CheckVeda.
              </li>
              <li>
                File GST returns (GSTR-1, GSTR-3B, and any other applicable returns) in a timely manner as
                prescribed under the Central Goods and Services Tax Act, 2017 (&ldquo;CGST Act&rdquo;).
              </li>
              <li>
                Notify CheckVeda immediately if your GSTIN is suspended, cancelled, or if any adverse regulatory
                action is initiated against you.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">7.2 Invoicing Requirements</h3>
            <p className="mb-3">
              Every sale made through the Platform must be accompanied by a valid tax invoice compliant with
              Section 31 of the CGST Act and Rule 46 of the CGST Rules, 2017. Invoices must include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Vendor&rsquo;s name, address, and GSTIN.</li>
              <li>Buyer&rsquo;s name and address (where applicable).</li>
              <li>HSN (Harmonized System of Nomenclature) code for each product.</li>
              <li>Description, quantity, and value of goods.</li>
              <li>
                Applicable tax rate and tax amount (CGST + SGST for intra-state, or IGST for inter-state
                transactions).
              </li>
              <li>Place of supply as required under GST law.</li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">7.3 Tax Collection at Source (TCS)</h3>
            <p>
              CheckVeda is required to collect Tax Collected at Source (TCS) under Section 52 of the CGST Act on
              the net value of taxable supplies made through the Platform. TCS will be deducted from your
              settlement payments and deposited with the government. CheckVeda will furnish TCS certificates as
              required under applicable law.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">7.4 Income Tax</h3>
            <p>
              You are solely responsible for the payment of all income taxes and other direct taxes applicable to
              your business. CheckVeda may deduct Tax Deducted at Source (TDS) as required under the Income Tax
              Act, 1961, and will provide TDS certificates accordingly.
            </p>
          </section>

          {/* ── 8. INTELLECTUAL PROPERTY ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">8. Intellectual Property</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">8.1 Vendor&rsquo;s Warranties</h3>
            <p className="mb-3">By listing products on the Platform, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You are the rightful owner of, or have obtained valid authorization to use, all trademarks,
                brand names, logos, images, product descriptions, and other intellectual property associated with
                your listings.
              </li>
              <li>
                Your products do not infringe upon the patents, copyrights, trademarks, trade secrets, or other
                intellectual property rights of any third party.
              </li>
              <li>
                If you are selling products manufactured by a third party, you hold a valid brand authorization
                letter or distribution agreement that permits you to sell such products on e-commerce platforms.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">8.2 License to CheckVeda</h3>
            <p>
              You grant CheckVeda a non-exclusive, royalty-free, worldwide license to use, display, reproduce, and
              distribute the content you upload to the Platform (including product images, descriptions, and brand
              logos) for the purposes of operating the Marketplace, marketing your products, and promoting the
              Platform. This license terminates upon removal of the content from the Platform or termination of
              your vendor account.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">8.3 Indemnification for IP Infringement</h3>
            <p>
              You agree to indemnify, defend, and hold harmless CheckVeda, its directors, officers, employees, and
              agents from and against any claims, damages, losses, liabilities, costs, and expenses (including
              reasonable attorney&rsquo;s fees) arising from any allegation that your products or listings infringe
              upon the intellectual property rights of any third party. CheckVeda will promptly notify you of any
              such claim and will cooperate with you in the defense thereof.
            </p>
          </section>

          {/* ── 9. LIABILITY & INDEMNIFICATION ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">9. Liability &amp; Indemnification</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">9.1 Vendor&rsquo;s Liability</h3>
            <p className="mb-3">
              You acknowledge and agree that as the seller of record, you are solely and exclusively liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                The quality, safety, efficacy, and legality of all products listed and sold through the Platform.
              </li>
              <li>
                Any contamination, adulteration, defect, or harmful substance found in your products, whether
                arising from manufacturing, storage, or transportation.
              </li>
              <li>
                Any mislabeling, incorrect product information, or failure to disclose allergens, side effects,
                or contraindications.
              </li>
              <li>
                Compliance with all applicable product liability laws, including the Consumer Protection Act,
                2019.
              </li>
              <li>
                Any harm, injury, or damage caused to buyers or third parties as a result of the use or
                consumption of your products.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">9.2 Indemnification</h3>
            <p>
              You agree to indemnify, defend, and hold harmless CheckVeda, its parent company, subsidiaries,
              affiliates, directors, officers, employees, agents, and service providers from and against any and
              all claims, demands, actions, suits, damages, losses, liabilities, costs, and expenses (including
              but not limited to reasonable legal fees) arising out of or in connection with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Any breach of these Terms by you.</li>
              <li>Any product sold by you through the Platform.</li>
              <li>Any violation of applicable law by you.</li>
              <li>Any third-party claim related to your products, listings, or business operations.</li>
              <li>Any negligent or fraudulent act or omission by you or your representatives.</li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">9.3 Limitation of CheckVeda&rsquo;s Liability</h3>
            <p>
              CheckVeda acts solely as an intermediary marketplace platform as defined under the Information
              Technology Act, 2000, and the Consumer Protection (E-Commerce) Rules, 2020. CheckVeda does not
              manufacture, store, or directly sell any products. To the maximum extent permitted by law,
              CheckVeda&rsquo;s total aggregate liability to any Vendor under these Terms shall not exceed the
              total commission earned by CheckVeda from that Vendor in the twelve (12) months preceding the event
              giving rise to the claim.
            </p>
          </section>

          {/* ── 10. TERMINATION ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">10. Termination</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">10.1 Termination for Cause</h3>
            <p className="mb-3">
              CheckVeda may suspend or terminate your vendor account immediately and without prior notice upon
              the occurrence of any of the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Fraud, misrepresentation, or submission of forged or invalid documents during registration or
                at any time thereafter.
              </li>
              <li>
                Selling counterfeit, adulterated, expired, or prohibited products.
              </li>
              <li>
                Non-compliance with any applicable law, regulation, license condition, or regulatory order,
                including but not limited to FSSAI, AYUSH, GST, or consumer protection regulations.
              </li>
              <li>
                Material breach of these Terms that is not cured within 7 days of written notice.
              </li>
              <li>
                Receiving a disproportionately high number of buyer complaints, product returns, or negative
                reviews indicating systemic quality issues.
              </li>
              <li>
                Insolvency, bankruptcy, or cessation of business operations.
              </li>
              <li>
                Any conduct that, in CheckVeda&rsquo;s reasonable judgment, may harm the reputation or
                integrity of the Platform.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">10.2 Termination for Convenience</h3>
            <p>
              Either party may terminate the vendor relationship for any reason by providing 30 (thirty) days&rsquo;
              written notice to the other party via email. Upon receiving such notice, the Vendor must fulfill all
              pending orders and resolve any outstanding disputes before the effective termination date.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">10.3 Effects of Termination</h3>
            <p className="mb-3">Upon termination:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>All product listings will be deactivated immediately.</li>
              <li>
                CheckVeda will settle any outstanding payments owed to the Vendor within 30 days, subject to
                deductions for pending buyer refunds, chargebacks, penalties, or other amounts owed by the
                Vendor to CheckVeda.
              </li>
              <li>
                The Vendor must promptly return or destroy any confidential information or materials belonging
                to CheckVeda.
              </li>
              <li>
                Sections 8 (Intellectual Property), 9 (Liability &amp; Indemnification), 11 (Dispute Resolution),
                and any other provisions that by their nature should survive, will survive termination.
              </li>
            </ul>
          </section>

          {/* ── 11. DISPUTE RESOLUTION ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">11. Dispute Resolution</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">11.1 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard
              to its conflict of laws principles.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">11.2 Amicable Resolution</h3>
            <p>
              In the event of any dispute, controversy, or claim arising out of or in connection with these Terms,
              the parties shall first attempt to resolve the matter amicably through good-faith negotiations within
              30 days of one party notifying the other in writing of the dispute.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">11.3 Arbitration</h3>
            <p className="mb-3">
              If the dispute is not resolved through negotiation within the 30-day period, it shall be referred to
              and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996
              (as amended). The arbitration shall be conducted as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The arbitration shall be conducted by a sole arbitrator mutually appointed by the parties.</li>
              <li>
                If the parties fail to agree on the arbitrator within 15 days, the arbitrator shall be appointed
                in accordance with the provisions of the Arbitration and Conciliation Act, 1996.
              </li>
              <li>The seat and venue of arbitration shall be Chandigarh, India.</li>
              <li>The language of arbitration shall be English.</li>
              <li>
                The arbitral award shall be final and binding on both parties and may be enforced in any court
                of competent jurisdiction.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">11.4 Jurisdiction</h3>
            <p>
              Subject to the arbitration clause above, the courts of Chandigarh, India shall have exclusive
              jurisdiction over any proceedings arising out of or in connection with these Terms.
            </p>
          </section>

          {/* ── 12. GRIEVANCE OFFICER ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">12. Grievance Officer</h2>
            <p className="mb-3">
              In accordance with Rule 4 of the Consumer Protection (E-Commerce) Rules, 2020, and the Information
              Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, CheckVeda has
              appointed the following Grievance Officer:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
              <p className="mb-1"><strong>Name:</strong> [Grievance Officer Name — To Be Appointed]</p>
              <p className="mb-1"><strong>Designation:</strong> Grievance Officer, CheckVeda</p>
              <p className="mb-1">
                <strong>Email:</strong>{" "}
                <a href="mailto:grievance@checkveda.com" className="text-forest underline">grievance@checkveda.com</a>
              </p>
              <p className="mb-1"><strong>Phone:</strong> [To Be Updated]</p>
              <p>
                <strong>Address:</strong> CheckVeda Technologies Pvt. Ltd., Chandigarh, India
              </p>
            </div>
            <p>
              The Grievance Officer shall acknowledge any complaint within 48 hours and resolve it within 30 days
              from the date of receipt, in accordance with applicable law. Vendors and buyers may submit grievances
              related to the Platform, product listings, transactions, or any violation of these Terms.
            </p>
          </section>

          {/* ── 13. AMENDMENTS ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">13. Amendments</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">13.1 Right to Amend</h3>
            <p>
              CheckVeda reserves the right to modify, update, or replace these Terms at any time. Amendments may
              be necessitated by changes in applicable law, regulatory requirements, business operations, or
              marketplace policies.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">13.2 Notice of Amendments</h3>
            <p>
              We will provide Vendors with at least 15 (fifteen) days&rsquo; advance notice of any material
              changes to these Terms. Notice will be sent via email to the registered email address associated
              with your vendor account and will also be published on the Platform. The notice will clearly
              describe the nature of the changes and their effective date.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">13.3 Acceptance of Amendments</h3>
            <p>
              Your continued use of the Platform after the effective date of any amendment shall constitute your
              acceptance of the amended Terms. If you do not agree with any amendment, your sole remedy is to
              terminate your vendor account before the effective date by providing written notice to CheckVeda.
              Pending orders and financial obligations must be fulfilled regardless of termination.
            </p>
          </section>

          {/* ── 14. FORCE MAJEURE ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">14. Force Majeure</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">14.1 Definition</h3>
            <p>
              Neither party shall be liable for any failure or delay in the performance of its obligations under
              these Terms to the extent that such failure or delay is caused by a Force Majeure Event. A
              &ldquo;Force Majeure Event&rdquo; means any event beyond the reasonable control of the affected
              party, including but not limited to: acts of God, natural disasters, epidemics, pandemics, fire,
              flood, earthquake, war, terrorism, riots, civil unrest, strikes, government actions or orders,
              changes in law or regulation, internet or telecommunications failures, power outages, cyberattacks,
              or any other event that could not have been reasonably foreseen or prevented.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">14.2 Obligations During Force Majeure</h3>
            <p className="mb-3">The party affected by a Force Majeure Event must:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Notify the other party in writing within 7 days of becoming aware of the Force Majeure Event,
                describing the nature and expected duration of the event.
              </li>
              <li>
                Use reasonable efforts to mitigate the effects of the Force Majeure Event and resume performance
                of its obligations as soon as practicable.
              </li>
              <li>
                Provide regular updates on the status of the Force Majeure Event and its impact on performance.
              </li>
            </ul>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">14.3 Extended Force Majeure</h3>
            <p>
              If a Force Majeure Event continues for more than 90 (ninety) consecutive days, either party may
              terminate these Terms by giving 15 days&rsquo; written notice to the other party, without incurring
              any liability for such termination. Pending financial obligations accrued prior to the Force Majeure
              Event shall remain payable.
            </p>
          </section>

          {/* ── 15. GENERAL PROVISIONS ── */}
          <section>
            <h2 className="font-outfit text-xl font-bold text-dark mb-4">15. General Provisions</h2>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">15.1 Entire Agreement</h3>
            <p>
              These Terms, together with CheckVeda&rsquo;s Privacy Policy, Commission Schedule, and any other
              policies referenced herein, constitute the entire agreement between you and CheckVeda with respect
              to your use of the Platform as a vendor, and supersede all prior or contemporaneous communications,
              agreements, and understandings, whether written or oral.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">15.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of
              competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid
              provision shall be modified to the minimum extent necessary to make it valid and enforceable while
              preserving its original intent.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">15.3 Waiver</h3>
            <p>
              The failure of either party to enforce any right or provision of these Terms shall not constitute a
              waiver of such right or provision. Any waiver must be in writing and signed by the waiving party.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">15.4 Assignment</h3>
            <p>
              You may not assign or transfer your rights or obligations under these Terms without the prior
              written consent of CheckVeda. CheckVeda may assign its rights and obligations under these Terms
              to any affiliate, successor, or acquirer without your consent.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">15.5 Notices</h3>
            <p>
              All notices under these Terms shall be in writing and shall be deemed duly given when sent via
              email to the registered email address of the respective party. Notices to CheckVeda must be sent
              to{" "}
              <a href="mailto:legal@checkveda.com" className="text-forest underline">legal@checkveda.com</a>.
            </p>

            <h3 className="font-outfit text-base font-semibold text-dark mt-4 mb-2">15.6 Relationship of Parties</h3>
            <p>
              Nothing in these Terms shall be construed as creating a partnership, joint venture, agency, or
              employment relationship between CheckVeda and the Vendor. Each party is an independent contractor,
              and neither party has the authority to bind the other in any manner.
            </p>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-500 text-center">
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@checkveda.com" className="text-forest underline">legal@checkveda.com</a>.
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              CheckVeda Technologies Private Limited &mdash; Chandigarh, India
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
