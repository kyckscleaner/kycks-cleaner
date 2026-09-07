import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ClientSignupForm } from "@/components/ClientSignupForm";

export default function ClientSignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm flex-1 px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white">
          Créer un compte
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Suivez vos rendez-vous et profitez du parrainage.
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <ClientSignupForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          Déjà un compte ?{" "}
          <Link href="/compte/connexion" className="text-[#a855f7] hover:underline">
            Se connecter
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
