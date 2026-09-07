import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Nos formules de nettoyage</h1>
        <p className="mt-2 text-slate-600">
          Toutes nos prestations sont réalisées à votre domicile ou sur votre lieu de travail, à
          la date et l&apos;heure de votre choix.
        </p>

        <div className="mt-10 space-y-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-6 sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900">{service.name}</h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">{service.description}</p>
                <p className="mt-1 text-xs text-slate-400">Durée estimée : {service.durationMinutes} min</p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <span className="text-2xl font-extrabold text-[#0b3d91]">
                  {centsToEuros(service.priceCents)}
                </span>
                <Link
                  href={`/reserver?service=${service.code}`}
                  className="rounded-full bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a2f70]"
                >
                  Réserver cette formule
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
