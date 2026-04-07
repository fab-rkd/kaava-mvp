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
    const { searchParams } = request.nextUrl;
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { success: false, message: "path query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase.storage
      .from("vendor-docs")
      .createSignedUrl(path, 60 * 15); // 15 minutes

    if (error) {
      console.error("Signed URL error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to generate document URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: data.signedUrl });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
