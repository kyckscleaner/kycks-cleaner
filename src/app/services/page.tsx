import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

const FORMULE_FEATURES: Record<string, { included: string[]; excluded: string[] }> = {
  interieur: {
    included: [
      "Aspiration complète de l'habitacle",
      "Nettoyage de l'habitacle",
      "Nettoyage des sièges",
      "Nettoyage des tapis & moquettes",
      "Nettoyage des vitres intérieures",
      "Parfum d'intérieur",
    ],
    excluded: ["Extérieur (carrosserie, jantes, vitres)"],
  },
  exterieur: {
    included: [
      "Nettoyage complet de la carrosserie",
      "Nettoyage des jantes",
      "Nettoyage des vitres extérieures",
      "Séchage du véhicule",
    ],
    excluded: ["Intérieur (habitacle, sièges, vitres)"],
  },
  complet: {
    included: [
      "Aspiration complète de l'habitacle",
      "Nettoyage de l'habitacle",
      "Nettoyage des sièges",
      "Nettoyage des tapis & moquettes",
      "Nettoyage des vitres intérieures",
      "Parfum d'intérieur",
      "Nettoyage complet de la carrosserie",
      "Nettoyage des jantes",
      "Nettoyage des vitres extérieures",
      "Séchage du véhicule",
    ],
    excluded: [],
  },
};

export default async function ServicesPage() {
  const [services, options] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.serviceOption.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-white">
          Nos formules
        </h1>
        <p className="mt-2 text-white/60">
          Toutes nos prestations sont réalisées directement à votre domicile, à la date et
          l&apos;heure de votre choix. Un point d&apos;eau et une prise électrique sont
          nécessaires sur place.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {services.map((service) => {
            const isFeatured = service.code === "complet";
            const features = FORMULE_FEATURES[service.code];
            return (
              <div
                key={service.id}
                className={`relative flex flex-col rounded-2xl border p-6 shadow-lg transition ${
                  isFeatured
                    ? "border-[#a855f7]/60 bg-gradient-to-b from-[#2a1a4a] to-[#16141c] sm:-translate-y-2"
                    : "border-white/10 bg-[#16141c] hover:border-[#a855f7]/50"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_20px_-4px_#a855f7]">
                    La plus demandée
                  </span>
                )}
                <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
                  {service.name}
                </h2>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#a855f7]">
                    {centsToEuros(service.priceCents)}
                  </span>
                  <span className="text-xs text-white/30">~{service.durationMinutes} min</span>
                </div>

                {features && (
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {features.included.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/80">
                        <span className="mt-0.5 text-green-400">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    {features.excluded.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/30">
                        <span className="mt-0.5">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={`/reserver?service=${service.code}`}
                  className={`mt-6 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isFeatured
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white shadow-[0_0_20px_-4px_#a855f7] hover:brightness-110"
                      : "border border-white/15 text-white hover:bg-white/5"
                  }`}
                >
                  Réserver
                  <span aria-hidden>→</span>
                </Link>
              </div>
            );
          })}
        </div>

        {options.length > 0 && (
          <div className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
              Options
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#16141c] px-4 py-3 text-sm"
                >
                  <span className="text-white/80">{option.name}</span>
                  <span className="font-bold text-[#a855f7]">+{centsToEuros(option.priceCents)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
