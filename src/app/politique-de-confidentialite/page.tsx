import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-white/80 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-white/50">Dernière mise à jour : septembre 2026</p>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Données collectées
          </h2>
          <p>Lors d&apos;une réservation ou de la création d&apos;un compte, nous collectons :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nom, email, téléphone</li>
            <li>Adresse d&apos;intervention (pour se rendre chez vous)</li>
            <li>Informations sur votre véhicule (facultatif)</li>
            <li>
              Adresse IP à l&apos;inscription, utilisée uniquement pour détecter les abus du
              programme de parrainage
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Finalité
          </h2>
          <p>
            Ces données servent exclusivement à gérer vos rendez-vous, vous contacter, assurer le
            suivi de votre compte et du programme de parrainage, et sécuriser l&apos;accès à
            l&apos;espace d&apos;administration. Elles ne sont ni vendues ni transmises à des tiers
            à des fins commerciales.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Sous-traitants techniques
          </h2>
          <p>Certains prestataires techniques traitent des données pour notre compte :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Vercel Inc. — hébergement du site</li>
            <li>Neon — hébergement de la base de données</li>
            <li>Resend — envoi des emails (confirmation de rendez-vous, codes de connexion)</li>
          </ul>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Cookies
          </h2>
          <p>
            Ce site utilise uniquement des cookies strictement nécessaires à son fonctionnement
            (maintien de votre connexion). Aucun cookie publicitaire ou de mesure d&apos;audience
            n&apos;est utilisé.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Durée de conservation
          </h2>
          <p>
            Vos données sont conservées le temps nécessaire à la gestion de la relation
            commerciale et aux obligations comptables légales.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et
            de suppression de vos données. Pour l&apos;exercer, contactez-nous à{" "}
            <a href="mailto:kylianhinarejos08@gmail.com" className="text-[#a855f7] hover:underline">
              kylianhinarejos08@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
