import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const password = body?.password as string | undefined;

  const user = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
  if (!user || !password || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  await prisma.adminUser.update({
    where: { email: session.user.email },
    data: { totpEnabled: false, totpSecret: null },
  });

  return NextResponse.json({ ok: true });
}
