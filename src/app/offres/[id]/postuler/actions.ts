"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
    MOTIVATION_MAX,
    MOTIVATION_MIN,
    postuler,
} from "@/lib/services/candidatures";

/**
 * La Server Action est le CONTRÔLEUR de la partie 3, version formulaire :
 * elle lit la requête, valide la FORME des données, appelle le service,
 * puis s'occupe de l'affichage (revalidation, redirection).
 *
 * Elle ne contient aucune règle métier : celles-ci sont dans le service.
 */

const Formulaire = z.object({
    motivation: z
        .string("La motivation est obligatoire.")
        .trim()
        .min(MOTIVATION_MIN, `Écrivez au moins ${MOTIVATION_MIN} caractères.`)
        .max(MOTIVATION_MAX, `N'allez pas au-delà de ${MOTIVATION_MAX} caractères.`),
});

/** Ce que l'action renvoie au formulaire quand elle n'a pas redirigé. */
export type EtatFormulaire = {
    erreurs?: { motivation?: string[] };
    message?: string;
    /** Ce que l'utilisateur avait tapé, pour ne pas le lui faire retaper. */
    motivation?: string;
};

const MESSAGES = {
    "offre-introuvable": "Cette offre n'existe plus.",
    "offre-fermee": "Cette offre n'accepte plus de candidature.",
    "deja-postule": "Vous avez déjà postulé à cette offre.",
} as const;

export async function envoyerCandidature(
    // offreId vient du client : il est donc suspect. Le service le revérifie.
    offreId: string,
    _etatPrecedent: EtatFormulaire,
    donnees: FormData,
): Promise<EtatFormulaire> {
    const motivation = String(donnees.get("motivation") ?? "");

    // 1. La forme : est-ce que le texte a la bonne tête ?
    const verifie = Formulaire.safeParse({ motivation });

    if (!verifie.success) {
        return {
            erreurs: z.flattenError(verifie.error).fieldErrors,
            motivation,
        };
    }

    // 2. Le métier : est-ce que cette candidature a le droit d'exister ?
    const resultat = await postuler(offreId, verifie.data.motivation);

    if (!resultat.ok) {
        return { message: MESSAGES[resultat.raison], motivation };
    }

    // 3. L'affichage : la liste doit montrer la nouvelle candidature.
    revalidatePath("/mes-candidatures");

    // 4. redirect() lève une exception : rien après cette ligne ne s'exécute,
    //    et elle doit rester HORS d'un try/catch.
    redirect("/mes-candidatures");
}
