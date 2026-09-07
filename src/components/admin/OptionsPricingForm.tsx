"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  id: string;
  name: string;
  priceCents: number;
  active: boolean;
};

export function OptionsPricingForm({ options }: { options: Option[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(
    options.map((o) => ({
      id: o.id,
      priceEuros: (o.priceCents / 100).toString(),
      active: o.active,
    }))
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  async function save(id: string) {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setSavingId(id);
    await fetch(`/api/admin/options/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    setSavingId(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">Option</th>
            <th className="px-4 py-3">Prix (€)</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, i) => (
            <tr key={option.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3 font-medium text-slate-900">{option.name}</td>
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
                  className="w-24 rounded-lg border border-slate-300 px-2 py-1"
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
                  onClick={() => save(option.id)}
                  disabled={savingId === option.id}
                  className="rounded-full bg-[#0b3d91] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {savingId === option.id ? "..." : "Enregistrer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
