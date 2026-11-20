import { getSearchIndex } from "@/lib/catalog";

/** Lightweight product index for instant search. Prerendered at build time. */
export async function GET() {
  return Response.json(await getSearchIndex());
}
