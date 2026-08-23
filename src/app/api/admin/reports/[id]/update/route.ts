import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabaseServer";
import { REPORT_STATUSES } from "@/lib/status";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Confirm caller is an authenticated admin (middleware also covers this, defense in depth for the API route itself)
  const authClient = await supabaseServer();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const { status, message } = await req.json();

  if (!(REPORT_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  if (!message || message.trim().length < 5) {
    return NextResponse.json({ error: "Please write an update message." }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { error: updateErr } = await db
    .from("reports")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateErr) {
    return NextResponse.json({ error: "Failed to update report." }, { status: 500 });
  }

  const { error: insertErr } = await db.from("report_updates").insert({
    report_id: id,
    status,
    message: message.trim(),
  });

  if (insertErr) {
    return NextResponse.json({ error: "Failed to save update." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
