"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fullLangList } from "@/constants/languages";
import type { PrismicDocument } from "@prismicio/client";
import { translateCareersSegment, stripLeadingLocalePrefix } from "@/utils/i18nDomains";

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

    // 2) Fallback: use current path, translated for careers/carrières,
    //    and with any leading /en-ca or /fr-ca stripped.
    const fallbackPath = translateCareersSegment(
      stripLeadingLocalePrefix(pathname),
      toLocale
    );

    const targetPath = prismicPath ?? fallbackPath;

    // 3) Build a full URL off current location so protocol + PORT are preserved
    const current =
      typeof window !== "undefined"
        ? new URL(window.location.href)
        : new URL("http://localhost:3000/");

    const hostname = current.hostname; // e.g., 'localhost' or 'fr.localhost' or 'www.womensports.ca'
    const isFr = hostname.startsWith("fr.");
    const enHost = isFr ? hostname.slice(3) : hostname;
    const frHost = isFr ? hostname : `fr.${hostname}`;

    const target = new URL(current.href);
    // Keep the dev port if present
    const port = current.port;

    target.hostname = toLocale === "fr-ca" ? frHost : enHost;
    if (port) target.port = port; // explicitly preserve :3000 etc. in dev

    target.pathname = targetPath || "/";
    target.search = searchParams?.toString() ? `?${searchParams.toString()}` : "";

    return target.toString();
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
