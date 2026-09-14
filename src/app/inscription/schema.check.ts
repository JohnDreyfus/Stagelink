// Vérification rapide : npx tsx src/app/inscription/schema.check.ts
import assert from "node:assert/strict";

import { Inscription } from "./schema";

const compte = {
  email: "nina@etu.fr",
  motDePasse: "motdepasse",
  confirmation: "motdepasse",
  nom: "Le Gall",
  prenom: "Nina",
};

assert.ok(
  Inscription.safeParse({ ...compte, role: "ETUDIANT", promotion: "SIO SLAM 2027" }).success,
  "un étudiant complet passe",
);

assert.ok(
  Inscription.safeParse({
    ...compte,
    role: "ENTREPRISE",
    fonction: "CTO",
    entreprise: "Armor Tech",
    ville: "Brest",
    secteur: "Logiciel",
  }).success,
  "une entreprise complète passe",
);

const sansNom = Inscription.safeParse({
  ...compte,
  role: "ENTREPRISE",
  fonction: "CTO",
  entreprise: "  ",
  ville: "Brest",
  secteur: "Logiciel",
});
assert.ok(!sansNom.success, "une entreprise sans nom échoue");
assert.deepEqual(sansNom.error.issues[0].path, ["entreprise"]);

const confirmation = Inscription.safeParse({
  ...compte,
  confirmation: "autre",
  role: "ETUDIANT",
  promotion: "SIO SLAM 2027",
});
assert.ok(!confirmation.success, "une confirmation différente échoue");
assert.deepEqual(confirmation.error.issues[0].path, ["confirmation"]);

assert.ok(!Inscription.safeParse(compte).success, "sans type de compte, échec");

console.log("inscription : OK");
