"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={20} />
          </span>
          <span>
            <span className="block text-sm font-bold leading-tight">Admin Dashboard</span>
            <span className="block text-xs text-gray-500 leading-tight">Anti-Ragging Support Portal</span>
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
