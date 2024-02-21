import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
import { CustomDomainMiddleware } from "./middleware/functions/customDomain.middleware";

export async function middleware(request: NextRequest) {
  const startsWith = (arg: string | RegExp) => {
    if (typeof arg === "string")
      return request.nextUrl.pathname.startsWith(arg);
    return arg.test(request.nextUrl.pathname);
  };

  const token = request.cookies.get("token")?.value;
  const host = request.headers.get("host");
  if (!host) throw "Host não encontrado.";

  if (host !== process.env.HOST) {
    const customDomain = await CustomDomainMiddleware({ host });
    const userId = await AuthMiddleware({
      request: { token },
      additionalArguments: { roles: ["user"] },
    });

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", userId);

    return NextResponse.rewrite(
      new URL(
        `/org/${customDomain}` +
          request.nextUrl.pathname +
          request.nextUrl.search,
        request.url
      ),
      { request: { headers: requestHeaders } }
    );
  }

  if (startsWith("/login") || startsWith("/registrar")) {
    const isAuthenticated = await AuthMiddleware({
      request: { token },
      additionalArguments: { roles: ["user"] },
    });

    const redirect = request.nextUrl.searchParams.get("redirect");

    if (isAuthenticated)
      return NextResponse.redirect(
        redirect
          ? new URL(redirect, request.nextUrl).href
          : new URL("/", request.nextUrl).href
      );
  }

  if (startsWith("/admin")) {
    const isAuthenticated = await AuthMiddleware({
      request: { token },
      additionalArguments: { roles: ["admin"] },
    });

    if (!isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }

  if (startsWith("/painel")) {
    const isAuthenticated = await AuthMiddleware({
      request: { token },
      additionalArguments: { roles: ["user"] },
    });

    if (!isAuthenticated)
      return NextResponse.redirect(new URL("/login", request.nextUrl).href);
  }

  if (startsWith("/inscricoes") || startsWith(/^\/org\/[^\/]+\/inscricoes/)) {
    const isAuthenticated = await AuthMiddleware({
      request: { token },
      additionalArguments: { roles: ["user"] },
    });

    if (!isAuthenticated)
      return NextResponse.redirect(
        new URL(`/login?&redirect=${request.nextUrl.pathname}`, request.nextUrl)
          .href
      );
  }

  const userId = await AuthMiddleware({
    request: { token },
    additionalArguments: { roles: ["user"] },
  });

  if (!userId) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("userId", userId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
