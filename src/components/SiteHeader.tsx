import Link from "next/link";
import { getCurrentClient } from "@/lib/getCurrentClient";
import { auth } from "@/auth";
import { MobileMenu } from "@/components/MobileMenu";
import { AccountMenu } from "@/components/AccountMenu";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";

export async function SiteHeader() {
  const [client, adminSession] = await Promise.all([getCurrentClient(), auth()]);
  const isAdmin = !!adminSession;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo height={36} />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 sm:flex">
          <Link href="/services" className="hover:text-white">
            Nos formules
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          {isAdmin ? (
            <AccountMenu variant="admin" label="Espace pro" href="/admin" />
          ) : client ? (
            <AccountMenu variant="client" label={`Bonjour ${client.name.split(" ")[0]}`} href="/compte" />
          ) : (
            <Link href="/compte/connexion" className="hover:text-white">
              Se connecter
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SocialLinks size={36} />
          </div>
          <Link
            href="/reserver"
            className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_-4px_#a855f7] transition hover:brightness-110"
          >
            Réserver
          </Link>
          <MobileMenu isLoggedIn={!!client} clientFirstName={client?.name.split(" ")[0]} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
