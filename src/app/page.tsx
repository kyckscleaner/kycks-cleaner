import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialLinks } from "@/components/SocialLinks";
import { prisma } from "@/lib/prisma";
import { centsToEuros } from "@/lib/money";

const TRUST_POINTS = [
  { label: "Chez vous", detail: "à domicile" },
  { label: "Sans institut", detail: "ni file d'attente" },
  { label: "Réglez", detail: "sur place" },
  { label: "Granville", detail: "et environs (10 km)" },
];

const GALLERY = [
  { src: "/gallery/work-1.jpg", alt: "Nettoyage minutieux de la console centrale" },
  { src: "/gallery/work-7.jpg", alt: "Dépoussiérage des commandes au chiffon microfibre" },
  { src: "/gallery/work-10.jpg", alt: "Finitions détaillées sur le tableau de bord" },
];

const FAQ = [
  {
    q: "De quoi avez-vous besoin sur place ?",
    a: "Juste un point d'eau et une prise électrique accessibles près du véhicule. Le reste (produits, matériel, aspirateur) est fourni.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Aucun paiement en ligne : vous réglez directement le jour du rendez-vous, une fois la prestation terminée et validée.",
  },
  {
    q: "Intervenez-vous uniquement à domicile ?",
    a: "Oui, exclusivement chez vous, à Granville et dans un rayon d'environ 10 km autour.",
  },
  {
    q: "Combien de temps dure une prestation ?",
    a: "Entre 1h pour un intérieur ou extérieur seul, et environ 1h45 pour la formule complète, selon l'état du véhicule.",
  },
  {
    q: "Puis-je annuler ou déplacer mon rendez-vous ?",
    a: "Oui, contactez-nous directement par téléphone ou via Instagram/TikTok dès que possible pour trouver un nouveau créneau.",
  },
];

export default async function HomePage() {
  const [services, reviews] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { client: true },
      take: 6,
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />

      <section className="relative">
        {/* bannière vidéo — un vrai nettoyage Kycks Cleaner en action */}
        <div className="relative h-[21vh] min-h-[180px] w-full overflow-hidden bg-black sm:h-[29vh] sm:min-h-[230px]">
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

        {/* contenu, sur fond noir uni juste sous la vidéo */}
        <div className="relative bg-black px-4 pb-14 pt-10 text-center text-white sm:px-6 sm:pb-16">
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
            <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase leading-[1.15] tracking-wide sm:text-6xl">
              Redonnez à votre voiture
              <br />
              <span className="bg-gradient-to-r from-[#a855f7] to-[#e9d5ff] bg-clip-text text-transparent">
                son éclat d&apos;origine
              </span>
            </h1>
            <p className="mt-3 bg-gradient-to-r from-[#a855f7] to-[#e9d5ff] bg-clip-text font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-transparent sm:text-xl">
              Votre voiture, notre passion.
            </p>
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

      {/* bandeau de confiance */}
      <section className="border-y border-white/10 bg-[#0f0d13] px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST_POINTS.map((point) => (
            <div key={point.label} className="text-center">
              <p className="font-[family-name:var(--font-display)] text-sm uppercase tracking-wide text-white sm:text-base">
                {point.label}
              </p>
              <p className="mt-1 text-xs text-white/50 sm:text-sm">{point.detail}</p>
            </div>
          ))}
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
            {services.map((service) => {
              const isFeatured = service.code === "complet";
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
              );
            })}
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

      {/* galerie — vraies photos issues des interventions */}
      <section className="border-t border-white/10 bg-[#0f0d13] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white sm:text-4xl">
            En action
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-white/60">
            Un aperçu de nos interventions récentes.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {GALLERY.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-white/50">Plus de vidéos sur nos réseaux</p>
            <div className="mt-3 flex justify-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black px-4 py-16 sm:px-6">
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

      {/* FAQ */}
      <section className="border-t border-white/10 bg-[#0f0d13] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white sm:text-4xl">
            Questions fréquentes
          </h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-white/10 bg-[#16141c] px-5 py-4 open:border-[#a855f7]/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white marker:content-none">
                  {item.q}
                  <span className="shrink-0 text-xl text-[#a855f7] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-white/60">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="border-t border-white/10 bg-[#0f0d13] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white sm:text-4xl">
              Avis clients
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
                  <p className="text-[#a855f7]">
                    {"★".repeat(review.rating)}
                    <span className="text-white/20">{"★".repeat(5 - review.rating)}</span>
                  </p>
                  <p className="mt-3 text-sm text-white/70">{review.comment}</p>
                  <p className="mt-3 text-sm font-medium text-white/50">
                    {review.client.name.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
