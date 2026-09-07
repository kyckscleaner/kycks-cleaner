"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function MobileMenu({
  isLoggedIn,
  clientFirstName,
  isAdmin,
}: {
  isLoggedIn: boolean;
  clientFirstName?: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    if (isAdmin) {
      await signOut({ redirect: false });
    } else {
      await fetch("/api/client/logout", { method: "POST" });
    }
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="sm:hidden">
      <button
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-white/10 bg-black/95 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-white/80">
            <Link href="/services" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-white/5">
              Nos formules
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-white/5">
              Contact
            </Link>
            {isAdmin ? (
              <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-white/5">
                Espace pro
              </Link>
            ) : isLoggedIn ? (
              <Link href="/compte" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-white/5">
                Mon compte ({clientFirstName})
              </Link>
            ) : (
              <Link
                href="/compte/connexion"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-white/5"
              >
                Se connecter
              </Link>
            )}
            {(isLoggedIn || isAdmin) && (
              <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-red-400 hover:bg-white/5">
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
