import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/calendrier", label: "Calendrier" },
  { href: "/admin/rdv", label: "Rendez-vous" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/finances", label: "URSSAF / Impôts" },
  { href: "/admin/qrcode", label: "QR code" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0f0d13] p-4 sm:flex">
        <Link
          href="/"
          className="mb-8 px-2 font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-white"
        >
          Kycks <span className="text-[#a855f7]">Cleaner</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
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
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white/70">
            Déconnexion ({session.user?.name})
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0f0d13] px-4 py-3 sm:hidden">
          <span className="font-[family-name:var(--font-display)] uppercase tracking-wide text-white">
            Kycks Cleaner — Admin
          </span>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
