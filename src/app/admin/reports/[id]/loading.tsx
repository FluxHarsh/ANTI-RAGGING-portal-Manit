export default function ReportDetailLoading() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="h-9 w-40 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-5 h-64 animate-pulse rounded-3xl border border-gray-100 bg-white" />
        <div className="mt-5 h-48 animate-pulse rounded-3xl border border-gray-100 bg-white" />
      </main>
    </div>
  );
}
