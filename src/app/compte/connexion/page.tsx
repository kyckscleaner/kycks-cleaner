import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ClientLoginForm } from "@/components/ClientLoginForm";

export default function ClientLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-sm flex-1 px-4 py-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-wide text-white">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-white/60">Accédez à votre espace client.</p>
        <div className="mt-6">
          <ClientLoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          Pas encore de compte ?{" "}
          <Link href="/compte/inscription" className="text-[#a855f7] hover:underline">
            Créer un compte
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
