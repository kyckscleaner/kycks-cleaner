import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0b3d91] to-[#0ea5e9] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 15h16M6 15v3M18 15v3M5 12l1.6-4.2A2 2 0 0 1 8.5 6.5h7a2 2 0 0 1 1.9 1.3L19 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7.5" cy="15" r="1.4" fill="currentColor" />
              <circle cx="16.5" cy="15" r="1.4" fill="currentColor" />
            </svg>
          </span>
          <span>
            Kycks <span className="text-[#0b3d91]">Cleaner</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 sm:flex">
          <Link href="/services" className="hover:text-[#0b3d91]">
            Nos formules
          </Link>
          <Link href="/contact" className="hover:text-[#0b3d91]">
            Contact
          </Link>
          <Link href="/admin" className="hover:text-[#0b3d91]">
            Espace pro
          </Link>
        </nav>
        <Link
          href="/reserver"
          className="rounded-full bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a2f70]"
        >
          Réserver
        </Link>
      </div>
    </header>
  );
}
