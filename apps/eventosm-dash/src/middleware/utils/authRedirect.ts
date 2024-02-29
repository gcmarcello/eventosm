import { NextRequest, NextResponse } from "next/server";

export default function authRedirect({
  url,
  request,
}: {
  url: string;
  request: NextRequest;
}) {
  return NextResponse.redirect(new URL(url, request.nextUrl).href);
}
