import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLocales } from "@/utils";
import * as prismic from "@prismicio/client";
import { Layout } from "@/components";
import { GeneralHero } from "@/components/Heros/GeneralHero";

export default async function Page({}) {
  const client = createClient();
  const page = await client
    .getSingle("contact_page", { lang: "en-ca" })
    .catch(() => notFound());
  const global = await client.getSingle("globals", { lang: "en-ca" });
  const menus = await client.getSingle("menus", { lang: "en-ca" });

  const locales = await getLocales(page, client);
  return (
    <Layout
      locales={locales}
      global={global.data}
      menus={menus.data}
      include_newsletter_sign_up_banner={
        page.data.include_newsletter_sign_up_banner
      }
    >
      <GeneralHero data={page.data} />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ lang: "en-ca" }}
      />
    </Layout>
  );
}

export async function generateMetadata({}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getSingle("contact_page", { lang: "en-ca" })
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

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("contact_page", {
    lang: "*",
  });

  return pages.map((page) => {
    return {
      lang: page.lang,
    };
  });
}
