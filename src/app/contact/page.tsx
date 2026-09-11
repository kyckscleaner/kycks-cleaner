import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialLinks } from "@/components/SocialLinks";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-wide text-white">
          Contact
        </h1>
        <p className="mt-4 text-white/60">
          Une question avant de réserver ? Contactez Kycks Cleaner :
        </p>
        <div className="mt-6 space-y-4 text-white/80">
          <p>
            📞 Téléphone :{" "}
            <a href="tel:0616643491" className="text-[#a855f7] hover:underline">
              06 16 64 34 91
            </a>
          </p>
          <p>
            📸 Instagram :{" "}
            <a
              href="https://instagram.com/kycks_cleaner"
              target="_blank"
              rel="noreferrer"
              className="text-[#a855f7] hover:underline"
            >
              @kycks_cleaner
            </a>
          </p>
          <p>
            🎵 TikTok :{" "}
            <a
              href="https://tiktok.com/@kycks_cleaner"
              target="_blank"
              rel="noreferrer"
              className="text-[#a855f7] hover:underline"
            >
              @kycks_cleaner
            </a>
          </p>
          <div>
            <p>📍 Zone d&apos;intervention (environ 10 km autour de Granville) :</p>
            <p className="mt-1 text-sm text-white/50">
              Granville, Donville-les-Bains, Saint-Pair-sur-Mer, Yquelon, Saint-Planchers, Longueville,
              Bréville-sur-Mer, Coudeville-sur-Mer, Jullouville, Champeaux, Carolles.
            </p>
          </div>
          <p>📅 Uniquement sur rendez-vous</p>
        </div>

        <div className="mt-8">
          <SocialLinks />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
