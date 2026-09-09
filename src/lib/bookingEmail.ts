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

type RescheduleEmailInput = {
  clientEmail: string;
  clientName: string;
  previousDate: Date;
  newDate: Date;
};

export async function sendRescheduleEmail(input: RescheduleEmailInput) {
  const format = (d: Date) =>
    `${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;

  const lines = [
    `Bonjour ${input.clientName.split(" ")[0]},`,
    "",
    `Votre rendez-vous Kycks Cleaner a été déplacé :`,
    "",
    `Ancien créneau : ${format(input.previousDate)}`,
    `Nouveau créneau : ${format(input.newDate)}`,
    "",
    "Si ce nouveau créneau ne vous convient pas, contactez-nous directement.",
    "",
    "Kycks Cleaner",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <onboarding@resend.dev>",
      to: input.clientEmail,
      subject: `Rendez-vous déplacé - nouveau créneau : ${format(input.newDate)}`,
      text: lines.join("\n"),
    });
  } catch {
    // L'échec d'envoi ne doit jamais faire échouer la modification du rendez-vous.
  }
}

type ReminderEmailInput = {
  clientEmail: string;
  clientName: string;
  date: Date;
  address: string;
  city: string;
  postalCode: string;
  serviceNames: string[];
};

export async function sendReminderEmail(input: ReminderEmailInput) {
  const dateLabel = input.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const timeLabel = input.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const lines = [
    `Bonjour ${input.clientName.split(" ")[0]},`,
    "",
    `Petit rappel : votre rendez-vous Kycks Cleaner est demain !`,
    "",
    `📅 ${dateLabel} à ${timeLabel}`,
    `🧽 ${input.serviceNames.join(", ")}`,
    `📍 ${input.address}, ${input.postalCode} ${input.city}`,
    "",
    "Pensez à prévoir un accès à un point d'eau et une prise électrique.",
    "Paiement sur place le jour du rendez-vous.",
    "",
    "À demain !",
    "Kycks Cleaner",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <onboarding@resend.dev>",
      to: input.clientEmail,
      subject: `Rappel : votre rendez-vous demain à ${timeLabel}`,
      text: lines.join("\n"),
    });
    return true;
  } catch {
    return false;
  }
}

type AdminNewBookingInput = {
  adminEmail: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: Date;
  address: string;
  city: string;
  postalCode: string;
  serviceNames: string[];
  totalCents: number;
};

export async function sendAdminNewBookingEmail(input: AdminNewBookingInput) {
  const dateLabel = input.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const timeLabel = input.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const lines = [
    `Nouvelle réservation reçue !`,
    "",
    `👤 ${input.clientName} — ${input.clientPhone} — ${input.clientEmail}`,
    `📅 ${dateLabel} à ${timeLabel}`,
    `🧽 ${input.serviceNames.join(", ")}`,
    `📍 ${input.address}, ${input.postalCode} ${input.city}`,
    `💰 ${centsToEuros(input.totalCents)} à régler sur place`,
    "",
    "Voir le détail dans l'espace pro.",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <onboarding@resend.dev>",
      to: input.adminEmail,
      subject: `Nouvelle réservation - ${dateLabel} à ${timeLabel}`,
      text: lines.join("\n"),
    });
  } catch {
    // L'échec d'envoi de la notification admin ne doit jamais faire échouer la réservation.
  }
}

type AdminDailySummaryAppointment = {
  clientName: string;
  clientPhone: string;
  date: Date;
  address: string;
  city: string;
  serviceNames: string[];
};

export async function sendAdminDailySummaryEmail(adminEmail: string, appointments: AdminDailySummaryAppointment[]) {
  if (appointments.length === 0) return;

  const lines = [
    `Vos rendez-vous de demain (${appointments.length}) :`,
    "",
    ...appointments.flatMap((appt) => [
      `📅 ${appt.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} — ${appt.clientName} (${appt.clientPhone})`,
      `   ${appt.serviceNames.join(", ")} — ${appt.address}, ${appt.city}`,
      "",
    ]),
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <onboarding@resend.dev>",
      to: adminEmail,
      subject: `${appointments.length} rendez-vous demain`,
      text: lines.join("\n"),
    });
  } catch {
    // L'échec d'envoi du récap admin ne doit jamais faire échouer la tâche planifiée.
  }
}
