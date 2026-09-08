import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialLinks } from "@/components/SocialLinks";
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

      <section className="relative">
        {/* bannière vidéo — un vrai nettoyage Kycks Cleaner en action */}
        <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden bg-black sm:h-[58vh] sm:min-h-[460px]">
          <video
            src="/hero-detailing.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, #000000 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
        </div>

        {/* contenu, sur fond noir uni juste sous la photo */}
        <div className="relative bg-black px-4 pb-20 pt-10 text-center text-white sm:px-6 sm:pb-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(124,58,237,0.3) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div className="relative mx-auto max-w-4xl">
            <p className="mb-4 inline-block rounded-full border border-[#a855f7]/40 bg-[#7c3aed]/10 px-4 py-1 text-sm font-medium text-[#c084fc]">
              Nettoyage automobile à domicile — Granville et environs
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.95] tracking-wide sm:text-6xl">
              Une voiture propre,
              <br />
              <span className="bg-gradient-to-r from-[#a855f7] to-[#e9d5ff] bg-clip-text text-transparent">
                c&apos;est un bon moral
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-white/70 sm:text-lg">
              Kycks Cleaner intervient directement à votre domicile pour un nettoyage intérieur et
              extérieur. Réservez en ligne, réglez sur place.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-sm text-white/50">Suivez-nous</p>
              <SocialLinks />
            </div>
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
        <h2 className="text-center font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white sm:text-4xl">
          Comment ça marche
        </h2>
        <div className="mx-auto mt-10 grid max-w-6xl gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Réservez en ligne",
              desc: "Choisissez votre formule, vos options et un créneau disponible en quelques clics.",
            },
            {
              step: "2",
              title: "On vient chez vous",
              desc: "Intervention directement à votre domicile à Granville et ses environs. Un point d'eau et une prise électrique sont nécessaires sur place.",
            },
            {
              step: "3",
              title: "Réglez sur place",
              desc: "Aucun paiement en ligne requis : vous réglez directement le jour du rendez-vous.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] font-[family-name:var(--font-display)] text-lg text-white">
                {item.step}
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-[#a855f7]/30 bg-gradient-to-br from-[#7c3aed]/15 to-transparent p-10 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white sm:text-3xl">
            Parrainez, économisez
          </h2>
          <p className="max-w-xl text-white/70">
            Créez un compte, partagez votre lien à vos proches : vous et la personne parrainée
            obtenez chacun 10% de réduction sur votre prochain rendez-vous.
          </p>
          <Link
            href="/compte/inscription"
            className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-7 py-3 font-semibold text-white shadow-[0_0_30px_-6px_#a855f7] transition hover:brightness-110"
          >
            Créer mon compte
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
