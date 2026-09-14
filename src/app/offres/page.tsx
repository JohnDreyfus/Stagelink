import Link from "next/link";
import { connection } from "next/server";

import { listerOffresVisibles } from "@/lib/services/offres";

export const metadata = { title: "Offres de stage — StageLink" };

export default async function Page() {
    // Cette page lit la base : elle doit etre rendue a chaque requete,
    // et non une seule fois au moment du build.
    await connection();

    const offres = await listerOffresVisibles();

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">Offres de stage</h1>

            {offres.length === 0 ? (
                <p className="mt-4 text-slate-600">
                    Aucune offre n&apos;est ouverte pour le moment. Revenez dans quelques jours.
                </p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {offres.map((offre) => (
                        <li key={offre.id}>
                            <Link href={`/offres/${offre.id}`} className="hover:underline">
                                {offre.intitule} — {offre.entreprise} ({offre.ville})
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
