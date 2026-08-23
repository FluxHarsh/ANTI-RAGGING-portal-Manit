"use client";

import { useState } from "react";

export default function EvidenceThumb({ url }: { url: string }) {
  const [broken, setBroken] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-xl border border-gray-200"
    >
      {broken ? (
        <div className="flex h-28 w-28 flex-col items-center justify-center gap-1 bg-gray-50 p-2 text-center text-xs text-gray-400">
          Link expired — refresh page
        </div>
      ) : (
        <img
          src={url}
          alt="Evidence"
          className="h-28 w-28 object-cover transition-transform group-hover:scale-105"
          onError={() => setBroken(true)}
        />
      )}
    </a>
  );
}
