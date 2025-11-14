// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { pairedDomainsFor, localeForHost, normalizeHost } from "@/utils/localeHosts";

const EN_L = "en-ca" as const; // lower for paths
const FR_L = "fr-ca" as const;
type AppPathLocale = typeof EN_L | typeof FR_L;

// Canonical cookie/html values for Intl & <html lang>
type CanonicalLocale = "en-CA" | "fr-CA";

const LOCALE_PREFIXES = new Set<AppPathLocale>([EN_L, FR_L]);

function translateCareers(pathname: string, locale: AppPathLocale) {
  if (locale === FR_L) return pathname.replace(/(^|\/)careers(\/|$)/, "$1carrieres$2");
  if (locale === EN_L) return pathname.replace(/(^|\/)carrieres(\/|$)/, "$1careers$2");
  return pathname;
}

function strip(pathname: string) {
  return pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
}

function protocolForHost(h: string) {
  return h.includes("localhost") ? "http" : "https";
}

function toAppPathLocale(input: unknown): AppPathLocale {
  const t = (typeof input === "string" ? input : "").trim().toLowerCase();
  return t === FR_L || t === "fr" ? FR_L : EN_L;
}

function toCanonicalLocale(app: AppPathLocale): CanonicalLocale {
  return app === FR_L ? "fr-CA" : "en-CA";
}

