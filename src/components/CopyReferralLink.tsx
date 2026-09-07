"use client";

import { useState } from "react";

export function CopyReferralLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponible, l'utilisateur peut copier manuellement le lien affiché
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        readOnly
        value={link}
        onFocus={(e) => e.target.select()}
        className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
      >
        {copied ? "Copié !" : "Copier"}
      </button>
    </div>
  );
}
