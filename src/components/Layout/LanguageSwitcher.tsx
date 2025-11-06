"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fullLangList } from "@/constants/languages";
import type { PrismicDocument } from "@prismicio/client";
import { translateCareersSegment, stripLeadingLocalePrefix } from "@/utils/i18nDomains";
import type { ChangeEvent } from "react";

type Lang = "en-ca" | "fr-ca";

// Accept null and return undefined to play nice with ?? chains
function normalizePathFromPrismicUrl(u?: string | null): string | undefined {
  if (!u) return undefined;
  try {
    // Works for absolute (https://...) or relative (/fr-ca/about) URLs
    const url = u.startsWith("http") ? new URL(u) : new URL(u, "http://local");
    return stripLeadingLocalePrefix(url.pathname || "/");
  } catch {
    // Fallback if we got something odd
    return stripLeadingLocalePrefix(u);
  }
}

// Strip www. only; server/middleware will canonicalize further
function stripWww(h: string) {
  return h.replace(/^www\./i, "");
}

export default function LanguageSwitcher({
  lang,              // "en-ca" | "fr-ca" from server
  locales,           // Prismic alt-language docs
  classname,
}: {
  lang: Lang;
  locales: PrismicDocument[];
  classname?: string;
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  const buildHref = (toLocale: Lang): string => {
    // 1) Prefer Prismic’s alt URL for the target locale
    const targetDoc = locales.find((d) => d.lang === toLocale);
    const prismicPath = normalizePathFromPrismicUrl(targetDoc?.url);

    // 2) Fallback: current path, translated for careers/carrières,
    //    and with any leading /en-ca or /fr-ca stripped.
    const fallbackPath = translateCareersSegment(
      stripLeadingLocalePrefix(pathname),
      toLocale
    );

    const targetPath = (prismicPath ?? fallbackPath) || "/";

    // 3) Base current URL (preserves protocol + in-dev port)
    const current =
      typeof window !== "undefined"
        ? new URL(window.location.href)
        : new URL("http://localhost:3000/");

    const curHost = stripWww(current.hostname);
    const isLocal = curHost === "localhost" || curHost.endsWith(".localhost");

    // 4) Env-aware domain pairing (no fr. fallback in prod)
    const EN_ENV = stripWww(process.env.NEXT_PUBLIC_DOMAIN_EN || "");
    const FR_ENV = stripWww(process.env.NEXT_PUBLIC_DOMAIN_FR || "");

    // Defaults
    let enHost = EN_ENV || curHost;
    let frHost = FR_ENV || curHost;

    // If both envs are set (prod), lock strictly to them
    if (EN_ENV && FR_ENV) {
      enHost = EN_ENV;
      frHost = FR_ENV;
    }
    // In local dev, if only EN is set, simulate fr.localhost for convenience
    else if (isLocal && EN_ENV && !FR_ENV) {
      frHost = `fr.${enHost}`;
    }
    // If neither env is set (preview), keep same host for both (no fr. fabrication)

    // 5) Build target URL
    const target = new URL(current.href);

    // Keep the dev port on localhost; drop it for apex/prod hosts
    if (isLocal && current.port) {
      target.port = current.port;
    } else {
      target.port = "";
    }

    target.protocol = current.protocol;
    target.hostname = toLocale === "fr-ca" ? frHost : enHost;
    target.pathname = targetPath;
    target.search = searchParams?.toString() ? `?${searchParams.toString()}` : "";

    return target.toString();
  };

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const toLocale = e.target.value as Lang;
    router.push(buildHref(toLocale));
  };

  return (
    <div className={`print:hidden ${classname ?? ""}`}>
      <div className="inline-flex text-[1rem] items-center px-2 pt-1">
        <label htmlFor="language-switcher" className="px-1 py-1 text-sm">
          {lang === "fr-ca" ? "Langue:" : "Language:"}
        </label>
        <select
          id="language-switcher"
          value={lang}
          onChange={onChange}
          className="bg-transparent px-1 py-1 rounded-lg text-[1rem] outline-none focus:ring-2 focus:ring-ultra-pink text-black"
        >
          <option value="en-ca" style={{ color: "black" }}>
            {fullLangList["en-ca"]}
          </option>
          <option value="fr-ca" style={{ color: "black" }}>
            {fullLangList["fr-ca"]}
          </option>
        </select>
      </div>
    </div>
  );
}
