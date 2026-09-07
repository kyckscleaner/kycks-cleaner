export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-900">Kycks Cleaner</p>
          <p>Nettoyage automobile professionnel, directement chez vous.</p>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Kycks Cleaner — Micro-entreprise
        </p>
      </div>
    </footer>
  );
}
