import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function MentionsLegalesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-white/80 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white">
          Mentions légales
        </h1>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Éditeur du site
          </h2>
          <p>Kylian Hinarejos, exerçant sous le nom commercial « Kycks Cleaner »</p>
          <p>Micro-entreprise en cours d&apos;immatriculation (numéro SIRET à venir)</p>
          <p>Adresse : 8 rue Docteur Letourneur, 50400 Granville</p>
          <p>
            Téléphone :{" "}
            <a href="tel:0616643491" className="text-[#a855f7] hover:underline">
              06 16 64 34 91
            </a>
          </p>
          <p>
            Email :{" "}
            <a href="mailto:kyckscleaner@gmail.com" className="text-[#a855f7] hover:underline">
              kyckscleaner@gmail.com
            </a>
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Directeur de la publication
          </h2>
          <p>Kylian Hinarejos</p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Hébergement
          </h2>
          <p>Vercel Inc.</p>
          <p>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
          <p>
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#a855f7] hover:underline">
              vercel.com
            </a>
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, logo, mise en page) est la
            propriété de Kycks Cleaner, sauf mention contraire.
          </p>
        </section>

        <p className="mt-10 text-sm text-white/50">
          Voir aussi notre{" "}
          <a href="/politique-de-confidentialite" className="text-[#a855f7] hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
