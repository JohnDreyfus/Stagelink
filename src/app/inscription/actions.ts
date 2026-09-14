"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { Inscription } from "@/app/inscription/schema";
import {
  inscrireEntreprise,
  inscrireEtudiant,
} from "@/lib/services/inscription";

/**
 * Le contrôleur de l'inscription : valide la forme, appelle le service,
 * puis redirige vers la connexion. Aucune règle métier ici.
 */

/** Les champs renvoyés au formulaire en cas d'erreur. Jamais les mots de passe. */
const CHAMPS_REPRIS = [
  "role",
  "email",
  "nom",
  "prenom",
  "promotion",
  "entreprise",
  "ville",
  "secteur",
  "fonction",
] as const;

export type EtatInscription = {
  erreurs?: Record<string, string[] | undefined>;
  message?: string;
  /** Ce que l'utilisateur avait tapé, pour ne pas le lui faire retaper. */
  saisie?: Record<string, string>;
};

const MESSAGES = {
  "email-pris": "Un compte existe déjà avec cette adresse e-mail.",
} as const;

export async function inscrire(
  _etatPrecedent: EtatInscription,
  donnees: FormData,
): Promise<EtatInscription> {
  const saisie = Object.fromEntries(
    CHAMPS_REPRIS.map((champ) => [champ, String(donnees.get(champ) ?? "")]),
  );

  // 1. La forme.
  const verifie = Inscription.safeParse({
    ...saisie,
    motDePasse: String(donnees.get("motDePasse") ?? ""),
    confirmation: String(donnees.get("confirmation") ?? ""),
  });

  if (!verifie.success) {
    return { erreurs: z.flattenError(verifie.error).fieldErrors, saisie };
  }

  // 2. Le métier.
  const d = verifie.data;
  const resultat =
    d.role === "ETUDIANT"
      ? await inscrireEtudiant(d, d.promotion)
      : await inscrireEntreprise(
          d,
          { nom: d.entreprise, ville: d.ville, secteur: d.secteur },
          d.fonction,
        );

  if (!resultat.ok) {
    return { message: MESSAGES[resultat.raison], saisie };
  }

  // 3. Le compte existe : place à la connexion. Hors de tout try/catch.
  redirect("/api/auth/signin");
}
