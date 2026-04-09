import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    // ── Map form payload → Supabase columns ─────────────────────────────
    const warehouseAddr = body.warehouseSameAsRegistered
      ? body.registeredAddress
      : (body.warehouseAddress || {});

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("vendors")
      .insert({
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
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, errors: { email: "A vendor with this email already exists" }, message: "Duplicate email." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Failed to submit application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Vendor submit error:", err);
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
