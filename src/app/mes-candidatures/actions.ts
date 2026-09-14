"use server";

import { revalidatePath } from "next/cache";

import { retirerMaCandidature } from "@/lib/services/candidatures";

/**
 * Retirer une candidature.
 *
 * L'action ne reçoit QUE l'identifiant de la candidature. Elle ne reçoit pas
 * l'identifiant de l'étudiant : le service le retrouve tout seul, côté
 * serveur. C'est ce qui empêche quelqu'un de supprimer la candidature d'un
 * autre en envoyant un POST à la main.
 */
export async function retirerCandidature(donnees: FormData): Promise<void> {
  const id = String(donnees.get("id") ?? "");
  if (!id) return;

  await retirerMaCandidature(id);

  revalidatePath("/mes-candidatures");
}