const LEGACY_SOURCES: Set<string> = new Set([
  "/about/contact-us",
  "/support-us",
  "/work-with-us",
  "/pro-sports-2024",
  "/resources",
  "/our-impact",
  "/news",
  "/about",
  "/rally-2024",
  "/learning-opportunities/e-learning/gender-equity-lens",
  "/learning-opportunities/presentations/long-term-development-for-women-and-girls",
  "/canadian-girls-sport-participation-on-the-rise-but-still-lags-behind-boys-according-to-new-research",
  "/rally-report-2024-virtual-learning-series",
  "/statement-on-trans-inclusion-in-sport",
  "/folgers-coffee-launches-bold-moves-bold-coffee-campaign-with-tennis-star-leylah-fernandez",
  "/news/newsletter",
  "/privacy-policy",
  "/about/vision-mission-values",
  "/about/our-story",
  "/about/our-team",
  "/about/board",
  "/about/partners",
  "/about/facilitators",
  "/about/policies-bylaws",
  "/about/faq",
  "/resources/publications",
  "/resources/research-insights",
  "/resources/tools",
  "/resources/glossary",
  "/resources/case-studies",
  "/work-with-us/workshops-and-presentations",
  "/learning-opportunities/e-learning",
  "/learning-opportunities/webinars",
  "/learning-opportunities/webinars/gender-equity-in-coaching",
  "/work-with-us/consulting",
  "/work-with-us/gender-equity-playbook",
  "/work-with-us/speaking-engagements",
  "/canadian-women-sport-appoints-advisory-group-to-ensure-maximum-impact-for-commercial-opportunities-of-professional-womens-sport-in-canada",
  "/rally-report-2022",
  "/our-impact/impact-report-2023-2024",
  "/impact-report",
  "/our-impact/strategic-plan",
  "/our-impact/theory-of-change",
  "/canadian-women-sport-unveils-new-fan-insight-reports",
  "/manager-partnerships",
  "/body-confident-sport-movement",
  "/director-finance-operations",
  "/canadas-women-olympians-and-paralympians-ready-to-grab-the-spotlight",
  "/manager-partnerships-engagement",
  "/news/page/2",
  "/news/page/3",
  "/news/page/17",
  "/resources/tools/maximizing-the-impact-of-gender-equity-diversity-and-inclusion-training",
  "/topic/allyship-and-advocacy",
  "/topic/best-practices-for-organizations",
  "/topic/coaching-and-designing-for-girls",
  "/topic/diversity-of-girls-and-women",
  "/topic/leadership-development",
  "/learning-opportunities/presentations",
  "/workshop-booking-form",
  "/introducing-canadian-women-and-sport",
  "/about/facilitator-sign-up",
  "/resources/publications/winning-plays-the-gender-equity-playbook-report",
  "/resources/publications/engaging-newcomers-handbook",
  "/resources/publications/she-belongs",
  "/resources/publications/actively-engaging-women-and-girls",
  "/resources/publications/good-practices-for-gender-equitable-boards",
  "/resources/publications/women-on-boards-guide-to-getting-involved",
  "/resources/publications/leading-the-way",
  "/resources/publications/women-55-70",
  "/resources/publications/on-the-move-handbook",
  "/resources/research-insights/rally-report-2024-a-call-to-reimagine-sport-so-all-girls-can-play",
  "/resources/research-insights/rally-report-2022-a-call-for-better-safer-sport-for-girls",
  "/resources/research-insights/the-pandemic-impact-on-girls-in-sport",
  "/resources/research-insights/the-sporting-experiences-of-bipoc-women-girls-in-canada",
  "/resources/research-insights/rally-report",
  "/resources/research-insights/leadership-snapshot",
  "/resources/research-insights/fuelling-a-lifetime-of-participation",
  "/resources/research-insights/trans-inclusion-in-sport",
  "/resources/research-insights/seeing-the-invisible-homophobia-in-sport",
  "/resources/tools/the-experiences-of-elite-athletes-during-pregnancy",
  "/resources/tools/gender-equity-in-coaching",
  "/resources/tools/using-gender-equity-as-a-tool-to-combat-gender-based-violence-in-sport",
  "/resources/tools/same-game",
  "/resources/tools/what-is-intersectionality",
  "/resources/tools/what-is-unconscious-bias",
  "/resources/tools/what-is-gender-equity",
  "/resources/tools/gender-equity-policy-template",
  "/resources/tools/how-to-apply-a-gender-lens-to-decision-making",
  "/resources/tools/page/2",
  "/resources/case-studies/forward-together-sport-leaders-share-their-gender-equity-journeys",
  "/resources/case-studies/second-generation-african-canadian-teen-girls-sport-experiences",
  "/resources/case-studies/squash-bc",
  "/resources/case-studies/coach-nb",
  "/resources/case-studies/ontario-basketball",
  "/resources/case-studies/nwt-soccer",
  "/resources/case-studies/judo-canada",
  "/resources/case-studies/storm-selects-lacrosse",
  "/resources/case-studies/gender-equity-is-good-governance-lessons-from-the-sport-sector",
  "/learning-opportunities/presentations/lgbtqi2s-inclusion-in-sport",
  "/learning-opportunities/presentations/women-in-sport-leadership",
  "/learning-opportunities/presentations/gender-equity-lens-debrief-session",
  "/learning-opportunities/presentations/women-on-boards-for-organizations",
  "/learning-opportunities/e-learning/keeping-girls-in-sport-e-module",
  "/learning-opportunities/webinars/the-sporting-experiences-of-bipoc-women-girls-in-canada",
  "/learning-opportunities/webinars/sport-leaders-share-gender-equity-journey",
  "/learning-opportunities/webinars/understanding-same-game",
  "/learning-opportunities/webinars/we-are-sport-mental-health",
  "/learning-opportunities/webinars/we-are-sport-diversity-leadership",
  "/learning-opportunities/webinars/we-are-sport-lgbtqi2s-inclusion",
  "/learning-opportunities/webinars/redefining-risk-taking",
  "/learning-opportunities/webinars/creating-a-safe-environment",
  "/learning-opportunities/webinars/positive-team-culture",
  "/learning-opportunities/webinars/page/2",
  "/the-next-play",
  "/national-same-game-challenge",
  "/canadian-women-sport-releases-findings-from-women-in-sport-leadership-snapshot-2023",
  "/spotlight-grant",
  "/25-million-investment-from-government-of-canada",
  "/pro-sports-2023",
  "/our-impact/impact-report",
  "/the-same-game-challenge-cohort-5",
  "/board-of-directors-2024-call-for-nominations",
  "/position-available-business-operations-internship-co-op",
  "/job-posting-director-marketing-communications",
  "/the-same-game-challenge-applications-now-open-for-sport-organizations",
  "/the-next-play-50-ontario-organizations-commit-to-make-a-difference-for-girls-in-sport",
  "/17-million-canadians-consider-themselves-fans-of-womens-sport-according-to-new-research",
  "/canadian-women-sport-to-expand-its-program-facilitators-and-consultants-team",
  "/ontario-government-invests-in-the-next-play-and-creates-opportunities-for-women-and-girls-in-sport-and-recreation",
  "/inspiring-inclusion-on-international-womens-day",
  "/news/page/4",
  "/52-sport-organizations-make-strides-forward-in-gender-equity-with-the-same-game-challenge",
  "/to-transgender-girls-and-women-across-canada-you-belong-in-sport",
  "/position-available-manager-finance-operations",
  "/job-posting-coordinator-programs",
  "/job-posting-manager-instructional-design-education-training",
  "/job-posting-manager-programs",
  "/job-posting-2023-product-manager-microsoft-365-web",
  "/job-posting-2023-product-manager-salesforce-bubble",
  "/canadian-women-sport-announces-third-cohort-of-same-game-challenge",
  "/safe-sport-in-canada",
  "/news/page/5",
  "/she-leads-by-sport",
  "/impact-research-committee-members",
  "/2020-wise-fund-recipients",
  "/game-on-pilot-program",
  "/february-2020-newsletter",
  "/news/page/16",
  "/news/page/15",
  "/topic/allyship-and-advocacy/page/2",
  "/learning-opportunities/webinars/directing-change-dina-bell-laroche",
  "/resources/tools/female-coach-mentorship-model",
  "/resources/tools/gender-equity-committee-terms-of-reference",
  "/topic/best-practices-for-organizations/page/2",
  "/topic/best-practices-for-organizations/page/3",
  "/topic/best-practices-for-organizations/page/4",
  "/learning-opportunities/webinars/empowering-girls-through-positive-coaching",
  "/topic/coaching-and-designing-for-girls/page/2",
  "/learning-opportunities/webinars/supporting-newcomer-girls-through-sport",
  "/topic/diversity-of-girls-and-women/page/2",
  "/topic/leadership-development/page/2",
  "/world-rugby-ban-of-trans-women",
  "/gender-equity/what-is-gender-equity",
  "/stepping-up-to-get-more-women-into-the-game-what-organizations-can-do-to-support-women-in-coaching",
  "/gender-equity/benefits-of-gender-equity",
  "/how-our-custom-consultations-support-organizations",
  "/meet-the-2023-disruptor-award-winners",
  "/national-day-for-truth-and-reconciliation-2023",
  "/news/page/6",
  "/position-available",
  "/interactive/same-game/story.html",
  "/resources/tools/gender-equity-self-assessment-tool-community",
  "/we-are-sport-conversations-with-bipoc-leaders",
  "/learning-opportunities/webinars/supporting-newcomer-girls-through-sport-fr",
  "/learning-opportunities/webinars/joining-a-board-rochelle-grayson",
  "/about/same-game-challenge-interest",
  "/about/the-next-play",
  "/year-in-review",
  "/46-sport-organizations-make-gender-equity-a-priority-with-the-same-game-challenge",
  "/government-of-canada-announces-new-funding-to-support-womens-professional-sport-movement",
  "/book-a-gender-equity-workshop-now-to-secure-2023-pricing",
  "/canadian-women-sport-welcomes-new-board-chair-and-vice-chair",
  "/fall-2023-programming",
  "/ncw-2023",
  "/back-to-school-back-to-sport",
  "/open-call-dei-committee-members",
]);

