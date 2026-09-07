import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { appointments: true, referrals: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Clients</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Compte</th>
              <th className="px-4 py-3">Filleuls</th>
              <th className="px-4 py-3">Réduction dispo</th>
              <th className="px-4 py-3">Rendez-vous</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">{client.name}</td>
                <td className="px-4 py-3 text-slate-600">{client.email}</td>
                <td className="px-4 py-3 text-slate-600">{client.phone}</td>
                <td className="px-4 py-3">
                  {client.passwordHash ? (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Créé
                    </span>
                  ) : (
                    <span className="text-slate-400">Invité</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{client.referrals.length}</td>
                <td className="px-4 py-3">
                  {client.referralDiscountAvailable ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      -10% dispo
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{client.appointments.length}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  Aucun client pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
