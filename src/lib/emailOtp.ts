import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

const CODE_TTL_MINUTES = 10;

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendLoginCode(email: string) {
  const code = generateSixDigitCode();
  const loginCodeHash = await bcrypt.hash(code, 10);
  const loginCodeExpiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000);

  await prisma.adminUser.update({
    where: { email },
    data: { loginCodeHash, loginCodeExpiresAt },
  });

  await resend.emails.send({
    from: "Kycks Cleaner <onboarding@resend.dev>",
    to: email,
    subject: `Code de connexion : ${code}`,
    text: `Votre code de connexion à l'espace pro Kycks Cleaner : ${code}\n\nCe code expire dans ${CODE_TTL_MINUTES} minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
  });
}

export async function verifyLoginCode(email: string, code: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user?.loginCodeHash || !user.loginCodeExpiresAt) return false;
  if (user.loginCodeExpiresAt < new Date()) return false;

  const valid = await bcrypt.compare(code, user.loginCodeHash);
  if (!valid) return false;

  // Code à usage unique : on l'invalide immédiatement après vérification.
  await prisma.adminUser.update({
    where: { email },
    data: { loginCodeHash: null, loginCodeExpiresAt: null },
  });

  return true;
}
