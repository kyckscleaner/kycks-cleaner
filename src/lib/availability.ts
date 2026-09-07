import { prisma } from "@/lib/prisma";

export const OPENING_HOUR = 8;
export const CLOSING_HOUR = 18;
export const SLOT_INTERVAL_MINUTES = 30;
export const CLOSED_WEEKDAY = 0; // Dimanche

export async function getAvailableSlots(dateStr: string, durationMinutes: number) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0);
  const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

  if (dayStart.getDay() === CLOSED_WEEKDAY) return [];

  const appointments = await prisma.appointment.findMany({
    where: {
      status: { not: "CANCELLED" },
      date: { gte: dayStart, lte: dayEnd },
    },
    select: { date: true, durationMinutes: true },
  });

  const busyIntervals = appointments.map((appt) => ({
    start: appt.date.getTime(),
    end: appt.date.getTime() + appt.durationMinutes * 60_000,
  }));

  const now = new Date();
  const slots: string[] = [];

  for (let minutes = OPENING_HOUR * 60; minutes + durationMinutes <= CLOSING_HOUR * 60; minutes += SLOT_INTERVAL_MINUTES) {
    const slotStart = new Date(year, month - 1, day, 0, minutes, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000);

    if (slotStart < now) continue;

    const overlaps = busyIntervals.some(
      (busy) => slotStart.getTime() < busy.end && slotEnd.getTime() > busy.start
    );
    if (overlaps) continue;

    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }

  return slots;
}
