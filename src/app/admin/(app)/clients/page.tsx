import { prisma } from "@/lib/prisma";

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { appointments: true, referrals: true },
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-white">
        Clients
      </h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#16141c]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-white/50">
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
              <tr key={client.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 font-medium text-white">{client.name}</td>
                <td className="px-4 py-3 text-white/60">{client.email}</td>
                <td className="px-4 py-3 text-white/60">{client.phone}</td>
                <td className="px-4 py-3">
                  {client.passwordHash ? (
                    <span className="rounded-full bg-[#7c3aed]/20 px-2 py-1 text-xs font-medium text-[#c084fc]">
                      Créé
                    </span>
                  ) : (
                    <span className="text-white/30">Invité</span>
                  )}
                </td>
                <td className="px-4 py-3 text-white/60">{client.referrals.length}</td>
                <td className="px-4 py-3">
                  {client.referralDiscountAvailable ? (
                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                      -10% dispo
                    </span>
                  ) : (
                    <span className="text-white/20">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-white/60">{client.appointments.length}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/30">
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
