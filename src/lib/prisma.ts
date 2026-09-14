import "server-only";

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 exige un adaptateur : new PrismaClient() seul lève une erreur.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// En développement, Next recharge les modules à chaque enregistrement.
// Sans ce garde-fou, on ouvrirait une nouvelle connexion à chaque sauvegarde.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
