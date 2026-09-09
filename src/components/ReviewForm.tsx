"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating === 0) {
      setError("Choisissez une note");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/client/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId, rating, comment }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'envoi de l'avis");
      return;
    }
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-[#a855f7]/40 px-3 py-1.5 text-sm font-medium text-[#c084fc] hover:bg-[#7c3aed]/10"
      >
        Laisser un avis
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-2xl leading-none"
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          >
            <span className={n <= (hoverRating || rating) ? "text-[#a855f7]" : "text-white/20"}>★</span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre expérience avec Kycks Cleaner..."
        rows={3}
        className="mt-3 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Envoi..." : "Envoyer l'avis"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
