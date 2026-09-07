import { prisma } from "@/lib/prisma";
import { getClientIdFromSession } from "@/lib/clientAuth";

export async function getCurrentClient() {
  const clientId = await getClientIdFromSession();
  if (!clientId) return null;

  return prisma.client.findUnique({ where: { id: clientId } });
}
