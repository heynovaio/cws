import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import React from "react";
import { Layout } from "@/components";
import { getLocales } from "@/utils";
import { GeneralHero } from "@/components/Heros/GeneralHero";

/**
 * This page renders a Prismic Document dynamically based on the URL.
 * It checks if the uid corresponds to a career_hub or regular page type.
 */

type Params = { uid: string; lang: string };

// Helper function to determine page type and fetch data
async function getPageData(uid: string, lang: string) {
  const client = createClient();

  // First, try to fetch as career_hub
  try {
    const careerHub = await client.getByUID("career_hub", uid, { lang });
    return {
      page: careerHub,
      type: "career_hub" as const,
    };
  } catch {
    // Career hub doesn't exist, continue to regular page check
  }

  // If not career_hub, try to fetch as regular page
  try {
    const page = await client.getByUID("page", uid, { lang });
    return {
      page,
      type: "page" as const,
    };
  } catch {
    // Neither type found
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid, lang } = await params;

  const pageData = await getPageData(uid, lang);

  if (!pageData) {
    notFound();
  }

  const { page } = pageData;

  return {
    title:
      page.data.meta_title ||
      prismic.asText(page.data.title) ||
      "Canadian Women in Sports",
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title || undefined,
      images: [
        {
          url: page.data.meta_image.url || "",
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid, lang } = await params;

  const pageData = await getPageData(uid, lang);

  if (!pageData) {
    notFound();
  }

  const { page, type } = pageData;
  const client = createClient();

  // Fetch common data
  const global = await client.getSingle("globals", { lang });
  const menus = await client.getSingle("menus", { lang });
  const partners = await client.getSingle("partners", { lang });
  const locales = await getLocales(page, client);

  // Render based on page type
  if (type === "career_hub") {
    const heroData = {
      title: page.data.title,
      body: page.data.body,
      button: Array.isArray(page.data.button) ? page.data.button : [],
    };

    return (
      <Layout
        locales={locales}
        lang={lang}
        global={global.data}
        menus={menus.data}
        partners={page.data.include_partners ? partners.data : null}
        include_newsletter_sign_up_banner={false}
      >
        <GeneralHero data={heroData} shortHero />
        <SliceZone
          slices={page.data.slices}
          components={components}
          context={{ lang }}
        />
      </Layout>
    );
  }

  // Regular page rendering
  return (
    <Layout
      locales={locales}
      lang={lang}
      global={global.data}
      menus={menus.data}
      partners={page.data.include_partners ? partners.data : null}
      include_newsletter_sign_up_banner={
        page.data.include_newsletter_sign_up_banner
      }
    >
      <GeneralHero data={page.data} />
      <div id="next-section">
        <SliceZone
          slices={page.data.slices}
          components={components}
          context={{ lang }}
        />
      </div>
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  // Get all regular pages
  const pages = await client
    .getAllByType("page", {
      lang: "*",
    })
    .catch(() => []);

  // Get career hub pages
  const careerHubs = await client
    .getAllByType("career_hub", {
      lang: "*",
    })
    .catch(() => []);

  // Combine both types
  const allParams = [
    ...pages.map((page) => ({
      uid: page.uid,
      lang: page.lang,
    })),
    ...careerHubs.map((careerHub) => ({
      uid: careerHub.uid,
      lang: careerHub.lang,
    })),
  ];

  return allParams;
}
