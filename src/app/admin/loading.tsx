export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="h-9 w-40 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white border border-gray-100" />
          ))}
        </div>
      </main>
    </div>
  );
}
