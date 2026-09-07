export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Kycks Cleaner
          </p>
          <p>Une voiture propre, c&apos;est un bon moral !</p>
        </div>
        <p className="mt-4 text-xs text-white/30">
          © {new Date().getFullYear()} Kycks Cleaner — Micro-entreprise — Granville et environs
        </p>
      </div>
    </footer>
  );
}
