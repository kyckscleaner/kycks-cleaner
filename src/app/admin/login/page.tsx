"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"credentials" | "code">("credentials");
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

    setStep("code");
  }

  async function handleCodeStep(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", { email, password, code, redirect: false });

    if (result?.error) {
      setError("Code invalide ou expiré.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <form
        onSubmit={step === "code" ? handleCodeStep : handleCredentialsStep}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#16141c] p-8"
      >
        <h1 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide text-white">
          Espace pro Kycks Cleaner
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {step === "code"
            ? `Un code a été envoyé à ${email}. Il expire dans 10 minutes.`
            : "Connectez-vous pour gérer vos rendez-vous."}
        </p>

        <div className="mt-6 space-y-4">
          {step === "credentials" && (
            <>
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/40"
              />
              <input
                required
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/40"
              />
            </>
          )}
          {step === "code" && (
            <input
              required
              autoFocus
              placeholder="Code à 6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-center text-lg tracking-widest text-white placeholder:text-white/40"
            />
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Envoi..." : step === "code" ? "Valider le code" : "Se connecter"}
        </button>

        {step === "code" && (
          <button
            type="button"
            onClick={() => setStep("credentials")}
            className="mt-3 w-full text-center text-sm text-white/40 hover:text-white/70"
          >
            Retour
          </button>
        )}
      </form>
    </div>
  );
}
