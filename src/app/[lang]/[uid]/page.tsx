import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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

// Helper function to determine document type and get document
async function getDocumentByUID(
  uid: string,
  lang: string,
  client: prismic.Client
) {
  try {
    const page = await client.getByUID("page", uid, { lang }).catch(() => null);
    if (page) {
      return {
        document: page,
        type: "page",
      };
    }

    const careerHub = await client
      .getByUID("career_hub", uid, { lang })
      .catch(() => null);
    if (careerHub) {
      return {
        document: careerHub,
        type: "career_hub",
      };
    }

    return {
      document: page,
      type: "page",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid, lang } = await params;
  const client = createClient();

  const result = await getDocumentByUID(uid, lang, client);

  if (!result) {
    notFound();
  }

  const { document, type } = result;

  // If it's a career hub, we shouldn't generate metadata here
  if (type === "career_hub") {
    notFound();
  }

  return {
    title:
      document?.data.meta_title ||
      prismic.asText(document?.data.title) ||
      "Canadian Women in Sports",
    description: document?.data.meta_description,
    openGraph: {
      title: document?.data.meta_title || undefined,
      images: [
        {
          url: document?.data.meta_image.url || "",
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid, lang } = await params;
  const client = createClient();

  const result = await getDocumentByUID(uid, lang, client);

  if (!result) {
    notFound();
  }

  const { document, type } = result;

  // Ensure document is not null before destructuring data
  if (!document) {
    notFound();
  }
  const { data } = document;

  // If it's a career hub, redirect to the proper career route
  if (type === "career_hub") {
    redirect(`/${lang}/${uid}`);
  }

  // Continue with regular page logic (type is "page")
  const global = await client.getSingle("globals", { lang });
  const menus = await client.getSingle("menus", { lang });
  const partners = await client.getSingle("partners", { lang });

  // Ensure document is not null before calling getLocales
  if (!document) {
    notFound();
  }
  const locales = await getLocales(document, client);

  return (
    <Layout
      locales={locales}
      lang={lang}
      global={global.data}
      menus={menus.data}
      partners={document.data.include_partners ? partners.data : null}
      include_newsletter_sign_up_banner={
        document.data.include_newsletter_sign_up_banner
      }
    >
      <GeneralHero
        data={{
          title: data.title,
          body: data.body,
          button: data.button,
          tagline: data.tagline,
        }}
      />
      <div id="next-section">
        <SliceZone
          slices={document.data.slices}
          components={components}
          context={{ lang }}
        />
      </div>
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client
    .getAllByType("page", {
      lang: "*",
    })
    .catch(() => []);

  // Filter out home page since it's handled by root route
  const filteredPages = pages.filter((page) => page.uid !== "home");

  return filteredPages.map((page) => {
    return {
      uid: page.uid,
      lang: page.lang,
    };
  });
}
