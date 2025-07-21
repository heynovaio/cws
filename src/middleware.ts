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

    // Clone request.nextUrl so we keep search params, host, etc.
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${strippedPathname}`;

    return NextResponse.redirect(url);
  }

  // If no locale fix needed, just continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|assets|slice-simulator|auth/.*|.*\\..*|_next).*)"],
};
