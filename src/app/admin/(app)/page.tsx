import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

const MONTH_LABELS_SHORT = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
];

const CHART_MONTHS = 6;

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfChartWindow = new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1), 1);

  const [upcoming, monthPayments, pendingCount, chartPayments] = await Promise.all([
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
    prisma.payment.findMany({
      where: { status: "PAYE", paidAt: { gte: startOfChartWindow, lt: startOfNextMonth } },
    }),
  ]);

  const monthTotalCents = monthPayments.reduce((sum, p) => sum + p.amountCents, 0);

  const chartMonths = Array.from({ length: CHART_MONTHS }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1 - i), 1);
    return { year: monthDate.getFullYear(), month: monthDate.getMonth() };
  });
  const chartTotals = chartMonths.map(({ year, month }) =>
    chartPayments
      .filter((p) => p.paidAt && p.paidAt.getFullYear() === year && p.paidAt.getMonth() === month)
      .reduce((sum, p) => sum + p.amountCents, 0)
  );
  const chartMax = Math.max(...chartTotals, 1);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
        Tableau de bord
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
          <p className="text-sm text-white/50">Encaissé ce mois-ci</p>
          <p className="mt-1 text-2xl font-extrabold text-[#a855f7]">{centsToEuros(monthTotalCents)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
          <p className="text-sm text-white/50">Prochains rendez-vous</p>
          <p className="mt-1 text-2xl font-extrabold text-white">{upcoming.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
          <p className="text-sm text-white/50">RDV en attente de confirmation</p>
          <p className="mt-1 text-2xl font-extrabold text-white">{pendingCount}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#16141c] p-6">
        <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
          Évolution du chiffre d&apos;affaires
        </h2>
        <p className="mt-1 text-sm text-white/50">Encaissements des {CHART_MONTHS} derniers mois</p>
        <div className="mt-8 flex items-end justify-between gap-2 sm:gap-4">
          {chartTotals.map((totalCents, i) => {
            const heightPercent = Math.max((totalCents / chartMax) * 100, totalCents > 0 ? 4 : 1);
            const isCurrentMonth = i === chartTotals.length - 1;
            return (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className="flex h-48 w-full flex-col items-center justify-end">
                  <span className="mb-1 text-xs font-semibold text-white/80 sm:text-sm">
                    {centsToEuros(totalCents)}
                  </span>
                  <div
                    className={`w-full rounded-t-lg ${
                      isCurrentMonth
                        ? "bg-gradient-to-t from-[#7c3aed] to-[#e9d5ff] shadow-[0_0_20px_-4px_#a855f7]"
                        : "bg-gradient-to-t from-[#7c3aed]/70 to-[#a855f7]/70"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="mt-2 text-xs uppercase tracking-wide text-white/40">
                  {MONTH_LABELS_SHORT[chartMonths[i].month]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-[#16141c] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Prochains rendez-vous
          </h2>
          <Link href="/admin/rdv" className="text-sm font-medium text-[#a855f7] hover:underline">
            Voir tous les RDV →
          </Link>
        </div>
        <div className="mt-4 divide-y divide-white/10">
          {upcoming.length === 0 && <p className="py-4 text-sm text-white/40">Aucun rendez-vous à venir.</p>}
          {upcoming.map((appt) => (
            <Link
              key={appt.id}
              href={`/admin/rdv/${appt.id}`}
              className="flex flex-col gap-1 py-3 text-sm hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-white">{appt.client.name}</p>
                <p className="text-white/50">
                  {appt.services.map((s) => s.service.name).join(", ")}
                </p>
              </div>
              <p className="text-white/60">
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
