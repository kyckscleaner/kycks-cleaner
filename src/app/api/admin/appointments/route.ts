import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "asc" },
    include: { client: true, services: { include: { service: true } } },
  });

  return NextResponse.json(
    appointments.map((appt) => ({
      id: appt.id,
      title: `${appt.client.name} - ${appt.services.map((s) => s.service.name).join(", ")}`,
      start: appt.date.toISOString(),
      end: new Date(appt.date.getTime() + appt.durationMinutes * 60_000).toISOString(),
      status: appt.status,
    }))
  );
}
