// app/(site)/search/page.tsx
import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLocales } from "@/utils";
import { Layout, SearchLayout } from "@/components";
import CategoryFilterProvider from "@/providers/CategoryFilterProvider";
import { GeneralHero } from "@/components/Heros/GeneralHero";
import { Suspense } from "react";
import { Loading } from "@/components/Loading/Loading";
import { getServerLocale } from "@/utils/serverLocale";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLocale();
  const client = createClient();

  const page = await client.getSingle("search_page", { lang }).catch(() => null);
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

export default async function Page() {
  const lang = await getServerLocale();
  const client = createClient();

  const page = await client.getSingle("search_page", { lang }).catch(() => null);
  if (!page) notFound();

  const [global, menus, partners] = await Promise.all([
    client.getSingle("globals", { lang }).catch(() => null),
    client.getSingle("menus", { lang }).catch(() => null),
    client.getSingle("partners", { lang }).catch(() => null),
  ]);
  if (!global || !menus) notFound();

  const locales = await getLocales(page, client as any);

  return (
    <Layout
      locales={locales}
      lang={lang}
      global={global.data}
      menus={menus.data}
      partners={page.data.include_partners ? partners?.data ?? null : null}
      include_newsletter_sign_up_banner={!!page.data.include_newsletter_sign_up_banner}
    >
      <Suspense fallback={<Loading hasText />}>
        <GeneralHero data={page.data} />
        <CategoryFilterProvider>
          <SearchLayout lang={lang} />
        </CategoryFilterProvider>
        <SliceZone slices={page.data.slices} components={components} context={{ lang }} />
      </Suspense>
    </Layout>
  );
}
