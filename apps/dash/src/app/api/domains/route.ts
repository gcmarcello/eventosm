import { getClientEnv } from "@/app/(frontend)/env";
import { getServerEnv } from "@/app/api/env";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "prisma/prisma";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const host = request.nextUrl.searchParams.get("host");
    if (!host) throw "Host não encontrado.";

    const orgInfo = await prisma.orgCustomDomain.findFirst({
      where: { domain: host },
      include: { Organization: { select: { slug: true } } },
    });

    const redirectUrl = getClientEnv(`NEXT_PUBLIC_SITE_URL`);

    if (!redirectUrl) throw "URL de redirecionamento não encontrada.";

    if (!orgInfo) return NextResponse.redirect(new URL("/", redirectUrl).href);

    return NextResponse.json(orgInfo);
  } catch (error) {
    return NextResponse.json(
      { message: (error as any).message, status: 403 },
      { status: 403 }
    );
  }
}
