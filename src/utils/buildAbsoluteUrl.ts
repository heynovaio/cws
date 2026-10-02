export function buildAbsoluteUrl(uid: string, lang: "en-ca" | "fr-ca") {
  // Prefer env (prod), fallback to current host (dev)
  const enHost = process.env.NEXT_PUBLIC_DOMAIN_EN || "localhost:3000";
  const frHost = process.env.NEXT_PUBLIC_DOMAIN_FR || "fr.localhost:3000";

  const host = lang === "fr-ca" ? frHost : enHost;
  const proto = host.includes("localhost") ? "http" : "https";

  // Campaign pages live at /campaign/:uid (no locale segment now)
  return `${proto}://${host}/campaign/${encodeURIComponent(uid)}`;
}
