import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
import authRedirect from "./middleware/utils/authRedirect";
import { customDomainMiddleware } from "./customDomainMiddleware";
import { startsWith } from "./middleware/utils/startsWith";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const host = request.headers.get("host");
  if (!host) throw "Host não encontrado.";

  if (host !== process.env.HOST) {
    return await customDomainMiddleware({ request, host, token });
  }

  const userId = await AuthMiddleware({
    request: { token },
    additionalArguments: { roles: ["user"] },
  });

  if (startsWith({ arg: ["/login", "/registrar"], request })) {
    const redirect = request.nextUrl.searchParams.get("redirect") || "/";

    userId &&
      authRedirect({
        url: new URL(redirect, request.nextUrl).href,
        request,
      });
  }

  if (startsWith({ arg: ["/admin"], request })) {
    !userId && authRedirect({ url: "/login?redirect=/painel", request });
  }

  if (startsWith({ arg: ["/painel"], request })) {
    !userId && authRedirect({ url: "/login?redirect=/painel", request });
  }

  if (
    startsWith({ arg: ["/inscricoes", /^\/org\/[^\/]+\/inscricoes/], request })
  ) {
    !userId &&
      authRedirect({
        url: `/login?&redirect=${request.nextUrl.pathname}`,
        request,
      });
  }

  if (!userId) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("userId", userId);
  requestHeaders.set("x-url", request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
