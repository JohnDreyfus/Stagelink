import { FormulaireInscription } from "@/app/inscription/formulaire";

export const metadata = { title: "Inscription — StageLink" };

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <p className="mt-1 text-gray-600">
        Étudiant ou entreprise : remplissez la partie qui vous concerne.
      </p>
      <FormulaireInscription />
    </main>
  );
}
