import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabaseServer";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authClient = await supabaseServer();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const db = supabaseAdmin();

  const { data: report } = await db
    .from("reports")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  if (report.status !== "closed") {
    return NextResponse.json(
      { error: "Only closed (resolved) reports can be deleted." },
      { status: 400 }
    );
  }

  const { error } = await db.from("reports").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}