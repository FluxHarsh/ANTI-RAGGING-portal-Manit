import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySecretCode } from "@/lib/ids";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`track:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { reportId, secretCode } = await req.json();
    if (!reportId || !secretCode) {
      return NextResponse.json({ error: "Report ID and Secret Code are required." }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data: report } = await db
      .from("reports")
      .select("id, public_report_id, category, status, created_at, secret_code_hash")
      .eq("public_report_id", reportId.trim().toUpperCase())
      .maybeSingle();

    // Same generic error whether ID doesn't exist or code is wrong — don't leak which one failed.
    if (!report) {
      return NextResponse.json({ error: "Invalid Report ID or Secret Code." }, { status: 401 });
    }

    const valid = await verifySecretCode(secretCode.trim().toUpperCase(), report.secret_code_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid Report ID or Secret Code." }, { status: 401 });
    }

    const { data: updates } = await db
      .from("report_updates")
      .select("status, message, created_at")
      .eq("report_id", report.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      reportId: report.public_report_id,
      category: report.category,
      status: report.status,
      submittedAt: report.created_at,
      updates: updates || [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
