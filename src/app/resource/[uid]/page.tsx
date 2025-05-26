import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import React, { Suspense } from "react";
import { Intro, Layout } from "@/components";
import { getLocales } from "@/utils";
import CategoryFilterProvider from "@/providers/CategoryFilterProvider";
import type { BreadcrumbLink } from "@/components/Breadcrumb";
import { Loading } from "@/components/Loading/Loading";

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */

type Params = { uid: string; lang: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid, lang } = await params;

  const client = createClient();
  const page = await client
    .getByUID("resource_page", uid, { lang })
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
  const { uid, lang } = await params;

  const client = createClient();
  const page = await client
    .getByUID("resource_page", uid, { lang })
    .catch(() => notFound());
  const global = await client.getSingle("globals", { lang });
  const menus = await client.getSingle("menus", { lang });
  const partners = await client.getSingle("partners", { lang });

  const locales = await getLocales(page, client);
  const resourceTags = page.tags || [];
  const pageTypeLabel =
    page.type === "resource_page"
      ? "Gender Equity in Action"
      : "Support Pathways";

  let categoryDoc = null;
  const category = page.data.category;

  if (category && category.link_type === "Document" && category.uid) {
    try {
      categoryDoc = await client.getByUID("resource_category", category.uid, {
        lang,
      });
    } catch {
      console.warn("Not Found:", category);
    }
  }

  const categoryLabel = categoryDoc && categoryDoc.data.name;

  const links = [
    {
      label: pageTypeLabel,
      href: "/search?filter=resource_page",
    },
    categoryLabel
      ? {
          label: categoryLabel,
          href:
            page.data.category && "id" in page.data.category
              ? page.data.category.id &&
                `/search?filter=resource_page&resource_categories=${page.data.category.id}`
              : undefined,
        }
      : null,
    {
      label: prismic.asText(page.data.title),
    },
  ].filter(Boolean) as BreadcrumbLink[];

  return (
    <Suspense fallback={<Loading hasText />}>
      <CategoryFilterProvider>
        <Layout
          locales={locales}
          global={global.data}
          menus={menus.data}
          partners={partners.data}
          include_newsletter_sign_up_banner={
            page.data.include_newsletter_sign_up_banner
          }
        >
          <Intro type="resource" pageData={page.data} links={links} />
          <SliceZone
            slices={page.data.slices}
            components={components}
            context={{ lang: "en-ca", tags: resourceTags }}
          />
        </Layout>
      </CategoryFilterProvider>
    </Suspense>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client
    .getAllByType("resource_page", {
      lang: "*",
    })
    .catch(() => notFound());

  return pages.map((page) => {
    return {
      uid: page.uid,
      lang: page.lang,
    };
  });
}
