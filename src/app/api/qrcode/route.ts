import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const target = searchParams.get("target") === "accueil" ? baseUrl : `${baseUrl}/reserver`;

  const pngBuffer = await QRCode.toBuffer(target, {
    type: "png",
    width: 1024,
    margin: 2,
    color: { dark: "#0a0a0d", light: "#ffffff" },
  });

  return new NextResponse(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
