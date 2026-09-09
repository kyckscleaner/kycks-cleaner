import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendRescheduleEmail } from "@/lib/bookingEmail";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "DONE", "CANCELLED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  if (body.date !== undefined) {
    const newDate = new Date(body.date);
    if (Number.isNaN(newDate.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!existing) return NextResponse.json({ error: "Rendez-vous introuvable" }, { status: 404 });

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: newDate,
        ...(body.status !== undefined ? { status: body.status } : {}),
      },
    });

    if (existing.date.getTime() !== newDate.getTime()) {
      await sendRescheduleEmail({
        clientEmail: existing.client.email,
        clientName: existing.client.name,
        previousDate: existing.date,
        newDate,
      });
    }

    return NextResponse.json(appointment);
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
