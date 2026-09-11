import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { ReservationForm } from "@/components/ReservationForm";
import { getCurrentClient } from "@/lib/getCurrentClient";

export default async function ReserverPage() {
  const [services, options, client] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.serviceOption.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    getCurrentClient(),
  ]);

  const plainServices = services.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    priceCents: s.priceCents,
    durationMinutes: s.durationMinutes,
  }));

  const plainOptions = options.map((o) => ({
    id: o.id,
    code: o.code,
    name: o.name,
    priceCents: o.priceCents,
  }));

  const loggedInClient = client
    ? {
        name: client.name,
        email: client.email,
        phone: client.phone,
        referralDiscountAvailable: client.referralDiscountAvailable,
        anniversaryDiscountAvailable: client.anniversaryDiscountAvailable,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-white">
          Réserver un nettoyage
        </h1>
        <p className="mt-2 text-white/60">
          Choisissez votre formule et un créneau disponible. Le paiement se fait sur place, le
          jour du rendez-vous.
        </p>
        <Suspense fallback={null}>
          <ReservationForm services={plainServices} options={plainOptions} loggedInClient={loggedInClient} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
