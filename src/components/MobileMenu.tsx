"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileMenu({
  isLoggedIn,
  clientFirstName,
  isAdmin,
}: {
  isLoggedIn: boolean;
  clientFirstName?: string;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);

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
            ) : (
              <Link
                href={isLoggedIn ? "/compte" : "/compte/connexion"}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-white/5"
              >
                {isLoggedIn ? `Mon compte (${clientFirstName})` : "Se connecter"}
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
