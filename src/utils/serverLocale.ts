import { cookies, headers } from "next/headers";

export type AppLocale = "en-ca" | "fr-ca";

export async function getServerLocale(): Promise<AppLocale> {

  const cookieStore = await Promise.resolve(cookies());
  const fromCookie = cookieStore?.get?.("NEXT_LOCALE")?.value as AppLocale | undefined;
  if (fromCookie === "en-ca" || fromCookie === "fr-ca") return fromCookie;

  const headerStore = await Promise.resolve(headers());
  const host = headerStore?.get?.("host")?.toLowerCase() || "";
  if (host.startsWith("fr.")) return "fr-ca";

  return "en-ca";
}
