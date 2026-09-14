import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Couche d'accès aux données : elle lit et elle écrit.
 * Elle ne décide rien. Elle ne connaît ni React, ni les règles métier.
 *
 * Le type ci-dessous décrit ce que la base renvoie. Il ne sort pas de cette
 * couche : c'est le service qui le transformera en type d'affichage.
 */
export type OffreEnBase = {
  id: string;
  intitule: string;
  ville: string;
  dateLimite: Date;
  places: number;
  entreprise: string;
};

export type OffreDetailEnBase = OffreEnBase & { description: string };

/** Toutes les offres marquées publiées, les plus récentes d'abord. */
export async function listerOffresPubliees(): Promise<OffreEnBase[]> {
  const lignes = await prisma.offre.findMany({
    where: { publiee: true },
    orderBy: { creeLe: "desc" },
    select: {
      id: true,
      intitule: true,
      ville: true,
      dateLimite: true,
      places: true,
      entreprise: { select: { nom: true } },
    },
  });

  // On aplatit la relation : l'appelant reçoit une chaîne, pas un objet imbriqué.
  return lignes.map((l) => ({
    id: l.id,
    intitule: l.intitule,
    ville: l.ville,
    dateLimite: l.dateLimite,
    places: l.places,
    entreprise: l.entreprise.nom,
  }));
}

/** Une offre par son identifiant, ou null si elle n'existe pas. */
export async function lireOffre(id: string): Promise<OffreDetailEnBase | null> {
  const ligne = await prisma.offre.findUnique({
    where: { id },
    select: {
      id: true,
      intitule: true,
      ville: true,
      description: true,
      dateLimite: true,
      places: true,
      entreprise: { select: { nom: true } },
    },
  });

  if (!ligne) return null;

  return {
    id: ligne.id,
    intitule: ligne.intitule,
    ville: ligne.ville,
    description: ligne.description,
    dateLimite: ligne.dateLimite,
    places: ligne.places,
    entreprise: ligne.entreprise.nom,
  };
}
