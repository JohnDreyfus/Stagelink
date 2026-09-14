import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Hachage des mots de passe avec scrypt, inclus dans Node : aucune
 * dépendance à installer. Format stocké : "sel:empreinte", en hexadécimal.
 * Pas de "server-only" ici : le seed (lancé hors de Next) s'en sert aussi.
 */

export function hacherMotDePasse(motDePasse: string): string {
  const sel = randomBytes(16).toString("hex");
  const empreinte = scryptSync(motDePasse, sel, 64).toString("hex");
  return `${sel}:${empreinte}`;
}

export function verifierMotDePasse(motDePasse: string, stocke: string): boolean {
  const [sel, empreinte] = stocke.split(":");
  if (!sel || !empreinte) return false;

  const attendue = Buffer.from(empreinte, "hex");
  const recue = scryptSync(motDePasse, sel, attendue.length);
  // timingSafeEqual : la durée de comparaison ne trahit pas le mot de passe.
  return attendue.length === recue.length && timingSafeEqual(attendue, recue);
}
