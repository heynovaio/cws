export function buildAbsoluteUrl(uid: string, lang: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

  return `${baseUrl}/${lang}/campaign/${uid}`;
}
