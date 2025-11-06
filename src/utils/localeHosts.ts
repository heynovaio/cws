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


// ❌ no more addFrPrefix/stripFrPrefix helpers

export function pairedDomainsFor(_hostHeader?: string) {
  // If both envs are set, always pair to those — regardless of the request host
  if (EN_ENV && FR_ENV) return { enHost: EN_ENV, frHost: FR_ENV };

  // If only one is set, use it for both (no subdomain fallback)
  if (EN_ENV && !FR_ENV) return { enHost: EN_ENV, frHost: EN_ENV };
  if (!EN_ENV && FR_ENV) return { enHost: FR_ENV, frHost: FR_ENV };

  // If neither is set, stick to the current host for both (still no fr. prefix)
  const h = normalizeHost(_hostHeader);
  return { enHost: h, frHost: h };
}

export function localeForHost(hostHeader?: string) {
  const host = normalizeHost(hostHeader);
  // Only treat requests to the explicit FR domain as French
  if (FR_ENV && host === FR_ENV) return "fr-ca" as const;
  return "en-ca" as const;
}

