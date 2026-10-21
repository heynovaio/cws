import type { NextRequest } from "next/server";
import { redirectToPreviewURL } from "@prismicio/next";
import { createClient } from "../../../prismicio";

// redirectToPreviewURL enables Draft Mode and stores the preview token.
export async function GET(request: NextRequest): Promise<never> {
  const client = createClient();

  return await redirectToPreviewURL({ client, request });
}
