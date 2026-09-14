import "server-only";

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { verifierMotDePasse } from "@/lib/mot-de-passe";

/**
 * Configuration de NextAuth, partagée par la route /api/auth et par
 * getServerSession. Connexion par e-mail et mot de passe, contre la table
 * Utilisateur. La session est un JWT dans un cookie : pas de table de session.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "StageLink",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: credentials.email },
        });
        if (!utilisateur) return null;
        if (!verifierMotDePasse(credentials.password, utilisateur.motDePasse)) return null;

        return {
          id: utilisateur.id,
          email: utilisateur.email,
          name: `${utilisateur.prenom} ${utilisateur.nom}`,
        };
      },
    }),
  ],
};
