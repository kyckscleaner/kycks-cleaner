import Link from "next/link";
import { getCurrentClient } from "@/lib/getCurrentClient";
import { auth } from "@/auth";
import { MobileMenu } from "@/components/MobileMenu";
import { AccountMenu } from "@/components/AccountMenu";
import { Logo } from "@/components/Logo";

export async function SiteHeader() {
  const [client, adminSession] = await Promise.all([getCurrentClient(), auth()]);
  const isAdmin = !!adminSession;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 2l1.6 3.2L17 6l-2.6 2.1L15 12l-3-1.8L9 12l0.6-3.9L7 6l3.4-0.8L12 2z"
                fill="currentColor"
              />
              <path
                d="M4 16h16M6 16v2.5M18 16v2.5M5 13l1.4-3.6A2 2 0 0 1 8.2 8h7.6a2 2 0 0 1 1.8 1.4L19 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7.5" cy="16" r="1.3" fill="currentColor" />
              <circle cx="16.5" cy="16" r="1.3" fill="currentColor" />
            </svg>
          </span>
          <Logo size="text-xl" />
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
