import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import { Outfit } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} font-sans`}>
      <head></head>
      <GoogleTagManager gtmId="GTM-PN5JLZD" />
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
