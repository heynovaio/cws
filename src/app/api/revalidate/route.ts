import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";

/**
 * Called by the Prismic "publish" webhook. Prismic sends the webhook's secret
 * in the JSON body as `secret`; it must match PRISMIC_WEBHOOK_SECRET.
 * If PRISMIC_WEBHOOK_SECRET is unset the check is skipped (with a warning) so
 * publishing keeps working until the secret is configured in both places.
 */
function secretsMatch(received: string, expected: string): boolean {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const expected = process.env.PRISMIC_WEBHOOK_SECRET;

  if (expected) {
    const body = (await req.json().catch(() => null)) as { secret?: unknown } | null;
    const received = typeof body?.secret === "string" ? body.secret : "";
    if (!secretsMatch(received, expected)) {
      return NextResponse.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
    }
  } else {
    console.warn("PRISMIC_WEBHOOK_SECRET is not set; /api/revalidate is unauthenticated");
  }

  revalidateTag("prismic");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
