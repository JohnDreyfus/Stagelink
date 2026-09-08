type Offre = {
  id: string;
  intitule: string;
};

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
                    <li key={offre.id}>{offre.intitule}</li>
                ))}
            </ul>
        </main>
    );
}