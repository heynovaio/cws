export type AppLocale = "en-ca" | "fr-ca";
export type CanonicalLocale = "en-CA" | "fr-CA";

export const EN_L: AppLocale = "en-ca";
export const FR_L: AppLocale = "fr-ca";

export function normalizeHost(h?: string | null): string {
  return (h || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/:.*$/, "");
}

export function stripWww(h: string): string {
  return h.replace(/^www\./i, "");
}

export const EN_ENV = normalizeHost(
  process.env.NEXT_PUBLIC_DOMAIN_EN || process.env.DOMAIN_EN
);
export const FR_ENV = normalizeHost(
  process.env.NEXT_PUBLIC_DOMAIN_FR || process.env.DOMAIN_FR
);

export function pairedDomainsFor(hostHeader?: string) {
  const fallback = normalizeHost(hostHeader);
  if (EN_ENV && FR_ENV) return { enHost: EN_ENV, frHost: FR_ENV };
  if (EN_ENV && !FR_ENV) return { enHost: EN_ENV, frHost: EN_ENV };
  if (!EN_ENV && FR_ENV) return { enHost: FR_ENV, frHost: FR_ENV };
  return { enHost: fallback, frHost: fallback };
}

export const EN_CAMPAIGN_PATH = "/campaign/keepgirlsplaying";
export const FR_CAMPAIGN_PATH =
  "/campaign/maintenant-continuons-a-faire-jouer-les-filles";

export const EN_CAMPAIGN_VANITY = "keepgirlsplaying.ca";
export const FR_CAMPAIGN_VANITY = "xn--danslquipedesfilles-fzb.ca";

export const EN_VANITY_HOSTS = new Set<string>([
  normalizeHost(EN_CAMPAIGN_VANITY),
  normalizeHost(`www.${EN_CAMPAIGN_VANITY}`),
]);

export const FR_VANITY_HOSTS = new Set<string>([
  normalizeHost(FR_CAMPAIGN_VANITY),
  normalizeHost(`www.${FR_CAMPAIGN_VANITY}`),
  normalizeHost("danslequipedesfilles.ca"),
  normalizeHost("www.danslequipedesfilles.ca"),
  normalizeHost("dansléquipedesfilles.ca"),
  normalizeHost("www.dansléquipedesfilles.ca"),
]);

export const SOURCE_HOSTS = new Set<string>(
  [
    "womenandsport.ca",
    "www.womenandsport.ca",
    "femmesetsport.ca",
    "www.femmesetsport.ca",
  ].map(normalizeHost)
);

export function isCampaignVanityHost(hostHeader?: string): boolean {
  const h = normalizeHost(hostHeader);
  return EN_VANITY_HOSTS.has(h) || FR_VANITY_HOSTS.has(h);
}

export function campaignVanityHostFor(
  currentHostHeader: string | undefined,
  toLocale: AppLocale
): string | null {
  const h = normalizeHost(currentHostHeader);
  const onVanity = EN_VANITY_HOSTS.has(h) || FR_VANITY_HOSTS.has(h);
  if (!onVanity) return null;
  return toLocale === FR_L ? FR_CAMPAIGN_VANITY : EN_CAMPAIGN_VANITY;
}

export function appLocaleForHost(hostHeader?: string): AppLocale {
  const host = normalizeHost(hostHeader);
  if (FR_ENV && host === FR_ENV) return FR_L;
  if (FR_VANITY_HOSTS.has(host)) return FR_L;
  return EN_L;
}

export function toCanonicalLocale(app: AppLocale): CanonicalLocale {
  return app === FR_L ? "fr-CA" : "en-CA";
}

export const LOCALE_PREFIXES = new Set<AppLocale>([EN_L, FR_L]);
