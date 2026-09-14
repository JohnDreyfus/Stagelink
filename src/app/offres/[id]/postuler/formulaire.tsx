"use client";

import { useActionState } from "react";

import { BoutonEnvoi } from "@/components/bouton-envoi";
import type { EtatFormulaire } from "@/app/offres/[id]/postuler/actions";

const ETAT_INITIAL: EtatFormulaire = {};

/**
 * L'action arrive DÉJÀ liée à son offre.
 *
 * Le `bind` est fait dans la page serveur, pas ici. C'est ce qui permet au
 * formulaire de fonctionner sans JavaScript : si on liait l'action dans ce
 * composant client, l'envoi sans JS s'exécuterait bien côté serveur mais la
 * réponse n'arriverait jamais — la page resterait bloquée.
 *
 * ATTENTION : `bind` n'est pas une protection. La valeur liée voyage dans la
 * requête et reste modifiable par l'utilisateur. C'est le service qui
 * revérifie que l'offre existe et qu'elle est ouverte. Voir l'étape 13.
 */
type ActionCandidature = (
  etatPrecedent: EtatFormulaire,
  donnees: FormData,
) => Promise<EtatFormulaire>;

export function FormulaireCandidature({
  action,
  min,
  max,
}: {
  action: ActionCandidature;
  min: number;
  max: number;
}) {
  const [etat, envoyer] = useActionState(action, ETAT_INITIAL);

  return (
    <form action={envoyer} className="mt-6 max-w-2xl">
      <label htmlFor="motivation" className="block font-medium">
        Votre motivation
      </label>

      <textarea
        id="motivation"
        name="motivation"
        rows={8}
        required
        minLength={min}
        maxLength={max}
        defaultValue={etat.motivation}
        aria-describedby="erreur-motivation"
        className="mt-2 w-full rounded border p-2"
      />

      <p id="erreur-motivation" aria-live="polite" className="mt-1 text-red-700">
        {etat.erreurs?.motivation?.join(" ")}
      </p>

      {etat.message && (
        <p aria-live="polite" className="mt-1 text-red-700">
          {etat.message}
        </p>
      )}

      <BoutonEnvoi />
    </form>
  );
}
