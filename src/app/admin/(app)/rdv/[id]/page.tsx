import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";
import { AppointmentActions } from "@/components/admin/AppointmentActions";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CARTE_EN_LIGNE: "Carte en ligne",
  ESPECES: "Espèces",
  VIREMENT: "Virement",
  CHEQUE: "Chèque",
  CARTE_SUR_PLACE: "Carte sur place",
};

export default async function AdminRdvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      client: true,
      services: { include: { service: true } },
      options: { include: { option: true } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!appointment) notFound();

  const paidCents = appointment.payments
    .filter((p) => p.status === "PAYE")
    .reduce((sum, p) => sum + p.amountCents, 0);
  const remainingCents = Math.max(appointment.totalCents - paidCents, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
        Rendez-vous du {appointment.date.toLocaleDateString("fr-FR")}
      </h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">Client</h2>
          <p className="mt-2 text-sm text-white/80">{appointment.client.name}</p>
          <p className="text-sm text-white/50">{appointment.client.email}</p>
          <p className="text-sm text-white/50">{appointment.client.phone}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Lieu d&apos;intervention
          </h2>
          <p className="mt-2 text-sm text-white/80">{appointment.address}</p>
          <p className="text-sm text-white/50">
            {appointment.postalCode} {appointment.city}
          </p>
          {appointment.vehicleInfo && (
            <p className="mt-2 text-sm text-white/50">Véhicule : {appointment.vehicleInfo}</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#16141c] p-6">
        <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">Prestations</h2>
        <ul className="mt-2 space-y-1 text-sm text-white/80">
          {appointment.services.map((s) => (
            <li key={s.id} className="flex justify-between">
              <span>{s.service.name}</span>
              <span>{centsToEuros(s.priceCents)}</span>
            </li>
          ))}
          {appointment.options.map((o) => (
            <li key={o.id} className="flex justify-between text-white/50">
              <span>+ {o.option.name}</span>
              <span>{centsToEuros(o.priceCents)}</span>
            </li>
          ))}
        </ul>
        {appointment.discountCents > 0 && (
          <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm text-green-400">
            <span>Réduction (parrainage / anniversaire)</span>
            <span>-{centsToEuros(appointment.discountCents)}</span>
          </div>
        )}
        <div className={`flex justify-between font-bold text-white ${appointment.discountCents > 0 ? "mt-1" : "mt-3 border-t border-white/10 pt-3"}`}>
          <span>Total</span>
          <span>{centsToEuros(appointment.totalCents)}</span>
        </div>
        {appointment.notes && (
          <p className="mt-3 text-sm text-white/50">Notes : {appointment.notes}</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#16141c] p-6">
        <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">Paiements</h2>
        <div className="mt-2 flex gap-6 text-sm">
          <p className="text-white/70">
            Payé : <span className="font-semibold text-green-400">{centsToEuros(paidCents)}</span>
          </p>
          <p className="text-white/70">
            Restant dû :{" "}
            <span className="font-semibold text-amber-400">{centsToEuros(remainingCents)}</span>
          </p>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-white/60">
          {appointment.payments.map((p) => (
            <li key={p.id} className="flex justify-between">
              <span>
                {PAYMENT_METHOD_LABELS[p.method]} — {p.status === "PAYE" ? "payé" : "en attente"}
              </span>
              <span>{centsToEuros(p.amountCents)}</span>
            </li>
          ))}
          {appointment.payments.length === 0 && <li className="text-white/30">Aucun paiement enregistré.</li>}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#16141c] p-6">
        <AppointmentActions
          appointmentId={appointment.id}
          currentStatus={appointment.status}
          currentDate={appointment.date.toISOString()}
          remainingCents={remainingCents}
        />
      </div>
    </div>
  );
}
