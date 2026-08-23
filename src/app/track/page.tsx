"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import ReportTimeline, { ReportData } from "@/components/ReportTimeline";

export default function TrackPage() {
  const [reportId, setReportId] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<ReportData | null>(null);

  function formatReportId(raw: string) {
    let v = raw.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (v && !v.startsWith("AR-")) {
      v = v.replace(/^AR-?/, "");
      v = "AR-" + v.replace(/-/g, "");
    }
    return v.slice(0, 9); // "AR-" + 6 chars
  }

  async function handleSubmit() {
    setError("");
    if (!reportId.trim() || !secretCode.trim()) {
      return setError("Both details are required to access your report.");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reports/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: reportId.trim(), secretCode: secretCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (report) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
          <ReportTimeline report={report} />
          <button
            onClick={() => setReport(null)}
            className="mt-4 rounded-lg px-2 py-1 text-sm font-medium text-blue-600 hover:underline active:text-blue-800"
          >
            ← Track a different report
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-8 sm:px-6 sm:py-0">
        <div className="w-full rounded-3xl border border-gray-100 bg-white p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Lock size={22} />
          </div>
          <h1 className="font-heading mt-4 text-3xl font-normal sm:text-4xl">Track Your Report</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the Report ID and Secret Code you received when submitting your concern.
          </p>

          <div className="mt-6 space-y-4 text-left">
            <div>
              <label htmlFor="trackReportId" className="mb-1.5 block text-sm font-semibold">Report ID</label>
              <input
                id="trackReportId"
                value={reportId}
                onChange={(e) => setReportId(formatReportId(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="AR-8F29K"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm tracking-wide focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="trackSecretCode" className="mb-1.5 block text-sm font-semibold">Secret Code</label>
              <div className="relative">
                <input
                  id="trackSecretCode"
                  type={showCode ? "text" : "password"}
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value.toUpperCase().slice(0, 10))}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter your secret code"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 font-mono text-sm tracking-wide focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  aria-label={showCode ? "Hide secret code" : "Show secret code"}
                  className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-600 active:text-gray-800"
                >
                  {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="animate-fade-in mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>View Report <ArrowRight size={16} /></>}
          </button>
          <p className="mt-3 text-xs text-gray-400">Both details are required to access your report.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
