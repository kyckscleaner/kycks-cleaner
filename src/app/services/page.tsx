import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

export default async function ServicesPage() {
  const [services, options] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.serviceOption.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-white">
          Nos formules
        </h1>
        <p className="mt-2 text-white/60">
          Toutes nos prestations sont réalisées directement à votre domicile, à la date et
          l&apos;heure de votre choix. Un point d&apos;eau et une prise électrique sont
          nécessaires sur place.
        </p>

        <div className="mt-10 space-y-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#16141c] p-6 sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide text-white">
                  {service.name}
                </h2>
                <p className="mt-1 max-w-xl text-sm text-white/60">{service.description}</p>
                <p className="mt-1 text-xs text-white/30">Durée estimée : {service.durationMinutes} min</p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <span className="text-2xl font-extrabold text-[#a855f7]">
                  {centsToEuros(service.priceCents)}
                </span>
                <Link
                  href={`/reserver?service=${service.code}`}
                  className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Réserver cette formule
                </Link>
              </div>
            </div>
          ))}
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
