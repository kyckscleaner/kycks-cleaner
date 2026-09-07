import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/calendrier", label: "Calendrier" },
  { href: "/admin/rdv", label: "Rendez-vous" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/finances", label: "URSSAF / Impôts" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 sm:flex">
        <Link href="/" className="mb-8 px-2 text-lg font-bold text-slate-900">
          Kycks <span className="text-[#0b3d91]">Cleaner</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 hover:bg-slate-100">
            Déconnexion ({session.user?.name})
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:hidden">
          <span className="font-bold">Kycks Cleaner — Admin</span>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
