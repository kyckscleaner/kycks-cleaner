import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clientSignupSchema } from "@/lib/clientValidation";
import { generateUniqueReferralCode } from "@/lib/referral";
import { createClientSession } from "@/lib/clientAuth";
import { getClientIp } from "@/lib/requestIp";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = clientSignupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const passwordHash = await bcrypt.hash(data.password, 10);
  const signupIp = getClientIp(req);
  const birthDate = new Date(`${data.birthDate}T00:00:00`);

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

  // Anti-fraude parrainage : même IP (même foyer/appareil) ou même téléphone que le parrain
  // => on garde le lien de parrainage pour la traçabilité, mais aucune réduction n'est accordée.
  let referralBlockedReason: string | null = null;
  if (referrer) {
    if (referrer.phone === data.phone) {
      referralBlockedReason = "Même numéro de téléphone que le parrain";
    } else if (signupIp && referrer.signupIp && signupIp === referrer.signupIp) {
      referralBlockedReason = "Même connexion internet que le parrain";
    }
  }
  const referralValid = !!referrer && !referralBlockedReason;

  const ownReferralCode = await generateUniqueReferralCode();

  const client = existing
    ? await prisma.client.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          phone: data.phone,
          passwordHash,
          birthDate,
          signupIp: existing.signupIp ?? signupIp,
          referralCode: existing.referralCode ?? ownReferralCode,
          referredById: referrer && referrer.id !== existing.id ? referrer.id : undefined,
          referralDiscountAvailable: referrer && referrer.id !== existing.id ? referralValid : undefined,
          referralBlockedReason: referrer && referrer.id !== existing.id ? referralBlockedReason : undefined,
        },
      })
    : await prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          birthDate,
          signupIp,
          referralCode: ownReferralCode,
          referredById: referrer?.id,
          referralDiscountAvailable: referralValid,
          referralBlockedReason,
        },
      });

  if (referrer && referralValid) {
    await prisma.client.update({
      where: { id: referrer.id },
      data: { referralDiscountAvailable: true },
    });
  }

  await createClientSession(client.id);

  return NextResponse.json({ id: client.id, name: client.name, email: client.email });
}
