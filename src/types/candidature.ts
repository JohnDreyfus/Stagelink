/**
 * Les contrats entre le métier et l'affichage, pour les candidatures.
 * Comme pour les offres : ce que l'écran a besoin de savoir, et rien de plus.
 */

export type CandidatureResume = {
  id: string;
  offreId: string;
  offreIntitule: string;
  entreprise: string;
  statut: StatutCandidature;
  deposeeLe: Date;
  /** Un extrait, pas la motivation complète : la liste n'en a pas besoin. */
  extrait: string;
};

/** Les quatre valeurs de l'énumération du schéma, côté application. */
export type StatutCandidature =
  | "DEPOSEE"
  | "EN_ENTRETIEN"
  | "ACCEPTEE"
  | "REFUSEE";

/** Le libellé lisible d'un statut, pour l'affichage. */
export const LIBELLE_STATUT: Record<StatutCandidature, string> = {
  DEPOSEE: "Déposée",
  EN_ENTRETIEN: "En entretien",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
};
