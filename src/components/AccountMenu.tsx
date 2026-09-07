"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function AccountMenu({
  variant,
  label,
  href,
}: {
  variant: "client" | "admin";
  label: string;
  href: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    if (variant === "admin") {
      await signOut({ redirect: false });
    } else {
      await fetch("/api/client/logout", { method: "POST" });
    }
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#16141c] shadow-lg">
          <Link
            href={href}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white"
          >
            {variant === "admin" ? "Espace pro" : "Mon compte"}
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/5"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
