import Link from "next/link";
import { connection } from "next/server";

import { retirerCandidature } from "@/app/mes-candidatures/actions";
import { listerMesCandidatures } from "@/lib/services/candidatures";
import { LIBELLE_STATUT } from "@/types/candidature";

export const metadata = { title: "Mes candidatures — StageLink" };

export default async function Page() {
    // Comme /offres : cette page lit la base, elle doit être rendue
    // à chaque requête et non une seule fois au build.
    await connection();

    const candidatures = await listerMesCandidatures();

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">Mes candidatures</h1>

            {candidatures.length === 0 ? (
                <p className="mt-4">
                    Vous n&apos;avez pas encore postulé.{" "}
                    <Link href="/offres" className="underline">
                        Voir les offres
                    </Link>
                </p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {candidatures.map((c) => (
                        <li key={c.id} className="rounded border p-4">
                            <Link href={`/offres/${c.offreId}`} className="font-medium underline">
                                {c.offreIntitule}
                            </Link>
                            <p className="text-gray-600">
                                {c.entreprise} — {LIBELLE_STATUT[c.statut]}
                            </p>
                            <p className="mt-2 text-gray-700">{c.extrait}</p>

                            <form action={retirerCandidature} className="mt-2">
                                <input type="hidden" name="id" value={c.id} />
                                <button type="submit" className="text-red-700 underline">
                                    Retirer ma candidature
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
