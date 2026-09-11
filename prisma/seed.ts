import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Le compte admin n'est jamais créé avec des identifiants codés en dur (dépôt public) :
  // ne s'exécute que si ADMIN_EMAIL et ADMIN_PASSWORD sont fournis en variables d'environnement.
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await prisma.adminUser.upsert({
      where: { email: process.env.ADMIN_EMAIL },
      update: { passwordHash },
      create: {
        email: process.env.ADMIN_EMAIL,
        passwordHash,
        name: process.env.ADMIN_NAME ?? "Admin",
      },
    });
    console.log(`Compte admin créé/mis à jour : ${process.env.ADMIN_EMAIL}`);
  }

  await prisma.businessSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const services = [
    {
      code: "interieur",
      name: "Intérieur",
      description:
        "Aspiration complète, nettoyage de l'habitacle, sièges, tapis & moquettes, vitres intérieures, parfum d'intérieur.",
      priceCents: 4500,
      durationMinutes: 60,
      order: 1,
    },
    {
      code: "exterieur",
      name: "Extérieur",
      description: "Carrosserie, jantes, vitres extérieures, séchage du véhicule.",
      priceCents: 4000,
      durationMinutes: 60,
      order: 2,
    },
    {
      code: "complet",
      name: "Complet",
      description:
        "Comprend l'intégralité des prestations des formules Intérieur & Extérieur. La formule la plus demandée.",
      priceCents: 8000,
      durationMinutes: 105,
      order: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { code: service.code },
      update: service,
      create: service,
    });
  }

  const options = [
    { code: "shampoing_sieges", name: "Shampoing sièges (tâches / salissures)", priceCents: 2000, order: 1 },
    { code: "tapis_moquettes", name: "Nettoyage tapis / moquettes", priceCents: 1000, order: 2, active: false },
    { code: "plastiques_tableau_bord", name: "Plastiques & tableau de bord", priceCents: 500, order: 3, active: false },
    { code: "jantes_tres_sales", name: "Jantes très sales", priceCents: 500, order: 4 },
    { code: "nourrissage_cuir", name: "Nourrissage de cuir", priceCents: 1000, order: 5 },
    { code: "poils_animaux", name: "Poils d'animaux", priceCents: 1500, order: 6 },
    { code: "vehicule_tres_sale", name: "Véhicule très sale / odeurs", priceCents: 1000, order: 7 },
    { code: "teinture_moquette_tapis", name: "Teinture moquette / tapis (ravive le noir d'origine)", priceCents: 1500, order: 8 },
    { code: "portes_coffre", name: "Nettoyage intérieur des portes & du coffre", priceCents: 1000, order: 9 },
    { code: "desinfection_vapeur", name: "Désinfection de l'habitacle à la vapeur", priceCents: 2000, order: 10 },
  ];

  for (const option of options) {
    await prisma.serviceOption.upsert({
      where: { code: option.code },
      update: { ...option, active: option.active ?? true },
      create: { ...option, active: option.active ?? true },
    });
  }

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
