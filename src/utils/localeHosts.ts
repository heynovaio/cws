export function normalizeHost(h?: string | null) {
  return (h || "").toLowerCase().replace(/:.*$/, ""); 
}

function addFrPrefix(host: string) {
  return host.startsWith("fr.") ? host : `fr.${host}`;
}
function stripFrPrefix(host: string) {
  return host.startsWith("fr.") ? host.slice(3) : host;
}

const EN_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_EN);
const FR_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_FR);

export function pairedDomainsFor(hostHeader?: string) {
  const host = normalizeHost(hostHeader);

  if (host === EN_ENV && FR_ENV) return { enHost: EN_ENV, frHost: FR_ENV };
  if (host === FR_ENV && EN_ENV) return { enHost: EN_ENV, frHost: FR_ENV };

  if (host.startsWith("fr.")) {
    const base = stripFrPrefix(host);
    return { enHost: base, frHost: host };
  }

  return { enHost: host, frHost: addFrPrefix(host) };
}

export function localeForHost(hostHeader?: string) {
  const host = normalizeHost(hostHeader);
  if (host === FR_ENV || host.startsWith("fr.")) return "fr-ca" as const;
  return "en-ca" as const;
}
