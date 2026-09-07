"use client";

import { useRouter } from "next/navigation";

export function ClientLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/client/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10"
    >
      Déconnexion
    </button>
  );
}
