import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Couche d'accès aux données des comptes : elle écrit, elle ne décide rien.
 */

/** Un compte prêt à écrire : le mot de passe est DÉJÀ haché. */
export type CompteEnBase = {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
};

/**
 * P2002 : violation d'unicité. Sur Utilisateur, seul l'e-mail est unique.
 * On compte sur la contrainte de la base plutôt que sur une lecture préalable :
 * deux inscriptions simultanées ne peuvent pas passer entre les deux.
 */
function estEmailDejaPris(erreur: unknown): boolean {
  return (
    erreur instanceof Prisma.PrismaClientKnownRequestError &&
    erreur.code === "P2002"
  );
}

/** Crée l'utilisateur et sa fiche étudiant. Faux si l'e-mail est déjà pris. */
export async function creerEtudiant(
  compte: CompteEnBase,
  promotion: string,
): Promise<boolean> {
  try {
    await prisma.etudiant.create({
      data: {
        promotion,
        utilisateur: { create: { ...compte, role: "ETUDIANT" } },
      },
    });
    return true;
  } catch (erreur) {
    if (estEmailDejaPris(erreur)) return false;
    throw erreur;
  }
}

/**
 * Crée d'un seul coup l'entreprise, l'utilisateur et sa fiche tuteur.
 * Une seule requête imbriquée : tout est écrit, ou rien.
 * Faux si l'e-mail est déjà pris.
 */
export async function creerCompteEntreprise(
  compte: CompteEnBase,
  entreprise: { nom: string; ville: string; secteur: string },
  fonction: string,
): Promise<boolean> {
  try {
    await prisma.tuteur.create({
      data: {
        fonction,
        entreprise: { create: entreprise },
        utilisateur: { create: { ...compte, role: "TUTEUR" } },
      },
    });
    return true;
  } catch (erreur) {
    if (estEmailDejaPris(erreur)) return false;
    throw erreur;
  }
}
