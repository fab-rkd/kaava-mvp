import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const docType = formData.get("type") as string | null;

    if (!file || !docType) {
      return NextResponse.json(
        { success: false, message: "file and type are required" },
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

    // Use a temp folder — files get associated with vendor after creation
    // Timestamp + random suffix ensures no collisions even with identical filenames
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const rand = Math.random().toString(36).slice(2, 8);
    const filePath = `pending/${docType}/${Date.now()}_${rand}_${sanitizedName}`;

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

    return NextResponse.json({
      success: true,
      filePath,
      filename: file.name,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
