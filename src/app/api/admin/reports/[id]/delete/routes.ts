import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify the requester is an authenticated admin
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = supabaseAdmin();

  // Only allow deletion of closed reports
  const { data: report } = await db
    .from("reports")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  if (report.status !== "closed") {
    return NextResponse.json(
      { error: "Only closed (resolved) reports can be deleted." },
      { status: 400 }
    );
  }

  const { error } = await db.from("reports").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}