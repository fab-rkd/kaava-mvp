"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────

interface VendorDocument {
  id: string;
  vendor_id: string;
  doc_type: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

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

type StatusFilter = "all" | "pending" | "verified" | "rejected";

// ── Helpers ──────────────────────────────────────────────────────────────

function statusColor(status: string) {
  switch (status) {
    case "verified":
      return "bg-emerald-100 text-emerald-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ── Login Component ──────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        onLogin();
      } else {
        setError(data.message || "Invalid password");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
      {/* Header */}
      <div className="bg-[#1B4D3E] flex items-center justify-center" style={{ height: 90, paddingBottom: 15 }}>
        <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-[20px] shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#2D6A4F] rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="font-outfit text-xl font-semibold text-gray-900">
              Admin Login
            </h2>
            <p className="font-inter text-sm text-gray-500 mt-1">
              Enter your admin password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="font-inter w-full px-4 py-3 border border-gray-200 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="font-inter text-sm text-red-600 bg-red-50 px-3 py-2 rounded-[8px]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="font-inter w-full py-3 bg-[#2D6A4F] text-white rounded-[8px] text-sm font-medium hover:bg-[#245a42] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Vendor Detail Modal ──────────────────────────────────────────────────

function VendorDetail({
  vendor,
  onClose,
  onUpdate,
}: {
  vendor: Vendor;
  onClose: () => void;
  onUpdate: (updated: Vendor) => void;
}) {
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [status, setStatus] = useState(vendor.status);
  const [adminNotes, setAdminNotes] = useState(vendor.admin_notes || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/admin/vendors/${vendor.id}`);
        const data = await res.json();
        if (data.success) {
          setDocuments(data.documents || []);
        }
      } catch {
        console.error("Failed to load vendor details");
      } finally {
        setLoadingDocs(false);
      }
    }
    fetchDetails();
  }, [vendor.id]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/admin/vendors/${vendor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg("Saved successfully");
        onUpdate({ ...vendor, status, admin_notes: adminNotes });
        setTimeout(() => setSaveMsg(""), 2000);
      } else {
        setSaveMsg("Failed to save");
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
        `/api/admin/vendors/${vendor.id}/documents?path=${encodeURIComponent(doc.file_path)}`
      );
      const data = await res.json();
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Failed to get document URL");
      }
    } catch {
      alert("Failed to load document");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[20px] w-full max-w-2xl my-8 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-outfit text-lg font-semibold text-gray-900">
            Vendor Application
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge + Application ID */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(vendor.status)}`}>
              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
            </span>
            {vendor.application_id && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 font-mono">
                {vendor.application_id}
              </span>
            )}
            <span className="text-xs text-gray-500 font-inter">
              Applied {formatDate(vendor.created_at)}
            </span>
          </div>

          {/* Business Info */}
          <Section title="Business Information">
            <Field label="Business Name" value={vendor.business_name} />
            <Field label="Brand Name" value={vendor.brand_name} />
            <Field label="Business Type" value={vendor.business_type} />
            <Field label="Owner Name" value={vendor.owner_name} />
            <Field label="Product Type" value={vendor.product_type || "—"} />
            {vendor.business_description && (
              <Field label="Description" value={vendor.business_description} full />
            )}
          </Section>

          {/* Contact */}
          <Section title="Contact Information">
            <Field label="Email" value={vendor.email} />
            <Field label="Phone" value={vendor.phone} />
            {vendor.alt_phone && <Field label="Alternate Phone" value={vendor.alt_phone} />}
            {vendor.website && <Field label="Website" value={vendor.website} />}
            {vendor.social_links && <Field label="Social Media" value={vendor.social_links} full />}
          </Section>

          {/* Registered Address */}
          <Section title="Registered Address">
            <Field label="Address" value={vendor.registered_address} full />
            <Field label="City" value={vendor.registered_city} />
            <Field label="State" value={vendor.registered_state} />
            <Field label="Pincode" value={vendor.registered_pincode} />
          </Section>

          {/* Warehouse Address */}
          {!vendor.warehouse_same_as_registered && vendor.warehouse_address && (
            <Section title="Warehouse / Pickup Address">
              <Field label="Address" value={vendor.warehouse_address} full />
              <Field label="City" value={vendor.warehouse_city || "—"} />
              <Field label="State" value={vendor.warehouse_state || "—"} />
              <Field label="Pincode" value={vendor.warehouse_pincode || "—"} />
            </Section>
          )}

          {/* Compliance */}
          <Section title="Compliance & Licensing">
            <Field label="GSTIN" value={vendor.gstin || "Not provided"} />
            <Field label="FSSAI Number" value={vendor.fssai_number || "Not provided"} />
          </Section>

          {/* Bank Details */}
          {vendor.account_holder_name && (
            <Section title="Bank Account Details">
              <Field label="Account Holder" value={vendor.account_holder_name} />
              <Field label="Bank Name" value={vendor.bank_name || "—"} />
              <Field label="Branch" value={vendor.branch_name || "—"} />
              <Field label="Account Number" value={vendor.account_number ? `****${vendor.account_number.slice(-4)}` : "—"} />
              <Field label="IFSC Code" value={vendor.ifsc_code || "—"} />
              <Field label="Account Type" value={vendor.account_type || "—"} />
            </Section>
          )}

          {/* Product Categories */}
          {vendor.product_categories && vendor.product_categories.length > 0 && (
            <Section title="Product Categories">
              <div className="col-span-2 flex flex-wrap gap-2">
                {vendor.product_categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#F8FBF8] text-[#2D6A4F] text-xs font-medium rounded-full border border-[#2D6A4F]/10"
                  >
                    {cat}
                  </span>
                ))}
                {vendor.other_category && (
                  <span className="px-3 py-1 bg-[#F8FBF8] text-[#2D6A4F] text-xs font-medium rounded-full border border-[#2D6A4F]/10">
                    Other: {vendor.other_category}
                  </span>
                )}
              </div>
            </Section>
          )}

