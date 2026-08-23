import { Lock, CheckCircle2, Clock, CheckCircle, Info } from "lucide-react";
import { STATUS_LABEL, STATUS_BADGE, formatDateTime } from "@/lib/status";

export type ReportData = {
  reportId: string;
  category: string;
  status: string;
  submittedAt: string;
  updates: { status: string; message: string; created_at: string }[];
};

export default function ReportTimeline({ report }: { report: ReportData }) {
  const lastIdx = report.updates.length - 1;

  return (
    <div>
      <p className="flex items-center gap-2 text-sm text-blue-600">
        <Lock size={14} /> Private report tracking
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Report {report.reportId}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[report.status]}`}>
          {STATUS_LABEL[report.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">Submitted on {formatDateTime(report.submittedAt)}</p>

      <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Clock size={16} />
          </span>
          <div>
            <p className="font-bold">Report updates</p>
            <p className="text-sm text-gray-500">Public updates from the Student Council</p>
          </div>
        </div>

        <ul className="mt-5 space-y-5">
          {report.updates.map((u, i) => {
            const isLast = i === lastIdx;
            return (
              <li
                key={i}
                className={`relative pl-9 ${isLast ? "rounded-2xl bg-lime-50 p-4" : ""}`}
              >
                <span
                  className={`absolute left-4 top-4 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full ${
                    isLast ? "bg-lime-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isLast ? <CheckCircle size={13} /> : <CheckCircle2 size={13} />}
                </span>
                <div className="flex items-center justify-between">
                  <p className={`font-bold ${isLast ? "text-lime-800" : ""}`}>{STATUS_LABEL[u.status]}</p>
                  {isLast && <span className="text-xs font-bold uppercase text-lime-700">Latest Update</span>}
                </div>
                <p className="text-xs text-gray-500">{formatDateTime(u.created_at)}</p>
                <p className={`mt-1 text-sm ${isLast ? "text-lime-900" : "text-gray-700"}`}>{u.message}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-600">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>
          These updates are written for you and do not include internal investigation details. Keep your Report ID
          and Secret Code private.
        </span>
      </div>
    </div>
  );
}
