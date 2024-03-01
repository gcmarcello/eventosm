import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
import authRedirect from "./middleware/utils/authRedirect";
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

  const xd = "xd";

  const token = request.cookies.get("token")?.value;
  const host = request.headers.get("host");
  if (!host) throw "Host não encontrado.";

  if (host !== getServerEnv("HOST")) {
    return await customDomainMiddleware({ request, host, token });
  }

  const userId = async (roles: string[] = ["user"]) =>
    await AuthMiddleware({
      request: { token },
      additionalArguments: { roles },
    });

  if (startsWith(["/login", "/registrar"])) {
    const redirect = request.nextUrl.searchParams.get("redirect") || "/";

    (await userId()) &&
      authRedirect({
        url: new URL(redirect, request.nextUrl).href,
        request,
      });
  }

  if (startsWith(["/admin"])) {
    !(await userId(["admin"])) &&
      authRedirect({ url: "/login?redirect=/painel", request });
  }

  if (startsWith(["/painel"])) {
    !(await userId(["admin"])) &&
      authRedirect({ url: "/login?redirect=/painel", request });
  }

  if (startsWith(["/inscricoes", /^\/org\/[^\/]+\/inscricoes/])) {
    !(await userId()) &&
      authRedirect({
        url: `/login?&redirect=${request.nextUrl.pathname}`,
        request,
      });
  }

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
