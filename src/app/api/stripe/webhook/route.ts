import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) throw new Error("Signature ou secret webhook manquant");
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook invalide: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;
    const appointmentId = session.metadata?.appointmentId;

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "PAYE",
          paidAt: new Date(),
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        },
      });
    }

    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "CONFIRMED" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
