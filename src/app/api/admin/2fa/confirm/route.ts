import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyTotpCode } from "@/lib/totp";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const code = body?.code as string | undefined;

  const user = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
  if (!user?.totpSecret) {
    return NextResponse.json({ error: "Configuration non initialisée" }, { status: 400 });
  }

  if (!code || !verifyTotpCode(code, user.totpSecret)) {
    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  }

  await prisma.adminUser.update({
    where: { email: session.user.email },
    data: { totpEnabled: true },
  });

  return NextResponse.json({ ok: true });
}
