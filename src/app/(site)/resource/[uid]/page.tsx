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
import { getServerLocale } from "@/utils/serverLocale";
import { ResourceCategoryDocument } from "../../../../../prismicio-types";

type Params = { uid: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const lang = await getServerLocale();
  const client = createClient();

  const page = await client.getByUID("resource_page", uid, { lang }).catch(() => null);
  if (!page) return {};

  return {
    title:
      page.data.meta_title ||
      prismic.asText(page.data.title) ||
      "Canadian Women in Sports",
    description: page.data.meta_description || undefined,
    openGraph: {
      title: page.data.meta_title || undefined,
      images: page.data.meta_image?.url ? [{ url: page.data.meta_image.url }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const lang = await getServerLocale();

  const client = createClient();

  const page = await client.getByUID("resource_page", uid, { lang }).catch(() => null);
  if (!page) notFound();

  const [global, menus, partners] = await Promise.all([
    client.getSingle("globals", { lang }).catch(() => null),
    client.getSingle("menus", { lang }).catch(() => null),
    client.getSingle("partners", { lang }).catch(() => null),
  ]);
  if (!global || !menus) notFound();

  const locales = await getLocales(page, client);
  const resourceTags = page.tags || [];

  const pageTypeLabel =
    page.type === "resource_page"
      ? lang === "fr-ca"
        ? "Équité de genre en action"
        : "Gender Equity in Action"
      : lang === "fr-ca"
      ? "Voies de soutien"
      : "Support Pathways";

  let categoryDoc: ResourceCategoryDocument | null = null;
  const category = (page.data).category;
  if (category && category.link_type === "Document" && category.uid) {
    try {
      categoryDoc = await client.getByUID("resource_category", category.uid, { lang });
    } catch {
      console.warn("Not Found:", category);
    }
  }
  const categoryLabel = categoryDoc?.data?.name as string | undefined;

  const links = [
    { label: pageTypeLabel, href: "/search?filter=resource_page" },
    categoryLabel
      ? {
          label: categoryLabel,
          href:
            page.data.category && "id" in page.data.category
              ? (page.data.category).id &&
                `/search?filter=resource_page&resource_categories=${(page.data.category).id}`
              : undefined,
        }
      : null,
    { label: prismic.asText(page.data.title) },
  ].filter(Boolean) as BreadcrumbLink[];

  return (
    <Suspense fallback={<Loading hasText />}>
      <CategoryFilterProvider>
        <Layout
          locales={locales}
          lang={lang}
          global={global.data}
          menus={menus.data}
          partners={page.data.include_partners ? partners?.data ?? null : null}
          include_newsletter_sign_up_banner={!!page.data.include_newsletter_sign_up_banner}
        >
          <Intro type="resource" pageData={page.data} links={links} lang={lang} />
          <SliceZone slices={page.data.slices} components={components} context={{ lang, tags: resourceTags }} />
        </Layout>
      </CategoryFilterProvider>
    </Suspense>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("resource_page", { lang: "*" }).catch(() => []);

  const seen = new Set<string>();
  const params: { uid: string }[] = [];
  for (const p of pages) {
    if (p.uid && !seen.has(p.uid)) {
      seen.add(p.uid);
      params.push({ uid: p.uid });
    }
  }
  return params;
}
