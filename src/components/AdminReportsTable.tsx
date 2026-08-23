"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, Inbox, Trash2, X, AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { STATUS_LABEL, STATUS_BADGE, formatShortDate } from "@/lib/status";

type Report = {
  id: string;
  public_report_id: string;
  category: string;
  status: string;
  created_at: string;
};

type DeleteState =
  | { phase: "idle" }
  | { phase: "confirm"; report: Report }
  | { phase: "blocked"; report: Report }
  | { phase: "deleting"; report: Report }
  | { phase: "error"; report: Report; message: string };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "action_taken", label: "Action Taken" },
  { key: "closed", label: "Closed" },
];

export default function AdminReportsTable({ reports: initial }: { reports: Report[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [reports, setReports] = useState(initial);
  const [del, setDel] = useState<DeleteState>({ phase: "idle" });

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: reports.length };
    for (const r of reports) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  }, [reports]);

  const filtered = useMemo(() => {
    let list = filter === "all" ? reports : reports.filter((r) => r.status === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) => r.public_report_id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reports, filter, query]);

  const requestDelete = useCallback((e: React.MouseEvent, report: Report) => {
    e.preventDefault();
    e.stopPropagation();
    if (report.status !== "closed") {
      setDel({ phase: "blocked", report });
    } else {
      setDel({ phase: "confirm", report });
    }
  }, []);

  const closeModal = useCallback(() => setDel({ phase: "idle" }), []);

  const confirmDelete = useCallback(async () => {
    if (del.phase !== "confirm") return;
    const report = del.report;
    setDel({ phase: "deleting", report });

    try {
      const res = await fetch(`/api/admin/reports/${report.id}/delete`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      // Optimistic removal from local list
      setReports((prev) => prev.filter((r) => r.id !== report.id));
      setDel({ phase: "idle" });
      router.refresh();
    } catch (e) {
      setDel({ phase: "error", report, message: e instanceof Error ? e.message : "Something went wrong." });
    }
  }, [del, router]);

  return (
    <div className="mt-6">
      {/* ── Delete modal ─────────────────────────────────────── */}
      {del.phase !== "idle" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">

            {/* BLOCKED — not closed yet */}
            {del.phase === "blocked" && (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                  <AlertTriangle size={22} className="text-amber-500" />
                </div>
                <h2 className="mt-4 text-center text-lg font-bold text-gray-900">Cannot Delete Yet</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Report <span className="font-mono font-bold">{del.report.public_report_id}</span> is currently{" "}
                  <span className="font-semibold">
                    {STATUS_LABEL[del.report.status]}
                  </span>
                  .
                </p>
                <p className="mt-2 text-center text-sm text-gray-600">
                  A report must be marked <span className="font-semibold text-blue-700">Closed</span> before it can be deleted. Please resolve and close it first.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Go Back
                  </button>
                  <Link
                    href={`/admin/reports/${del.report.id}`}
                    onClick={closeModal}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Open Report
                  </Link>
                </div>
              </>
            )}

            {/* CONFIRM deletion */}
            {(del.phase === "confirm" || del.phase === "deleting") && (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <Trash2 size={22} className="text-red-500" />
                </div>
                <h2 className="mt-4 text-center text-lg font-bold text-gray-900">Delete Report?</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  You're about to permanently delete report{" "}
                  <span className="font-mono font-bold">{del.report.public_report_id}</span>.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-2">
                  <ShieldCheck size={15} className="text-green-600" />
                  <span className="text-xs font-medium text-green-800">This report is Closed / Resolved ✓</span>
                </div>
                <p className="mt-3 text-center text-xs text-gray-400">This action cannot be undone.</p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={closeModal}
                    disabled={del.phase === "deleting"}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={del.phase === "deleting"}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {del.phase === "deleting" && <Loader2 size={15} className="animate-spin" />}
                    {del.phase === "deleting" ? "Deleting…" : "Yes, Delete"}
                  </button>
                </div>
              </>
            )}

            {/* ERROR */}
            {del.phase === "error" && (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <X size={22} className="text-red-500" />
                </div>
                <h2 className="mt-4 text-center text-lg font-bold text-gray-900">Delete Failed</h2>
                <p className="mt-2 text-center text-sm text-gray-600">{del.message}</p>
                <button
                  onClick={closeModal}
                  className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Filters + Search ────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 pb-1" style={{ minWidth: "max-content" }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium ${
                  filter === f.key
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {f.label}
                {counts[f.key] > 0 && (
                  <span className={filter === f.key ? "text-blue-100" : "text-gray-400"}>{counts[f.key]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64 sm:self-end">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID or category"
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* ── List ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <Inbox size={28} className="text-gray-300" />
          <p className="text-sm text-gray-500">
            {query ? "No reports match your search." : "No reports in this category."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-gray-100 bg-white sm:block">
            <ul className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <li key={r.id} className="group flex items-center gap-2 pr-3 hover:bg-gray-50">
                  <Link
                    href={`/admin/reports/${r.id}`}
                    className="flex flex-1 items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-bold">{r.public_report_id}</p>
                      <p className="truncate text-sm text-gray-500">{r.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span className="text-xs text-gray-400">{formatShortDate(r.created_at)}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </Link>
                  {/* Delete button — visible on row hover */}
                  <button
                    onClick={(e) => requestDelete(e, r)}
                    aria-label={`Delete report ${r.public_report_id}`}
                    title="Delete report"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-3 sm:hidden">
            {filtered.map((r) => (
              <div key={r.id} className="relative rounded-2xl border border-gray-100 bg-white">
                <Link
                  href={`/admin/reports/${r.id}`}
                  className="block p-4 active:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2 pr-8">
                    <p className="font-mono text-sm font-bold">{r.public_report_id}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <p className="truncate text-sm text-gray-500">{r.category}</p>
                    <p className="shrink-0 text-xs text-gray-400">{formatShortDate(r.created_at)}</p>
                  </div>
                </Link>
                {/* Delete button — absolute top-right on mobile */}
                <button
                  onClick={(e) => requestDelete(e, r)}
                  aria-label={`Delete report ${r.public_report_id}`}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}