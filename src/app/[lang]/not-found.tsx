"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout } from "@/components";
import { createClient } from "@/prismicio";
import { getLocales } from "@/utils";
import { useEffect, useState } from "react";
import { GlobalsDocument, MenusDocument } from "../../../prismicio-types";
import { PrismicDocument } from "@prismicio/client";

export async function generateStaticParams() {
  const client = createClient();

  // Get all available locales from Prismic
  const repository = await client.getRepository();
  const locales = repository.languages.map((lang) => ({
    lang: lang.id,
  }));

  return locales;
}

// Note: generateMetadata won't work in client components
// You'll need to handle metadata differently or move this logic to a server component

export default function NotFound() {
  const pathname = usePathname();
  const [lang, setLang] = useState("en");
  const [data, setData] = useState<{
    global: GlobalsDocument;
    menus: MenusDocument;
    locales: PrismicDocument[];
  } | null>(null);

  useEffect(() => {
    // Extract language from pathname
    const pathSegments = pathname.split("/").filter(Boolean);
    const detectedLang = pathSegments[0] || "en";

    // Validate if it's a valid language code (optional)
    const validLangs = ["en", "fr-ca"]; // Add your supported languages
    const finalLang = validLangs.includes(detectedLang) ? detectedLang : "en";

    setLang(finalLang);

    // Fetch data
    async function fetchData() {
      const client = createClient();
      const global = await client.getSingle("globals", { lang: finalLang });
      const menus = await client.getSingle("menus", { lang: finalLang });
      const locales = await getLocales(global, client);

      setData({ global, menus, locales });
    }

    fetchData();
  }, [pathname]);

  if (!data) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <Layout
      locales={data.locales}
      lang={lang}
      menus={data.menus.data}
      global={data.global.data}
      include_newsletter_sign_up_banner
    >
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {lang === "fr-ca" ? "404 – Page non trouvée" : "404 – Page Not Found"}
        </h1>
        <p className="text-lg mb-6">
          {lang === "fr-ca"
            ? "Désolé, la page que vous recherchez n'existe pas ou a peut-être été déplacée lors de notre récente mise à jour du site. Essayez l'un des liens ci-dessous pour revenir sur la bonne voie."
            : "Sorry, the page you're looking for doesn't exist or may have been moved during our recent site update. Try one of the links below to get back on track."}
        </p>
        <div className="flex flex-col items-center md:flex-row gap-4 center justify-center">
          <Link href={`/${lang}`} className="btn btn-primary w-fit">
            {lang === "fr-ca" ? "Visitez la page d'accueil" : "Visit Homepage"}
          </Link>
          <Link href={`/${lang}/search`} className="btn btn-primary w-fit">
            {lang === "fr-ca" ? "Explorer et apprendre" : "Explore & Learn"}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
