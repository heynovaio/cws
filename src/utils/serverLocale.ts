import { cookies, headers } from "next/headers";

export type AppLocale = "en-ca" | "fr-ca";

// Normalize host: strip scheme, www, and port
function normalizeHost(h?: string | null) {
  return (h || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/:.*$/, "");
}

// Read env-paired domains (works if you set either NEXT_PUBLIC_* or server-only)
const EN_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_EN || process.env.DOMAIN_EN);
const FR_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_FR || process.env.DOMAIN_FR);

// Map any cookie value (canonical or not) to our internal lowercase
function toAppLocale(input?: string | null): AppLocale | undefined {
  const t = (input ?? "").trim().toLowerCase();
  if (t === "fr" || t === "fr-ca") return "fr-ca";
  if (t === "en" || t === "en-ca") return "en-ca";
  // Accept canonical cookie casing too:
  if (t === "fr-ca".toLowerCase() || t === "fr-ca") return "fr-ca";
  if (t === "en-ca".toLowerCase() || t === "en-ca") return "en-ca";
  if (t === "fr-ca" || t === "fr-ca") return "fr-ca";
  // Handle canonical tags that may come from middleware
  if (t === "fr-ca" || t === "fr-ca") return "fr-ca";
  return undefined;
}

// Convert internal to canonical for <html lang>
export function toHtmlLang(app: AppLocale): "en-CA" | "fr-CA" {
  return app === "fr-ca" ? "fr-CA" : "en-CA";
}

export async function getServerLocale(): Promise<AppLocale> {
  const cookieStore = await Promise.resolve(cookies());
  const rawCookie = cookieStore?.get?.("NEXT_LOCALE")?.value ?? null;

  // 1) Prefer cookie (accept canonical or lowercase)
  const fromCookie = toAppLocale(rawCookie);
  if (fromCookie) return fromCookie;

  // 2) Infer from host — treat the explicit FR domain as French
  const headerStore = await Promise.resolve(headers());
  const host = normalizeHost(headerStore?.get?.("host"));
  if (FR_ENV && host === FR_ENV) return "fr-ca";

  // 3) Default English
  return "en-ca";
}
