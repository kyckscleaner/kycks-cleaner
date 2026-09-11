"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-[#a855f7] focus:outline-none";

export function ClientSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledRef = searchParams.get("ref") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [referralCode, setReferralCode] = useState(prefilledRef);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/client/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        birthDate,
        referralCode: referralCode || undefined,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erreur lors de la création du compte");
      setSubmitting(false);
      return;
    }

    router.push("/compte");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input required placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      <input required placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      <input required type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      <label className="block">
        <span className="mb-1 block text-xs text-white/50">Date de naissance</span>
        <input
          required
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`${inputClass} [color-scheme:dark]`}
        />
      </label>
      <input
        placeholder="Code de parrainage (optionnel)"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
        className={inputClass}
      />

      {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
      >
        {submitting ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
