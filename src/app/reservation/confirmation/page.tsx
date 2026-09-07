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
        include: { services: { include: { service: true } }, client: true },
      })
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✅
        </div>
        <h1 className="mt-6 text-3xl font-bold text-slate-900">Réservation confirmée</h1>

        {appointment ? (
          <div className="mt-8 rounded-2xl border border-slate-200 p-6 text-left">
            <p className="font-semibold text-slate-900">
              {appointment.date.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              à{" "}
              {appointment.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {appointment.services.map((s) => s.service.name).join(", ")}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {appointment.address}, {appointment.postalCode} {appointment.city}
            </p>
            <p className="mt-3 text-lg font-bold text-[#0b3d91]">
              Total : {centsToEuros(appointment.totalCents)}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Nous vous recontacterons à {appointment.client.email} ou par téléphone si besoin.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-slate-600">
            Votre paiement a bien été enregistré. Vous recevrez une confirmation par email.
          </p>
        )}

        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-[#0b3d91] px-6 py-3 font-semibold text-white"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
