"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ExternalLink, FileText, Loader2 } from "lucide-react";

interface Vendor {
  id: string;
  application_id: string | null;
  business_name: string;
  business_type: string;
  owner_name: string;
  email: string;
  phone: string;
  alt_phone: string | null;
  registered_address: string;
  registered_city: string;
  registered_state: string;
  registered_pincode: string;
  warehouse_same_as_registered: boolean;
  warehouse_address: string | null;
  warehouse_city: string | null;
  warehouse_state: string | null;
  warehouse_pincode: string | null;
  brand_name: string;
  product_type: string | null;
  product_categories: string[];
  other_category: string | null;
  estimated_products: string | null;
  business_description: string | null;
  website: string | null;
  social_links: string | null;
  pan_number: string | null;
  gstin: string | null;
  fssai_number: string | null;
  account_holder_name: string | null;
  bank_name: string | null;
  branch_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  account_type: string | null;
  consent_accepted: boolean;
  status: "pending" | "verified" | "rejected";
  admin_notes: string | null;
  created_at: string;
}

interface VendorDocument {
  id: string;
  doc_type: string;
  file_path: string;
  file_name: string;
  uploaded_at: string;
}

function statusColor(status: string) {
  switch (status) {
    case "verified": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "rejected": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-amber-100 text-amber-700 border-amber-200";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function InfoRow({ label, value, hide }: { label: string; value: string | null | undefined; hide?: boolean }) {
  if (hide && !value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2.5 border-b border-gray-100 last:border-0">
      <span className="font-inter text-[13px] font-medium text-gray-500 sm:w-40 shrink-0">{label}</span>
      <span className={`font-inter text-sm ${value ? "text-gray-900" : "text-gray-300 italic"}`}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-outfit text-sm font-semibold text-gray-800 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-5 py-3">{children}</div>
    </div>
  );
}

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Vendor["status"]>("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    async function fetchVendor() {
      try {
        const res = await fetch(`/api/admin/vendors/${vendorId}`);
        if (res.status === 401) {
          router.push("/admin/vendors");
          return;
        }
        const data = await res.json();
        if (data.success) {
          setVendor(data.vendor);
          setStatus(data.vendor.status);
          setAdminNotes(data.vendor.admin_notes || "");
          setDocuments(data.documents || []);
        }
      } catch {
        console.error("Failed to load vendor");
      } finally {
        setLoading(false);
      }
    }
    fetchVendor();
  }, [vendorId, router]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg("Saved successfully");
        setVendor((prev) => prev ? { ...prev, status, admin_notes: adminNotes } : prev);
        setTimeout(() => setSaveMsg(""), 3000);
      } else {
        setSaveMsg("Failed to save: " + (data.message || "Unknown error"));
      }
    } catch {
      setSaveMsg("Connection error");
    } finally {
      setSaving(false);
    }
  }

  async function viewDocument(doc: VendorDocument) {
    try {
      const res = await fetch(
        `/api/admin/vendors/${vendorId}/documents?path=${encodeURIComponent(doc.file_path)}`
      );
      const data = await res.json();
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      alert("Failed to load document");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#2D6A4F] animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="font-inter text-gray-500">Vendor not found</p>
        <Link href="/admin/vendors" className="font-inter text-sm text-[#2D6A4F] hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1B4D3E] px-4 sm:px-6" style={{ height: 90, paddingBottom: 15 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
          <Link
            href="/admin/vendors"
            className="font-inter text-sm text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Bar — App ID + Status + Date */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {vendor.application_id && (
            <span className="font-mono text-sm font-semibold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              {vendor.application_id}
            </span>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(vendor.status)}`}>
            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
          </span>
          <span className="text-xs text-gray-500 font-inter">
            Applied {formatDate(vendor.created_at)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — Main info (2 cols wide) */}
          <div className="lg:col-span-2 space-y-5">
            <SectionCard title="Business Information">
              <InfoRow label="Business Name" value={vendor.business_name} />
              <InfoRow label="Brand Name" value={vendor.brand_name} />
              <InfoRow label="Business Type" value={vendor.business_type} />
              <InfoRow label="Owner Name" value={vendor.owner_name} />
              <InfoRow label="Product Type" value={vendor.product_type} />
              <InfoRow label="Est. Products" value={vendor.estimated_products} hide />
              <InfoRow label="Description" value={vendor.business_description} hide />
            </SectionCard>

            <SectionCard title="Contact">
              <InfoRow label="Email" value={vendor.email} />
              <InfoRow label="Phone" value={vendor.phone} />
              <InfoRow label="Alt Phone" value={vendor.alt_phone} hide />
              <InfoRow label="Website" value={vendor.website} hide />
              <InfoRow label="Social Media" value={vendor.social_links} hide />
            </SectionCard>

            <SectionCard title="Registered Address">
              <InfoRow label="Address" value={vendor.registered_address} />
              <InfoRow label="City" value={vendor.registered_city} />
              <InfoRow label="State" value={vendor.registered_state} />
              <InfoRow label="Pincode" value={vendor.registered_pincode} />
            </SectionCard>

            {!vendor.warehouse_same_as_registered && vendor.warehouse_address && (
              <SectionCard title="Warehouse / Pickup Address">
                <InfoRow label="Address" value={vendor.warehouse_address} />
                <InfoRow label="City" value={vendor.warehouse_city} />
                <InfoRow label="State" value={vendor.warehouse_state} />
                <InfoRow label="Pincode" value={vendor.warehouse_pincode} />
              </SectionCard>
            )}

            <SectionCard title="Compliance & Licensing">
              <InfoRow label="PAN Number" value={vendor.pan_number} />
              <InfoRow label="GSTIN" value={vendor.gstin} />
              <InfoRow label="FSSAI Number" value={vendor.fssai_number} />
            </SectionCard>

            <SectionCard title="Bank Account Details">
              <InfoRow label="Account Holder" value={vendor.account_holder_name} />
              <InfoRow label="Bank Name" value={vendor.bank_name} />
              <InfoRow label="Branch" value={vendor.branch_name} />
              <InfoRow label="Account Number" value={vendor.account_number} />
              <InfoRow label="IFSC Code" value={vendor.ifsc_code} />
              <InfoRow label="Account Type" value={vendor.account_type} />
            </SectionCard>

            {/* Product Categories */}
            {vendor.product_categories?.length > 0 && (
              <SectionCard title="Product Categories">
                <div className="flex flex-wrap gap-2 py-2">
                  {vendor.product_categories.map((cat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#F0F7F0] text-[#2D6A4F] text-xs font-medium rounded-full border border-[#2D6A4F]/15"
                    >
                      {cat}
                    </span>
                  ))}
                  {vendor.other_category && (
                    <span className="px-3 py-1.5 bg-[#F0F7F0] text-[#2D6A4F] text-xs font-medium rounded-full border border-[#2D6A4F]/15">
                      Other: {vendor.other_category}
                    </span>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Documents */}
            <SectionCard title="Uploaded Documents">
              {documents.length === 0 ? (
                <p className="font-inter text-sm text-gray-400 py-2">No documents uploaded</p>
              ) : (
                <div className="space-y-2 py-1">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => viewDocument(doc)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-[#F0F7F0] border border-gray-100 hover:border-[#2D6A4F]/20 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                        <p className="font-inter text-xs text-gray-500">{doc.doc_type.replace(/([A-Z])/g, " $1").trim()}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right column — Admin Actions (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-outfit text-sm font-semibold text-gray-800 uppercase tracking-wide">Admin Actions</h3>

                <div>
                  <label className="block text-xs font-medium text-gray-600 font-inter mb-1.5">
                    Application Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Vendor["status"])}
                    className="font-inter w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 font-inter mb-1.5">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder="Internal notes about this vendor..."
                    className="font-inter w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="font-inter w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245a42] disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                {saveMsg && (
                  <p className={`text-xs font-inter text-center ${saveMsg.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
                    {saveMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
