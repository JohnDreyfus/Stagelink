"use client";

import { useFormStatus } from "react-dom";

/**
 * Deux façons de connaître l'état d'attente :
 *
 *  - `useActionState` renvoie un booléen `pending`, mais seulement dans le
 *    composant qui appelle le hook ;
 *  - `useFormStatus` le lit depuis n'importe quel composant PLACÉ DANS le
 *    <form>, sans avoir à faire descendre l'information en props.
 *
 * C'est la seconde qu'on retient ici : le bouton vit dans son propre fichier
 * et n'a besoin de rien recevoir. Attention, le hook vient de `react-dom`,
 * pas de `react`, et le composant doit être À L'INTÉRIEUR du <form>.
 */
export function BoutonEnvoi() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
    >
      {pending ? "Envoi en cours…" : "Envoyer ma candidature"}
    </button>
  );
}
