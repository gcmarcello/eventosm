"use server";
import { headers } from "next/headers";

export async function useHeaders() {
  const headersList = headers();
  const referer = headersList.get("x-url");

  return { referer };
}
