import { NextRequest, NextResponse } from "next/server";

export default function rewrite({
  request,
  customDomain,
  headers,
}: {
  request: NextRequest;
  customDomain: string;
  headers: Headers;
}) {
  return NextResponse.rewrite(
    new URL(
      `/org/${customDomain}` +
        request.nextUrl.pathname +
        request.nextUrl.search,
      request.url
    ),
    { request: { headers } }
  );
}
