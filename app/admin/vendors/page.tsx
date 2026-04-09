"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Loader2, Users, Clock, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────

interface Vendor {
  id: string;
  application_id: string | null;
  business_name: string;
  brand_name: string;
  business_type: string;
  owner_name: string;
  email: string;
  phone: string;
  product_type: string | null;
  status: "pending" | "verified" | "rejected";
  created_at: string;
}

type StatusFilter = "all" | "pending" | "verified" | "rejected";
type SortField = "created_at" | "business_name";
type SortDir = "asc" | "desc";

// ── Helpers ──────────────────────────────────────────────────────────────

function statusColor(status: string) {
  switch (status) {
    case "verified": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-[#1B4D3E] flex items-center justify-center" style={{ height: 90, paddingBottom: 15 }}>
        <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#2D6A4F] rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-outfit text-xl font-semibold text-gray-900">Admin Login</h2>
            <p className="font-inter text-sm text-gray-500 mt-1">Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="font-inter w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition-colors"
              autoFocus
            />
            {error && (
              <p className="font-inter text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="font-inter w-full py-3 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245a42] disabled:opacity-50 transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, active, onClick }: {
  label: string;
  value: number;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
        active
          ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm"
          : "bg-white text-gray-900 border-gray-200 hover:border-[#2D6A4F]/30"
      }`}
    >
      <div className={`shrink-0 ${active ? "text-white/80" : "text-gray-400"}`}>{icon}</div>
      <div>
        <p className={`font-inter text-2xl font-bold ${active ? "text-white" : "text-gray-900"}`}>{value}</p>
        <p className={`font-inter text-xs font-medium ${active ? "text-white/70" : "text-gray-500"}`}>{label}</p>
      </div>
    </button>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────

export default function AdminVendorsPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/vendors");
        if (res.ok) setAuthenticated(true);
      } catch { /* not authenticated */ } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vendors");
      const data = await res.json();
      if (data.success) setVendors(data.vendors);
    } catch {
      console.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchVendors();
  }, [authenticated, fetchVendors]);

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

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "created_at" ? "desc" : "asc");
    }
  }

  // Stats
  const stats = {
    total: vendors.length,
    pending: vendors.filter((v) => v.status === "pending").length,
    verified: vendors.filter((v) => v.status === "verified").length,
    rejected: vendors.filter((v) => v.status === "rejected").length,
  };

  // Filtered + searched + sorted vendors
  const filteredVendors = useMemo(() => {
    let list = vendors;

    // Status filter
    if (filter !== "all") {
      list = list.filter((v) => v.status === filter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((v) =>
        v.business_name?.toLowerCase().includes(q) ||
        v.brand_name?.toLowerCase().includes(q) ||
        v.owner_name?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.phone?.includes(q) ||
        v.application_id?.toLowerCase().includes(q)
      );
    }

    // Sort
    list = [...list].sort((a, b) => {
      const aVal = sortField === "created_at" ? new Date(a.created_at).getTime() : (a.business_name || "").toLowerCase();
      const bVal = sortField === "created_at" ? new Date(b.created_at).getTime() : (b.business_name || "").toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [vendors, filter, searchQuery, sortField, sortDir]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#2D6A4F] animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1B4D3E] px-4 sm:px-6" style={{ height: 90, paddingBottom: 15 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <img src="/checkveda-logo-header.png" alt="CheckVeda" className="h-12 w-auto" />
          <button
            onClick={handleLogout}
            className="font-inter text-sm text-white/80 hover:text-white px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="font-outfit text-xl font-bold text-gray-900">Vendor Applications</h1>
          <p className="font-inter text-sm text-gray-500 mt-0.5">Manage and review vendor onboarding submissions</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total"
            value={stats.total}
            icon={<Users className="w-5 h-5" />}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<Clock className="w-5 h-5" />}
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          />
          <StatCard
            label="Verified"
            value={stats.verified}
            icon={<CheckCircle className="w-5 h-5" />}
            active={filter === "verified"}
            onClick={() => setFilter("verified")}
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<XCircle className="w-5 h-5" />}
            active={filter === "rejected"}
            onClick={() => setFilter("rejected")}
          />
        </div>

        {/* Toolbar — Search + Sort + Export */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, or app ID..."
              className="font-inter w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <button
              onClick={() => toggleSort("created_at")}
              className={`font-inter text-xs px-3 py-2.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                sortField === "created_at" ? "bg-[#2D6A4F] text-white border-[#2D6A4F]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Date {sortField === "created_at" && (sortDir === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={() => toggleSort("business_name")}
              className={`font-inter text-xs px-3 py-2.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                sortField === "business_name" ? "bg-[#2D6A4F] text-white border-[#2D6A4F]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Name {sortField === "business_name" && (sortDir === "asc" ? "↑" : "↓")}
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="font-inter text-xs px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="font-inter text-xs text-gray-500">
            {filteredVendors.length} result{filteredVendors.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#2D6A4F] animate-spin" />
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-inter text-gray-400 text-sm">
                {searchQuery ? "No vendors match your search" : "No vendor applications found"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3">Business</th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3 hidden md:table-cell">Owner</th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3 hidden lg:table-cell">Contact</th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3 hidden sm:table-cell">App ID</th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3">Status</th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3 hidden sm:table-cell">Date</th>
                    <th className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wider px-4 sm:px-5 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      onClick={() => router.push(`/admin/vendors/${vendor.id}`)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-4 sm:px-5 py-4">
                        <p className="font-inter text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {vendor.business_name}
                        </p>
                        <p className="font-inter text-xs text-gray-500 md:hidden mt-0.5">{vendor.owner_name}</p>
                      </td>
                      <td className="px-4 sm:px-5 py-4 hidden md:table-cell">
                        <p className="font-inter text-sm text-gray-700">{vendor.owner_name}</p>
                      </td>
                      <td className="px-4 sm:px-5 py-4 hidden lg:table-cell">
                        <p className="font-inter text-sm text-gray-700">{vendor.email}</p>
                        <p className="font-inter text-xs text-gray-500 mt-0.5">{vendor.phone}</p>
                      </td>
                      <td className="px-4 sm:px-5 py-4 hidden sm:table-cell">
                        <span className="font-inter text-xs text-gray-500 font-mono">{vendor.application_id || "—"}</span>
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor(vendor.status)}`}>
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-4 hidden sm:table-cell">
                        <span className="font-inter text-sm text-gray-500">{formatDate(vendor.created_at)}</span>
                      </td>
                      <td className="px-4 sm:px-5 py-4">
                        <span className="font-inter text-sm text-[#2D6A4F] font-medium">View →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
