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
      "ID",
      "Business Name",
      "Owner Name",
      "Email",
      "Phone",
      "Business Type",
      "GST Number",
      "AYUSH License",
      "FSSAI Number",
      "Address Line 1",
      "Address Line 2",
      "City",
      "State",
      "Pincode",
      "Website",
      "Product Categories",
      "Tier",
      "Description",
      "Status",
      "Admin Notes",
      "Created At",
      "Updated At",
    ];

    const rows = (vendors || []).map((v) => [
      v.id,
      v.business_name,
      v.owner_name,
      v.email,
      v.phone,
      v.business_type,
      v.gst_number,
      v.ayush_license_number,
      v.fssai_number,
      v.address_line1,
      v.address_line2,
      v.city,
      v.state,
      v.pincode,
      v.website,
      Array.isArray(v.product_categories)
        ? v.product_categories.join("; ")
        : v.product_categories,
      v.tier,
      v.description,
      v.status,
      v.admin_notes,
      v.created_at,
      v.updated_at,
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
