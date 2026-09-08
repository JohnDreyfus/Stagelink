import Link from "next/link";
import { Offre } from "@/types/Offre";

const OFFRES: Offre[] = [
  {
    id: "1",
    intitule: "Développeur Frontend",
  },
  {
    id: "2",
    intitule: "Développeur Backend",
  },
];

export default function Page() {
    return (
        <main>
            <h1>Offres d'emploi</h1>
            <ul>
                {OFFRES.map((offre) => (
                    <li key={offre.id}>
                        <Link href={`/offres/${offre.id}`}>{offre.intitule}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}