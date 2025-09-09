import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { fullLangList } from "./constants/languages";

const defaultLocale = "en-ca";
const locales = Object.keys(fullLangList);

function getLocale(request: NextRequest) {
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  const headers = { "accept-language": acceptedLanguage };
  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for files proxied through Netlify edge functions
  if (pathname.startsWith("/files/")) {
    return NextResponse.next();
  }

  if (pathname.includes("/careers") || pathname.includes("/carrieres")) {
    const langMatch = pathname.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\//);
    const currentLang = langMatch ? langMatch[1] : null;

    if (currentLang) {
      if (currentLang.startsWith("en") && pathname.includes("/carrieres")) {
        const newPath = pathname.replace("/carrieres", "/careers");
        const url = request.nextUrl.clone();
        url.pathname = newPath;
        return NextResponse.redirect(url);
      }

      if (currentLang.startsWith("fr") && pathname.includes("/careers")) {
        const newPath = pathname.replace("/careers", "/carrieres");
        const url = request.nextUrl.clone();
        url.pathname = newPath;
        return NextResponse.redirect(url);
      }
    }
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Strip any existing locale from the pathname
    const strippedPathname = locales.reduce((path, locale) => {
      if (path.startsWith(`/${locale}/`)) {
        return path.slice(locale.length + 1);
      } else if (path === `/${locale}`) {
        return "/";
      }
      return path;
    }, pathname);

    let finalPathname = strippedPathname;
    if (
      strippedPathname.includes("/careers") ||
      strippedPathname.includes("/carrieres")
    ) {
      if (locale.startsWith("fr")) {
        finalPathname = strippedPathname.replace("/careers", "/carrieres");
      } else {
        finalPathname = strippedPathname.replace("/carrieres", "/careers");
      }
    }

    // Clone request.nextUrl so we keep search params, host, etc.
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${finalPathname}`;

    return NextResponse.redirect(url);
  }

  // If no locale fix needed, just continue
  return NextResponse.next();
}

export const config = {
  // Exclude /files/* from middleware processing
  matcher: [
    "/((?!api|assets|files/.*|slice-simulator|auth/.*|.*\\..*|_next).*)",
  ],
};
