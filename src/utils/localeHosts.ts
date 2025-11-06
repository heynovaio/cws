// Replace your normalizeHost() with this:
export function normalizeHost(h?: string | null) {
  return (h || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "") // safety if a full URL ever slips in
    .replace(/^www\./, "")       // <<< strip www.
    .replace(/:.*$/, "");        // strip port
}

const EN_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_EN);
const FR_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_FR);

// pairedDomainsFor: no changes needed besides relying on normalized values
export function pairedDomainsFor(hostHeader?: string) {
  const host = normalizeHost(hostHeader);

  if (host === EN_ENV && FR_ENV) return { enHost: EN_ENV, frHost: FR_ENV };
  if (host === FR_ENV && EN_ENV) return { enHost: EN_ENV, frHost: FR_ENV };

  if (host.startsWith("fr.")) {
    const base = host.slice(3);
    return { enHost: base, frHost: host };
  }

  return { enHost: host, frHost: `fr.${host}` };
}

export function localeForHost(hostHeader?: string) {
  const host = normalizeHost(hostHeader);
  if (host === FR_ENV || host.startsWith("fr.")) return "fr-ca" as const;
  return "en-ca" as const;
}
