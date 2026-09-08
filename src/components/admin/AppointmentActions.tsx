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

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteAppointment() {
    setDeleting(true);
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, { method: "DELETE" });
    if (!res.ok) {
      setDeleting(false);
      setError("Erreur lors de la suppression");
      return;
    }
    router.push("/admin/rdv");
    router.refresh();
  }

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
        <p className="mb-2 text-sm font-medium text-white/70">Statut du rendez-vous</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              disabled={updatingStatus}
              onClick={() => updateStatus(s.value)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                status === s.value
                  ? "border-[#a855f7] bg-[#a855f7] text-white"
                  : "border-white/15 text-white/70 hover:border-white/30"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {remainingCents > 0 && (
        <form onSubmit={recordPayment} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-sm font-medium text-white/70">
            Encaisser un paiement (espèces, virement, chèque, ou carte sur place)
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-28 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white"
              placeholder="Montant €"
            />
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#16141c] px-3 py-2 text-white"
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
              className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {recording ? "Enregistrement..." : "Encaisser"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </form>
      )}

      <div className="border-t border-white/10 pt-6">
        {!confirmingDelete ? (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="text-sm font-medium text-red-400 hover:text-red-300"
          >
            Supprimer ce rendez-vous
          </button>
        ) : (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm text-white/80">
              Supprimer définitivement ce rendez-vous et ses paiements associés ? Cette action est
              irréversible.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={deleteAppointment}
                disabled={deleting}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Oui, supprimer"}
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
