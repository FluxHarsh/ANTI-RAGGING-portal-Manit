"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    const supabase = supabaseBrowser();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />
      <main className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-8 sm:px-6 sm:py-0">
        <div className="w-full rounded-3xl border border-gray-100 bg-white p-6 text-center sm:p-8">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <ShieldCheck className="text-blue-600" size={26} />
            <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-lime-400" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Authorized Access</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the report management dashboard.</p>

          <div className="mt-6 space-y-4 text-left">
            <div>
              <label htmlFor="adminEmail" className="mb-1.5 block text-sm font-semibold">Email</label>
              <input
                id="adminEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="admin@college.edu"
                autoComplete="username"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="adminPassword" className="mb-1.5 block text-sm font-semibold">Password</label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
}
