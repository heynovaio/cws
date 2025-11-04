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
import { getServerLocale } from "@/utils/serverLocale";

type Params = { uid: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const lang = await getServerLocale();

  const client = createClient();
  const page = await client.getByUID("career_page", uid, { lang }).catch(() => null);
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
  const page = await client.getByUID("career_page", uid, { lang }).catch(() => null);
  if (!page) notFound();

  const [global, menus, partners] = await Promise.all([
    client.getSingle("globals", { lang }).catch(() => null),
    client.getSingle("menus", { lang }).catch(() => null),
    client.getSingle("partners", { lang }).catch(() => null),
  ]);
  if (!global || !menus) notFound();

  const locales = await getLocales(page, client);
  const pageTags = page.tags || [];

  const links: BreadcrumbLink[] = [
    { label: "Careers", href: "/careers" }, 
    { label: prismic.asText(page.data.title) },
  ];

  return (
    <Suspense fallback={<Loading hasText />}>
      <CategoryFilterProvider>
        <Layout
          locales={locales}
          lang={lang}
          global={global.data}
          menus={menus.data}
          partners={page.data.include_partners ? partners?.data ?? null : null}
          include_newsletter_sign_up_banner={false}
        >
          <CareerIntro pageData={page.data} links={links} lang={lang} />
          <SliceZone slices={page.data.slices} components={components} context={{ lang, tags: pageTags }} />
        </Layout>
      </CategoryFilterProvider>
    </Suspense>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const docs = await client.getAllByType("career_page", { lang: "*" }).catch(() => []);

  const seen = new Set<string>();
  const params: { uid: string }[] = [];
  for (const d of docs) {
    if (d.uid && !seen.has(d.uid)) {
      seen.add(d.uid);
      params.push({ uid: d.uid });
    }
  }
  return params;
}
