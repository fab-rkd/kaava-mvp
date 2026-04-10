import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { verifyAdminSession } from "@/app/api/admin/auth/route";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const supabase = getServiceClient();

    // Fetch vendor
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    // Fetch documents
    const { data: documents, error: docsError } = await supabase
      .from("vendor_documents")
      .select("*")
      .eq("vendor_id", id)
      .order("uploaded_at", { ascending: false });

    if (docsError) {
      console.error("Fetch documents error:", docsError);
    }

    return NextResponse.json({
      success: true,
      vendor,
      documents: documents || [],
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getServiceClient();

    const updates: Record<string, unknown> = {};

    if (body.status && ["pending", "verified", "rejected"].includes(body.status)) {
      updates.status = body.status;
    }

    if (typeof body.admin_notes === "string") {
      updates.admin_notes = body.admin_notes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("vendors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update vendor error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to update vendor" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, vendor: data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
