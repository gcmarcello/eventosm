import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
import { customDomainMiddleware } from "./customDomainMiddleware";
import { getServerEnv } from "./app/api/env";

export async function middleware(request: NextRequest) {
  const startsWith = (arg: (string | RegExp)[]) => {
    const testArray = [];
    for (const a of arg) {
      if (typeof a === "string") {
        testArray.push(request.nextUrl.pathname.startsWith(a));
      } else {
        testArray.push(a.test(request.nextUrl.pathname));
      }
      return testArray.some((a) => a);
    }
  };

  function authRedirect({ url, redirect }: { url: string; redirect?: string }) {
    return NextResponse.redirect(
      new URL(redirect ?? url, request.nextUrl).href
    );
  }

  const token = request.cookies.get("token")?.value;
  const host = request.headers.get("host");
  const redirect = request.nextUrl.searchParams.get("redirect") || "/";
  if (!host) throw "Host não encontrado.";

  if (host !== getServerEnv("HOST")) {
    return await customDomainMiddleware({ request, host, token, redirect });
  }

  const userId = async (roles: string[] = ["user"]) =>
    await AuthMiddleware({
      request: { token },
      additionalArguments: { roles },
    });

  if (startsWith(["/login", "/registrar"]) && (await userId())) {
    return authRedirect({ url: redirect });
  }

  if (startsWith(["/admin"]) && !(await userId(["admin"])))
    return authRedirect({ url: "/" });

  if (startsWith(["/painel"]) && !(await userId(["admin"])))
    return authRedirect({ url: "/login?redirect=/painel" });

  if (
    startsWith(["/inscricoes", /^\/org\/[^\/]+\/inscricoes/]) &&
    !(await userId())
  )
    return authRedirect({
      url: `/login?&redirect=${request.nextUrl.pathname}`,
    });

  if (!userId) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("userId", await userId());
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
