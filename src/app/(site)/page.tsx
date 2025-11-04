import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { Layout } from "@/components";
import { getLocales } from "@/utils";
import { HomepageHero } from "@/components/Heros/HomepageHero";
import { getServerLocale } from "@/utils/serverLocale";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLocale();
  const client = createClient();

  const page = await client
    .getByUID("page", "home", { lang })
    .catch(() => null);

  if (!page) return {};

  const title =
    page.data.meta_title ||
    prismic.asText(page.data.title) ||
    "Canadian Women in Sports";

  return {
    title,
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

  const page = await client
    .getByUID("page", "home", { lang })
    .catch(() => null);
  if (!page) notFound();

  const [global, menus, partners] = await Promise.all([
    client.getSingle("globals", { lang }).catch(() => null),
    client.getSingle("menus", { lang }).catch(() => null),
    client.getSingle("partners", { lang }).catch(() => null),
  ]);
  if (!global || !menus) notFound();

  const locales = await getLocales(page, client);

  return (
    <Layout
      locales={locales}
      lang={lang}
      global={global.data}
      menus={menus.data}
      partners={page.data.include_partners ? partners?.data ?? null : null}
      include_newsletter_sign_up_banner={!!page.data.include_newsletter_sign_up_banner}
    >
      <div className="relative">
        <HomepageHero data={page.data} />
        <SliceZone slices={page.data.slices} components={components} context={{ lang }} />
      </div>
    </Layout>
  );
}

