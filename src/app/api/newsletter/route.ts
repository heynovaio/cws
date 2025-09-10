import { NextResponse } from "next/server";
import crypto from "crypto";

function md5(input: string) {
  return crypto.createHash("md5").update(input.toLowerCase()).digest("hex");
}

// Helper: read a list like "LNAME,MMERGE4"
function parseList(envVal: string | undefined) {
  return (envVal || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({} as any));

    // ---- Required: EMAIL
    const EMAIL = typeof payload.EMAIL === "string" ? payload.EMAIL.trim() : "";
    if (!EMAIL) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    // ---- Optional: FNAME (first name)
    const FNAME = typeof payload.FNAME === "string" ? payload.FNAME.trim() : "";

    // ---- Env
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., "us12"
    const LIST_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const DOUBLE_OPT_IN =
      (process.env.MAILCHIMP_DOUBLE_OPT_IN || "").toLowerCase() === "true";

    if (!API_KEY || !SERVER_PREFIX || !LIST_ID) {
      return NextResponse.json(
        { ok: false, error: "Mailchimp environment is not configured" },
        { status: 500 }
      );
    }

    // ---- Build merge_fields we *actually* send
    const merge_fields: Record<string, string> = {};
    if (FNAME) merge_fields.FNAME = FNAME;

    // (Optional) Attach language only if you’ve created that merge tag and want to use it.
    // Keep disabled by default to avoid “unknown merge tag” errors.
    const LANG_TAG = (process.env.MAILCHIMP_LANG_MERGE_TAG || "").toUpperCase(); // e.g., "LANG"
    if (LANG_TAG && typeof payload[LANG_TAG] === "string" && payload[LANG_TAG].trim()) {
      merge_fields[LANG_TAG] = payload[LANG_TAG].trim();
    } else if (LANG_TAG && typeof payload.LANG === "string" && payload.LANG.trim()) {
      // Support client sending { LANG: "en" } while env uses MAILCHIMP_LANG_MERGE_TAG=LANG
      merge_fields[LANG_TAG] = payload.LANG.trim();
    }

    // ---- Fallbacks for required fields you cannot collect (e.g., LNAME, MMERGE4)
    const required = parseList(process.env.MAILCHIMP_REQUIRED_FIELDS);
    for (const tag of required) {
      // use client-sent value if present and non-empty
      const fromClient =
        typeof payload[tag] === "string" ? String(payload[tag]).trim() : "";

      if (fromClient) {
        merge_fields[tag] = fromClient;
        continue;
      }

      // Otherwise fall back to env-specific fallback, e.g., MAILCHIMP_FALLBACK_LNAME, MAILCHIMP_FALLBACK_MMERGE4
      const fallbackEnvKey = `MAILCHIMP_FALLBACK_${tag}`;
      const fallbackVal = (process.env as any)[fallbackEnvKey] as string | undefined;

      if (fallbackVal && fallbackVal.trim()) {
        merge_fields[tag] = fallbackVal.trim();
      } else {
        // Last-resort fallback to a dot for name-ish fields, or "Unknown" otherwise
        merge_fields[tag] = tag === "LNAME" ? "." : "Unknown";
      }
    }

    // ---- Upsert member
    const subscriberHash = md5(EMAIL);
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}`;

    const body = {
      email_address: EMAIL,
      status_if_new: DOUBLE_OPT_IN ? "pending" : "subscribed",
      status: DOUBLE_OPT_IN ? "pending" : "subscribed",
      merge_fields,
    };

    const mcRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const mcData = await mcRes.json().catch(() => ({}));
    if (!mcRes.ok) {
      // DEBUG: log the entire error payload so you can see *which* field failed
      console.error("Mailchimp error:", JSON.stringify(mcData, null, 2));
      const detail =
        mcData?.detail ||
        mcData?.title ||
        (Array.isArray(mcData?.errors) ? mcData.errors.map((e: any) => e?.field + ": " + e?.message).join("; ") : "") ||
        "Mailchimp request failed";
      return NextResponse.json({ ok: false, error: detail }, { status: mcRes.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
