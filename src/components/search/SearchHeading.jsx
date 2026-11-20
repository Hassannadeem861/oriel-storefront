"use client";

import { useSearchParams } from "next/navigation";

export default function SearchHeading() {
  const q = useSearchParams().get("q");
  return q ? <>Results for “{q}”</> : <>Search the collection</>;
}
