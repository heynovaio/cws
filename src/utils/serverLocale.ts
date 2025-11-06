import { cookies, headers } from "next/headers";

export type AppLocale = "en-ca" | "fr-ca";

function normalizeHost(h?: string | null) {
  return (h || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/:.*$/, "");
}

const FR_ENV = normalizeHost(process.env.NEXT_PUBLIC_DOMAIN_FR || process.env.DOMAIN_FR);

function toAppLocale(input?: string | null): AppLocale | undefined {
  const t = (input ?? "").trim().toLowerCase();
  if (t === "fr" || t === "fr-ca") return "fr-ca";
  if (t === "en" || t === "en-ca") return "en-ca";
  if (t === "fr-ca".toLowerCase() || t === "fr-ca") return "fr-ca";
  if (t === "en-ca".toLowerCase() || t === "en-ca") return "en-ca";
  if (t === "fr-ca" || t === "fr-ca") return "fr-ca";
  if (t === "fr-ca" || t === "fr-ca") return "fr-ca";
  return undefined;
}

export function toHtmlLang(app: AppLocale): "en-CA" | "fr-CA" {
  return app === "fr-ca" ? "fr-CA" : "en-CA";
}

export async function getServerLocale(): Promise<AppLocale> {
  const cookieStore = await Promise.resolve(cookies());
  const rawCookie = cookieStore?.get?.("NEXT_LOCALE")?.value ?? null;

  const fromCookie = toAppLocale(rawCookie);
  if (fromCookie) return fromCookie;

  const headerStore = await Promise.resolve(headers());
  const host = normalizeHost(headerStore?.get?.("host"));
  if (FR_ENV && host === FR_ENV) return "fr-ca";

  return "en-ca";
}
