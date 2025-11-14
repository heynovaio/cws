import { FR_VANITY_HOSTS } from "@/middleware";

export function normalizeHost(h?: string | null) {
  return (h || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/:.*$/, "");
}

const EN_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_EN || process.env.DOMAIN_EN);
const FR_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_FR || process.env.DOMAIN_FR);

export function pairedDomainsFor(_hostHeader?: string) {
  if (EN_ENV && FR_ENV) return { enHost: EN_ENV, frHost: FR_ENV };
  if (EN_ENV && !FR_ENV) return { enHost: EN_ENV, frHost: EN_ENV };
  if (!EN_ENV && FR_ENV) return { enHost: FR_ENV, frHost: FR_ENV };
  const h = normalizeHost(_hostHeader);
  return { enHost: h, frHost: h };
}

export function localeForHost(hostHeader?: string) {
  const host = normalizeHost(hostHeader);

  if (FR_ENV && host === FR_ENV) return "fr-ca" as const;
  if (FR_VANITY_HOSTS.has(host)) return "fr-ca" as const;

  return "en-ca" as const;
}
