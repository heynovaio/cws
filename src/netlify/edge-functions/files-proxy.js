// Netlify Edge (Deno). Proxies /files/* to Prismic CDN,
// preserves range requests, sets cache headers, and cleans filenames.
const REPO = "canadian-women-in-sports"; // Prismic repo slug

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req) => {
  const incoming = new URL(req.url);

  // Extract the filename after /files/
  const fileName = incoming.pathname.replace(/^\/files\//, "");

  if (!fileName) {
    return new Response("File name required", { status: 400 });
  }

  // Construct the upstream Prismic URL
  // /files/aLsTBmGNHVfTOt-k_WinningPlays-2022-FR-WEB.pdf
  // -> https://canadian-women-in-sports.cdn.prismic.io/canadian-women-in-sports/aLsTBmGNHVfTOt-k_WinningPlays-2022-FR-WEB.pdf
  const upstream = new URL(
    `https://${REPO}.cdn.prismic.io/${REPO}/${fileName}${incoming.search}`
  );

  console.log(`Proxying: ${incoming.pathname} -> ${upstream.toString()}`);

  // Forward relevant headers
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

  // Add referer to help with any anti-hotlinking protection
  fwd.set("referer", req.headers.get("referer") || incoming.origin);

  const method = req.method === "HEAD" ? "HEAD" : "GET";

  try {
    const upstreamRes = await fetch(upstream.toString(), {
      method,
      headers: fwd,
    });

    if (!upstreamRes.ok) {
      console.error(
        `Upstream failed: ${upstreamRes.status} ${upstreamRes.statusText} for ${upstream.toString()}`
      );

      // More detailed error logging
      const errorText = await upstreamRes.text().catch(() => "No error text");
      console.error("Error response:", errorText);

      return new Response(`File not found: ${upstreamRes.status}`, {
        status: 404,
      });
    }

    const headers = new Headers();

    // Copy essential headers from upstream
    const importantHeaders = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "etag",
      "last-modified",
    ];

    for (const header of importantHeaders) {
      const value = upstreamRes.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    }

    // Set default content-type if missing
    if (!headers.get("content-type")) {
      const ext = fileName.split(".").pop()?.toLowerCase();
      const contentTypeMap = {
        pdf: "application/pdf",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        mp4: "video/mp4",
        webm: "video/webm",
      };
      headers.set(
        "Content-Type",
        contentTypeMap[ext] || "application/octet-stream"
      );
    }

    // Extract a cleaner filename from the Prismic filename
    // aLsTBmGNHVfTOt-k_WinningPlays-2022-FR-WEB.pdf -> WinningPlays-2022-FR-WEB.pdf
    let cleanFileName = fileName;

    // If filename contains a hash followed by underscore, extract the part after underscore
    const underscoreIndex = fileName.indexOf("_");
    if (underscoreIndex > 0) {
      cleanFileName = fileName.substring(underscoreIndex + 1);
    }

    headers.set("Content-Disposition", `inline; filename="${cleanFileName}"`);

    // Cache for a long time (adjust as needed)
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // CORS headers (if needed)
    headers.set("Access-Control-Allow-Origin", "*");

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
  } catch (error) {
    console.error("Error fetching from Prismic:", error);
    return new Response(`Internal server error: ${error.message}`, {
      status: 500,
    });
  }
};

export const config = { path: "/files/*" };
