import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
        <p className="mt-4 text-slate-600">
          Une question avant de réserver ? Contactez Kycks Cleaner :
        </p>
        <div className="mt-6 space-y-3 text-slate-700">
          <p>
            📧 Email :{" "}
            <a href="mailto:contact@kycks-cleaner.fr" className="text-[#0b3d91] underline">
              contact@kycks-cleaner.fr
            </a>
          </p>
          <p>📞 Téléphone : à compléter</p>
          <p>📍 Zone d&apos;intervention : à compléter</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
