import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLocales } from "./utils";
import React from "react";
import { Layout } from "@/components";

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getByUID("page", "home", { lang })
    .catch(() => notFound());

  return {
    title:
      page.data.meta_title ||
      prismic.asText(page.data.title) ||
      "Community Legal Information",
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

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const client = createClient();

  const page = await client.getByUID("page", "home", { lang });
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
    >
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ lang }}
      />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("page", {
    lang: "*",
    filters: [prismic.filter.at("my.page.uid", "home")],
  });

  return pages.map((page) => {
    return {
      lang: page.lang,
    };
  });
}
