import "server-only";

import {
  creerCompteEntreprise,
  creerEtudiant,
  type CompteEnBase,
} from "@/lib/donnees/utilisateurs";
import { hacherMotDePasse } from "@/lib/mot-de-passe";

/**
 * Couche service : les règles métier de l'inscription.
 * Elle ne connaît ni React, ni Prisma, ni FormData.
 */

/** Les raisons pour lesquelles une inscription peut être refusée. */
export type RefusInscription = "email-pris";

type Resultat = { ok: true } | { ok: false; raison: RefusInscription };

/** Ce que le formulaire fournit : le mot de passe est encore en clair. */
type Compte = CompteEnBase;

/**
 * Règle : un mot de passe n'est jamais stocké en clair.
 * Les champs sont recopiés un par un : ce qui arrive en plus (confirmation,
 * role…) ne doit pas partir vers la base.
 */
function preparer(compte: Compte): CompteEnBase {
  return {
    email: compte.email,
    nom: compte.nom,
    prenom: compte.prenom,
    motDePasse: hacherMotDePasse(compte.motDePasse),
  };
}

function resultat(cree: boolean): Resultat {
  return cree ? { ok: true } : { ok: false, raison: "email-pris" };
}

export async function inscrireEtudiant(
  compte: Compte,
  promotion: string,
): Promise<Resultat> {
  return resultat(await creerEtudiant(preparer(compte), promotion));
}

export async function inscrireEntreprise(
  compte: Compte,
  entreprise: { nom: string; ville: string; secteur: string },
  fonction: string,
): Promise<Resultat> {
  return resultat(
    await creerCompteEntreprise(preparer(compte), entreprise, fonction),
  );
}
