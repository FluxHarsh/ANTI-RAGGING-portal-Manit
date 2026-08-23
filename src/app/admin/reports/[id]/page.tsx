import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminHeader from "@/components/AdminHeader";
import ReportUpdateForm from "@/components/ReportUpdateForm";
import EvidenceThumb from "@/components/EvidenceThumb";

export const dynamic = "force-dynamic";

export default async function AdminReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseAdmin();

  const { data: report } = await db
    .from("reports")
    .select("id, public_report_id, category, description, location, incident_date, status, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!report) return notFound();

  const [{ data: evidence }, { data: updates }] = await Promise.all([
    db.from("report_evidence").select("id, file_path").eq("report_id", id),
    db.from("report_updates").select("status, message, created_at").eq("report_id", id).order("created_at", { ascending: false }),
  ]);

  let evidenceUrls: { id: string; url: string }[] = [];
  if (evidence && evidence.length > 0) {
    const { data: signedList } = await db.storage
      .from("report-evidence")
      .createSignedUrls(evidence.map((e) => e.file_path), 300);

    evidenceUrls = (signedList || [])
      .map((s, i) => ({ id: evidence[i].id, url: s.signedUrl || "" }))
      .filter((e) => e.url);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <AdminHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 rounded-lg text-sm text-gray-500 hover:text-gray-800 active:text-gray-900">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <h1 className="mt-3 text-xl font-extrabold sm:text-3xl">Report {report.public_report_id}</h1>

        <div className="mt-5 space-y-5 rounded-3xl border border-gray-100 bg-white p-5 sm:p-8">
          <Field label="Category" value={report.category} />
          <Field label="Description" value={report.description} multiline />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Location" value={report.location || "Not provided"} />
            <Field
              label="Incident Date"
              value={report.incident_date ? new Date(report.incident_date).toLocaleDateString("en-IN") : "Not provided"}
            />
          </div>

          {evidenceUrls.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">Evidence</p>
              <div className="flex flex-wrap gap-3">
                {evidenceUrls.map((ev) => (
                  <EvidenceThumb key={ev.id} url={ev.url} />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-400">Links expire after 5 minutes for security — refresh the page to renew them.</p>
            </div>
          )}
        </div>

        <ReportUpdateForm reportId={report.id} currentStatus={report.status} />

        {updates && updates.length > 0 && (
          <div className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 sm:p-8">
            <p className="text-sm font-semibold">Update History</p>
            <ul className="mt-3 space-y-3">
              {updates.map((u, i) => (
                <li key={i} className="border-l-2 border-gray-100 pl-4">
                  <p className="text-xs text-gray-400">{new Date(u.created_at).toLocaleString("en-IN")}</p>
                  <p className="text-sm text-gray-700">{u.message}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className={`mt-1 text-sm text-gray-900 ${multiline ? "whitespace-pre-wrap" : ""}`}>{value}</p>
    </div>
  );
}
