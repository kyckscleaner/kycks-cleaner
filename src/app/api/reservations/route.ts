import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validation";
import { getAvailableSlots } from "@/lib/availability";
import { getClientIdFromSession } from "@/lib/clientAuth";
import { REFERRAL_DISCOUNT_PERCENT } from "@/lib/referral";
import { sendBookingConfirmationEmail, sendAdminNewBookingEmail } from "@/lib/bookingEmail";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const [services, options] = await Promise.all([
    prisma.service.findMany({ where: { code: { in: data.serviceCodes }, active: true } }),
    prisma.serviceOption.findMany({ where: { code: { in: data.optionCodes }, active: true } }),
  ]);

  if (services.length !== data.serviceCodes.length) {
    return NextResponse.json({ error: "Une ou plusieurs formules sont introuvables" }, { status: 400 });
  }
  if (options.length !== data.optionCodes.length) {
    return NextResponse.json({ error: "Une ou plusieurs options sont introuvables" }, { status: 400 });
  }

  const durationMinutes = services.reduce((sum, s) => sum + s.durationMinutes, 0);
  const subtotalCents =
    services.reduce((sum, s) => sum + s.priceCents, 0) +
    options.reduce((sum, o) => sum + o.priceCents, 0);

  // Re-vérification du créneau pour éviter les doubles réservations (race condition)
  const availableSlots = await getAvailableSlots(data.date, durationMinutes);
  if (!availableSlots.includes(data.time)) {
    return NextResponse.json(
      { error: "Ce créneau vient d'être réservé, merci d'en choisir un autre." },
      { status: 409 }
    );
  }

  const [year, month, day] = data.date.split("-").map(Number);
  const [hour, minute] = data.time.split(":").map(Number);
  const appointmentDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  // La réduction de parrainage n'est appliquée que pour un compte client authentifié
  // (jamais sur la seule foi de l'email saisi dans le formulaire, pour éviter les abus).
  const sessionClientId = await getClientIdFromSession();
  const sessionClient = sessionClientId
    ? await prisma.client.findUnique({ where: { id: sessionClientId } })
    : null;

  const client = sessionClient
    ? await prisma.client.update({
        where: { id: sessionClient.id },
        data: { phone: data.clientPhone },
      })
    : await prisma.client.upsert({
        where: { email: data.clientEmail },
        update: { name: data.clientName, phone: data.clientPhone },
        create: { name: data.clientName, email: data.clientEmail, phone: data.clientPhone },
      });

  // Un client peut avoir au plus une réduction active à la fois (parrainage prioritaire sur anniversaire).
  const useReferralDiscount =
    data.applyReferralDiscount && sessionClient?.referralDiscountAvailable === true;
  const useAnniversaryDiscount =
    !useReferralDiscount && data.applyReferralDiscount && sessionClient?.anniversaryDiscountAvailable === true;
  const applyDiscount = useReferralDiscount || useAnniversaryDiscount;
  const discountCents = applyDiscount ? Math.round((subtotalCents * REFERRAL_DISCOUNT_PERCENT) / 100) : 0;
  const totalCents = subtotalCents - discountCents;

  const appointment = await prisma.appointment.create({
    data: {
      clientId: client.id,
      date: appointmentDate,
      durationMinutes,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      vehicleInfo: data.vehicleInfo,
      notes: data.notes,
      discountCents,
      totalCents,
      services: {
        create: services.map((s) => ({ serviceId: s.id, priceCents: s.priceCents })),
      },
      options: {
        create: options.map((o) => ({ optionId: o.id, priceCents: o.priceCents })),
      },
    },
  });

  if (useReferralDiscount) {
    await prisma.client.update({
      where: { id: client.id },
      data: { referralDiscountAvailable: false },
    });
  } else if (useAnniversaryDiscount) {
    await prisma.client.update({
      where: { id: client.id },
      data: { anniversaryDiscountAvailable: false },
    });
  }

  await sendBookingConfirmationEmail({
    clientEmail: client.email,
    clientName: client.name,
    date: appointmentDate,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    serviceNames: services.map((s) => s.name),
    totalCents,
    discountCents,
  });

  const admin = await prisma.adminUser.findFirst();
  if (admin) {
    await sendAdminNewBookingEmail({
      adminEmail: admin.email,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      date: appointmentDate,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      serviceNames: services.map((s) => s.name),
      totalCents,
    });
  }

  return NextResponse.json({ appointmentId: appointment.id, totalCents });
}