          {/* Documents */}
          <Section title="Documents">
            <div className="col-span-2">
              {loadingDocs ? (
                <p className="text-sm text-gray-400 font-inter">Loading documents...</p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-gray-400 font-inter">No documents uploaded</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between bg-[#FAFAFA] px-4 py-3 rounded-[8px] border border-gray-100"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium text-gray-900 font-inter truncate">
                          {doc.file_name}
                        </p>
                        <p className="text-xs text-gray-500 font-inter">
                          {doc.doc_type.replace(/_/g, " ")} &middot; {formatBytes(doc.file_size)}
                        </p>
                      </div>
                      <button
                        onClick={() => viewDocument(doc)}
                        className="text-[#2D6A4F] text-sm font-medium hover:underline font-inter shrink-0"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* Admin Actions */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="font-outfit text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Admin Actions
            </h4>

            <div>
              <label className="block text-xs font-medium text-gray-600 font-inter mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Vendor["status"])}
                className="font-inter w-full sm:w-48 px-3 py-2.5 border border-gray-200 rounded-[8px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
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
                rows={3}
                placeholder="Internal notes about this vendor..."
                className="font-inter w-full px-3 py-2.5 border border-gray-200 rounded-[8px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F]"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="font-inter px-6 py-2.5 bg-[#2D6A4F] text-white rounded-[8px] text-sm font-medium hover:bg-[#245a42] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {saveMsg && (
                <span
                  className={`text-sm font-inter ${
                    saveMsg.includes("success") ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {saveMsg}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-outfit text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
        {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <dt className="text-xs text-gray-500 font-inter">{label}</dt>
      <dd className="text-sm text-gray-900 font-inter mt-0.5">{value}</dd>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────

export default function AdminVendorsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [exporting, setExporting] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/vendors");
        if (res.ok) {
          setAuthenticated(true);
        }
      } catch {
        // not authenticated
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  const fetchVendors = useCallback(async (statusFilter: StatusFilter) => {
    setLoading(true);
    try {
      const url =
        statusFilter === "all"
          ? "/api/admin/vendors"
          : `/api/admin/vendors?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch {
      console.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchVendors(filter);
    }
  }, [authenticated, filter, fetchVendors]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setVendors([]);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/vendors/export");
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `checkveda-vendors-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  }

  function handleVendorUpdate(updated: Vendor) {
    setVendors((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
  }

  // Stats
  const stats = {
    total: vendors.length,
    pending: vendors.filter((v) => v.status === "pending").length,
    verified: vendors.filter((v) => v.status === "verified").length,
    rejected: vendors.filter((v) => v.status === "rejected").length,
  };

  // Loading spinner
  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8FBF8] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "verified", label: "Verified" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FBF8]">
      {/* Header */}
      <header className="bg-[#1B4D3E] px-4 sm:px-6" style={{ height: 90, paddingBottom: 15 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
          <button
            onClick={handleLogout}
            className="font-inter text-sm text-white/80 hover:text-white px-4 py-2 rounded-[8px] border border-white/20 hover:border-white/40 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Total" value={stats.total} color="bg-gray-100 text-gray-800" />
          <StatCard label="Pending" value={stats.pending} color="bg-amber-50 text-amber-800" />
          <StatCard label="Verified" value={stats.verified} color="bg-emerald-50 text-emerald-800" />
          <StatCard label="Rejected" value={stats.rejected} color="bg-red-50 text-red-800" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex gap-1 bg-white rounded-[8px] p-1 border border-gray-100 shadow-sm">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`font-inter text-sm px-4 py-2 rounded-[6px] transition-colors ${
                  filter === tab.key
                    ? "bg-[#2D6A4F] text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="font-inter text-sm px-4 py-2.5 bg-white border border-gray-200 rounded-[8px] text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-inter text-gray-400 text-sm">
                No vendor applications found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3">
                      Business
                    </th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3 hidden md:table-cell">
                      Owner
                    </th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3 hidden lg:table-cell">
                      Contact
                    </th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3 hidden sm:table-cell">
                      App ID
                    </th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3">
                      Status
                    </th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3 hidden sm:table-cell">
                      Date
                    </th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <p className="font-inter text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {vendor.business_name}
                        </p>
                        <p className="font-inter text-xs text-gray-500 md:hidden mt-0.5">
                          {vendor.owner_name}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <p className="font-inter text-sm text-gray-700">
                          {vendor.owner_name}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <p className="font-inter text-sm text-gray-700">
                          {vendor.email}
                        </p>
                        <p className="font-inter text-xs text-gray-500 mt-0.5">
                          {vendor.phone}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <span className="font-inter text-xs text-gray-500 font-mono">
                          {vendor.application_id || "—"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusColor(vendor.status)}`}
                        >
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <span className="font-inter text-sm text-gray-500">
                          {formatDate(vendor.created_at)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="font-inter text-sm text-[#2D6A4F] font-medium hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <VendorDetail
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onUpdate={handleVendorUpdate}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-[20px] p-4 sm:p-5 ${color}`}>
      <p className="font-inter text-xs font-medium uppercase tracking-wider opacity-70">
        {label}
      </p>
      <p className="font-outfit text-2xl sm:text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
