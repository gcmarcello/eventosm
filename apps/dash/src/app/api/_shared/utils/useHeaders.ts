"use server";
import { headers } from "next/headers";

export async function useHeaders() {
  const headersList = headers();
  const referer = headersList.get("x-url");
  if (!referer) return { referer: "", pathname: "" };

  const url = new URL(referer);
  const pathname = url.pathname;

  return { referer, pathname };
}
