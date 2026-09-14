import { notFound } from "next/navigation";

import { consulterOffre } from "@/lib/services/offres";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const resultat = await consulterOffre(id);

    // notFound() a le type never : après cette ligne, TypeScript sait que
    // resultat n'est plus null. Plus besoin du point d'exclamation.
    if (!resultat) notFound();

    const { offre, ouverte } = resultat;

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">{offre.intitule}</h1>
            <p className="text-slate-600">
                {offre.entreprise} — {offre.ville}
            </p>

            {!ouverte && (
                <p className="mt-4 rounded border border-amber-300 bg-amber-50 p-3">
                    Cette offre n&apos;accepte plus de candidature.
                </p>
            )}

            <p className="mt-4">{offre.description}</p>
        </main>
    );
}
