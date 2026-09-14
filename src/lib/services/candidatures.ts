import "server-only";

import {
  aDejaPostule,
  creerCandidature,
  listerCandidaturesDe,
  supprimerCandidatureDe,
  trouverEtudiantParEmail,
} from "@/lib/donnees/candidatures";
import { lireOffre } from "@/lib/donnees/offres";
import { estOuverte } from "@/lib/services/offres";
import type {
  CandidatureResume,
  StatutCandidature,
} from "@/types/candidature";

/**
 * Couche service : les règles métier de la candidature.
 * Elle ne connaît ni React, ni Prisma, ni FormData.
 */

/**
 * L'étudiant connecté.
 * Tant qu'il n'y a pas d'authentification, il est écrit ici — à UN seul
 * endroit, pour que le module 04 n'ait qu'une ligne à remplacer.
 * Il n'est JAMAIS transmis par le formulaire : voir l'étape 13.
 */
const EMAIL_ETUDIANT_CONNECTE = "yanis.oubella@etu.fr";

/** Les raisons pour lesquelles une candidature peut être refusée. */
export type RefusCandidature =
  | "offre-introuvable"
  | "offre-fermee"
  | "deja-postule";

/** Longueur attendue de la motivation. Le formulaire s'en sert aussi. */
export const MOTIVATION_MIN = 50;
export const MOTIVATION_MAX = 1000;

function extraire(texte: string, taille = 90): string {
  const propre = texte.replace(/\s+/g, " ").trim();
  return propre.length <= taille ? propre : `${propre.slice(0, taille)}…`;
}

/** Les candidatures de l'étudiant connecté, les plus récentes d'abord. */
export async function listerMesCandidatures(): Promise<CandidatureResume[]> {
  const etudiantId = await trouverEtudiantParEmail(EMAIL_ETUDIANT_CONNECTE);
  if (!etudiantId) return [];

  const lignes = await listerCandidaturesDe(etudiantId);

  return lignes.map((l) => ({
    id: l.id,
    offreId: l.offreId,
    offreIntitule: l.offreIntitule,
    entreprise: l.entreprise,
    statut: l.statut as StatutCandidature,
    deposeeLe: l.deposeeLe,
    extrait: extraire(l.motivation),
  }));
}

/**
 * Règle métier : on ne peut postuler qu'à une offre qui existe, qui est
 * encore ouverte, et à laquelle on n'a pas déjà postulé.
 *
 * La motivation arrive déjà validée en forme (longueur) : c'est le rôle de
 * la Server Action. Ici on valide le *métier*, ce que Zod ne peut pas savoir.
 */
export async function postuler(
  offreId: string,
  motivation: string,
): Promise<{ ok: true; id: string } | { ok: false; raison: RefusCandidature }> {
  const etudiantId = await trouverEtudiantParEmail(EMAIL_ETUDIANT_CONNECTE);
  if (!etudiantId) return { ok: false, raison: "offre-introuvable" };

  const offre = await lireOffre(offreId);
  if (!offre) return { ok: false, raison: "offre-introuvable" };

  if (!estOuverte(offre)) return { ok: false, raison: "offre-fermee" };

  if (await aDejaPostule(etudiantId, offreId)) {
    return { ok: false, raison: "deja-postule" };
  }

  const id = await creerCandidature({ etudiantId, offreId, motivation });
  return { ok: true, id };
}

/** Retire une candidature de l'étudiant connecté. */
export async function retirerMaCandidature(
  candidatureId: string,
): Promise<boolean> {
  const etudiantId = await trouverEtudiantParEmail(EMAIL_ETUDIANT_CONNECTE);
  if (!etudiantId) return false;

  const supprimees = await supprimerCandidatureDe(candidatureId, etudiantId);
  return supprimees === 1;
}
