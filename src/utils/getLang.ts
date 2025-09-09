import { usePathname } from "next/navigation";
import { fullLangList } from "@/constants/languages";

export type RouteLocale = keyof typeof fullLangList;
export const SUPPORTED_ROUTE_LOCALES = Object.keys(fullLangList) as RouteLocale[];
export const DEFAULT_ROUTE_LOCALE: RouteLocale = SUPPORTED_ROUTE_LOCALES[0] ?? "en-ca";

const firstSegment = (pathname: string): string =>
  pathname.split("?")[0].split("#")[0].replace(/^\/+/, "").split("/")[0] || "";

const isRouteLocale = (val: string): val is RouteLocale =>
  SUPPORTED_ROUTE_LOCALES.includes(val.toLowerCase() as RouteLocale);

export const stripLocaleFromPath = (pathname: string): string => {
  const seg = firstSegment(pathname).toLowerCase();
  if (isRouteLocale(seg)) {
    const rest = pathname.replace(new RegExp(`^/${seg}`), "") || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
};

export const buildLocalizedHref = (locale: RouteLocale, path: string): string => {
  const clean = stripLocaleFromPath(path);
  return `/${locale}${clean === "/" ? "" : clean}`;
};

export function getLangFromPath(pathname: string) {
  const seg = firstSegment(pathname).toLowerCase();
  const routeLocale: RouteLocale = isRouteLocale(seg) ? (seg as RouteLocale) : DEFAULT_ROUTE_LOCALE;
  return {
    routeLocale,
    prismicLocale: routeLocale,         
    hrefPrefix: `/${routeLocale}` as const,
    pathWithoutLocale: stripLocaleFromPath(pathname),
  };
}

export function useLang() {
  const pathname = usePathname() || "/";
  return getLangFromPath(pathname);
}
