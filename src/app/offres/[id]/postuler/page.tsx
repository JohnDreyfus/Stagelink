import { notFound } from "next/navigation";

import { envoyerCandidature } from "@/app/offres/[id]/postuler/actions";
import { FormulaireCandidature } from "@/app/offres/[id]/postuler/formulaire";
import {
    MOTIVATION_MAX,
    MOTIVATION_MIN,
} from "@/lib/services/candidatures";
import { consulterOffre } from "@/lib/services/offres";

export const metadata = { title: "Postuler — StageLink" };

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const resultat = await consulterOffre(id);

    if (!resultat) notFound();

    const { offre, ouverte } = resultat;

    // La règle métier est revérifiée dans le service au moment de l'envoi.
    // Ici, on évite seulement d'afficher un formulaire qui ne servirait à rien.
    if (!ouverte) {
        return (
            <main className="p-8">
                <h1 className="text-2xl font-bold">{offre.intitule}</h1>
                <p className="mt-4">Cette offre n&apos;accepte plus de candidature.</p>
            </main>
        );
    }

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">Postuler</h1>
            <p className="mt-1 text-gray-600">
                {offre.intitule} — {offre.entreprise} ({offre.ville})
            </p>

            {/*
        Le bind est fait ICI, dans le composant serveur, et non dans le
        composant client : c'est ce qui permet au formulaire de fonctionner
        sans JavaScript. Voir l'étape 15.
      */}
            <FormulaireCandidature
                action={envoyerCandidature.bind(null, offre.id)}
                min={MOTIVATION_MIN}
                max={MOTIVATION_MAX}
            />
        </main>
    );
}
