"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, HelpCircle, Search, Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white transition-shadow ${
        scrolled ? "border-gray-100 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={20} />
          </span>
          <span className="hidden sm:block">
            <span className="font-heading block text-lg leading-tight text-gray-900">Anti-Ragging</span>
            <span className="font-accent block text-[11px] leading-tight text-gray-500">Support Portal</span>
          </span>
          <span className="font-heading block text-lg leading-tight text-gray-900 sm:hidden">Anti-Ragging Portal</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 sm:flex">
          <Link href="/#how-it-works" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            <HelpCircle size={16} /> How It Works
          </Link>
          <Link href="/track" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Search size={16} /> Track Report
          </Link>
          <Link href="/report" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Report a Concern
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link href="/report" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Report
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="animate-fade-in border-t border-gray-100 bg-white px-4 py-3 sm:hidden">
          <Link
            href="/#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <HelpCircle size={16} /> How It Works
          </Link>
          <Link
            href="/track"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Search size={16} /> Track Report
          </Link>
        </div>
      )}
    </header>
  );
}
