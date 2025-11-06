// /src/app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

/** Incoming payload we expect from the client */
interface NewsletterPayload {
  EMAIL?: string;
  FNAME?: string;
  LANG?: string;
  // Allow extras; we only pick whitelisted tags
  [k: string]: unknown;
}

/** Minimal Mailchimp error structures */
interface MailchimpErrorItem {
  field?: string;
  message?: string;
}

interface MailchimpErrorBody {
  detail?: string;
  title?: string;
  status?: number;
  errors?: MailchimpErrorItem[];
  [k: string]: unknown;
}

function md5(input: string): string {
  return crypto.createHash("md5").update(input.toLowerCase()).digest("hex");
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parsePayload(value: unknown): NewsletterPayload {
  return value && typeof value === "object" ? (value as NewsletterPayload) : {};
}

function parseMailchimpError(value: unknown): MailchimpErrorBody {
  if (!value || typeof value !== "object") return {};
  const obj = value as Record<string, unknown>;
  const rawErrors = Array.isArray(obj.errors) ? obj.errors : undefined;

  const errors: MailchimpErrorItem[] | undefined = rawErrors
    ? rawErrors.map((e) => {
        if (!e || typeof e !== "object") return {};
        const item = e as Record<string, unknown>;
        return {
          field: asString(item.field),
          message: asString(item.message),
        };
      })
    : undefined;

  return {
    detail: asString(obj.detail),
    title: asString(obj.title),
    status: typeof obj.status === "number" ? obj.status : undefined,
    errors,
  };
}

export async function POST(req: Request) {
  try {
    // Parse JSON without `any`
    const raw = (await req.json().catch(() => null)) as unknown;
    const payload = parsePayload(raw);

    // Required
    const EMAIL = asString(payload.EMAIL).trim();
    if (!EMAIL) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    // Optional
    const FNAME = asString(payload.FNAME).trim();

    // Env
    const API_KEY = asString(process.env.MAILCHIMP_API_KEY);
    const SERVER_PREFIX = asString(process.env.MAILCHIMP_SERVER_PREFIX); // e.g. "us12"
    const LIST_ID = asString(process.env.MAILCHIMP_AUDIENCE_ID);
    const DOUBLE_OPT_IN =
      asString(process.env.MAILCHIMP_DOUBLE_OPT_IN).toLowerCase() === "true";

    if (!API_KEY || !SERVER_PREFIX || !LIST_ID) {
      return NextResponse.json(
        { ok: false, error: "Mailchimp environment is not configured" },
        { status: 500 }
      );
    }

    // Merge fields
    const merge_fields: Record<string, string> = {};
    if (FNAME) merge_fields.FNAME = FNAME;

    // Optional language support (only if you created this tag)
    const LANG_TAG = asString(process.env.MAILCHIMP_LANG_MERGE_TAG).toUpperCase(); // e.g. "LANG"
    const LANG_VALUE = asString(payload[LANG_TAG || "LANG"]).trim();
    if (LANG_TAG && LANG_VALUE) {
      merge_fields[LANG_TAG] = LANG_VALUE;
    }

    // Support for hidden required fields (if your audience still requires them)
    // e.g. MAILCHIMP_REQUIRED_FIELDS=LNAME,MMERGE4
    const required = asString(process.env.MAILCHIMP_REQUIRED_FIELDS)
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    for (const tag of required) {
      const fromClient = asString(payload[tag]).trim();
      if (fromClient) {
        merge_fields[tag] = fromClient;
        continue;
      }
      const fallbackEnvKey = `MAILCHIMP_FALLBACK_${tag}` as keyof NodeJS.ProcessEnv;
      const fallbackVal = asString(process.env[fallbackEnvKey]).trim();
      merge_fields[tag] = fallbackVal || (tag === "LNAME" ? "." : "Unknown");
    }

    // Upsert member
    const hash = md5(EMAIL);
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}`;

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

    const rawMc = (await mcRes.json().catch(() => null)) as unknown;

    if (!mcRes.ok) {
      const err = parseMailchimpError(rawMc);
      console.error("Mailchimp error:", JSON.stringify(err, null, 2));

      const listErrors =
        err.errors && err.errors.length
          ? err.errors.map((e) => `${e.field ?? "field"}: ${e.message ?? "invalid"}`).join("; ")
          : undefined;

      const detail = err.detail || err.title || listErrors || "Mailchimp request failed";
      return NextResponse.json({ ok: false, error: detail }, { status: mcRes.status });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
