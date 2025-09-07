export function maskPrismicMediaUrl(url: string | URL) {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith(".cdn.prismic.io")) return url;

    // pathname: /<repo>/<rest>
    const [, repo, ...rest] = u.pathname.split("/");
    if (!repo || rest.length === 0) return url;

    return `/files/${rest.join("/")}${u.search || ""}`;
  } catch {
    return url;
  }
}
