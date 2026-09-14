// StageLink — jeu de données de démonstration
// Lancer : npx prisma db seed

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/** Renvoie une date décalée de n jours par rapport à aujourd'hui. */
function dans(jours: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + jours);
  return d;
}

async function main() {
  // On vide dans l'ordre inverse des dépendances.
  await prisma.visite.deleteMany();
  await prisma.convention.deleteMany();
  await prisma.candidature.deleteMany();
  await prisma.document.deleteMany();
  await prisma.offre.deleteMany();
  await prisma.tuteur.deleteMany();
  await prisma.etudiant.deleteMany();
  await prisma.entreprise.deleteMany();
  await prisma.utilisateur.deleteMany();

  // ── entreprises ──────────────────────────────────────────────────────────
  const naonis = await prisma.entreprise.create({
    data: { nom: "Naonis Logiciel", ville: "Quimper", secteur: "Édition logicielle" },
  });
  const brevia = await prisma.entreprise.create({
    data: { nom: "Brévia Santé", ville: "Rennes", secteur: "Santé" },
  });
  const korrig = await prisma.entreprise.create({
    data: { nom: "Korrigan Web", ville: "Lorient", secteur: "Agence web" },
  });

  // ── tuteurs ──────────────────────────────────────────────────────────────
  const tuteurNaonis = await prisma.tuteur.create({
    data: {
      fonction: "Responsable technique",
      entreprise: { connect: { id: naonis.id } },
      utilisateur: {
        create: {
          email: "c.leroy@naonis.fr",
          motDePasse: "a-remplacer",
          nom: "Leroy",
          prenom: "Camille",
          role: "TUTEUR",
        },
      },
    },
  });

  const tuteurBrevia = await prisma.tuteur.create({
    data: {
      fonction: "Chef de projet",
      entreprise: { connect: { id: brevia.id } },
      utilisateur: {
        create: {
          email: "s.morvan@brevia.fr",
          motDePasse: "a-remplacer",
          nom: "Morvan",
          prenom: "Sofiane",
          role: "TUTEUR",
        },
      },
    },
  });

  // ── étudiants ────────────────────────────────────────────────────────────
  const lea = await prisma.etudiant.create({
    data: {
      promotion: "SIO SLAM 2026",
      utilisateur: {
        create: {
          email: "lea.bertin@etu.fr",
          motDePasse: "a-remplacer",
          nom: "Bertin",
          prenom: "Léa",
          role: "ETUDIANT",
        },
      },
    },
  });

  const yanis = await prisma.etudiant.create({
    data: {
      promotion: "SIO SLAM 2026",
      utilisateur: {
        create: {
          email: "yanis.oubella@etu.fr",
          motDePasse: "a-remplacer",
          nom: "Oubella",
          prenom: "Yanis",
          role: "ETUDIANT",
        },
      },
    },
  });

  // ── coordinateur ─────────────────────────────────────────────────────────
  await prisma.utilisateur.create({
    data: {
      email: "coordination@lycee.fr",
      motDePasse: "a-remplacer",
      nom: "Dreyfus",
      prenom: "John",
      role: "COORDINATEUR",
    },
  });

  // ── offres ───────────────────────────────────────────────────────────────
  // Publiées et encore ouvertes
  const offreFront = await prisma.offre.create({
    data: {
      intitule: "Développeur front-end React",
      description:
        "Participation au développement de l'interface de notre logiciel de gestion. " +
        "Stack React et TypeScript, revues de code hebdomadaires.",
      ville: "Quimper",
      dateLimite: dans(45),
      places: 2,
      publiee: true,
      entrepriseId: naonis.id,
      tuteurId: tuteurNaonis.id,
    },
  });

  const offreApi = await prisma.offre.create({
    data: {
      intitule: "Développeur API Node.js",
      description:
        "Conception et développement des services qui alimentent nos applications mobiles. " +
        "Bonne occasion de voir une API REST en production.",
      ville: "Rennes",
      dateLimite: dans(30),
      places: 1,
      publiee: true,
      entrepriseId: brevia.id,
      tuteurId: tuteurBrevia.id,
    },
  });

  await prisma.offre.create({
    data: {
      intitule: "Intégrateur web",
      description: "Intégration de maquettes, accessibilité, performance.",
      ville: "Lorient",
      dateLimite: dans(60),
      places: 1,
      publiee: true,
      entrepriseId: korrig.id,
    },
  });

  // Cas limite : publiée mais la date limite est passée
  await prisma.offre.create({
    data: {
      intitule: "Développeur mobile (clôturée)",
      description: "Offre dont la date limite est dépassée : elle ne doit plus apparaître.",
      ville: "Brest",
      dateLimite: dans(-5),
      places: 1,
      publiee: true,
      entrepriseId: naonis.id,
    },
  });

  // Cas limite : non publiée, encore en brouillon
  await prisma.offre.create({
    data: {
      intitule: "Data analyst (brouillon)",
      description: "Offre pas encore publiée : elle ne doit pas apparaître non plus.",
      ville: "Rennes",
      dateLimite: dans(90),
      places: 1,
      publiee: false,
      entrepriseId: brevia.id,
    },
  });

  // Cas limite : publiée, ouverte, mais plus aucune place
  await prisma.offre.create({
    data: {
      intitule: "Développeur back-end (complet)",
      description: "Offre sans place restante : utile pour tester la règle métier.",
      ville: "Quimper",
      dateLimite: dans(20),
      places: 0,
      publiee: true,
      entrepriseId: naonis.id,
    },
  });

  // ── candidatures ─────────────────────────────────────────────────────────
  const candidatureLea = await prisma.candidature.create({
    data: {
      motivation:
        "Votre offre correspond exactement au projet que j'ai mené cette année en BTS : " +
        "une application React connectée à une API que j'ai conçue moi-même.",
      statut: "ACCEPTEE",
      etudiantId: lea.id,
      offreId: offreFront.id,
    },
  });

  await prisma.candidature.create({
    data: {
      motivation:
        "Je cherche un stage centré sur le back-end pour consolider ce que j'ai vu en cours " +
        "sur les API REST et les bases de données.",
      statut: "DEPOSEE",
      etudiantId: yanis.id,
      offreId: offreApi.id,
    },
  });

  await prisma.candidature.create({
    data: {
      motivation: "Candidature envoyée en parallèle, en attente de retour.",
      statut: "EN_ENTRETIEN",
      etudiantId: yanis.id,
      offreId: offreFront.id,
    },
  });

  // ── convention et visites ────────────────────────────────────────────────
  const convention = await prisma.convention.create({
    data: {
      candidatureId: candidatureLea.id,
      dateDebut: dans(60),
      dateFin: dans(102),
      signee: true,
    },
  });

  await prisma.visite.create({
    data: {
      conventionId: convention.id,
      date: dans(75),
      compteRendu: "Visite de mi-stage : intégration réussie, autonomie sur les tickets simples.",
    },
  });

  await prisma.visite.create({
    data: { conventionId: convention.id, date: dans(95), compteRendu: null },
  });

  // ── documents ────────────────────────────────────────────────────────────
  await prisma.document.create({
    data: { etudiantId: lea.id, nom: "CV_Lea_Bertin.pdf", type: "CV" },
  });
  await prisma.document.create({
    data: { etudiantId: lea.id, nom: "Convention_signee.pdf", type: "CONVENTION" },
  });

  console.log("Jeu de données inséré.");
  console.log("  6 offres, dont 3 réellement visibles (les 3 autres sont des cas limites)");
  console.log("  2 étudiants, 2 tuteurs, 1 coordinateur, 3 entreprises");
  console.log("  3 candidatures, 1 convention, 2 visites, 2 documents");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
