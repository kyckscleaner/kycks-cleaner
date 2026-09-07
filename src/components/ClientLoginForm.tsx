"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-[#a855f7] focus:outline-none";

export function ClientLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"credentials" | "proCode">("credentials");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Compte client classique en priorité.
    const res = await fetch("/api/client/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/compte");
      router.refresh();
      return;
    }

    // Si ce n'est pas un compte client, on tente le compte pro (email + mot de passe + code par email).
    const proRes = await fetch("/api/admin/precheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setSubmitting(false);

    if (proRes.ok) {
      setStep("proCode");
      return;
    }

    setError("Email ou mot de passe incorrect.");
  }

  async function handleProCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", { email, password, code, redirect: false });

    if (result?.error) {
      setError("Code invalide ou expiré.");
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (step === "proCode") {
    return (
      <form onSubmit={handleProCodeSubmit} className="space-y-4">
        <p className="text-sm text-white/60">
          Un code a été envoyé à {email}. Il expire dans 10 minutes.
        </p>
        <input
          required
          autoFocus
          inputMode="numeric"
          placeholder="Code à 6 chiffres"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`${inputClass} text-center text-lg tracking-widest`}
        />

        {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? "Vérification..." : "Valider le code"}
        </button>
        <button
          type="button"
          onClick={() => setStep("credentials")}
          className="w-full text-center text-sm text-white/40 hover:text-white/70"
        >
          Retour
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCredentialsSubmit} className="space-y-4">
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className={inputClass}
      />
      <input
        required
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className={inputClass}
      />

      {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {submitting ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
