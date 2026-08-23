import Link from "next/link";
import { ShieldQuestion, ArrowRight, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f8]">
      <Header />
      <main className="mx-auto flex flex-1 max-w-md flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <ShieldQuestion size={30} />
        </div>
        <h1 className="font-heading mt-5 text-4xl font-normal">Page Not Found</h1>
        <p className="mt-2 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Home <ArrowRight size={16} />
          </Link>
          <Link
            href="/track"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-gray-50"
          >
            <Search size={16} /> Track My Report
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
