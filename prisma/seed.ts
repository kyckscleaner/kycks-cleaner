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
      name: "Nettoyage intérieur complet",
      description:
        "Aspiration complète, nettoyage des plastiques et cuirs, vitres intérieures, désinfection, shampouinage sièges/moquette sur demande.",
      priceCents: 6000,
      durationMinutes: 90,
      order: 1,
    },
    {
      code: "exterieur",
      name: "Nettoyage extérieur complet",
      description:
        "Prélavage, lavage carrosserie, jantes et passages de roue, vitres extérieures, séchage microfibre, pneus lustrés.",
      priceCents: 5000,
      durationMinutes: 75,
      order: 2,
    },
    {
      code: "complet",
      name: "Formule complète (intérieur + extérieur)",
      description:
        "La totale : intérieur et extérieur pour un véhicule qui ressort comme neuf. Formule la plus demandée.",
      priceCents: 9500,
      durationMinutes: 150,
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
