import { NextRequest, NextResponse } from "next/server";

export default function authRedirect({
  url,
  request,
  redirect,
}: {
  url: string;
  request: NextRequest;
  redirect?: string;
}) {
  return NextResponse.redirect(new URL(url, request.nextUrl).href);
}
