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
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
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
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
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
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
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
  services: { name: string; priceCents: number }[];
  options: { name: string; priceCents: number }[];
  discountCents: number;
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
    ...input.services.map((s) => `🧽 ${s.name} ${centsToEuros(s.priceCents)}`),
    ...input.options.map((o) => `➕ ${o.name} ${centsToEuros(o.priceCents)}`),
    `📍 ${input.address}, ${input.postalCode} ${input.city}`,
    ...(input.discountCents > 0 ? [`🎁 Réduction : -${centsToEuros(input.discountCents)}`] : []),
    `💰 ${centsToEuros(input.totalCents)} à régler sur place`,
    "",
    "Voir le détail dans l'espace pro.",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
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
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
      to: adminEmail,
      subject: `${appointments.length} rendez-vous demain`,
      text: lines.join("\n"),
    });
  } catch {
    // L'échec d'envoi du récap admin ne doit jamais faire échouer la tâche planifiée.
  }
}

export async function sendAnniversaryDiscountEmail(clientEmail: string, clientName: string, discountPercent: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kycks-cleaner.fr";
  const reserverUrl = `${baseUrl}/reserver`;

  const lines = [
    `Bonjour ${clientName.split(" ")[0]},`,
    "",
    `Ça fait déjà 1 an que vous avez créé votre compte Kycks Cleaner ! 🎉`,
    "",
    `Pour vous remercier, vous bénéficiez de ${discountPercent}% de réduction sur votre prochain rendez-vous.`,
    `La réduction est déjà activée sur votre compte : elle s'appliquera automatiquement à votre prochaine réservation, sans code à saisir.`,
    "",
    `Réservez ici : ${reserverUrl}`,
    "",
    "À bientôt !",
    "Kycks Cleaner",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
      to: clientEmail,
      subject: `🎉 1 an ensemble - ${discountPercent}% de réduction pour vous`,
      text: lines.join("\n"),
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendAdminAnniversaryNotification(adminEmail: string, clientName: string, clientEmail: string) {
  const lines = [
    `Un client fête ses 1 an sur le site aujourd'hui : ${clientName} (${clientEmail}).`,
    "",
    "Une réduction de 10% a été activée automatiquement sur son compte pour sa prochaine réservation.",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
      to: adminEmail,
      subject: `Réduction anniversaire accordée à ${clientName}`,
      text: lines.join("\n"),
    });
  } catch {
    // L'échec d'envoi ne doit jamais faire échouer la tâche planifiée.
  }
}

export async function sendBirthdayDiscountEmail(clientEmail: string, clientName: string, discountPercent: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kycks-cleaner.fr";
  const reserverUrl = `${baseUrl}/reserver`;
  const firstName = clientName.split(" ")[0];

  const lines = [
    `🎂 Joyeux anniversaire ${firstName} ! 🎉`,
    "",
    `Toute l'équipe Kycks Cleaner vous souhaite une excellente journée.`,
    "",
    `Pour fêter ça, vous bénéficiez de ${discountPercent}% de réduction sur votre prochain rendez-vous.`,
    `Aucun code à retenir : la réduction est déjà activée sur votre compte et s'appliquera automatiquement.`,
    "",
    `🎁 Réservez votre prochain nettoyage ici : ${reserverUrl}`,
    "",
    "Prenez soin de vous, et à bientôt !",
    "L'équipe Kycks Cleaner",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
      to: clientEmail,
      subject: `🎂 Joyeux anniversaire ${firstName} - ${discountPercent}% pour vous`,
      text: lines.join("\n"),
    });
    return true;
  } catch {
    return false;
  }
}

export async function sendAdminBirthdayNotification(adminEmail: string, clientName: string, clientEmail: string) {
  const lines = [
    `C'est l'anniversaire de ${clientName} (${clientEmail}) aujourd'hui ! 🎂`,
    "",
    "Une réduction de 10% a été activée automatiquement sur son compte pour sa prochaine réservation.",
  ];

  try {
    await resend.emails.send({
      from: "Kycks Cleaner <contact@kycks-cleaner.fr>",
      to: adminEmail,
      subject: `Réduction anniversaire de naissance accordée à ${clientName}`,
      text: lines.join("\n"),
    });
  } catch {
    // L'échec d'envoi ne doit jamais faire échouer la tâche planifiée.
  }
}
