import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ServicesPricingForm } from "@/components/admin/ServicesPricingForm";

export default async function AdminParametresPage() {
  const [settings, services] = await Promise.all([
    prisma.businessSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configurez votre micro-entreprise et vos tarifs.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-bold text-slate-900">Micro-entreprise & fiscalité</h2>
        <SettingsForm settings={settings} />
      </section>

      <section>
        <h2 className="mb-3 font-bold text-slate-900">Tarifs des prestations</h2>
        <ServicesPricingForm services={services} />
      </section>
    </div>
  );
}
