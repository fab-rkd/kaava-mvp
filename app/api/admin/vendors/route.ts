import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { verifyAdminSession } from "@/app/api/admin/auth/route";

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = getServiceClient();
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");

    let query = supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && ["pending", "verified", "rejected"].includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Fetch vendors error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch vendors" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, vendors: data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
