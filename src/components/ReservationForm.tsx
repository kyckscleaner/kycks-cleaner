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

function centsToEuros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ReservationForm({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service");

  const [selectedCodes, setSelectedCodes] = useState<string[]>(preselected ? [preselected] : []);
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [payMode, setPayMode] = useState<"total" | "acompte">("total");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedServices = useMemo(
    () => services.filter((s) => selectedCodes.includes(s.code)),
    [services, selectedCodes]
  );
  const totalCents = selectedServices.reduce((sum, s) => sum + s.priceCents, 0);
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
      const resResa = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCodes: selectedCodes,
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
        }),
      });
      const resaData = await resResa.json();
      if (!resResa.ok) {
        setError(resaData.error?.formErrors?.[0] ?? resaData.error ?? "Erreur lors de la réservation");
        setSubmitting(false);
        return;
      }

      const resCheckout = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: resaData.appointmentId, payMode }),
      });
      const checkoutData = await resCheckout.json();
      if (!resCheckout.ok) {
        setError(checkoutData.error ?? "Erreur lors du paiement");
        setSubmitting(false);
        return;
      }

      window.location.href = checkoutData.url;
    } catch {
      setError("Une erreur est survenue, merci de réessayer.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-10">
      <section>
        <h2 className="text-lg font-bold text-slate-900">1. Choisissez votre formule</h2>
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
                    ? "border-[#0b3d91] bg-blue-50 ring-2 ring-[#0b3d91]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-semibold text-slate-900">{service.name}</p>
                <p className="mt-1 text-sm text-[#0b3d91]">{centsToEuros(service.priceCents)}</p>
                <p className="text-xs text-slate-400">{service.durationMinutes} min</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">2. Choisissez un créneau</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <div className="flex flex-1 flex-wrap gap-2">
            {totalDuration === 0 && (
              <p className="text-sm text-slate-400">Choisissez d&apos;abord une formule.</p>
            )}
            {totalDuration > 0 && loadingSlots && <p className="text-sm text-slate-400">Chargement des créneaux…</p>}
            {totalDuration > 0 && !loadingSlots && slots.length === 0 && (
              <p className="text-sm text-slate-400">Aucun créneau disponible ce jour-là.</p>
            )}
            {slots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setTime(slot)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  time === slot
                    ? "border-[#0b3d91] bg-[#0b3d91] text-white"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">3. Vos coordonnées et le lieu</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input required placeholder="Nom complet" value={clientName} onChange={(e) => setClientName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2" />
          <input required type="email" placeholder="Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <input required placeholder="Téléphone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <input required placeholder="Adresse (où intervenir)" value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2" />
          <input required placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <input required placeholder="Code postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <input placeholder="Véhicule (marque, modèle...)" value={vehicleInfo} onChange={(e) => setVehicleInfo(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2" />
          <textarea placeholder="Notes (optionnel)" value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2" rows={3} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">4. Paiement</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setPayMode("total")}
            className={`flex-1 rounded-xl border p-4 text-left ${payMode === "total" ? "border-[#0b3d91] bg-blue-50 ring-2 ring-[#0b3d91]" : "border-slate-200"}`}
          >
            <p className="font-semibold text-slate-900">Payer la totalité</p>
            <p className="text-sm text-slate-600">{centsToEuros(totalCents)}</p>
          </button>
          <button
            type="button"
            onClick={() => setPayMode("acompte")}
            className={`flex-1 rounded-xl border p-4 text-left ${payMode === "acompte" ? "border-[#0b3d91] bg-blue-50 ring-2 ring-[#0b3d91]" : "border-slate-200"}`}
          >
            <p className="font-semibold text-slate-900">Payer un acompte (30%)</p>
            <p className="text-sm text-slate-600">{centsToEuros(Math.round(totalCents * 0.3))} maintenant, reste sur place</p>
          </button>
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <div>
          <p className="text-sm text-slate-500">Total de la prestation</p>
          <p className="text-2xl font-extrabold text-slate-900">{centsToEuros(totalCents)}</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#0b3d91] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#0a2f70] disabled:opacity-50"
        >
          {submitting ? "Redirection..." : "Confirmer et payer"}
        </button>
      </div>
    </form>
  );
}
