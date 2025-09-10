// Netlify Edge (Deno). Proxies /files/* to Prismic CDN safely.
// - Preserves Range / conditional headers
// - Adds sensible caching
// - Sanitizes path + nice filenames
// - Keeps locale agnostic (file chosen by URL)
const REPO = "canadian-women-in-sports"; // Prismic repo slug

const VIEW_INLINE = new Set([
  "pdf", "jpg", "jpeg", "png", "gif", "webp", "svg", "mp4", "webm"
]);
const CONTENT_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
};

export default async (req: Request) => {
  const incoming = new URL(req.url);

  // Extract the filename after /files/ and sanitize
  let fileName = incoming.pathname.replace(/^\/files\//, "");
  // Block traversal / Windows-style shenanigans
  if (!fileName || fileName.includes("..") || fileName.includes("\\") || fileName.startsWith("/")) {
    return new Response("Bad file path", { status: 400 });
  }

  // Normalize multiple slashes
  fileName = fileName.replace(/\/+/g, "/");

  // Compose upstream Prismic URL
  const upstream = `https://${REPO}.cdn.prismic.io/${REPO}/${fileName}${incoming.search}`;

  // Forward important request headers for byte range & validation
  const forwardHeaderNames = [
    "range",
    "if-none-match",
    "if-modified-since",
    "accept-encoding",
    "user-agent",
  ];
  const fwd = new Headers();
  for (const h of forwardHeaderNames) {
    const v = req.headers.get(h);
    if (v) fwd.set(h, v);
  }
  // Helpful referer (hotlink protection friendliness)
  fwd.set("referer", req.headers.get("referer") || incoming.origin);

  const method = req.method === "HEAD" ? "HEAD" : "GET";

  try {
    const upstreamRes = await fetch(upstream, { method, headers: fwd });

    // If Prismic 404/403/etc., surface a 404 (don’t leak internals)
    if (!upstreamRes.ok && upstreamRes.status !== 304) {
      // Read body once for logging; do not return it to user
      try {
        const t = await upstreamRes.text();
        console.error("Upstream error", upstream, upstreamRes.status, t?.slice(0, 500));
      } catch {}
      return new Response("File not found", { status: 404 });
    }

    // Build response headers
    const h = new Headers();

    // Pass through server validation / range support
    for (const name of ["etag", "last-modified", "accept-ranges", "content-range"]) {
      const v = upstreamRes.headers.get(name);
      if (v) h.set(name, v);
    }

    // Content-Type (fallback by extension)
    let ct = upstreamRes.headers.get("content-type");
    if (!ct) {
      const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
      ct = CONTENT_TYPE[ext] || "application/octet-stream";
    }
    h.set("content-type", ct);

    // Don’t force content-length; if upstream provides it, pass it through
    const cl = upstreamRes.headers.get("content-length");
    if (cl) h.set("content-length", cl);

    // Nice filename: strip Prismic hash prefix up to first underscore
    //   aLsTBmGNHVfTOt-k_WinningPlays-2022-FR-WEB.pdf -> WinningPlays-2022-FR-WEB.pdf
    const base = fileName.split("/").pop()!;
    const idx = base.indexOf("_");
    const cleanFileName = idx > 0 ? base.substring(idx + 1) : base;

    const ext = cleanFileName.split(".").pop()?.toLowerCase() ?? "";
    const inline = VIEW_INLINE.has(ext);
    h.set(
      "content-disposition",
      `${inline ? "inline" : "attachment"}; filename="${cleanFileName}"`
    );

    // Caching:
    // - Browser: short-ish (1 day) so users eventually see updates
    // - CDN: longer (30 days) for performance; ETag/Last-Modified allow revalidation upstream
    h.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=600");
    h.set("Surrogate-Control", "max-age=2592000"); // many CDNs honor this; harmless if ignored
    h.set("Vary", "Range, Accept-Encoding"); // clarify caching behavior

    // Optional hardening
    h.set("X-Content-Type-Options", "nosniff");
    // If you truly need it:
    // h.set("Access-Control-Allow-Origin", "*");

    if (method === "HEAD" || upstreamRes.status === 304) {
      return new Response(null, { status: upstreamRes.status, headers: h });
    }

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: h,
    });
  } catch (e: any) {
    console.error("Proxy error:", e?.message || e);
    return new Response("Internal server error", { status: 500 });
  }
};

export const config = { path: "/files/*" };
