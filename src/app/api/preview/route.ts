import type { NextRequest } from "next/server";
import { draftMode } from "next/headers";
import { redirectToPreviewURL } from "@prismicio/next";
import { createClient } from "../../../prismicio";

export async function GET(request: NextRequest): Promise<never> {
  const client = createClient();

  (await draftMode()).enable();
  return await redirectToPreviewURL({ client, request });
}
