import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  const data: Record<string, unknown> = {};

  if (body.businessName !== undefined) data.businessName = body.businessName;
  if (body.siret !== undefined) data.siret = body.siret;
  if (body.activityType !== undefined) data.activityType = body.activityType;
  if (body.cotisationRatePercent !== undefined) data.cotisationRatePercent = Number(body.cotisationRatePercent);
  if (body.versementLiberatoireActif !== undefined)
    data.versementLiberatoireActif = Boolean(body.versementLiberatoireActif);
  if (body.versementLiberatoireRate !== undefined)
    data.versementLiberatoireRate = Number(body.versementLiberatoireRate);
  if (body.cfpRatePercent !== undefined) data.cfpRatePercent = Number(body.cfpRatePercent);
  if (body.declarationFrequency !== undefined) data.declarationFrequency = body.declarationFrequency;

  for (const day of [
    "openMonday",
    "openTuesday",
    "openWednesday",
    "openThursday",
    "openFriday",
    "openSaturday",
    "openSunday",
  ]) {
    if (body[day] !== undefined) data[day] = Boolean(body[day]);
  }

  const settings = await prisma.businessSettings.update({
    where: { id: "singleton" },
    data,
  });

  return NextResponse.json(settings);
}
