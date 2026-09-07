"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
};

export function ServicesPricingForm({ services }: { services: Service[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(
    services.map((s) => ({
      id: s.id,
      priceEuros: (s.priceCents / 100).toString(),
      durationMinutes: s.durationMinutes.toString(),
      active: s.active,
    }))
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  async function save(id: string) {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setSavingId(id);
    await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    setSavingId(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16141c]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/5 text-white/50">
          <tr>
            <th className="px-4 py-3">Formule</th>
            <th className="px-4 py-3">Prix (€)</th>
            <th className="px-4 py-3">Durée (min)</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, i) => (
            <tr key={service.id} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3 font-medium text-white">{service.name}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  step="0.01"
                  value={rows[i].priceEuros}
                  onChange={(e) => {
                    const next = [...rows];
                    next[i] = { ...next[i], priceEuros: e.target.value };
                    setRows(next);
                  }}
                  className="w-24 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-white"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={rows[i].durationMinutes}
                  onChange={(e) => {
                    const next = [...rows];
                    next[i] = { ...next[i], durationMinutes: e.target.value };
                    setRows(next);
                  }}
                  className="w-20 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-white"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={rows[i].active}
                  onChange={(e) => {
                    const next = [...rows];
                    next[i] = { ...next[i], active: e.target.checked };
                    setRows(next);
                  }}
                  className="h-4 w-4"
                />
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => save(service.id)}
                  disabled={savingId === service.id}
                  className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {savingId === service.id ? "..." : "Enregistrer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
