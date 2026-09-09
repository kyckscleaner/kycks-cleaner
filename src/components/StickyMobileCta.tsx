"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = ["/reserver", "/admin", "/compte"];

export function StickyMobileCta() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2 sm:hidden">
      <Link
        href="/reserver"
        className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] py-3 text-center font-semibold text-white shadow-[0_0_30px_-6px_#a855f7]"
      >
        Prendre rendez-vous
      </Link>
    </div>
  );
}
