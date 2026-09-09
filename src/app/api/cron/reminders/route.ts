import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/bookingEmail";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: tomorrowStart, lt: tomorrowEnd },
      status: { in: ["PENDING", "CONFIRMED"] },
      reminderSentAt: null,
    },
    include: { client: true, services: { include: { service: true } } },
  });

  let sent = 0;
  for (const appt of appointments) {
    const ok = await sendReminderEmail({
      clientEmail: appt.client.email,
      clientName: appt.client.name,
      date: appt.date,
      address: appt.address,
      city: appt.city,
      postalCode: appt.postalCode,
      serviceNames: appt.services.map((s) => s.service.name),
    });
    if (ok) {
      await prisma.appointment.update({ where: { id: appt.id }, data: { reminderSentAt: new Date() } });
      sent++;
    }
  }

  return NextResponse.json({ checked: appointments.length, sent });
}
