// Vérification rapide : npx tsx src/lib/mot-de-passe.check.ts
import assert from "node:assert/strict";

import { hacherMotDePasse, verifierMotDePasse } from "./mot-de-passe";

const stocke = hacherMotDePasse("motdepasse");

assert.ok(verifierMotDePasse("motdepasse", stocke), "le bon mot de passe passe");
assert.ok(!verifierMotDePasse("mauvais", stocke), "un mauvais mot de passe échoue");
assert.ok(!verifierMotDePasse("motdepasse", "a-remplacer"), "un format invalide échoue");
assert.notEqual(hacherMotDePasse("motdepasse"), stocke, "chaque hachage a son sel");

console.log("mot-de-passe : OK");
