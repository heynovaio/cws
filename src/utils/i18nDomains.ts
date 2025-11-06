// utils/i18nDomains.ts
import { pairedDomainsFor } from "@/utils/localeHosts";

export function translateCareersSegment(pathname: string, to: "en-ca" | "fr-ca") {
  if (to === "fr-ca" && pathname.includes("/careers")) return pathname.replace("/careers", "/carrieres");
  if (to === "en-ca" && pathname.includes("/carrieres")) return pathname.replace("/carrieres", "/careers");
  return pathname;
}

export function stripLeadingLocalePrefix(pathname: string) {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length > 0 && (segs[0] === "en-ca" || segs[0] === "fr-ca")) return "/" + segs.slice(1).join("/");
  return pathname || "/";
}

export function buildSwitchHref(opts: {
  toLocale: "en-ca" | "fr-ca";
  pathname: string;
  search?: string;
}) {
  // Base off the *current* URL so we keep protocol + port (e.g. :3000 in dev)
  const current = typeof window !== "undefined"
    ? new URL(window.location.href)
    : new URL("http://localhost:3000/");

  const hostname = current.hostname;        // e.g. "localhost" or "fr.localhost"
  const { enHost, frHost } = pairedDomainsFor(hostname); // returns hostnames (no port)

  let cleanPath = stripLeadingLocalePrefix(opts.pathname);
  cleanPath = translateCareersSegment(cleanPath, opts.toLocale);

  const target = new URL(current.href);
  // swap just the hostname; preserve protocol + port
  target.hostname = opts.toLocale === "fr-ca" ? frHost : enHost;
  target.pathname = cleanPath;
  target.search = opts.search ? `?${opts.search}` : "";

  return target.toString();
}
