import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import React, { Suspense } from "react";
import { Layout, CareerIntro } from "@/components";
import { getLocales } from "@/utils";
import CategoryFilterProvider from "@/providers/CategoryFilterProvider";
import type { BreadcrumbLink } from "@/components/Breadcrumb";
import { Loading } from "@/components/Loading/Loading";

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */

type Params = { uid: string; careeruid: string; lang: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { careeruid, lang } = await params;

  const client = createClient();
  const page = await client
    .getByUID("career_page", careeruid, { lang })
    .catch(() => notFound());

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
  const { uid, careeruid, lang } = await params;

  const client = createClient();

  // Get the career page document
  const page = await client
    .getByUID("career_page", careeruid, { lang })
    .catch(() => notFound());

  // Get the career hub using the uid parameter
  const careerHub = await client
    .getByUID("career_hub", uid, { lang })
    .catch(() => notFound());

  const global = await client.getSingle("globals", { lang });
  const menus = await client.getSingle("menus", { lang });
  const partners = await client.getSingle("partners", { lang });
  const locales = await getLocales(page, client);
  const pageTags = page.tags || [];

  const links: BreadcrumbLink[] = [
    {
      label: "Careers",
      href: "/career",
    },
    {
      label: prismic.asText(careerHub.data.title),
      href: `/${uid}`, // Updated to use uid instead of career
    },
    {
      label: prismic.asText(page.data.title),
    },
  ];

  return (
    <Suspense fallback={<Loading hasText />}>
      <CategoryFilterProvider>
        <Layout
          locales={locales}
          global={global.data}
          menus={menus.data}
          partners={page.data.include_partners ? partners.data : null}
          include_newsletter_sign_up_banner={false}
        >
          <CareerIntro pageData={page.data} links={links} />
          <SliceZone
            slices={page.data.slices}
            components={components}
            context={{ lang, tags: pageTags }}
          />
        </Layout>
      </CategoryFilterProvider>
    </Suspense>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  // Get all career pages
  const careerPages = await client
    .getAllByType("career_page", {
      lang: "*",
    })
    .catch(() => []);

  // Get all career hubs to create the mapping
  const careerHubs = await client
    .getAllByType("career_hub", {
      lang: "*",
    })
    .catch(() => []);

  const params = [];

  for (const hub of careerHubs) {
    for (const page of careerPages) {
      if (hub.lang === page.lang) {
        params.push({
          uid: hub.uid,
          careeruid: page.uid,
          lang: page.lang,
        });
      }
    }
  }

  return params;
}
