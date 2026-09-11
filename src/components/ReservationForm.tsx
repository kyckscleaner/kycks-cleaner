"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Service = {
  id: string;
  code: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
};

type Option = {
  id: string;
  code: string;
  name: string;
  priceCents: number;
};

type LoggedInClient = {
  name: string;
  email: string;
  phone: string;
  referralDiscountAvailable: boolean;
  anniversaryDiscountAvailable: boolean;
};

const REFERRAL_DISCOUNT_PERCENT = 10;

function centsToEuros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const inputClass =
  "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-[#a855f7] focus:outline-none disabled:opacity-60";

export function ReservationForm({
  services,
  options,
  loggedInClient,
}: {
  services: Service[];
  options: Option[];
  loggedInClient: LoggedInClient | null;
}) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service");

  const [selectedCodes, setSelectedCodes] = useState<string[]>(preselected ? [preselected] : []);
  const [selectedOptionCodes, setSelectedOptionCodes] = useState<string[]>([]);
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState<string | null>(null);

  const [clientName, setClientName] = useState(loggedInClient?.name ?? "");
  const [clientEmail, setClientEmail] = useState(loggedInClient?.email ?? "");
  const [clientPhone, setClientPhone] = useState(loggedInClient?.phone ?? "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [useReferralDiscount, setUseReferralDiscount] = useState(
    (loggedInClient?.referralDiscountAvailable || loggedInClient?.anniversaryDiscountAvailable) ?? false
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedServices = useMemo(
    () => services.filter((s) => selectedCodes.includes(s.code)),
    [services, selectedCodes]
  );
  const selectedOptions = useMemo(
    () => options.filter((o) => selectedOptionCodes.includes(o.code)),
    [options, selectedOptionCodes]
  );
  const subtotalCents =
    selectedServices.reduce((sum, s) => sum + s.priceCents, 0) +
    selectedOptions.reduce((sum, o) => sum + o.priceCents, 0);
  const hasAvailableDiscount =
    loggedInClient?.referralDiscountAvailable || loggedInClient?.anniversaryDiscountAvailable;
  const discountCents =
    hasAvailableDiscount && useReferralDiscount
      ? Math.round((subtotalCents * REFERRAL_DISCOUNT_PERCENT) / 100)
      : 0;
  const totalCents = subtotalCents - discountCents;
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  function toggleService(code: string) {
    if (code === "complet") {
      setSelectedCodes((prev) => (prev.includes("complet") ? [] : ["complet"]));
      return;
    }
    setSelectedCodes((prev) => {
      const withoutComplet = prev.filter((c) => c !== "complet");
      return withoutComplet.includes(code)
        ? withoutComplet.filter((c) => c !== code)
        : [...withoutComplet, code];
    });
  }

  function toggleOption(code: string) {
    setSelectedOptionCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  useEffect(() => {
    if (totalDuration === 0) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setTime(null);
    fetch(`/api/disponibilites?date=${date}&duration=${totalDuration}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [date, totalDuration]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (selectedCodes.length === 0) {
      setError("Sélectionnez au moins une formule.");
      return;
    }
    if (!time) {
      setError("Sélectionnez un créneau horaire.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCodes: selectedCodes,
          optionCodes: selectedOptionCodes,
          date,
          time,
          clientName,
          clientEmail,
          clientPhone,
          address,
          city,
          postalCode,
          vehicleInfo,
          notes,
          applyReferralDiscount: useReferralDiscount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.formErrors?.[0] ?? data.error ?? "Erreur lors de la réservation");
        setSubmitting(false);
        return;
      }

      window.location.href = `/reservation/confirmation?appointmentId=${data.appointmentId}`;
    } catch {
      setError("Une erreur est survenue, merci de réessayer.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-10">
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
          1. Choisissez votre formule
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {services.map((service) => {
            const active = selectedCodes.includes(service.code);
            return (
              <button
                type="button"
                key={service.code}
                onClick={() => toggleService(service.code)}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-[#a855f7] bg-[#7c3aed]/10 ring-2 ring-[#a855f7]"
                    : "border-white/15 bg-white/5 hover:border-white/30"
                }`}
              >
                <p className="font-semibold text-white">{service.name}</p>
                <p className="mt-1 text-sm text-[#a855f7]">{centsToEuros(service.priceCents)}</p>
                <p className="text-xs text-white/40">{service.durationMinutes} min</p>
              </button>
            );
          })}
        </div>
      </section>

      {options.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
            2. Options (facultatif)
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {options.map((option) => {
              const active = selectedOptionCodes.includes(option.code);
              return (
                <button
                  type="button"
                  key={option.code}
                  onClick={() => toggleOption(option.code)}
                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                    active
                      ? "border-[#a855f7] bg-[#7c3aed]/10"
                      : "border-white/15 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <span className="text-white/80">{option.name}</span>
                  <span className="font-semibold text-[#a855f7]">+{centsToEuros(option.priceCents)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
          3. Choisissez un créneau
        </h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
          <div className="flex flex-1 flex-wrap gap-2">
            {totalDuration === 0 && (
              <p className="text-sm text-white/40">Choisissez d&apos;abord une formule.</p>
            )}
            {totalDuration > 0 && loadingSlots && <p className="text-sm text-white/40">Chargement des créneaux…</p>}
            {totalDuration > 0 && !loadingSlots && slots.length === 0 && (
              <p className="text-sm text-white/40">Aucun créneau disponible ce jour-là.</p>
            )}
            {slots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setTime(slot)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  time === slot
                    ? "border-[#a855f7] bg-[#a855f7] text-white"
                    : "border-white/15 text-white/70 hover:border-white/30"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white">
          4. Vos coordonnées et le lieu
        </h2>
        {loggedInClient && (
          <p className="mt-2 text-sm text-white/50">
            Connecté en tant que <span className="text-white">{loggedInClient.email}</span>
          </p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input required disabled={!!loggedInClient} placeholder="Nom complet" value={clientName} onChange={(e) => setClientName(e.target.value)} className={`${inputClass} sm:col-span-2`} />
          <input required disabled={!!loggedInClient} type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className={inputClass} />
          <input required placeholder="Téléphone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className={inputClass} />
          <input required placeholder="Adresse (où intervenir)" value={address} onChange={(e) => setAddress(e.target.value)} className={`${inputClass} sm:col-span-2`} />
          <input required placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
          <input required placeholder="Code postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputClass} />
          <input placeholder="Véhicule (marque, modèle...)" value={vehicleInfo} onChange={(e) => setVehicleInfo(e.target.value)} className={`${inputClass} sm:col-span-2`} />
          <textarea placeholder="Notes (optionnel)" value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} sm:col-span-2`} rows={3} />
        </div>
      </section>

      {hasAvailableDiscount && (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <input
            type="checkbox"
            checked={useReferralDiscount}
            onChange={(e) => setUseReferralDiscount(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-green-400">
            {loggedInClient?.referralDiscountAvailable
              ? `Utiliser ma réduction de parrainage (-${REFERRAL_DISCOUNT_PERCENT}%)`
              : `Utiliser ma réduction anniversaire (-${REFERRAL_DISCOUNT_PERCENT}%)`}
          </span>
        </label>
      )}

      {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <div className="border-t border-white/10 pt-6">
        {discountCents > 0 && (
          <div className="mb-2 flex justify-between text-sm text-white/50">
            <span>Sous-total</span>
            <span>{centsToEuros(subtotalCents)}</span>
          </div>
        )}
        {discountCents > 0 && (
          <div className="mb-4 flex justify-between text-sm text-green-400">
            <span>Réduction parrainage</span>
            <span>-{centsToEuros(discountCents)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Total à régler sur place</p>
            <p className="text-2xl font-extrabold text-white">{centsToEuros(totalCents)}</p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-6 py-3 font-semibold text-white shadow-[0_0_30px_-6px_#a855f7] transition hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "Réservation..." : "Confirmer le rendez-vous"}
          </button>
        </div>
      </div>
    </form>
  );
}
