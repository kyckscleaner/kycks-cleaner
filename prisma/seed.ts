import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("kycks2026", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@kycks-cleaner.fr" },
    update: {},
    create: {
      email: "admin@kycks-cleaner.fr",
      passwordHash,
      name: "Kylian",
    },
  });

  await prisma.businessSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const services = [
    {
      code: "interieur",
      name: "Intérieur",
      description: "Sièges compris, sauf tâche importante.",
      priceCents: 2000,
      durationMinutes: 45,
      order: 1,
    },
    {
      code: "exterieur",
      name: "Extérieur",
      description: "Carrosserie, jantes, vitres extérieures, séchage.",
      priceCents: 3000,
      durationMinutes: 45,
      order: 2,
    },
    {
      code: "complet",
      name: "Complet",
      description: "Intérieur + extérieur. La formule la plus demandée.",
      priceCents: 4500,
      durationMinutes: 75,
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
    { code: "shampoing_sieges", name: "Shampoing sièges (tâches / salissures)", priceCents: 1000, order: 1 },
    { code: "tapis_moquettes", name: "Nettoyage tapis / moquettes", priceCents: 1000, order: 2 },
    { code: "plastiques_tableau_bord", name: "Plastiques & tableau de bord", priceCents: 500, order: 3 },
    { code: "jantes_tres_sales", name: "Jantes très sales", priceCents: 500, order: 4 },
    { code: "nourrissage_cuir", name: "Nourrissage de cuir", priceCents: 1000, order: 5 },
    { code: "poils_animaux", name: "Poils d'animaux", priceCents: 1000, order: 6 },
    { code: "vehicule_tres_sale", name: "Véhicule très sale / odeurs", priceCents: 1000, order: 7 },
  ];

  for (const option of options) {
    await prisma.serviceOption.upsert({
      where: { code: option.code },
      update: option,
      create: option,
    });
  }

  console.log("Seed terminé.");
  console.log("Connexion admin -> email: admin@kycks-cleaner.fr / mot de passe: kycks2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
