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
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
  CANCELLED: "bg-slate-200 text-slate-600",
};

export default async function AdminRdvListPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: { client: true, services: { include: { service: true } }, payments: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Rendez-vous</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
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
                <tr key={appt.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/rdv/${appt.id}`} className="block font-medium text-slate-900">
                      {appt.date.toLocaleDateString("fr-FR")}{" "}
                      {appt.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{appt.client.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {appt.services.map((s) => s.service.name).join(", ")}
                  </td>
                  <td className="px-4 py-3">{centsToEuros(appt.totalCents)}</td>
                  <td className="px-4 py-3">
                    {paidCents > 0 ? (
                      <span className="text-green-700">{centsToEuros(paidCents)} payé</span>
                    ) : (
                      <span className="text-slate-400">Non payé</span>
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
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
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
