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
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />

      <section className="relative overflow-hidden bg-black px-4 py-24 text-white sm:px-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(124,58,237,0.35) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-block rounded-full border border-[#a855f7]/40 bg-[#7c3aed]/10 px-4 py-1 text-sm font-medium text-[#c084fc]">
            Nettoyage automobile à domicile — Granville et environs
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl uppercase leading-[0.95] tracking-wide sm:text-7xl">
            Une voiture propre,
            <br />
            <span className="bg-gradient-to-r from-[#a855f7] to-[#e9d5ff] bg-clip-text text-transparent">
              c&apos;est un bon moral
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Kycks Cleaner intervient chez vous ou sur votre lieu de travail pour un nettoyage
            intérieur et extérieur. Réservation et paiement en ligne en quelques clics.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/reserver"
              className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-7 py-3 font-semibold text-white shadow-[0_0_30px_-6px_#a855f7] transition hover:brightness-110"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Voir les formules
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white sm:text-4xl">
            Nos formules
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-white/60">
            Un vrai gros nettoyage, pas un simple coup d&apos;éponge.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#16141c] p-6 shadow-lg transition hover:border-[#a855f7]/50"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-white/60">{service.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-[#a855f7]">
                    {centsToEuros(service.priceCents)}
                  </span>
                  <span className="text-xs text-white/30">~{service.durationMinutes} min</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/reserver"
              className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-7 py-3 font-semibold text-white shadow-[0_0_30px_-6px_#a855f7] transition hover:brightness-110"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0f0d13] px-4 py-16 sm:px-6">
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
              title: "Granville et environs",
              desc: "Intervention dans un rayon de 10 km autour de Granville, sur rendez-vous.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
