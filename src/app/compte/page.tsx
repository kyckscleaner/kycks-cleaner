import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCurrentClient } from "@/lib/getCurrentClient";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";
import { ClientLogoutButton } from "@/components/ClientLogoutButton";
import { CopyReferralLink } from "@/components/CopyReferralLink";
import { ReviewForm } from "@/components/ReviewForm";
import { REFERRAL_DISCOUNT_PERCENT } from "@/lib/referral";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  DONE: "Terminé",
  CANCELLED: "Annulé",
};

export default async function ComptePage() {
  const client = await getCurrentClient();
  if (!client) redirect("/compte/connexion");

  const appointments = await prisma.appointment.findMany({
    where: { clientId: client.id },
    orderBy: { date: "desc" },
    include: { services: { include: { service: true } }, review: true },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const referralLink = `${baseUrl}/compte/inscription?ref=${client.referralCode}`;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white">
              Bonjour {client.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-white/50">{client.email}</p>
          </div>
          <ClientLogoutButton />
        </div>

        <section className="mt-8 rounded-2xl border border-[#a855f7]/30 bg-[#7c3aed]/10 p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
            Parrainage
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Partagez votre lien : vous et la personne parrainée recevez chacun{" "}
            <strong className="text-[#a855f7]">{REFERRAL_DISCOUNT_PERCENT}% de réduction</strong> sur
            votre prochain rendez-vous.
          </p>
          <div className="mt-4">
            <CopyReferralLink link={referralLink} />
          </div>
          {client.referralDiscountAvailable && (
            <p className="mt-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">
              🎉 Vous avez une réduction de {REFERRAL_DISCOUNT_PERCENT}% disponible — elle sera
              proposée automatiquement à votre prochaine réservation.
            </p>
          )}
          {client.referredById && client.referralBlockedReason && (
            <p className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
              Le parrainage associé à votre inscription n&apos;a pas pu être validé.
            </p>
          )}
          {client.anniversaryDiscountAvailable && (
            <p className="mt-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">
              🎉 1 an sur le site ! Vous avez une réduction de {REFERRAL_DISCOUNT_PERCENT}% disponible
              — elle sera proposée automatiquement à votre prochaine réservation.
            </p>
          )}
          {client.birthdayDiscountAvailable && (
            <p className="mt-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">
              🎂 Joyeux anniversaire ! Vous avez une réduction de {REFERRAL_DISCOUNT_PERCENT}% disponible
              — elle sera proposée automatiquement à votre prochaine réservation.
            </p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
            Mes rendez-vous
          </h2>
          <div className="mt-4 space-y-3">
            {appointments.length === 0 && (
              <p className="text-sm text-white/40">Aucun rendez-vous pour le moment.</p>
            )}
            {appointments.map((appt) => (
              <div key={appt.id} className="rounded-xl border border-white/10 bg-[#16141c] p-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-medium text-white">
                      {appt.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}{" "}
                      à {appt.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-sm text-white/50">
                      {appt.services.map((s) => s.service.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/60">{STATUS_LABELS[appt.status]}</span>
                    <span className="font-bold text-[#a855f7]">{centsToEuros(appt.totalCents)}</span>
                  </div>
                </div>
                {appt.status === "DONE" && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    {appt.review ? (
                      <p className="text-sm text-white/50">
                        Votre avis :{" "}
                        <span className="text-[#a855f7]">{"★".repeat(appt.review.rating)}</span>{" "}
                        {appt.review.published ? (
                          <span className="text-green-400">(publié)</span>
                        ) : (
                          <span className="text-white/30">(en attente de validation)</span>
                        )}
                      </p>
                    ) : (
                      <ReviewForm appointmentId={appt.id} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
