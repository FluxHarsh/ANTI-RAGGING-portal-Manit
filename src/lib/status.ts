// Single source of truth for report status labels, colors, and the valid enum —
// was previously duplicated across ReportTimeline, AdminReportsTable, and ReportUpdateForm.

export const REPORT_STATUSES = ["submitted", "under_review", "action_taken", "closed"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  action_taken: "Action Taken",
  closed: "Closed",
};

export const STATUS_BADGE: Record<string, string> = {
  submitted: "bg-gray-100 text-gray-700",
  under_review: "bg-amber-50 text-amber-700",
  action_taken: "bg-lime-100 text-lime-800",
  closed: "bg-blue-50 text-blue-700",
};

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
