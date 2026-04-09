import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(code.toUpperCase())) {
    return NextResponse.json({ error: "Invalid IFSC code" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://ifsc.razorpay.com/${code.toUpperCase()}`);
    if (!res.ok) {
      return NextResponse.json({ error: "IFSC code not found" }, { status: 404 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to lookup IFSC" }, { status: 500 });
  }
}
