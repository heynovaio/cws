import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import { Outfit } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { getServerLocale, toHtmlLang } from "@/utils/serverLocale";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const appLocale = await getServerLocale();   
  const htmlLang = toHtmlLang(appLocale);        

  return (
    <html lang={htmlLang} className={`${outfit.variable} font-sans`}>
      <head />
      <body>
        <GoogleTagManager gtmId="GTM-PN5JLZD" />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
