export type OffreResume = {
    id: string;
    intitule: string;
    entreprise: string;
    ville: string;
};

/** Ce que la fiche d'une offre a besoin d'afficher. */
export type OffreDetail = OffreResume & {
    description: string;
    dateLimite: Date;
    places: number;
};