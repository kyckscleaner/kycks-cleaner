import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();

  const settings = await prisma.businessSettings.update({
    where: { id: "singleton" },
    data: {
      businessName: body.businessName,
      siret: body.siret,
      activityType: body.activityType,
      cotisationRatePercent: Number(body.cotisationRatePercent),
      versementLiberatoireActif: Boolean(body.versementLiberatoireActif),
      versementLiberatoireRate: Number(body.versementLiberatoireRate),
      cfpRatePercent: Number(body.cfpRatePercent),
      declarationFrequency: body.declarationFrequency,
    },
  });

  return NextResponse.json(settings);
}
