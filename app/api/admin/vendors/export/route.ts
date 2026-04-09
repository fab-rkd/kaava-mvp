import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { verifyAdminSession } from "@/app/api/admin/auth/route";

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = getServiceClient();

    const { data: vendors, error } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Export vendors error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch vendors" },
        { status: 500 }
      );
    }

    const headers = [
      "Application ID",
      "Business Name",
      "Brand Name",
      "Owner Name",
      "Email",
      "Phone",
      "Alt Phone",
      "Business Type",
      "Product Type",
      "Product Categories",
      "Estimated Products",
      "Registered Address",
      "City",
      "State",
      "Pincode",
      "Warehouse Same",
      "Warehouse Address",
      "Warehouse City",
      "Warehouse State",
      "Warehouse Pincode",
      "GSTIN",
      "FSSAI Number",
      "Account Holder",
      "Bank Name",
      "Branch",
      "Account Number",
      "IFSC Code",
      "Account Type",
      "Website",
      "Social Links",
      "Description",
      "Status",
      "Admin Notes",
      "Created At",
    ];

    const rows = (vendors || []).map((v) => [
      v.application_id,
      v.business_name,
      v.brand_name,
      v.owner_name,
      v.email,
      v.phone,
      v.alt_phone,
      v.business_type,
      v.product_type,
      Array.isArray(v.product_categories)
        ? v.product_categories.join("; ")
        : v.product_categories,
      v.estimated_products,
      v.registered_address,
      v.registered_city,
      v.registered_state,
      v.registered_pincode,
      v.warehouse_same_as_registered ? "Yes" : "No",
      v.warehouse_address,
      v.warehouse_city,
      v.warehouse_state,
      v.warehouse_pincode,
      v.gstin,
      v.fssai_number,
      v.account_holder_name,
      v.bank_name,
      v.branch_name,
      v.account_number,
      v.ifsc_code,
      v.account_type,
      v.website,
      v.social_links,
      v.business_description,
      v.status,
      v.admin_notes,
      v.created_at,
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const now = new Date().toISOString().split("T")[0];

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="checkveda-vendors-${now}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
