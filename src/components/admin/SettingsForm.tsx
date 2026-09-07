"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ACTIVITY_TYPE_LABELS } from "@/lib/tax";

type Settings = {
  businessName: string;
  siret: string | null;
  activityType: string;
  cotisationRatePercent: number;
  versementLiberatoireActif: boolean;
  versementLiberatoireRate: number;
  cfpRatePercent: number;
  declarationFrequency: string;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Nom de la micro-entreprise</span>
          <input
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">SIRET</span>
          <input
            value={form.siret ?? ""}
            onChange={(e) => setForm({ ...form, siret: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Type d&apos;activité</span>
          <select
            value={form.activityType}
            onChange={(e) => setForm({ ...form, activityType: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        Les taux ci-dessous sont des valeurs par défaut à titre indicatif. Vérifiez toujours le
        taux en vigueur pour votre activité sur{" "}
        <a
          href="https://www.autoentrepreneur.urssaf.fr"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          autoentrepreneur.urssaf.fr
        </a>{" "}
        avant chaque déclaration.
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Taux cotisations sociales (%)</span>
          <input
            type="number"
            step="0.01"
            value={form.cotisationRatePercent}
            onChange={(e) => setForm({ ...form, cotisationRatePercent: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Contribution formation pro (%)</span>
          <input
            type="number"
            step="0.01"
            value={form.cfpRatePercent}
            onChange={(e) => setForm({ ...form, cfpRatePercent: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Fréquence de déclaration</span>
          <select
            value={form.declarationFrequency}
            onChange={(e) => setForm({ ...form, declarationFrequency: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="mensuel">Mensuelle</option>
            <option value="trimestriel">Trimestrielle</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="versementLiberatoire"
          checked={form.versementLiberatoireActif}
          onChange={(e) => setForm({ ...form, versementLiberatoireActif: e.target.checked })}
          className="h-4 w-4"
        />
        <label htmlFor="versementLiberatoire" className="text-sm font-medium text-slate-700">
          J&apos;ai opté pour le versement libératoire de l&apos;impôt sur le revenu
        </label>
        {form.versementLiberatoireActif && (
          <input
            type="number"
            step="0.01"
            value={form.versementLiberatoireRate}
            onChange={(e) => setForm({ ...form, versementLiberatoireRate: Number(e.target.value) })}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2"
          />
        )}
        {form.versementLiberatoireActif && <span className="text-sm text-slate-500">%</span>}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#0b3d91] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        {saved && <span className="text-sm text-green-700">Paramètres enregistrés ✓</span>}
      </div>
    </form>
  );
}
