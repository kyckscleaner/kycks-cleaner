import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function GET() {
  const settings = await prisma.businessSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const openWeekdays = OPEN_DAY_FIELDS.map((field, i) => (settings[field] ? i : null)).filter(
    (i): i is number => i !== null
  );

  return NextResponse.json({ openWeekdays });
}
