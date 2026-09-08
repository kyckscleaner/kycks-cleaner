import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "DONE", "CANCELLED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json(appointment);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  await prisma.appointment.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
