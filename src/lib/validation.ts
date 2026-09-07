import { z } from "zod";

export const reservationSchema = z.object({
  serviceCodes: z.array(z.string()).min(1, "Sélectionnez au moins une formule"),
  optionCodes: z.array(z.string()).default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Horaire invalide"),
  clientName: z.string().min(2, "Nom trop court"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().min(6, "Numéro de téléphone invalide"),
  address: z.string().min(4, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().min(4, "Code postal requis"),
  vehicleInfo: z.string().optional(),
  notes: z.string().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
