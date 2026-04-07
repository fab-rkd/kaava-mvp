import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const vendorId = formData.get("vendorId") as string | null;
    const docType = formData.get("docType") as string | null;

    if (!file || !vendorId || !docType) {
      return NextResponse.json(
        { success: false, message: "file, vendorId, and docType are required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only PDF, JPG, and PNG files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${vendorId}/${docType}/${Date.now()}_${sanitizedName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("vendor-docs")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Insert record into vendor_documents table
    const { error: dbError } = await supabase.from("vendor_documents").insert({
      vendor_id: vendorId,
      doc_type: docType,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    });

    if (dbError) {
      console.error("Document record insert error:", dbError);
      // Clean up uploaded file on DB failure
      await supabase.storage.from("vendor-docs").remove([filePath]);
      return NextResponse.json(
        { success: false, message: "Failed to save document record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, filePath }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
