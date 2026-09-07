import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.json();
  const appointmentId = body?.appointmentId as string | undefined;
  const payMode = body?.payMode === "acompte" ? "acompte" : "total";

  if (!appointmentId) {
    return NextResponse.json({ error: "appointmentId manquant" }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: true,
      services: { include: { service: true } },
      options: { include: { option: true } },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Rendez-vous introuvable" }, { status: 404 });
  }

  const amountCents =
    payMode === "acompte" ? Math.round(appointment.totalCents * 0.3) : appointment.totalCents;

  const payment = await prisma.payment.create({
    data: {
      appointmentId: appointment.id,
      amountCents,
      method: "CARTE_EN_LIGNE",
      status: "EN_ATTENTE",
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: appointment.client.email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          product_data: {
            name:
              payMode === "acompte"
                ? "Acompte (30%) - Kycks Cleaner"
                : "Nettoyage véhicule - Kycks Cleaner",
            description: [
              ...appointment.services.map((s) => s.service.name),
              ...appointment.options.map((o) => o.option.name),
            ].join(", "),
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: appointment.id,
      paymentId: payment.id,
    },
    success_url: `${baseUrl}/reservation/confirmation?appointmentId=${appointment.id}`,
    cancel_url: `${baseUrl}/reserver?annule=1`,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeCheckoutId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
