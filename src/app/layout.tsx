import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import { Outfit } from 'next/font/google'
const outfit = Outfit ({
  variable: '--font-outfit',
})
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
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
