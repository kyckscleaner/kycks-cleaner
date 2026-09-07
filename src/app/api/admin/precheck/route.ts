import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendLoginCode } from "@/lib/emailOtp";

export async function POST(req: Request) {
  const body = await req.json();
  const emailRaw = body?.email as string | undefined;
  const passwordRaw = body?.password as string | undefined;
  const email = emailRaw?.trim().toLowerCase();
  const password = passwordRaw?.trim();

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
  }

  await sendLoginCode(email);

  return NextResponse.json({ ok: true });
}
