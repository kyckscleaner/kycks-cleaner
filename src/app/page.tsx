import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

export default async function HomePage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="bg-gradient-to-b from-[#0b3d91] to-[#0a2f70] px-4 py-20 text-white sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
            Nettoyage automobile à domicile
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Votre voiture, comme neuve, sans bouger de chez vous
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
            Kycks Cleaner intervient chez vous ou sur votre lieu de travail pour un nettoyage en
            profondeur, intérieur et extérieur. Réservation et paiement en ligne en quelques
            clics.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/reserver"
              className="rounded-full bg-white px-6 py-3 font-semibold text-[#0b3d91] shadow-lg transition hover:bg-blue-50"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Voir les formules
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-slate-900">Nos formules</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
            Un vrai gros nettoyage, pas un simple coup d&apos;éponge. Choisissez la formule qui
            correspond à votre besoin.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{service.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-[#0b3d91]">
                    {centsToEuros(service.priceCents)}
                  </span>
                  <span className="text-xs text-slate-400">~{service.durationMinutes} min</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/reserver"
              className="rounded-full bg-[#0b3d91] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#0a2f70]"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          {[
            {
              title: "Chez vous, où que vous soyez",
              desc: "Domicile, bureau, parking : on vient avec tout le matériel nécessaire.",
            },
            {
              title: "Paiement en ligne sécurisé",
              desc: "Réglez votre RDV directement en ligne au moment de la réservation.",
            },
            {
              title: "Suivi simple et transparent",
              desc: "Confirmation, rappel et historique de vos rendez-vous.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
