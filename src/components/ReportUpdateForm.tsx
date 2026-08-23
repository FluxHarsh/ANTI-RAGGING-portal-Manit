"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronDown } from "lucide-react";
import { REPORT_STATUSES, STATUS_LABEL } from "@/lib/status";

export default function ReportUpdateForm({ reportId, currentStatus }: { reportId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setError("");
    setSuccess(false);
    if (message.trim().length < 5) return setError("Please write an update message.");

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setMessage("");
      setSuccess(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 sm:p-8">
      <p className="font-bold">Action Update</p>

      <div className="mt-4">
        <label htmlFor="updateStatus" className="mb-1.5 block text-sm font-semibold">Change Status</label>
        <div className="relative">
          <select
            id="updateStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:outline-none"
          >
            {REPORT_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="updateMessage" className="mb-1.5 block text-sm font-semibold">Update for Student</label>
        <textarea
          id="updateMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write an update that the reporter will be able to see..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
      {success && <p className="mt-3 rounded-lg bg-lime-50 px-4 py-3 text-sm text-lime-700">Update saved successfully.</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {saving && <Loader2 size={16} className="animate-spin" />}
        {saving ? "Saving..." : "Save Update"}
      </button>
    </div>
  );
}
