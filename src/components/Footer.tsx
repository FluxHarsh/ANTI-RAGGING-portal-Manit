import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-500 sm:flex-row sm:px-6">
        <span className="font-heading text-base text-gray-700">
          Anti-Ragging Support Portal
        </span>
        <span className="font-accent flex items-center gap-1.5 text-xs">
          <ShieldCheck size={14} /> Built for safer campuses
        </span>
      </div>
      <div className="border-t border-gray-100 py-3 text-center">
        <span className="font-credit text-xs text-gray-400">
          Designed and Developed by{" "}
          <a
            href="https://github.com/FluxHarsh"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-600 underline underline-offset-2 transition-colors hover:text-gray-900"
          >
            Harsh Jagtap
          </a>
        </span>
      </div>
    </footer>
  );
}
