import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendAnniversaryDiscountEmail,
  sendAdminAnniversaryNotification,
  sendBirthdayDiscountEmail,
  sendAdminBirthdayNotification,
} from "@/lib/bookingEmail";
import { REFERRAL_DISCOUNT_PERCENT } from "@/lib/referral";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();

  const candidates = await prisma.client.findMany({
    where: {
      passwordHash: { not: null }, // seulement les vrais comptes créés, pas les réservations en invité
      anniversaryDiscountSentAt: null,
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const admin = await prisma.adminUser.findFirst();

  let sent = 0;
  for (const client of candidates) {
    const created = client.createdAt;
    const isOneYearAnniversary =
      created.getMonth() === now.getMonth() &&
      created.getDate() === now.getDate() &&
      created.getFullYear() < now.getFullYear();

    if (!isOneYearAnniversary) continue;

    await prisma.client.update({
      where: { id: client.id },
      data: { anniversaryDiscountAvailable: true, anniversaryDiscountSentAt: now },
    });

    const ok = await sendAnniversaryDiscountEmail(client.email, client.name, REFERRAL_DISCOUNT_PERCENT);
    if (ok) sent++;

    if (admin) {
      await sendAdminAnniversaryNotification(admin.email, client.name, client.email);
    }
  }

  // Réduction pour l'anniversaire de naissance (chaque année, contrairement à celle du compte)
  const birthdayCandidates = await prisma.client.findMany({
    where: { birthDate: { not: null } },
    select: { id: true, name: true, email: true, birthDate: true, birthdayDiscountSentYear: true },
  });

  let birthdaySent = 0;
  for (const client of birthdayCandidates) {
    if (!client.birthDate) continue;
    const isBirthdayToday =
      client.birthDate.getMonth() === now.getMonth() && client.birthDate.getDate() === now.getDate();
    const alreadySentThisYear = client.birthdayDiscountSentYear === now.getFullYear();

    if (!isBirthdayToday || alreadySentThisYear) continue;

    await prisma.client.update({
      where: { id: client.id },
      data: { birthdayDiscountAvailable: true, birthdayDiscountSentYear: now.getFullYear() },
    });

    const ok = await sendBirthdayDiscountEmail(client.email, client.name, REFERRAL_DISCOUNT_PERCENT);
    if (ok) birthdaySent++;

    if (admin) {
      await sendAdminBirthdayNotification(admin.email, client.name, client.email);
    }
  }

  return NextResponse.json({
    checked: candidates.length,
    sent,
    birthdayChecked: birthdayCandidates.length,
    birthdaySent,
  });
}
