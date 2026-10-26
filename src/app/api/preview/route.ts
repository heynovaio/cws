import type { NextRequest } from "next/server";
import type { LinkResolverFunction } from "@prismicio/client";
import { redirectToPreviewURL } from "@prismicio/next";
import { createClient } from "../../../prismicio";
import { usesDomainLocale } from "@/utils/localeHosts";

// Non-production hosts serve French under /fr-ca, so French drafts open there.
// Returning null falls back to the URL from the route resolver.
const pathLocaleResolver: LinkResolverFunction = (doc) =>
  doc.lang === "fr-ca" && doc.url
    ? `/fr-ca${doc.url === "/" ? "" : doc.url}`
    : null;

// redirectToPreviewURL enables Draft Mode and stores the preview token.
export async function GET(request: NextRequest): Promise<never> {
  const client = createClient();
  const linkResolver = usesDomainLocale(request.headers.get("host"))
    ? undefined
    : pathLocaleResolver;

  return await redirectToPreviewURL({ client, request, linkResolver });
}
