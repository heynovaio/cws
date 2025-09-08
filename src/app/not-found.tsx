"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STRINGS = {
  "en-ca": {
    title: "404 – Page Not Found",
    desc:
      "Sorry, the page you're looking for doesn't exist or may have been moved during our recent site update. Try one of the links below to get back on track.",
    home: "Visit Homepage",
    explore: "Explore & Learn",
  },
  "fr-ca": {
    title: "404 – Page non trouvée",
    desc:
      "Désolé, la page que vous recherchez n'existe pas ou a peut-être été déplacée lors de notre récente mise à jour du site. Essayez l'un des liens ci-dessous pour revenir sur la bonne voie.",
    home: "Visitez la page d'accueil",
    explore: "Explorer et apprendre",
  },
} as const;

const SUPPORTED = new Set<keyof typeof STRINGS>(["en-ca", "fr-ca"]);

export default function NotFound() {
  const pathname = usePathname() || "/";
  const first = pathname.split("/").filter(Boolean)[0] ?? "en-ca";
  const lang = (SUPPORTED.has(first as any) ? first : "en-ca") as keyof typeof STRINGS;
  const t = STRINGS[lang];

  return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
      <p className="text-lg mb-6">{t.desc}</p>
      <div className="flex flex-col items-center md:flex-row gap-4 justify-center">
        <Link href={`/${lang}`} className="btn btn-primary w-fit">{t.home}</Link>
        <Link href={`/${lang}/search`} className="btn btn-primary w-fit">{t.explore}</Link>
      </div>
    </div>
  );
}
