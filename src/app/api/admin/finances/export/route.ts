import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()), 10);

  const payments = await prisma.payment.findMany({
    where: {
      status: "PAYE",
      paidAt: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) },
    },
    orderBy: { paidAt: "asc" },
    include: { appointment: { include: { client: true } } },
  });

  const header = "Date;Client;Méthode;Montant (EUR);Rendez-vous";
  const rows = payments.map((p) => {
    const date = p.paidAt ? p.paidAt.toLocaleDateString("fr-FR") : "";
    const amount = (p.amountCents / 100).toFixed(2).replace(".", ",");
    return [date, p.appointment.client.name, p.method, amount, p.appointmentId].join(";");
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kycks-cleaner-encaissements-${year}.csv"`,
    },
  });
}
