import { AdminCalendar } from "@/components/admin/AdminCalendar";

export default function AdminCalendrierPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
        Calendrier des rendez-vous
      </h1>
      <p className="mt-1 text-sm text-white/50">Cliquez sur un rendez-vous pour voir le détail.</p>
      <div className="mt-6">
        <AdminCalendar />
      </div>
    </div>
  );
}
