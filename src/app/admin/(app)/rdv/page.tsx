import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  DONE: "Terminé",
  CANCELLED: "Annulé",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  CONFIRMED: "bg-[#7c3aed]/20 text-[#c084fc]",
  DONE: "bg-green-500/10 text-green-400",
  CANCELLED: "bg-white/10 text-white/50",
};

export default async function AdminRdvListPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: { client: true, services: { include: { service: true } }, payments: true },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
        Rendez-vous
      </h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#16141c]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-white/50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Formule(s)</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paiement</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const paidCents = appt.payments
                .filter((p) => p.status === "PAYE")
                .reduce((sum, p) => sum + p.amountCents, 0);
              return (
                <tr key={appt.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Link href={`/admin/rdv/${appt.id}`} className="block font-medium text-white">
                      {appt.date.toLocaleDateString("fr-FR")}{" "}
                      {appt.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white/80">{appt.client.name}</td>
                  <td className="px-4 py-3 text-white/60">
                    {appt.services.map((s) => s.service.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-white/80">{centsToEuros(appt.totalCents)}</td>
                  <td className="px-4 py-3">
                    {paidCents > 0 ? (
                      <span className="text-green-400">{centsToEuros(paidCents)} payé</span>
                    ) : (
                      <span className="text-white/30">Non payé</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[appt.status]}`}>
                      {STATUS_LABELS[appt.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/30">
                  Aucun rendez-vous pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
