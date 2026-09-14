import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Couche d'accès aux données : elle lit et elle écrit.
 * Elle ne décide rien — aucune règle métier ici.
 */

/** Ce que la base sait d'une candidature. Type interne à cette couche. */
export type CandidatureEnBase = {
  id: string;
  offreId: string;
  offreIntitule: string;
  entreprise: string;
  statut: string;
  deposeeLe: Date;
  motivation: string;
};

/** L'identifiant interne d'un étudiant, retrouvé par l'e-mail de son compte. */
export async function trouverEtudiantParEmail(
  email: string,
): Promise<string | null> {
  const etudiant = await prisma.etudiant.findFirst({
    where: { utilisateur: { email } },
    select: { id: true },
  });

  return etudiant?.id ?? null;
}

/** Les candidatures d'un étudiant, les plus récentes d'abord. */
export async function listerCandidaturesDe(
  etudiantId: string,
): Promise<CandidatureEnBase[]> {
  const lignes = await prisma.candidature.findMany({
    where: { etudiantId },
    orderBy: { deposeeLe: "desc" },
    select: {
      id: true,
      statut: true,
      deposeeLe: true,
      motivation: true,
      offreId: true,
      offre: {
        select: { intitule: true, entreprise: { select: { nom: true } } },
      },
    },
  });

  return lignes.map((l) => ({
    id: l.id,
    offreId: l.offreId,
    offreIntitule: l.offre.intitule,
    entreprise: l.offre.entreprise.nom,
    statut: l.statut,
    deposeeLe: l.deposeeLe,
    motivation: l.motivation,
  }));
}

/** Vrai si cet étudiant a déjà postulé à cette offre. */
export async function aDejaPostule(
  etudiantId: string,
  offreId: string,
): Promise<boolean> {
  const existante = await prisma.candidature.findUnique({
    where: { etudiantId_offreId: { etudiantId, offreId } },
    select: { id: true },
  });

  return existante !== null;
}

/** Écrit une candidature. Ne vérifie rien : c'est le rôle du service. */
export async function creerCandidature(donnees: {
  etudiantId: string;
  offreId: string;
  motivation: string;
}): Promise<string> {
  const creee = await prisma.candidature.create({
    data: donnees,
    select: { id: true },
  });

  return creee.id;
}

/**
 * Supprime une candidature — mais seulement si elle appartient bien à cet
 * étudiant. La propriété fait partie du `where` : on ne peut pas supprimer
 * la candidature de quelqu'un d'autre, même en connaissant son identifiant.
 */
export async function supprimerCandidatureDe(
  id: string,
  etudiantId: string,
): Promise<number> {
  const { count } = await prisma.candidature.deleteMany({
    where: { id, etudiantId },
  });

  return count;
}
