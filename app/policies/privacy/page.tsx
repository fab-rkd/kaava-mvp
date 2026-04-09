"use client";

import Link from "next/link";

export default function PrivacyNoticePage() {
  return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/vendor-onboarding"
          className="inline-flex items-center text-sm font-inter text-[#1B4D3E] hover:underline mb-8"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Vendor Onboarding
        </Link>

        <h1 className="font-outfit text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Privacy Notice
        </h1>
        <p className="font-inter text-sm text-gray-500 mb-4">
          Under the Digital Personal Data Protection Act, 2023 (DPDP Act)
        </p>
        <p className="font-inter text-sm text-gray-400 mb-10">
          Last updated: April 2026
        </p>

        <div className="font-inter text-gray-700 leading-relaxed space-y-8">
          {/* Introduction */}
          <section>
            <p>
              This Privacy Notice is issued by <strong>CheckVeda</strong> (operated by [Company Name Placeholder]),
              an Indian online marketplace for Ayurvedic, herbal, and organic products ("Platform"). This notice
              is addressed to <strong>vendors</strong> who register on the Platform to list and sell their products,
              and explains how we collect, use, store, and protect your personal data in compliance with the
              Digital Personal Data Protection Act, 2023 ("DPDP Act" or "Act").
            </p>
            <p className="mt-3">
              By registering as a vendor on CheckVeda, you acknowledge that you have read, understood, and agree
              to this Privacy Notice.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              1. Data Fiduciary
            </h2>
            <p>
              Under Section 2(i) of the DPDP Act, <strong>CheckVeda</strong> (operated by [Company Name Placeholder])
              is the <strong>Data Fiduciary</strong> that determines the purpose and means of processing your personal data.
            </p>
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p><strong>Registered Entity:</strong> [Company Name Placeholder]</p>
              <p className="mt-1"><strong>Registered Address:</strong> [Registered Address Placeholder], India</p>
              <p className="mt-1"><strong>Data Protection Officer:</strong> [DPO Name Placeholder]</p>
              <p className="mt-1"><strong>DPO Email:</strong> <a href="mailto:dpo@checkveda.com" className="text-[#1B4D3E] underline">dpo@checkveda.com</a></p>
              <p className="mt-1"><strong>Contact Phone:</strong> [Phone Placeholder]</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              2. Purpose of Data Collection
            </h2>
            <p className="mb-3">
              We collect and process your personal data for the following specific purposes:
            </p>
            <ol className="list-decimal list-outside ml-5 space-y-2">
              <li>
                <strong>Vendor Verification and Onboarding</strong> — To verify your identity, validate your business
                credentials, and approve your vendor account on the Platform.
              </li>
              <li>
                <strong>Payment Processing</strong> — To process vendor payouts, commissions, and settlements through our
                payment processor, PayU. Your bank account details are required to facilitate timely disbursements.
              </li>
              <li>
                <strong>Regulatory Compliance</strong> — To comply with applicable Indian laws, including but not limited to:
                <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
                  <li>Food Safety and Standards Act, 2006 (FSSAI regulations)</li>
                  <li>Goods and Services Tax Act, 2017 (GST compliance)</li>
                  <li>Income Tax Act, 1961 (TDS deductions and tax reporting)</li>
                  <li>Digital Personal Data Protection Act, 2023</li>
                </ul>
              </li>
              <li>
                <strong>Communication</strong> — To contact you regarding orders, account updates, policy changes,
                compliance requirements, payment notifications, and Platform announcements.
              </li>
              <li>
                <strong>Marketplace Operations</strong> — To manage product listings, process customer orders,
                coordinate logistics, handle returns and disputes, and maintain the overall quality and trust
                of the Platform.
              </li>
            </ol>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              3. Lawful Basis and Consent
            </h2>
            <p className="mb-3">
              We process your personal data on the following lawful bases under the DPDP Act:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong>Explicit Consent (Section 6)</strong> — At the time of vendor registration, you provide
                explicit, free, specific, informed, unconditional, and unambiguous consent through a clearly
                presented checkbox mechanism. This consent covers the collection and processing of all data
                described in this notice.
              </li>
              <li>
                <strong>Legitimate Uses (Section 7)</strong> — Certain processing is necessary for compliance with
                Indian law (e.g., GST filing, Income Tax reporting, FSSAI compliance) and does not require
                separate consent.
              </li>
            </ul>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-amber-800 mb-2">Right to Withdraw Consent</p>
              <p>
                Under Section 6(4) of the DPDP Act, you have the right to withdraw your consent at any time by
                contacting our Data Protection Officer at{" "}
                <a href="mailto:dpo@checkveda.com" className="text-[#1B4D3E] underline">dpo@checkveda.com</a>.
              </p>
              <p className="mt-2">
                <strong>Consequence of withdrawal:</strong> Upon withdrawal of consent, your vendor account will be
                deactivated, pending orders will be fulfilled or cancelled as appropriate, and your personal data
                will be deleted subject to statutory retention requirements outlined in Section 5 of this notice.
                Withdrawal of consent shall not affect the lawfulness of processing carried out before withdrawal.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              4. Data Collected
            </h2>
            <p className="mb-4">
              We collect the following categories of personal data from vendors during registration and ongoing
              use of the Platform:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1B4D3E] text-white">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-lg">Category</th>
                    <th className="text-left py-3 px-4 font-semibold rounded-tr-lg">Data Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium align-top bg-gray-50">Business Information</td>
                    <td className="py-3 px-4">Business name, business type (manufacturer / distributor / retailer / white-label), owner/proprietor name, brand name</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium align-top bg-gray-50">Contact Details</td>
                    <td className="py-3 px-4">Email address, phone number, alternate phone number</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium align-top bg-gray-50">Addresses</td>
                    <td className="py-3 px-4">Registered business address (street, city, state, PIN code), warehouse/dispatch address (street, city, state, PIN code)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium align-top bg-gray-50">Compliance and Tax</td>
                    <td className="py-3 px-4">PAN number, GSTIN (Goods and Services Tax Identification Number), FSSAI license number</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium align-top bg-gray-50">Financial / Banking</td>
                    <td className="py-3 px-4">Bank account holder name, bank name, branch name, bank account number, IFSC code, account type (savings / current)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium align-top bg-gray-50">Documents</td>
                    <td className="py-3 px-4">GST certificate, FSSAI certificate, trademark registration certificate, brand authorization letter</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium align-top bg-gray-50 rounded-bl-lg">Consent Records</td>
                    <td className="py-3 px-4 rounded-br-lg">Timestamp of consent (date, time, and version of notice agreed to)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              5. Data Retention
            </h2>
            <p className="mb-3">
              We retain your personal data only for as long as it is necessary for the purposes stated in this
              notice or as required by applicable law. Our retention schedule is as follows:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1B4D3E] text-white">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-lg">Data Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Retention Period</th>
                    <th className="text-left py-3 px-4 font-semibold rounded-tr-lg">Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Active vendor data</td>
                    <td className="py-3 px-4">Duration of active vendor relationship</td>
                    <td className="py-3 px-4">Contractual necessity</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Financial and tax records</td>
                    <td className="py-3 px-4">8 years from end of relevant financial year</td>
                    <td className="py-3 px-4">Income Tax Act, 1961 (Section 149)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">GST-related records</td>
                    <td className="py-3 px-4">8 years from end of relevant financial year</td>
                    <td className="py-3 px-4">GST Act, 2017 (Section 36)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium bg-gray-50">Business and compliance records</td>
                    <td className="py-3 px-4">3 years after account deactivation</td>
                    <td className="py-3 px-4">Regulatory compliance and dispute resolution</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium bg-gray-50 rounded-bl-lg">Consent records</td>
                    <td className="py-3 px-4">Retained for the duration of data processing + statutory period</td>
                    <td className="py-3 px-4 rounded-br-lg">DPDP Act (accountability)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Upon expiry of the applicable retention period, your personal data will be securely deleted or
              anonymized, unless a legal hold or ongoing legal proceeding requires continued retention.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              6. Data Sharing
            </h2>
            <p className="mb-3">
              We may share your personal data with the following categories of recipients, strictly for the
              purposes described in this notice:
            </p>
            <ol className="list-decimal list-outside ml-5 space-y-2">
              <li>
                <strong>Payment Processor (PayU)</strong> — Your banking details (account number, IFSC code,
                account holder name) are shared with PayU to process vendor payouts and settlements. PayU acts
                as a Data Processor under the DPDP Act.
              </li>
              <li>
                <strong>Logistics Partners</strong> — Your warehouse address and contact details may be shared with
                logistics and shipping partners to facilitate order fulfillment and pickups.
              </li>
              <li>
                <strong>Government and Regulatory Authorities</strong> — We may disclose your PAN, GSTIN, FSSAI
                license, and financial data to the GST Department, Income Tax Department, FSSAI, or other
                government authorities as required by law or in response to lawful requests.
              </li>
            </ol>

            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-green-800 mb-1">Our Commitment</p>
              <ul className="list-disc list-outside ml-4 space-y-1">
                <li>We do <strong>not</strong> sell, rent, or trade vendor personal data to third parties.</li>
                <li>All third-party processors operate under written data processing agreements that require them to protect your data in accordance with the DPDP Act.</li>
                <li>We only share the minimum data necessary for each stated purpose.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              7. Data Principal Rights (Sections 11-13, DPDP Act)
            </h2>
            <p className="mb-3">
              As a Data Principal under the DPDP Act, you have the following rights regarding your personal data:
            </p>
            <ol className="list-decimal list-outside ml-5 space-y-3">
              <li>
                <strong>Right to Access (Section 11)</strong> — You have the right to obtain a summary of your
                personal data being processed by CheckVeda, along with information about the processing activities
                and the identities of all Data Processors and third parties with whom your data has been shared.
              </li>
              <li>
                <strong>Right to Correction (Section 11)</strong> — You have the right to request correction of
                inaccurate or misleading personal data, and to have incomplete data completed.
              </li>
              <li>
                <strong>Right to Erasure (Section 12)</strong> — You have the right to request erasure of your
                personal data. Please note that this right is subject to legal retention obligations described in
                Section 5 of this notice. Where data must be retained under applicable law, it will be restricted
                from active processing but retained securely until the statutory period expires.
              </li>
              <li>
                <strong>Right to Grievance Redressal (Section 13)</strong> — You have the right to register a
                grievance with CheckVeda regarding any aspect of our personal data processing. See Section 11 of
                this notice for the grievance redressal process.
              </li>
              <li>
                <strong>Right to Nominate (Section 14)</strong> — You have the right to nominate another individual
                to exercise your rights in the event of your death or incapacity.
              </li>
            </ol>

            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">How to Exercise Your Rights</p>
              <p>
                To exercise any of the above rights, please send an email to our Data Protection Officer at{" "}
                <a href="mailto:dpo@checkveda.com" className="text-[#1B4D3E] underline">dpo@checkveda.com</a>{" "}
                with the subject line "Data Principal Rights Request". Include your registered vendor email address
                and a clear description of the right you wish to exercise. We will acknowledge your request within
                7 days and fulfill it within 30 days.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              8. Cross-Border Transfer of Data
            </h2>
            <p>
              CheckVeda processes and stores all vendor personal data within India. Our primary servers and
              databases are located in India.
            </p>
            <p className="mt-3">
              In the event that any Data Processor engaged by CheckVeda processes data outside India, such
              transfer will only be made to countries or territories notified as permitted by the Central
              Government under <strong>Section 16</strong> of the DPDP Act. We will not transfer your personal
              data to any jurisdiction that has been restricted by the Central Government.
            </p>
            <p className="mt-3">
              Should any cross-border transfer become necessary, we will update this notice and notify affected
              vendors in advance.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              9. Data Security
            </h2>
            <p className="mb-3">
              CheckVeda implements reasonable security safeguards as required under <strong>Section 8(4)</strong> of
              the DPDP Act to protect your personal data against unauthorized access, disclosure, alteration,
              or destruction. Our security measures include:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong>Encryption in Transit</strong> — All data transmitted between your browser and our servers
                is encrypted using TLS 1.2 or higher (HTTPS).
              </li>
              <li>
                <strong>Encryption at Rest</strong> — Personal data stored in our databases is encrypted at rest
                using industry-standard encryption algorithms.
              </li>
              <li>
                <strong>Enhanced Financial Data Protection</strong> — Bank account details (account number, IFSC code)
                are stored with additional layers of encryption and access restrictions beyond standard measures.
              </li>
              <li>
                <strong>Access Controls</strong> — Access to vendor personal data is restricted to authorized personnel
                on a need-to-know basis, with role-based access controls and audit logging.
              </li>
              <li>
                <strong>Regular Security Audits</strong> — We conduct periodic security assessments and vulnerability
                testing to identify and remediate potential threats.
              </li>
              <li>
                <strong>Document Security</strong> — Uploaded documents (certificates, licenses) are stored in secure,
                access-controlled storage with encryption.
              </li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              10. Breach Notification
            </h2>
            <p>
              In the event of a personal data breach, CheckVeda will comply with its obligations under{" "}
              <strong>Section 8(6)</strong> of the DPDP Act:
            </p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2">
              <li>
                We will notify the <strong>Data Protection Board of India</strong> without unreasonable delay upon
                becoming aware of a breach.
              </li>
              <li>
                We will notify <strong>affected vendors (Data Principals)</strong> without unreasonable delay,
                informing them of the nature of the breach, the data involved, and the remedial actions taken.
              </li>
              <li>
                We will take immediate steps to contain the breach, investigate its cause, and implement measures
                to prevent recurrence.
              </li>
            </ul>
            <p className="mt-3">
              The notification will include details of the breach, the personal data affected, potential
              consequences, and the steps taken or proposed to mitigate the impact.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              11. Grievance Redressal
            </h2>
            <p className="mb-3">
              In compliance with <strong>Section 13</strong> of the DPDP Act, CheckVeda has established the following
              grievance redressal mechanism:
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm mb-4">
              <p><strong>Designated Grievance Officer:</strong> [DPO Name Placeholder]</p>
              <p className="mt-1"><strong>Email:</strong> <a href="mailto:dpo@checkveda.com" className="text-[#1B4D3E] underline">dpo@checkveda.com</a></p>
              <p className="mt-1"><strong>Postal Address:</strong> [Registered Address Placeholder], India</p>
            </div>

            <ol className="list-decimal list-outside ml-5 space-y-2">
              <li>
                <strong>Filing a Grievance</strong> — You may submit a grievance via email to the Grievance Officer,
                clearly describing the issue and including your registered vendor email address.
              </li>
              <li>
                <strong>Acknowledgment</strong> — We will acknowledge receipt of your grievance within 7 business days.
              </li>
              <li>
                <strong>Resolution</strong> — We will investigate and resolve your grievance within 30 days of receipt.
                You will be informed of the outcome and any actions taken.
              </li>
              <li>
                <strong>Escalation</strong> — If you are not satisfied with our resolution, or if we fail to respond
                within the stipulated timeframe, you have the right to file a complaint with the{" "}
                <strong>Data Protection Board of India</strong> established under Section 18 of the DPDP Act.
              </li>
            </ol>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="font-outfit text-xl font-semibold text-gray-900 mb-3">
              12. Updates to This Notice
            </h2>
            <p>
              CheckVeda reserves the right to update or modify this Privacy Notice from time to time to reflect
              changes in our data processing practices, legal requirements, or business operations.
            </p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2">
              <li>
                Vendors will be notified of any material changes via email to their registered email address at
                least <strong>15 days before</strong> the changes take effect.
              </li>
              <li>
                The updated notice will be published on this page with a revised "Last updated" date.
              </li>
              <li>
                Continued use of the Platform after the effective date of changes constitutes acceptance of the
                updated notice.
              </li>
              <li>
                If you do not agree with the updated notice, you may withdraw your consent by contacting the
                Data Protection Officer (see Section 3).
              </li>
            </ul>
          </section>

          {/* Closing */}
          <section className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-500">
              This Privacy Notice is governed by and construed in accordance with the laws of India, including
              the Digital Personal Data Protection Act, 2023. Any disputes arising from this notice shall be
              subject to the exclusive jurisdiction of courts in [City Placeholder], India.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              For questions about this Privacy Notice, please contact our Data Protection Officer at{" "}
              <a href="mailto:dpo@checkveda.com" className="text-[#1B4D3E] underline">dpo@checkveda.com</a>.
            </p>
          </section>
        </div>
      </main>
  );
}
