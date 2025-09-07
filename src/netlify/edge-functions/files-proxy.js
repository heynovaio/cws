// Netlify Edge (Deno). Proxies /files/* to Prismic CDN,
// preserves range requests, sets cache headers, and cleans filenames.

const REPO = "canadian-women-in-sports"; // Prismic repo slug

const filesProxy = async (req) => {
  const incoming = new URL(req.url);

  // Map /files/<rest> -> https://<repo>.cdn.prismic.io/<repo>/<rest>
  const upstream = new URL(
    incoming.pathname.replace(
      /^\/files\//,
      `https://${REPO}.cdn.prismic.io/${REPO}/`
    ) + incoming.search
  );

  const forwardHeaderNames = [
    "range",
    "if-none-match",
    "if-modified-since",
    "accept-encoding",
  ];
  const fwd = new Headers();
  for (const h of forwardHeaderNames) {
    const v = req.headers.get(h);
    if (v) fwd.set(h, v);
  }

  const method = req.method === "HEAD" ? "HEAD" : "GET";
  const upstreamRes = await fetch(upstream.toString(), {
    method,
    headers: fwd,
  });

  const headers = new Headers(upstreamRes.headers);

  // Ensure sensible defaults
  if (!headers.get("content-type")) {
    headers.set("Content-Type", "application/pdf");
  }

  // Friendly filename (change inline → attachment to force download)
  const fallbackName = incoming.pathname.split("/").pop() || "file.pdf";
  headers.set("Content-Disposition", `inline; filename="${fallbackName}"`);

  // Strong caching (adjust if PDFs change under same name)
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  if (method === "HEAD") {
    return new Response(null, {
      status: upstreamRes.status,
      headers,
    });
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers,
  });
};

export default filesProxy;

export const config = { path: "/files/*" };
