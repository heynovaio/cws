// components/LanguageSwitcher.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fullLangList } from "@/constants/languages";
import type { PrismicDocument } from "@prismicio/client";
import { translateCareersSegment, stripLeadingLocalePrefix } from "@/utils/i18nDomains";

type Lang = "en-ca" | "fr-ca";

function normalizePathFromPrismicUrl(u: string | undefined): string | null {
  if (!u) return null;
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
  lang,              // <-- server-provided current lang ("en-ca" | "fr-ca")
  locales,           // <-- Prismic alt-language docs (array)
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
    // 1) Try to use Prismic's alt-language URL for the target locale
    const targetDoc = locales.find((d) => d.lang === toLocale);
    let targetPath =
      normalizePathFromPrismicUrl(targetDoc?.url) ??
      // Fallback: use current path (and translate careers segment just in case)
      translateCareersSegment(stripLeadingLocalePrefix(pathname), toLocale);

    // 2) Build off current location so protocol + PORT (e.g., :3000) are preserved
    const current =
      typeof window !== "undefined"
        ? new URL(window.location.href)
        : new URL("http://localhost:3000/");

    const hostname = current.hostname; // e.g., 'localhost' or 'fr.localhost' or 'www.womensports.ca'
    // Pairing logic: if current is FR (fr.*), EN is base; else FR is fr.<host>
    const enHost = hostname.startsWith("fr.") ? hostname.slice(3) : hostname;
    const frHost = hostname.startsWith("fr.") ? hostname : `fr.${hostname}`;

    const target = new URL(current.href);
    target.hostname = toLocale === "fr-ca" ? frHost : enHost;
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
