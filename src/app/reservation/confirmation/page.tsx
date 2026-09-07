import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId?: string }>;
}) {
  const { appointmentId } = await searchParams;

  const appointment = appointmentId
    ? await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          services: { include: { service: true } },
          options: { include: { option: true } },
          client: true,
        },
      })
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#7c3aed]/20 text-3xl">
          ✅
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white">
          Réservation confirmée
        </h1>

        {appointment ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#16141c] p-6 text-left">
            <p className="font-semibold text-white">
              {appointment.date.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              à{" "}
              {appointment.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {[
                ...appointment.services.map((s) => s.service.name),
                ...appointment.options.map((o) => o.option.name),
              ].join(", ")}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {appointment.address}, {appointment.postalCode} {appointment.city}
            </p>
            <p className="mt-3 text-lg font-bold text-[#a855f7]">
              Total : {centsToEuros(appointment.totalCents)}
            </p>
            <p className="mt-4 text-sm text-white/40">
              Nous vous recontacterons à {appointment.client.email} ou par téléphone si besoin.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-white/60">Votre paiement a bien été enregistré.</p>
        )}

        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-6 py-3 font-semibold text-white"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
