"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Info, Paperclip, UploadCloud, X, Loader2, ChevronDown, ImageIcon } from "lucide-react";

const CATEGORIES = ["Ragging", "Harassment", "Intimidation / Threat", "Forced Activity", "Verbal Abuse", "Other"];
const MAX_DESC = 2000;

type FileItem = { file: File; previewUrl: string };

export default function ReportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [items, setItems] = useState<FileItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ category?: boolean; description?: boolean }>({});

  useEffect(() => {
    return () => items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(list: FileList | File[]) {
    setError("");
    const incoming = Array.from(list);
    const room = 2 - items.length;
    if (room <= 0) {
      setError("You can attach at most 2 files. Remove one to add another.");
      return;
    }
    const accepted: FileItem[] = [];
    for (const f of incoming.slice(0, room)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        setError("Only JPG, PNG or WEBP images are allowed.");
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        setError("Each file must be under 5MB.");
        continue;
      }
      accepted.push({ file: f, previewUrl: URL.createObjectURL(f) });
    }
    if (accepted.length) setItems((prev) => [...prev, ...accepted]);
  }

  function removeItem(idx: number) {
    setItems((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  async function handleSubmit() {
    setError("");
    setTouched({ category: true, description: true });
    if (!category) return setError("Please select a concern type.");
    if (description.trim().length < 10) return setError("Please describe what happened (at least 10 characters).");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("category", category);
      fd.append("description", description.trim());
      if (location) fd.append("location", location);
      if (incidentDate) fd.append("incidentDate", incidentDate);
      items.forEach((it) => fd.append("evidence", it.file));

      const res = await fetch("/api/reports", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");

      const params = new URLSearchParams({ reportId: data.reportId, secretCode: data.secretCode });
      router.push(`/report/success?${params.toString()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  const descCount = description.length;
  const descNearLimit = descCount > MAX_DESC * 0.9;

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg text-sm text-gray-500 hover:text-gray-800 active:text-gray-900"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="font-heading mt-3 text-3xl font-normal sm:text-5xl">Report a Concern</h1>
        <p className="mt-2 text-gray-600">
          You can submit this report without providing your name, email, phone number, or roll number.
        </p>

        <div className="mt-5 flex gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
          <Info size={18} className="mt-0.5 shrink-0" />
          <span>To help protect your anonymity, avoid including personal information about yourself unless necessary.</span>
        </div>

        <div className="mt-6 space-y-5 rounded-3xl border border-gray-100 bg-white p-5 sm:p-8">
          {/* Category */}
          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-semibold">
              Concern Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, category: true }))}
                className={`w-full appearance-none rounded-xl border bg-gray-50 px-4 py-3 pr-10 text-sm focus:outline-none ${
                  touched.category && !category ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-blue-500"
                }`}
              >
                <option value="">Select the type of concern</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {touched.category && !category && <p className="mt-1 text-xs text-red-500">Please select a concern type.</p>}
          </div>

          {/* Description */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="description" className="block text-sm font-semibold">
                Describe What Happened <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs ${descNearLimit ? "text-amber-600" : "text-gray-400"}`}>
                {descCount}/{MAX_DESC}
              </span>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              rows={5}
              placeholder="Describe the situation and include relevant details such as what happened, where, and when."
              className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm focus:outline-none ${
                touched.description && description.trim().length < 10
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {touched.description && description.trim().length < 10 && (
              <p className="mt-1 text-xs text-red-500">Please add a bit more detail (at least 10 characters).</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="mb-1.5 block text-sm font-semibold">
              Location <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hostel Block C"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="incidentDate" className="mb-1.5 block text-sm font-semibold">
              Date of Incident <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="incidentDate"
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Evidence */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-semibold">
                Add Evidence <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <Paperclip size={16} className="text-gray-400" />
            </div>
            <p className="mb-2 text-sm text-gray-500">Screenshots can help us understand your concern.</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />

            {items.length > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-3">
                {items.map((it, i) => (
                  <div key={i} className="animate-fade-in group relative overflow-hidden rounded-xl border border-gray-200">
                    <img src={it.previewUrl} alt="" className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 active:bg-black"
                    >
                      <X size={14} />
                    </button>
                    <p className="truncate bg-white px-2 py-1 text-[11px] text-gray-500">{it.file.name}</p>
                  </div>
                ))}
              </div>
            )}

            {items.length < 2 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl px-4 py-6 text-white sm:py-8 ${
                  dragActive ? "bg-blue-700 ring-4 ring-blue-200" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }`}
              >
                {dragActive ? <ImageIcon size={22} /> : <UploadCloud size={22} />}
                <span className="text-sm font-semibold text-center">
                  {dragActive ? "Drop to upload" : "Tap to upload screenshots"}
                </span>
                <span className="text-xs text-blue-100">JPG, PNG or WEBP · Max 5MB each · Up to 2 files</span>
              </button>
            )}
          </div>

          {error && (
            <p className="animate-fade-in rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
