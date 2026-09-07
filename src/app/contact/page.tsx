import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
              href="https://instagram.com/kycks.cleaner"
              target="_blank"
              rel="noreferrer"
              className="text-[#a855f7] hover:underline"
            >
              @kycks.cleaner
            </a>
          </p>
          <p>📍 Zone d&apos;intervention : Granville et environs (10 km autour)</p>
          <p>📅 Uniquement sur rendez-vous</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
