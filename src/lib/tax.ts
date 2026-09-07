import type { BusinessSettings } from "@prisma/client";

export type PeriodTaxSummary = {
  periodLabel: string;
  caEncaisseCents: number;
  cotisationsSocialesCents: number;
  cfpCents: number;
  versementLiberatoireCents: number;
  totalAPayerCents: number;
  netPourEntrepreneurCents: number;
};

/**
 * Calcule les cotisations dues sur un chiffre d'affaires encaissé, à partir des taux
 * configurés par l'utilisateur (à vérifier/ajuster selon les taux en vigueur sur
 * autoentrepreneur.urssaf.fr, ces derniers évoluant chaque année).
 */
export function computeTaxSummary(
  periodLabel: string,
  caEncaisseCents: number,
  settings: Pick<
    BusinessSettings,
    "cotisationRatePercent" | "cfpRatePercent" | "versementLiberatoireActif" | "versementLiberatoireRate"
  >
): PeriodTaxSummary {
  const cotisationsSocialesCents = Math.round((caEncaisseCents * settings.cotisationRatePercent) / 100);
  const cfpCents = Math.round((caEncaisseCents * settings.cfpRatePercent) / 100);
  const versementLiberatoireCents = settings.versementLiberatoireActif
    ? Math.round((caEncaisseCents * settings.versementLiberatoireRate) / 100)
    : 0;

  const totalAPayerCents = cotisationsSocialesCents + cfpCents + versementLiberatoireCents;

  return {
    periodLabel,
    caEncaisseCents,
    cotisationsSocialesCents,
    cfpCents,
    versementLiberatoireCents,
    totalAPayerCents,
    netPourEntrepreneurCents: caEncaisseCents - totalAPayerCents,
  };
}

// Plafond annuel de CA en micro-entreprise pour une activité de prestation de services (BIC/BNC).
// Seuil 2024-2025 à titre indicatif — vérifier le montant en vigueur sur urssaf.fr avant de s'y fier.
export const PLAFOND_MICRO_ENTREPRISE_SERVICES_CENTS = 77_700 * 100;

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  prestation_service_commerciale: "Prestation de service commerciale (BIC)",
  prestation_service_artisanale: "Prestation de service artisanale (BIC)",
  vente_marchandises: "Vente de marchandises (BIC)",
};
