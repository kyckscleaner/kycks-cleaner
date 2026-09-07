import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const service = await prisma.service.update({
    where: { id },
    data: {
      priceCents: Math.round(Number(body.priceEuros) * 100),
      durationMinutes: Number(body.durationMinutes),
      active: Boolean(body.active),
    },
  });

  return NextResponse.json(service);
}
