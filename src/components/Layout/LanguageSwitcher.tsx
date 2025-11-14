"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fullLangList } from "@/constants/languages";
import type { PrismicDocument } from "@prismicio/client";
import { translateCareersSegment, stripLeadingLocalePrefix } from "@/utils/i18nDomains";
import type { ChangeEvent } from "react";

type Lang = "en-ca" | "fr-ca";

function normalizePathFromPrismicUrl(u?: string | null): string | undefined {
  if (!u) return undefined;
  try {
    const url = u.startsWith("http") ? new URL(u) : new URL(u, "http://local");
    return stripLeadingLocalePrefix(url.pathname || "/");
  } catch {
    return stripLeadingLocalePrefix(u);
  }
}

function stripWww(h: string) {
  return h.replace(/^www\./i, "");
}

export default function LanguageSwitcher({
  lang,
  locales,
  classname,
}: {
  lang: Lang;
  locales: PrismicDocument[];
  classname?: string;
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  const EN_CAMPAIGN_VANITY = "keepgirlsplaying.ca";
  const FR_CAMPAIGN_VANITY = "xn--danslquipedesfilles-fzb.ca";

  const buildHref = (toLocale: Lang): string => {
    const targetDoc = locales.find((d) => d.lang === toLocale);
    const prismicPath = normalizePathFromPrismicUrl(targetDoc?.url);

    const fallbackPath = translateCareersSegment(
      stripLeadingLocalePrefix(pathname),
      toLocale
    );

    const targetPath = (prismicPath ?? fallbackPath) || "/";

    const current =
      typeof window !== "undefined"
        ? new URL(window.location.href)
        : new URL("http://localhost:3000/");

    const curHost = stripWww(current.hostname);
    const isLocal = curHost === "localhost" || curHost.endsWith(".localhost");

    const isCampaignVanity =
      curHost === EN_CAMPAIGN_VANITY || curHost === FR_CAMPAIGN_VANITY;

    if (isCampaignVanity) {
      const target = new URL(current.href);
      target.hostname = toLocale === "fr-ca" ? FR_CAMPAIGN_VANITY : EN_CAMPAIGN_VANITY;
      target.pathname = "/";
      target.port = current.port;
      target.protocol = current.protocol;
      target.search = searchParams?.toString()
        ? `?${searchParams.toString()}`
        : "";
      return target.toString();
    }

    const EN_ENV = stripWww(process.env.NEXT_PUBLIC_DOMAIN_EN || "");
    const FR_ENV = stripWww(process.env.NEXT_PUBLIC_DOMAIN_FR || "");

    let enHost = EN_ENV || curHost;
    let frHost = FR_ENV || curHost;

    if (EN_ENV && FR_ENV) {
      enHost = EN_ENV;
      frHost = FR_ENV;
    } else if (isLocal && EN_ENV && !FR_ENV) {
      frHost = `fr.${enHost}`;
    }

    const target = new URL(current.href);

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
