import { Offre } from "@/types/Offre";
import {notFound} from "next/navigation";

const OFFRES: Offre[] = [
    { id: "1", intitule: "Développeur Frontend" },
    { id: "2", intitule: "Développeur Backend" },
];

export default async function Page({params,}: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const offre = OFFRES.find((o) => o.id === id);

    if (!offre) {
        notFound();
    }

    return (
        <div>
            <h1>{offre!.intitule}</h1>
        </div>
    );
}