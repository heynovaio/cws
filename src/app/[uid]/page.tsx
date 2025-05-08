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
    .getByUID("page", uid, { lang })
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
    .getByUID("page", uid, { lang })
    .catch(() => notFound());
  const global = await client.getSingle("globals", { lang });
  const menus = await client.getSingle("menus", { lang });
  const partners = await client.getSingle("partners", { lang });

  const locales = await getLocales(page, client);

  return (
    <Layout
      locales={locales}
      global={global.data}
      menus={menus.data}
      partners={partners.data}
      include_newsletter_sign_up_banner={
        page.data.include_newsletter_sign_up_banner
      }
    >
      <GeneralHero data={page.data} tagline="Test tagline" />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ lang: "en-ca" }}
      />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client
    .getAllByType("page", {
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
