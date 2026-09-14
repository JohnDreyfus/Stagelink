"use client";

import { useActionState } from "react";

import { BoutonEnvoi } from "@/components/bouton-envoi";
import { inscrire, type EtatInscription } from "@/app/inscription/actions";

const ETAT_INITIAL: EtatInscription = {};

/**
 * Tous les champs sont affichés : sans JavaScript, on ne peut pas masquer
 * la partie inutile. Le serveur n'exige que celle du type de compte choisi.
 */
export function FormulaireInscription() {
  const [etat, envoyer] = useActionState(inscrire, ETAT_INITIAL);

  return (
    <form action={envoyer} className="mt-6 max-w-xl">
      <fieldset>
        <legend className="font-medium">Je suis</legend>
        <label className="mr-6">
          <input
            type="radio"
            name="role"
            value="ETUDIANT"
            required
            defaultChecked={etat.saisie?.role === "ETUDIANT"}
          />{" "}
          Étudiant
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="ENTREPRISE"
            defaultChecked={etat.saisie?.role === "ENTREPRISE"}
          />{" "}
          Entreprise
        </label>
        <p aria-live="polite" className="mt-1 text-red-700">
          {etat.erreurs?.role?.join(" ")}
        </p>
      </fieldset>

      <Champ nom="prenom" label="Prénom" etat={etat} />
      <Champ nom="nom" label="Nom" etat={etat} />
      <Champ nom="email" label="E-mail" type="email" etat={etat} />
      <Champ nom="motDePasse" label="Mot de passe" type="password" etat={etat} />
      <Champ
        nom="confirmation"
        label="Confirmez le mot de passe"
        type="password"
        etat={etat}
      />

      <fieldset className="mt-6 rounded border p-4">
        <legend className="font-medium">Si vous êtes étudiant</legend>
        <Champ nom="promotion" label="Promotion" etat={etat} />
      </fieldset>

      <fieldset className="mt-6 rounded border p-4">
        <legend className="font-medium">Si vous êtes une entreprise</legend>
        <Champ nom="entreprise" label="Nom de l'entreprise" etat={etat} />
        <Champ nom="ville" label="Ville" etat={etat} />
        <Champ nom="secteur" label="Secteur" etat={etat} />
        <Champ nom="fonction" label="Votre fonction" etat={etat} />
      </fieldset>

      {etat.message && (
        <p aria-live="polite" className="mt-4 text-red-700">
          {etat.message}
        </p>
      )}

      <BoutonEnvoi label="Créer mon compte" />
    </form>
  );
}

function Champ({
  nom,
  label,
  type = "text",
  etat,
}: {
  nom: string;
  label: string;
  type?: string;
  etat: EtatInscription;
}) {
  const idErreur = `erreur-${nom}`;

  return (
    <div className="mt-4">
      <label htmlFor={nom} className="block font-medium">
        {label}
      </label>
      <input
        id={nom}
        name={nom}
        type={type}
        defaultValue={etat.saisie?.[nom]}
        aria-describedby={idErreur}
        className="mt-1 w-full rounded border p-2"
      />
      <p id={idErreur} aria-live="polite" className="mt-1 text-red-700">
        {etat.erreurs?.[nom]?.join(" ")}
      </p>
    </div>
  );
}
