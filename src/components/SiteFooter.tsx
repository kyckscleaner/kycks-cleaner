import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Logo height={32} />
          <p>Votre voiture, notre passion.</p>
          <SocialLinks />
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kycks Cleaner — Micro-entreprise — Granville et environs</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white/60">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white/60">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
