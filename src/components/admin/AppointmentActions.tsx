"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmé" },
  { value: "DONE", label: "Terminé" },
  { value: "CANCELLED", label: "Annulé" },
];

const PAYMENT_METHODS = [
  { value: "ESPECES", label: "Espèces" },
  { value: "VIREMENT", label: "Virement" },
  { value: "CHEQUE", label: "Chèque" },
  { value: "CARTE_SUR_PLACE", label: "Carte sur place (TPE/appli tierce)" },
];

export function AppointmentActions({
  appointmentId,
  currentStatus,
  remainingCents,
}: {
  appointmentId: string;
  currentStatus: string;
  remainingCents: number;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [amount, setAmount] = useState(remainingCents > 0 ? (remainingCents / 100).toString() : "");
  const [method, setMethod] = useState("ESPECES");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    setUpdatingStatus(true);
    setStatus(newStatus);
    await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdatingStatus(false);
    router.refresh();
  }

  async function recordPayment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setRecording(true);
    const res = await fetch(`/api/admin/appointments/${appointmentId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountEuros: parseFloat(amount), method }),
    });
    setRecording(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de l'encaissement");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Statut du rendez-vous</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              disabled={updatingStatus}
              onClick={() => updateStatus(s.value)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                status === s.value
                  ? "border-[#0b3d91] bg-[#0b3d91] text-white"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {remainingCents > 0 && (
        <form onSubmit={recordPayment} className="rounded-xl border border-slate-200 p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Encaisser un paiement (espèces, virement, chèque, ou carte sur place)
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-28 rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Montant €"
            />
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={recording}
              className="rounded-full bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {recording ? "Enregistrement..." : "Encaisser"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      )}
    </div>
  );
}