const SOURCE_HOSTS = new Set(["womenandsport.ca", "www.womenandsport.ca"]);
const EN_CAMPAIGN_PATH = "/campaign/keepgirlsplaying";
const FR_CAMPAIGN_PATH = "/campaign/maintenant-continuons-a-faire-jouer-les-filles";
// Vanity domains
export const EN_VANITY_HOSTS = new Set(["keepgirlsplaying.ca", "www.keepgirlsplaying.ca"]);
export const FR_VANITY_HOSTS = new Set([
  "danslequipedesfilles.ca",
  "www.danslequipedesfilles.ca",
  "dansléquipedesfilles.ca",
  "www.dansléquipedesfilles.ca",
  "xn--danslquipedesfilles-fzb.ca",
  "www.xn--danslquipedesfilles-fzb.ca",
]);

function ensureUtmDefaults(
  sp: URLSearchParams,
  defaults: { source: string; medium: string; campaign: string; content: string }
) {
  if (!sp.has("utm_source")) sp.set("utm_source", defaults.source);
  if (!sp.has("utm_medium")) sp.set("utm_medium", defaults.medium);
  if (!sp.has("utm_campaign")) sp.set("utm_campaign", defaults.campaign);
  if (!sp.has("utm_content")) sp.set("utm_content", defaults.content);
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const originalPort = url.port; // preserve :3000 in dev
  const hostHeader = (request.headers.get("host") || "").toLowerCase();
  const host = normalizeHost(hostHeader);
  const hostNoPort = host.split(":")[0]; // do NOT treat as final host for redirects
  const pathname = strip(url.pathname);

  // Compute target locale up front
  const pathLocale: AppPathLocale = toAppPathLocale(localeForHost(host));
  const canonicalLocale: CanonicalLocale = toCanonicalLocale(pathLocale);

  // /files/* passthrough (no cookie needed – static)
  if (pathname.startsWith("/files/")) return NextResponse.next();

  const { enHost, frHost } = pairedDomainsFor(host);

  // SOURCE_HOSTS → external campaign redirect with UTM defaults
  if (SOURCE_HOSTS.has(hostNoPort)) {
    if (pathname === `/en-ca${EN_CAMPAIGN_PATH}` || pathname === EN_CAMPAIGN_PATH) {
      const target = new URL(`https://keepgirlsplaying.ca/`);
      const merged = new URLSearchParams(url.searchParams);
      ensureUtmDefaults(merged, {
        source: hostNoPort,
        medium: "redirect",
        campaign: "keep_girls_playing",
        content: "campaign_path_en",
      });
      target.search = merged.toString();
      if (url.hash) target.hash = url.hash;
      return NextResponse.redirect(target, 308);
    }
    if (pathname === `/fr-ca${FR_CAMPAIGN_PATH}` || pathname === FR_CAMPAIGN_PATH) {
      // Use punycode host for safety across clients
      const target = new URL(`https://xn--danslquipedesfilles-fzb.ca/`);
      const merged = new URLSearchParams(url.searchParams);
      ensureUtmDefaults(merged, {
        source: hostNoPort,
        medium: "redirect",
        campaign: "dans_lequipe_des_filles",
        content: "campaign_path_fr",
      });
      target.search = merged.toString();
      if (url.hash) target.hash = url.hash;
      return NextResponse.redirect(target, 308);
    }
  }

  // Vanity domains
  const onEnVanity = EN_VANITY_HOSTS.has(hostNoPort);
  const onFrVanity = FR_VANITY_HOSTS.has(hostNoPort);
  if (onEnVanity || onFrVanity) {
    if (pathname === "/" || pathname === "/index.html") {
      // Rewrite to campaign path on same host
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = onEnVanity ? EN_CAMPAIGN_PATH : FR_CAMPAIGN_PATH;
      const res = NextResponse.rewrite(rewriteUrl);
      // Set locale cookie even here
      res.cookies.set("NEXT_LOCALE", canonicalLocale, { path: "/" });
      return res;
    }
    // Redirect all other vanity paths to primary site
    const target = request.nextUrl.clone();
    target.protocol = "https:";
    target.hostname = "womenandsport.ca";
    // no port for prod
    const res = NextResponse.redirect(target, 308);
    res.cookies.set("NEXT_LOCALE", canonicalLocale, { path: "/" });
    return res;
  }

  // Legacy sources: pass through BUT set the cookie so edge never falls back to Accept-Language
  if (LEGACY_SOURCES.has(pathname)) {
    const res = NextResponse.next();
    res.cookies.set("NEXT_LOCALE", canonicalLocale, { path: "/" });
    return res;
  }

  // Locale-prefixed legacy URLs → strip prefix and redirect to correct domain
  const segs = pathname.split("/").filter(Boolean);
  const hasLegacyPrefix = segs.length > 0 && LOCALE_PREFIXES.has(segs[0] as AppPathLocale);

  if (hasLegacyPrefix) {
    const prefixedLocale = segs[0] as AppPathLocale;
    const [, ...rest] = segs;
    let clean = "/" + rest.join("/");
    if (clean === "/") clean = "/";

    clean = translateCareers(clean, prefixedLocale);

    const desiredHostname = prefixedLocale === FR_L ? frHost : enHost;

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = protocolForHost(desiredHostname);
    redirectUrl.hostname = desiredHostname;
    if (originalPort) redirectUrl.port = originalPort; // preserve :3000 in dev
    redirectUrl.pathname = clean;
    redirectUrl.search = url.search;
    redirectUrl.hash = url.hash;

    const res = NextResponse.redirect(redirectUrl, 301);
    res.cookies.set("NEXT_LOCALE", toCanonicalLocale(prefixedLocale), { path: "/" });
    return res;
  }

  // Careers/carrières segment harmonization on same host
  const adjusted = translateCareers(pathname, pathLocale);
  if (adjusted !== pathname) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = adjusted;
    if (originalPort) redirectUrl.port = originalPort;
    const res = NextResponse.redirect(redirectUrl, 301);
    res.cookies.set("NEXT_LOCALE", canonicalLocale, { path: "/" });
    return res;
  }

  // Default: continue and set cookie
  const res = NextResponse.next();
  res.cookies.set("NEXT_LOCALE", canonicalLocale, { path: "/" });
  return res;
}

export const config = {
  matcher: ["/((?!api|assets|files/.*|slice-simulator|auth/.*|.*\\..*|_next).*)"],
};
