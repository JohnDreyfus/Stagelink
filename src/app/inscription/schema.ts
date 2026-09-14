import { z } from "zod";

/**
 * La FORME d'une inscription. Ni "use server" ni "server-only" ici :
 * le fichier schema.check.ts, lancé hors de Next, l'importe aussi.
 *
 * Le champ "role" choisit la variante : chaque type de compte n'exige que
 * ses propres champs. "ENTREPRISE" crée en base un compte TUTEUR rattaché
 * à une nouvelle entreprise.
 */

export const MOT_DE_PASSE_MIN = 8;

const obligatoire = (message: string) => z.string(message).trim().min(1, message);

const compte = {
  email: z.email("Adresse e-mail invalide."),
  motDePasse: z
    .string("Le mot de passe est obligatoire.")
    .min(MOT_DE_PASSE_MIN, `Au moins ${MOT_DE_PASSE_MIN} caractères.`),
  confirmation: z.string(),
  nom: obligatoire("Le nom est obligatoire."),
  prenom: obligatoire("Le prénom est obligatoire."),
};

export const Inscription = z
  .discriminatedUnion(
    "role",
    [
      z.object({
        ...compte,
        role: z.literal("ETUDIANT"),
        promotion: obligatoire("La promotion est obligatoire."),
      }),
      z.object({
        ...compte,
        role: z.literal("ENTREPRISE"),
        entreprise: obligatoire("Le nom de l'entreprise est obligatoire."),
        ville: obligatoire("La ville est obligatoire."),
        secteur: obligatoire("Le secteur est obligatoire."),
        fonction: obligatoire("Votre fonction est obligatoire."),
      }),
    ],
    { error: "Choisissez un type de compte." },
  )
  .refine((d) => d.motDePasse === d.confirmation, {
    path: ["confirmation"],
    message: "Les deux mots de passe ne correspondent pas.",
  });
