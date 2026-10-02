// lib/prismicClient.ts
import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";

export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * Route resolver: domain-based locales, so no :lang in path.
 * Keep career hub bilingual slug handled by middleware redirects,
 * but expose both slugs in routes for direct linking/preview.
 */
const routes: prismic.ClientConfig["routes"] = [
  // homepage
  { type: "page", path: "/", uid: "home" },

  // generic pages (UID at root)
  { type: "page", path: "/:uid" },

  // specific page types
  { type: "program_page", path: "/program/:uid" },
  { type: "resource_page", path: "/resource/:uid" },
  { type: "contact_page", path: "/contact" },
  { type: "team_members", path: "/team" },
  { type: "campaign_page", path: "/campaign/:uid" },
  { type: "search_page", path: "/search" },

  // Career hub bilingual slugs (both allowed)
  { type: "career_hub", path: "/careers" },
  { type: "career_hub", path: "/carrieres" },

  { type: "career_page", path: "/careers/:uid" },
  { type: "career_page", path: "/carrieres/:uid" },
];

export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
