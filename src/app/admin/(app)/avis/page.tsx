import { prisma } from "@/lib/prisma";
import { ReviewModeration } from "@/components/admin/ReviewModeration";

export default async function AdminAvisPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
        Avis clients
      </h1>
      <p className="mt-1 text-sm text-white/50">
        Les avis publiés apparaissent sur la page d&apos;accueil. Les nouveaux avis doivent être
        validés avant publication.
      </p>

      <div className="mt-6 space-y-3">
        {reviews.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-[#16141c] px-4 py-8 text-center text-white/30">
            Aucun avis pour le moment.
          </p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-white/10 bg-[#16141c] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-medium text-white">{review.client.name}</span>{" "}
                <span className="text-[#a855f7]">{"★".repeat(review.rating)}</span>
                <span className="text-white/20">{"★".repeat(5 - review.rating)}</span>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  review.published ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-300"
                }`}
              >
                {review.published ? "Publié" : "En attente"}
              </span>
            </div>
            <p className="mt-2 text-sm text-white/70">{review.comment}</p>
            <p className="mt-1 text-xs text-white/30">
              {review.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="mt-3">
              <ReviewModeration reviewId={review.id} published={review.published} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
