export function buildAbsoluteUrl(uid: string, lang: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://womenandsport.ca";

  return `${baseUrl}/${lang}/campaign/${uid}`;
}
