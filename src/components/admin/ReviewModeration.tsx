"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewModeration({ reviewId, published }: { reviewId: string; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function togglePublished() {
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setLoading(false);
    router.refresh();
  }

  async function deleteReview() {
    if (!confirm("Supprimer définitivement cet avis ?")) return;
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={togglePublished}
        disabled={loading}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
          published
            ? "border border-white/15 text-white/70 hover:bg-white/5"
            : "bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white"
        }`}
      >
        {published ? "Dépublier" : "Publier"}
      </button>
      <button
        onClick={deleteReview}
        disabled={loading}
        className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
      >
        Supprimer
      </button>
    </div>
  );
}
