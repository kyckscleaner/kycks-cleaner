import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") ?? "60", 10);

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Paramètre date invalide" }, { status: 400 });
  }

  const slots = await getAvailableSlots(date, duration);
  return NextResponse.json({ slots });
}
