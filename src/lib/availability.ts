import { prisma } from "@/lib/prisma";

export const OPENING_HOUR = 9;
export const CLOSING_HOUR = 18;
export const SLOT_INTERVAL_MINUTES = 30;
export const MIN_BLOCK_MINUTES = 180; // temps minimum bloqué après chaque RDV (trajet + marge), même si la prestation est plus courte

// index JS getDay() : 0=dimanche, 1=lundi, ... 6=samedi
const OPEN_DAY_FIELDS = [
  "openSunday",
  "openMonday",
  "openTuesday",
  "openWednesday",
  "openThursday",
  "openFriday",
  "openSaturday",
] as const;

export async function getAvailableSlots(dateStr: string, durationMinutes: number) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0);
  const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

  const settings = await prisma.businessSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const isOpenToday = settings[OPEN_DAY_FIELDS[dayStart.getDay()]];
  if (!isOpenToday) return [];

  const appointments = await prisma.appointment.findMany({
    where: {
      status: { not: "CANCELLED" },
      date: { gte: dayStart, lte: dayEnd },
    },
    select: { date: true, durationMinutes: true },
  });

  const busyIntervals = appointments.map((appt) => ({
    start: appt.date.getTime(),
    end: appt.date.getTime() + Math.max(appt.durationMinutes, MIN_BLOCK_MINUTES) * 60_000,
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
