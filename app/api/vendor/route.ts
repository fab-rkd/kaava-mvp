import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// ── Rate limiting (in-memory for dev, use Redis/KV for production) ────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max submissions per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ── Max payload size check (10MB) ─────────────────────────────────────────
const MAX_BODY_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // ── Rate limiting ─────────────────────────────────────────────────
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // ── Payload size check ────────────────────────────────────────────
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { success: false, message: "Request too large." },
        { status: 413 }
      );
    }

    const body = await request.json();

    // ── Honeypot check ────────────────────────────────────────────────
    if (body._website_confirm) {
      // Bots fill hidden fields — reject silently with fake success
      return NextResponse.json({ success: true, id: "CV-0000-00000" }, { status: 201 });
    }

    // ── Server-side validation ──────────────────────────────────────────
    const errors: Record<string, string> = {};

    if (!body.businessName?.trim()) errors.businessName = "Business name is required";
    if (!body.businessType) errors.businessType = "Business type is required";
    if (!body.ownerName?.trim()) errors.ownerName = "Owner name is required";
    if (!body.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.email = "Invalid email format";
    }
    if (!body.mobile?.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(body.mobile)) {
      errors.mobile = "Mobile must be 10 digits";
    }

    // Address
    const addr = body.registeredAddress || {};
    if (!addr.addressLine?.trim()) errors["registeredAddress.addressLine"] = "Address is required";
    if (!addr.city?.trim()) errors["registeredAddress.city"] = "City is required";
    if (!addr.state) errors["registeredAddress.state"] = "State is required";
    if (!addr.pincode?.trim() || !/^\d{6}$/.test(addr.pincode)) {
      errors["registeredAddress.pincode"] = "Valid 6-digit pincode is required";
    }

    // Brand
    if (!body.brandName?.trim()) errors.brandName = "Brand name is required";
    if (!body.productType) errors.productType = "Product type is required";

    // Bank
    if (!body.accountHolderName?.trim()) errors.accountHolderName = "Account holder name is required";
    if (!body.accountNumber?.trim()) errors.accountNumber = "Account number is required";
    if (!body.ifscCode?.trim()) errors.ifscCode = "IFSC code is required";
    if (!body.accountType) errors.accountType = "Account type is required";

    // GSTIN format (optional field)
    if (body.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/i.test(body.gstin)) {
      errors.gstin = "Invalid GSTIN format";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: "Please fix the validation errors." }, { status: 400 });
    }

    // ── Generate human-friendly application ID ─────────────────────────
    const supabase = getServiceClient();

    const { count } = await supabase.from("vendors").select("id", { count: "exact", head: true });
    const nextNum = (count ?? 0) + 1;
    const year = new Date().getFullYear();
    const applicationId = `CV-${year}-${String(nextNum).padStart(5, "0")}`;

    // ── Map form payload → Supabase columns ─────────────────────────────
    const warehouseAddr = body.warehouseSameAsRegistered
      ? body.registeredAddress
      : (body.warehouseAddress || {});

    const { data, error } = await supabase
      .from("vendors")
      .insert({
        application_id: applicationId,
        business_name: body.businessName.trim(),
        business_type: body.businessType,
        owner_name: body.ownerName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.mobile.trim(),
        alt_phone: body.alternateContact?.trim() || null,

        registered_address: addr.addressLine.trim(),
        registered_city: addr.city.trim(),
        registered_state: addr.state,
        registered_pincode: addr.pincode.trim(),

        warehouse_same_as_registered: !!body.warehouseSameAsRegistered,
        warehouse_address: warehouseAddr.addressLine?.trim() || null,
        warehouse_city: warehouseAddr.city?.trim() || null,
        warehouse_state: warehouseAddr.state || null,
        warehouse_pincode: warehouseAddr.pincode?.trim() || null,

        brand_name: body.brandName.trim(),
        product_categories: body.productCategories || [],
        estimated_products: body.estimatedProducts || null,
        business_description: body.businessDescription?.trim() || null,
        website: body.websiteUrl?.trim() || null,
        social_links: Array.isArray(body.socialMediaLinks)
          ? body.socialMediaLinks.filter(Boolean).join(", ")
          : (body.socialMediaLinks || null),

        product_type: body.productType || null,
        other_category: body.otherCategory?.trim() || null,

        gstin: body.gstin?.trim().toUpperCase() || null,
        fssai_number: body.fssaiLicense?.trim() || null,

        account_holder_name: body.accountHolderName?.trim() || null,
        bank_name: body.bankName?.trim() || null,
        branch_name: body.branchName?.trim() || null,
        account_number: body.accountNumber?.trim() || null,
        ifsc_code: body.ifscCode?.trim().toUpperCase() || null,
        account_type: body.accountType || null,

        consent_accepted: true,
        consent_timestamp: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // Handle unique constraint violations
      if (error.code === "23505") {
        const detail = error.message || "";
        if (detail.includes("email")) {
          return NextResponse.json(
            { success: false, errors: { email: "A vendor with this email already exists" }, message: "This email is already registered." },
            { status: 400 }
          );
        }
        if (detail.includes("phone")) {
          return NextResponse.json(
            { success: false, errors: { mobile: "A vendor with this mobile number already exists" }, message: "This phone number is already registered." },
            { status: 400 }
          );
        }
        if (detail.includes("gstin")) {
          return NextResponse.json(
            { success: false, errors: { gstin: "A vendor with this GSTIN already exists" }, message: "This GSTIN is already registered." },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { success: false, message: "A vendor with these details already exists." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Failed to submit application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: applicationId }, { status: 201 });
  } catch (err) {
    console.error("Vendor submit error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
