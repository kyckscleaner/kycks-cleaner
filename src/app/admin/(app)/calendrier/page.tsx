import { AdminCalendar } from "@/components/admin/AdminCalendar";

export default function AdminCalendrierPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Calendrier des rendez-vous</h1>
      <p className="mt-1 text-sm text-slate-500">Cliquez sur un rendez-vous pour voir le détail.</p>
      <div className="mt-6">
        <AdminCalendar />
      </div>
    </div>
  );
}
