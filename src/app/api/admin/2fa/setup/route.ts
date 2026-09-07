import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateTotpSecret } from "@/lib/totp";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const secret = generateTotpSecret();

  await prisma.adminUser.update({
    where: { email: session.user.email },
    data: { totpSecret: secret, totpEnabled: false },
  });

  return NextResponse.json({ secret });
}
