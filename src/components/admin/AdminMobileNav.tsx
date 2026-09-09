"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/calendrier", label: "Calendrier" },
  { href: "/admin/rdv", label: "Rendez-vous" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/avis", label: "Avis clients" },
  { href: "/admin/finances", label: "URSSAF / Impôts" },
  { href: "/admin/qrcode", label: "QR code" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export function AdminMobileNav({ adminName }: { adminName?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        <div className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-black/95 backdrop-blur">
          <nav className="flex flex-col gap-1 px-4 py-3 text-white/80">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  pathname === item.href ? "bg-[#7c3aed]/20 text-white" : "hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ redirectTo: "/admin/login" })}
              className="rounded-lg px-3 py-2 text-left text-red-400 hover:bg-white/5"
            >
              Déconnexion {adminName ? `(${adminName})` : ""}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
