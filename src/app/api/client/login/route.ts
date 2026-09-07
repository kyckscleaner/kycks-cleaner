import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clientLoginSchema } from "@/lib/clientValidation";
import { createClientSession } from "@/lib/clientAuth";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = clientLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const client = await prisma.client.findUnique({ where: { email } });
  if (!client?.passwordHash) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, client.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  }

  await createClientSession(client.id);

  return NextResponse.json({ id: client.id, name: client.name, email: client.email });
}
