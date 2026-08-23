"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, Inbox } from "lucide-react";
import { STATUS_LABEL, STATUS_BADGE, formatShortDate } from "@/lib/status";

type Report = {
  id: string;
  public_report_id: string;
  category: string;
  status: string;
  created_at: string;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "action_taken", label: "Action Taken" },
  { key: "closed", label: "Closed" },
];

export default function AdminReportsTable({ reports }: { reports: Report[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

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

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3">
        {/* Filter pills — horizontally scrollable on mobile */}
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

        {/* Search */}
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
                <li key={r.id}>
                  <Link
                    href={`/admin/reports/${r.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-bold">{r.public_report_id}</p>
                      <p className="truncate text-sm text-gray-500">{r.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatShortDate(r.created_at)}
                      </span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-3 sm:hidden">
            {filtered.map((r) => (
              <Link
                key={r.id}
                href={`/admin/reports/${r.id}`}
                className="block rounded-2xl border border-gray-100 bg-white p-4 active:bg-gray-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-sm font-bold">{r.public_report_id}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="truncate text-sm text-gray-500">{r.category}</p>
                  <p className="shrink-0 text-xs text-gray-400">
                    {formatShortDate(r.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
