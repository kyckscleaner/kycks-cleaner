"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsStep(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/precheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Email ou mot de passe incorrect.");
      return;
    }

    if (data.needsCode) {
      setNeedsCode(true);
      return;
    }

    await finishSignIn();
  }

  async function handleCodeStep(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    await finishSignIn();
  }

  async function finishSignIn() {
    setLoading(true);
    const result = await signIn("credentials", { email, password, code, redirect: false });

    if (result?.error) {
      setError(needsCode ? "Code invalide." : "Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={needsCode ? handleCodeStep : handleCredentialsStep}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-slate-900">Espace pro Kycks Cleaner</h1>
        <p className="mt-1 text-sm text-slate-500">
          {needsCode
            ? "Entrez le code de votre application d'authentification."
            : "Connectez-vous pour gérer vos rendez-vous."}
        </p>

        <div className="mt-6 space-y-4">
          {!needsCode && (
            <>
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <input
                required
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </>
          )}
          {needsCode && (
            <input
              required
              autoFocus
              placeholder="Code à 6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-widest"
            />
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#0b3d91] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0a2f70] disabled:opacity-50"
        >
          {loading ? "Connexion..." : needsCode ? "Valider le code" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
