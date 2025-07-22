import Link from "next/link";
import { Layout } from "@/components";
import { createClient } from "@/prismicio";
import { getLocales } from "@/utils";

export default async function NotFound() {
  const client = createClient();
  const lang = "en-ca";

  const global = await client.getSingle("globals", { lang });
  const menus = await client.getSingle("menus", { lang });
  const locales = await getLocales(global, client);

  return (
    <Layout
      locales={locales}
      menus={menus.data}
      global={global.data}
      include_newsletter_sign_up_banner
    >
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">404 – Page Not Found</h1>
        <p className="text-lg mb-6">
          Sorry, the page you’re looking for doesn’t exist or may have been
          moved during our recent site update. Try one of the links below to get
          back on track.
        </p>
        <div className="flex flex-col items-center md:flex-row gap-4 center justify-center ">
          <Link href="/" className="btn btn-primary w-fit">
            Visit Homepage
          </Link>
          <Link href="/search" className="btn btn-primary w-fit">
            Explore & Learn
          </Link>
        </div>
      </div>
    </Layout>
  );
}
