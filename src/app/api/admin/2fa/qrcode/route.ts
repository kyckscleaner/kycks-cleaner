import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildOtpAuthUrl } from "@/lib/totp";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const user = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
  if (!user?.totpSecret) return NextResponse.json({ error: "Configuration non initialisée" }, { status: 400 });

  const otpauthUrl = buildOtpAuthUrl(user.email, user.totpSecret);
  const pngBuffer = await QRCode.toBuffer(otpauthUrl, { type: "png", width: 320, margin: 2 });

  return new NextResponse(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
  });
}
