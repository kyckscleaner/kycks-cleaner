import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TwoFactorSetup } from "@/components/admin/TwoFactorSetup";

export default async function AdminSecuritePage() {
  const session = await auth();
  const user = session?.user?.email
    ? await prisma.adminUser.findUnique({ where: { email: session.user.email } })
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Sécurité</h1>
      <p className="mt-1 text-sm text-slate-500">
        Protège l&apos;accès à ton espace pro avec une double vérification.
      </p>
      <div className="mt-6">
        <TwoFactorSetup initiallyEnabled={user?.totpEnabled ?? false} />
      </div>
    </div>
  );
}
