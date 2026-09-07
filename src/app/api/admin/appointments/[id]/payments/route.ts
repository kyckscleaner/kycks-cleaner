import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { eurosToCents } from "@/lib/money";

const VALID_METHODS = ["ESPECES", "VIREMENT", "CHEQUE", "CARTE_SUR_PLACE"];

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (!VALID_METHODS.includes(body.method)) {
    return NextResponse.json({ error: "Moyen de paiement invalide" }, { status: 400 });
  }
  const amountEuros = Number(body.amountEuros);
  if (!amountEuros || amountEuros <= 0) {
    return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      appointmentId: id,
      amountCents: eurosToCents(amountEuros),
      method: body.method,
      status: "PAYE",
      paidAt: new Date(),
    },
  });

  return NextResponse.json(payment);
}
