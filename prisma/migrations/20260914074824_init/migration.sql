-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ETUDIANT', 'TUTEUR', 'COORDINATEUR');

-- CreateEnum
CREATE TYPE "StatutCandidature" AS ENUM ('DEPOSEE', 'EN_ENTRETIEN', 'ACCEPTEE', 'REFUSEE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "promotion" TEXT NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tuteur" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "fonction" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,

    CONSTRAINT "Tuteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "secteur" TEXT NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offre" (
    "id" TEXT NOT NULL,
    "intitule" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "dateLimite" TIMESTAMP(3) NOT NULL,
    "places" INTEGER NOT NULL DEFAULT 1,
    "publiee" BOOLEAN NOT NULL DEFAULT false,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entrepriseId" TEXT NOT NULL,
    "tuteurId" TEXT,

    CONSTRAINT "Offre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "statut" "StatutCandidature" NOT NULL DEFAULT 'DEPOSEE',
    "deposeeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "etudiantId" TEXT NOT NULL,
    "offreId" TEXT NOT NULL,

    CONSTRAINT "Candidature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Convention" (
    "id" TEXT NOT NULL,
    "candidatureId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "signee" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Convention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visite" (
    "id" TEXT NOT NULL,
    "conventionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "compteRendu" TEXT,

    CONSTRAINT "Visite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "deposeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_utilisateurId_key" ON "Etudiant"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Tuteur_utilisateurId_key" ON "Tuteur"("utilisateurId");

-- CreateIndex
CREATE INDEX "Offre_publiee_dateLimite_idx" ON "Offre"("publiee", "dateLimite");

-- CreateIndex
CREATE UNIQUE INDEX "Candidature_etudiantId_offreId_key" ON "Candidature"("etudiantId", "offreId");

-- CreateIndex
CREATE UNIQUE INDEX "Convention_candidatureId_key" ON "Convention"("candidatureId");

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuteur" ADD CONSTRAINT "Tuteur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuteur" ADD CONSTRAINT "Tuteur_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offre" ADD CONSTRAINT "Offre_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offre" ADD CONSTRAINT "Offre_tuteurId_fkey" FOREIGN KEY ("tuteurId") REFERENCES "Tuteur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Convention" ADD CONSTRAINT "Convention_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visite" ADD CONSTRAINT "Visite_conventionId_fkey" FOREIGN KEY ("conventionId") REFERENCES "Convention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
