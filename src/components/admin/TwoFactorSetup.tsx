"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TwoFactorSetup({ initiallyEnabled }: { initiallyEnabled: boolean }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [step, setStep] = useState<"idle" | "setup" | "confirm">("idle");
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startSetup() {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/2fa/setup", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Erreur");
      return;
    }
    setSecret(data.secret);
    setStep("confirm");
  }

  async function confirmSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/2fa/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Code invalide");
      return;
    }
    setEnabled(true);
    setStep("idle");
    router.refresh();
  }

  async function disable(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/2fa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Erreur");
      return;
    }
    setEnabled(false);
    setPassword("");
    router.refresh();
  }

  if (enabled) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="flex items-center gap-2 font-medium text-green-700">
          ✅ Double vérification activée
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Un code de ton application d&apos;authentification est demandé à chaque connexion.
        </p>
        <form onSubmit={disable} className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="password"
            placeholder="Mot de passe pour désactiver"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Désactiver
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (step === "confirm" && secret) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="font-medium text-slate-900">1. Scanne ce QR code</p>
        <p className="mt-1 text-sm text-slate-500">
          Avec Google Authenticator, Microsoft Authenticator, ou une application équivalente.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/api/admin/2fa/qrcode" alt="QR code 2FA" width={200} height={200} className="mt-4" />
        <p className="mt-3 text-xs text-slate-400">
          Impossible de scanner ? Code manuel : <span className="font-mono">{secret}</span>
        </p>

        <form onSubmit={confirmSetup} className="mt-6">
          <p className="font-medium text-slate-900">2. Entre le code affiché dans l&apos;application</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              required
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-center tracking-widest"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Confirmer et activer
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="font-medium text-slate-900">Double vérification non activée</p>
      <p className="mt-1 text-sm text-slate-500">
        Ajoute une couche de sécurité : un code à 6 chiffres généré par une application
        d&apos;authentification sera demandé à chaque connexion.
      </p>
      <button
        onClick={startSetup}
        disabled={loading}
        className="mt-4 rounded-full bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Chargement..." : "Configurer maintenant"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
