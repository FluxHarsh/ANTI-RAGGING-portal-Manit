import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroAnimation from "@/components/HeroAnimation";
import { Lock, Send, KeyRound, Activity, ArrowRight, UserX, IdCard, EyeOff } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Left: copy */}
            <div>
              <h1 className="font-heading text-5xl font-normal leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                A Safe Space to Raise Your Concerns.
              </h1>

              <p className="mt-5 max-w-xl text-base text-gray-600 sm:text-lg">
                Confidentially report concerns related to ragging, harassment, intimidation, or forced
                activities. No login or personal details are required.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/report"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                >
                  Report a Concern <ArrowRight size={16} />
                </Link>
                <Link
                  href="/track"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:-translate-y-0.5 hover:bg-gray-50"
                >
                  Track My Report
                </Link>
              </div>
            </div>

            {/* Right: lottie animation */}
            <div className="relative pb-10">
              <div className="relative overflow-hidden rounded-[2rem] bg-gray-50">
                <div className="mx-auto aspect-square w-full max-w-sm p-3 sm:max-w-md">
                  <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
                    <HeroAnimation />
                  </div>
                </div>
              </div>

              {/* Floating privacy card, anchored to the bottom edge of the animation */}
              <div className="absolute -bottom-2 left-6 right-6 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:left-8 sm:right-auto sm:w-64">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Lock size={16} />
                  </span>
                  <span className="rounded-full bg-lime-100 px-2 py-0.5 text-[11px] font-medium text-lime-800">
                    Private
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900">Your privacy comes first</h3>
                <p className="mt-1 text-xs text-gray-600">
                  No account, name, email, or roll number needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust points */}
        <div className="mt-4 grid gap-3 rounded-3xl border border-gray-100 bg-white p-6 sm:grid-cols-3 sm:p-8">
          <TrustPoint icon={<UserX size={18} />} text="No login required" />
          <TrustPoint icon={<IdCard size={18} />} text="Personal details not required" />
          <TrustPoint icon={<EyeOff size={18} />} text="Track your report privately" />
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mt-4 rounded-3xl border border-gray-100 bg-white p-6 sm:p-10">
          <p className="font-accent text-base text-blue-600">Simple by design</p>
          <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <h2 className="font-heading text-4xl font-normal text-gray-900 sm:text-5xl">How It Works</h2>
            <p className="max-w-xs text-sm text-gray-500 sm:text-right">
              Three straightforward steps to share a concern and stay informed.
            </p>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <Step n="01" icon={<Send size={18} />} title="Submit" text="Share your concern and optionally attach relevant screenshots." />
            <Step n="02" icon={<KeyRound size={18} />} title="Save Your Credentials" text="Receive a unique Report ID and Secret Code." />
            <Step n="03" icon={<Activity size={18} />} title="Track Updates" text="Use your credentials later to check the status and updates." />
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-blue-600 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading text-2xl font-normal text-white">Already submitted a report?</h3>
              <p className="text-sm text-blue-100">Use your Report ID and Secret Code to see the latest updates.</p>
            </div>
            <Link
              href="/track"
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Track My Report <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TrustPoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-50 text-lime-700">{icon}</span>
      <span className="text-sm font-medium text-gray-800">{text}</span>
    </div>
  );
}

function Step({ n, icon, title, text }: { n: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-accent text-2xl leading-none text-blue-600">{n}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">{icon}</span>
      </div>
      <h4 className="mt-3 font-bold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
    </div>
  );
}