import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminHeader from "@/components/AdminHeader";
import AdminReportsTable from "@/components/AdminReportsTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = supabaseAdmin();
  const { data: reports } = await db
    .from("reports")
    .select("id, public_report_id, category, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Report Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">All concerns submitted through the portal.</p>
        <AdminReportsTable reports={reports || []} />
      </main>
    </div>
  );
}
