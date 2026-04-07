import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

const REQUIRED_FIELDS = [
  "business_name",
  "owner_name",
  "email",
  "phone",
  "business_type",
  "gst_number",
  "address_line1",
  "city",
  "state",
  "pincode",
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const errors: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || (typeof body[field] === "string" && !body[field].trim())) {
        errors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    }

    // Email format validation
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.email = "Invalid email format";
    }

    // Phone validation (10 digits)
    if (body.phone && !/^\d{10}$/.test(body.phone.replace(/[\s-]/g, ""))) {
      errors.phone = "Phone must be 10 digits";
    }

    // GST format validation (15 chars)
    if (body.gst_number && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/i.test(body.gst_number)) {
      errors.gst_number = "Invalid GST number format";
    }

    // Pincode validation
    if (body.pincode && !/^\d{6}$/.test(body.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("vendors")
      .insert({
        business_name: body.business_name.trim(),
        owner_name: body.owner_name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        business_type: body.business_type,
        gst_number: body.gst_number.trim().toUpperCase(),
        ayush_license_number: body.ayush_license_number?.trim() || null,
        fssai_number: body.fssai_number?.trim() || null,
        address_line1: body.address_line1.trim(),
        address_line2: body.address_line2?.trim() || null,
        city: body.city.trim(),
        state: body.state.trim(),
        pincode: body.pincode.trim(),
        website: body.website?.trim() || null,
        product_categories: body.product_categories || [],
        tier: body.tier || "standard",
        description: body.description?.trim() || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, errors: { email: "A vendor with this email already exists" } },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, vendorId: data.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
