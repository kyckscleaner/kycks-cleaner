import { z } from "zod";

export const clientSignupSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Numéro de téléphone invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  referralCode: z.string().optional(),
});

export const clientLoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
