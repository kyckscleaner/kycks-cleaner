import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [upcoming, monthPayments, pendingCount] = await Promise.all([
    prisma.appointment.findMany({
      where: { date: { gte: now }, status: { not: "CANCELLED" } },
      orderBy: { date: "asc" },
      take: 5,
      include: { client: true, services: { include: { service: true } } },
    }),
    prisma.payment.findMany({
      where: { status: "PAYE", paidAt: { gte: startOfMonth, lt: startOfNextMonth } },
    }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
  ]);

  const monthTotalCents = monthPayments.reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Encaissé ce mois-ci</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0b3d91]">{centsToEuros(monthTotalCents)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Prochains rendez-vous</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{upcoming.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">RDV en attente de confirmation</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{pendingCount}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Prochains rendez-vous</h2>
          <Link href="/admin/rdv" className="text-sm font-medium text-[#0b3d91]">
            Voir tous les RDV →
          </Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {upcoming.length === 0 && <p className="py-4 text-sm text-slate-400">Aucun rendez-vous à venir.</p>}
          {upcoming.map((appt) => (
            <Link
              key={appt.id}
              href={`/admin/rdv/${appt.id}`}
              className="flex items-center justify-between py-3 text-sm hover:bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-900">{appt.client.name}</p>
                <p className="text-slate-500">
                  {appt.services.map((s) => s.service.name).join(", ")}
                </p>
              </div>
              <p className="text-slate-600">
                {appt.date.toLocaleDateString("fr-FR")} à{" "}
                {appt.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
