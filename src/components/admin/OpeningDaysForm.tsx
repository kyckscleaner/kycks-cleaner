"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DAYS = [
  { field: "openMonday", label: "Lundi" },
  { field: "openTuesday", label: "Mardi" },
  { field: "openWednesday", label: "Mercredi" },
  { field: "openThursday", label: "Jeudi" },
  { field: "openFriday", label: "Vendredi" },
  { field: "openSaturday", label: "Samedi" },
  { field: "openSunday", label: "Dimanche" },
] as const;

type OpeningDays = Record<(typeof DAYS)[number]["field"], boolean>;

export function OpeningDaysForm({ settings }: { settings: OpeningDays }) {
  const router = useRouter();
  const [days, setDays] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function toggle(field: (typeof DAYS)[number]["field"]) {
    const next = { ...days, [field]: !days[field] };
    setDays(next);
    setSaved(false);
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next[field] }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#16141c] p-6">
      <p className="text-sm text-white/60">
        Décochez les jours où vous n&apos;êtes pas disponible (par exemple à cause d&apos;un autre
        emploi) : ils n&apos;apparaîtront plus du tout comme créneaux réservables.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DAYS.map((day) => (
          <label
            key={day.field}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
              days[day.field]
                ? "border-[#a855f7]/40 bg-[#7c3aed]/10 text-white"
                : "border-white/10 text-white/40"
            }`}
          >
            <input
              type="checkbox"
              checked={days[day.field]}
              onChange={() => toggle(day.field)}
              disabled={saving}
              className="h-4 w-4"
            />
            {day.label}
          </label>
        ))}
      </div>
      {saved && <p className="mt-3 text-sm text-green-400">Jours d&apos;ouverture enregistrés ✓</p>}
    </div>
  );
}
