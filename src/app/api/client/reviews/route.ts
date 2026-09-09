import { NextResponse } from "next/server";
import { getCurrentClient } from "@/lib/getCurrentClient";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const client = await getCurrentClient();
  if (!client) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  const appointmentId = body.appointmentId;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Note invalide" }, { status: 400 });
  }
  if (!comment) {
    return NextResponse.json({ error: "Commentaire requis" }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { review: true },
  });

  if (!appointment || appointment.clientId !== client.id) {
    return NextResponse.json({ error: "Rendez-vous introuvable" }, { status: 404 });
  }
  if (appointment.status !== "DONE") {
    return NextResponse.json({ error: "Ce rendez-vous n'est pas encore terminé" }, { status: 400 });
  }
  if (appointment.review) {
    return NextResponse.json({ error: "Un avis existe déjà pour ce rendez-vous" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      clientId: client.id,
      appointmentId: appointment.id,
      rating,
      comment,
    },
  });

  return NextResponse.json(review);
}
