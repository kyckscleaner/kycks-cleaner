import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";
import { computeTaxSummary, ACTIVITY_TYPE_LABELS, type PeriodTaxSummary } from "@/lib/tax";

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function SummaryCard({ summary }: { summary: PeriodTaxSummary }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
      <p className="text-sm font-medium text-white/50">{summary.periodLabel}</p>
      <p className="mt-1 text-3xl font-extrabold text-white">
        {centsToEuros(summary.caEncaisseCents)}
      </p>
      <p className="text-xs text-white/30">Chiffre d&apos;affaires encaissé</p>

      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Cotisations sociales</span>
          <span className="font-medium text-white">{centsToEuros(summary.cotisationsSocialesCents)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Contribution formation pro</span>
          <span className="font-medium text-white">{centsToEuros(summary.cfpCents)}</span>
        </div>
        {summary.versementLiberatoireCents > 0 && (
          <div className="flex justify-between">
            <span className="text-white/60">Impôt (versement libératoire)</span>
            <span className="font-medium text-white">{centsToEuros(summary.versementLiberatoireCents)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
          <span className="text-white">Total à déclarer / payer</span>
          <span className="text-[#a855f7]">{centsToEuros(summary.totalAPayerCents)}</span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>Net pour vous</span>
          <span>{centsToEuros(summary.netPourEntrepreneurCents)}</span>
        </div>
      </div>
    </div>
  );
}

export default async function AdminFinancesPage() {
  const settings = await prisma.businessSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const now = new Date();
  const year = now.getFullYear();

  const payments = await prisma.payment.findMany({
    where: { status: "PAYE", paidAt: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } },
  });

  const monthlyTotals = Array.from({ length: 12 }, () => 0);
  for (const payment of payments) {
    if (!payment.paidAt) continue;
    monthlyTotals[payment.paidAt.getMonth()] += payment.amountCents;
  }

  const currentMonthIndex = now.getMonth();
  const currentQuarterIndex = Math.floor(currentMonthIndex / 3);
  const quarterMonths = [0, 1, 2].map((i) => currentQuarterIndex * 3 + i);
  const currentQuarterCA = quarterMonths.reduce((sum, m) => sum + monthlyTotals[m], 0);

  const currentMonthSummary = computeTaxSummary(
    `${MONTH_LABELS[currentMonthIndex]} ${year}`,
    monthlyTotals[currentMonthIndex],
    settings
  );

  const currentQuarterSummary = computeTaxSummary(
    `${currentQuarterIndex + 1}ᵉ trimestre ${year}`,
    currentQuarterCA,
    settings
  );

  const periodToDeclare =
    settings.declarationFrequency === "trimestriel" ? currentQuarterSummary : currentMonthSummary;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
            URSSAF / Impôts
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {ACTIVITY_TYPE_LABELS[settings.activityType]} — déclaration {settings.declarationFrequency}
          </p>
        </div>
        <a
          href={`/api/admin/finances/export?year=${year}`}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
        >
          Exporter les encaissements {year} (CSV)
        </a>
      </div>

      <div className="mt-4 rounded-xl bg-amber-500/10 p-4 text-sm text-amber-300">
        Ce module calcule un récapitulatif à partir des paiements encaissés dans l&apos;application.
        Il ne télé-déclare pas automatiquement à l&apos;URSSAF (aucune API officielle ne le permet) :
        reportez le chiffre d&apos;affaires ci-dessous sur{" "}
        <a
          href="https://www.autoentrepreneur.urssaf.fr"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          autoentrepreneur.urssaf.fr
        </a>{" "}
        pour votre déclaration officielle.
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <SummaryCard summary={periodToDeclare} />
        <SummaryCard
          summary={computeTaxSummary(
            `Année ${year}`,
            monthlyTotals.reduce((a, b) => a + b, 0),
            settings
          )}
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#16141c]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-white/50">
            <tr>
              <th className="px-4 py-3">Mois</th>
              <th className="px-4 py-3">CA encaissé</th>
              <th className="px-4 py-3">Cotisations dues</th>
              <th className="px-4 py-3">Net estimé</th>
            </tr>
          </thead>
          <tbody>
            {MONTH_LABELS.map((label, i) => {
              const summary = computeTaxSummary(label, monthlyTotals[i], settings);
              return (
                <tr key={label} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-white">{label}</td>
                  <td className="px-4 py-3 text-white/70">{centsToEuros(summary.caEncaisseCents)}</td>
                  <td className="px-4 py-3 text-white/70">{centsToEuros(summary.totalAPayerCents)}</td>
                  <td className="px-4 py-3 text-white/70">{centsToEuros(summary.netPourEntrepreneurCents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
