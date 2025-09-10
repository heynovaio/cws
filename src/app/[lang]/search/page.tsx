import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLocales } from "@/utils";
import * as prismic from "@prismicio/client";
import { Layout, SearchLayout } from "@/components";
import CategoryFilterProvider from "@/providers/CategoryFilterProvider";
import { GeneralHero } from "@/components/Heros/GeneralHero";
import { Suspense } from "react";
import { Loading } from "@/components/Loading/Loading";
import { SupportedLanguage } from "@/constants";

type Params = { uid: string; lang: SupportedLanguage };

export default async function Page({ params }: { params: Promise<Params> }) {
  const client = createClient();
  const { lang } = await params;

  const page = await client
    .getSingle("search_page", { lang })
    .catch(() => notFound());
  const global = await client.getSingle("globals", { lang });
  const menus = await client.getSingle("menus", { lang });
  const partners = await client.getSingle("partners", { lang });

  const locales = await getLocales(page, client);
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
      <Suspense fallback={<Loading hasText />}>
        <GeneralHero data={page.data} />
        <CategoryFilterProvider>
          <SearchLayout lang={lang} />
        </CategoryFilterProvider>
        <SliceZone
          slices={page.data.slices}
          components={components}
          context={{ lang }}
        />
      </Suspense>
    </Layout>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const page = await client
    .getSingle("search_page", { lang })
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

  const pages = await client.getAllByType("search_page", {
    lang: "*",
  });

  return pages.map((page) => {
    return {
      lang: page.lang,
    };
  });
}
