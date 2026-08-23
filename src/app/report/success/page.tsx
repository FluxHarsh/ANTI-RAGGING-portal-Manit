"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Lock, Copy, ExternalLink, AlertTriangle, ShieldCheck, Check } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const reportId = params.get("reportId") || "";
  const secretCode = params.get("secretCode") || "";
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  function copyAll() {
    navigator.clipboard.writeText(`Report ID: ${reportId}\nSecret Code: ${secretCode}`);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-8 text-center sm:px-6 sm:py-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-100">
          <CheckCircle2 className="text-lime-600" size={32} />
        </div>
        <h1 className="font-heading mt-5 text-3xl font-normal sm:text-5xl">Your Report Has Been Submitted</h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600">
          Your concern has been received successfully. Save the following details carefully to track your report later.
        </p>

        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 text-left sm:p-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-600">
            <Lock size={14} /> Save These Credentials
          </p>
          <p className="mt-1 text-sm text-gray-600">You will need both details to privately access your report.</p>

          <CredentialRow label="Report ID" value={reportId} onCopy={() => copy(reportId, "id")} copied={copied === "id"} />
          <div className="mt-3">
            <CredentialRow label="Secret Code" value={secretCode} onCopy={() => copy(secretCode, "secret")} copied={copied === "secret"} />
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14} /> Keep your Report ID and Secret Code private.
          </p>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-amber-700">
          <AlertTriangle size={16} className="shrink-0" />
          <span>This Secret Code may not be shown again. Please save it somewhere secure.</span>
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={copyAll}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 sm:w-auto"
          >
            <Copy size={16} /> {copiedAll ? "Copied!" : "Copy All Details"}
          </button>
          <Link
            href="/track"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-gray-50 sm:w-auto"
          >
            <ExternalLink size={16} /> Track My Report
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CredentialRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-mono text-base font-bold tracking-wide sm:text-lg break-all">{value}</p>
      </div>
      <button
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-lg border border-gray-200 bg-white p-2.5 hover:bg-gray-100 active:bg-gray-200"
      >
        {copied ? <Check size={16} className="text-lime-600" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
