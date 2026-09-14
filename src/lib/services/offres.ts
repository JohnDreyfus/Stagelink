import "server-only";

import { lireOffre, listerOffresPubliees } from "@/lib/donnees/offres";
import type { OffreDetail, OffreResume } from "@/types/offre";

/**
 * Couche service : c'est ici, et seulement ici, que vivent les règles métier.
 * Elle ne connaît ni React, ni Prisma, ni l'objet requête.
 */

/**
 * La règle métier « offre ouverte », écrite une seule fois.
 * La liste et la fiche s'en servent toutes les deux.
 */
export function estOuverte(offre: { dateLimite: Date; places: number }): boolean {
  return offre.dateLimite > new Date() && offre.places > 0;
}

/** Une offre est visible dans la liste si elle est publiée et encore ouverte. */
export async function listerOffresVisibles(): Promise<OffreResume[]> {
  const offres = await listerOffresPubliees();

  return offres
      .filter(estOuverte)
      .map((o) => ({
        id: o.id,
        intitule: o.intitule,
        entreprise: o.entreprise,
        ville: o.ville,
      }));
}

/** Une offre expirée reste consultable : on renvoie de quoi le signaler à l'écran. */
export async function consulterOffre(
    id: string,
): Promise<{ offre: OffreDetail; ouverte: boolean } | null> {
  const ligne = await lireOffre(id);
  if (!ligne) return null;

  const ouverte = estOuverte(ligne);

  return {
    ouverte,
    offre: {
      id: ligne.id,
      intitule: ligne.intitule,
      entreprise: ligne.entreprise,
      ville: ligne.ville,
      description: ligne.description,
      dateLimite: ligne.dateLimite,
      places: ligne.places,
    },
  };
}
