import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { ReservationForm } from "@/components/ReservationForm";

export default async function ReserverPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const plainServices = services.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    priceCents: s.priceCents,
    durationMinutes: s.durationMinutes,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Réserver un nettoyage</h1>
        <p className="mt-2 text-slate-600">
          Choisissez votre formule, un créneau disponible, puis vos coordonnées pour finaliser.
        </p>
        <Suspense fallback={null}>
          <ReservationForm services={plainServices} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
