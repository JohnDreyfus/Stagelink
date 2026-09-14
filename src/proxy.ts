import { withAuth } from "next-auth/middleware";

/**
 * Next 16 : l'ancien middleware.ts s'appelle désormais proxy.ts.
 *
 * Seules ces pages sont ouvertes sans connexion. La comparaison est EXACTE :
 * /offres est public, /offres/[id] et /offres/[id]/postuler ne le sont pas.
 * Le proxy ne fait que rediriger vers la connexion ; la vraie protection
 * reste dans le service, car les Server Actions peuvent contourner le proxy.
 */
const PAGES_PUBLIQUES = ["/", "/offres", "/inscription"];

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      token !== null || PAGES_PUBLIQUES.includes(req.nextUrl.pathname),
  },
});

export const config = {
  // Tout sauf l'API (dont /api/auth), les fichiers de Next et les fichiers statiques.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
