import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clientSignupSchema } from "@/lib/clientValidation";
import { generateUniqueReferralCode } from "@/lib/referral";
import { createClientSession } from "@/lib/clientAuth";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = clientSignupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const passwordHash = await bcrypt.hash(data.password, 10);

  const existing = await prisma.client.findUnique({ where: { email: data.email } });
  if (existing?.passwordHash) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email. Connectez-vous." },
      { status: 409 }
    );
  }

  let referrer = null;
  if (data.referralCode) {
    referrer = await prisma.client.findUnique({ where: { referralCode: data.referralCode.toUpperCase() } });
  }

  const ownReferralCode = await generateUniqueReferralCode();

  const client = existing
    ? await prisma.client.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          phone: data.phone,
          passwordHash,
          referralCode: existing.referralCode ?? ownReferralCode,
          referredById: referrer && referrer.id !== existing.id ? referrer.id : undefined,
          referralDiscountAvailable: referrer && referrer.id !== existing.id ? true : undefined,
        },
      })
    : await prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          referralCode: ownReferralCode,
          referredById: referrer?.id,
          referralDiscountAvailable: !!referrer,
        },
      });

  if (referrer) {
    await prisma.client.update({
      where: { id: referrer.id },
      data: { referralDiscountAvailable: true },
    });
  }

  await createClientSession(client.id);

  return NextResponse.json({ id: client.id, name: client.name, email: client.email });
}
