import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <p className="font-[family-name:var(--font-display)] text-7xl uppercase tracking-wide text-[#a855f7]">
          404
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
          Page introuvable
        </h1>
        <p className="mt-2 text-white/60">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-6 py-3 font-semibold text-white shadow-[0_0_30px_-6px_#a855f7] transition hover:brightness-110"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
