import { resend } from "@/lib/resend";
import { centsToEuros } from "@/lib/money";

type BookingEmailInput = {
  clientEmail: string;
  clientName: string;
  date: Date;
  address: string;
  city: string;
  postalCode: string;
  serviceNames: string[];
  totalCents: number;
  discountCents: number;
};

export async function sendBookingConfirmationEmail(input: BookingEmailInput) {
  const dateLabel = input.date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeLabel = input.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const lines = [
    `Bonjour ${input.clientName.split(" ")[0]},`,
    "",
    `Votre rendez-vous Kycks Cleaner est confirmé :`,
    "",
    `📅 ${dateLabel} à ${timeLabel}`,
    `🧽 ${input.serviceNames.join(", ")}`,
    `📍 ${input.address}, ${input.postalCode} ${input.city}`,
    "",
    ...(input.discountCents > 0
      ? [`Réduction parrainage : -${centsToEuros(input.discountCents)}`]
      : []),
    `Total à régler sur place : ${centsToEuros(input.totalCents)}`,
    "",
    "Paiement sur place le jour du rendez-vous. À bientôt !",
    "",
    "Kycks Cleaner",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <onboarding@resend.dev>",
      to: input.clientEmail,
      subject: `Rendez-vous confirmé - ${dateLabel} à ${timeLabel}`,
      text: lines.join("\n"),
    });
  } catch {
    // L'échec d'envoi de l'email de confirmation ne doit jamais faire échouer la réservation.
  }
}
